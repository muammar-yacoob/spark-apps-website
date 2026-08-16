/**
 * SSRF-guarded outbound fetch for user-influenced URLs (favicon probing, etc).
 *
 * Guarantees:
 *  - https only, default port only, no credentials in the URL
 *  - every hop (including each redirect Location) is DNS-resolved and ALL
 *    returned addresses must be public before any request is sent
 *  - redirects are followed manually (capped) so each hop re-enters the guard
 *  - hard timeout per hop, response bodies read through a byte cap
 *
 * Accepted residual risk (documented, not fixed): a DNS-rebinding TOCTOU
 * between our lookup and undici's own connect-time lookup. Closing it needs a
 * custom dispatcher pinning the resolved address; this surface is admin-bearer
 * gated and the domain is human-approved, so the guard is defense in depth.
 */
import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_REDIRECTS = 3;

/** True when the IP must never be fetched: loopback, private, link-local, metadata, CGNAT. */
export function isForbiddenAddress(ip: string): boolean {
  // Normalize IPv6-mapped IPv4 (::ffff:10.0.0.1) and re-check as IPv4.
  const mapped = ip.toLowerCase().match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped?.[1]) return isForbiddenAddress(mapped[1]);

  if (isIP(ip) === 4) {
    const octets = ip.split('.').map(Number);
    if (octets.length !== 4 || octets.some((o) => Number.isNaN(o) || o < 0 || o > 255)) {
      return true;
    }
    // Defaulted only to satisfy noUncheckedIndexedAccess: the length and range
    // check above already guarantees four valid octets.
    const a = octets[0] ?? -1;
    const b = octets[1] ?? -1;
    if (a === 0) return true; // 0.0.0.0/8 "this network"
    if (a === 10) return true; // RFC1918
    if (a === 127) return true; // loopback
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a === 169 && b === 254) return true; // link-local incl. 169.254.169.254 metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
    if (a === 192 && b === 168) return true; // RFC1918
    return false;
  }

  if (isIP(ip) === 6) {
    const v6 = ip.toLowerCase();
    if (v6 === '::' || v6 === '::1') return true; // unspecified / loopback
    if (
      v6.startsWith('fe8') ||
      v6.startsWith('fe9') ||
      v6.startsWith('fea') ||
      v6.startsWith('feb')
    ) {
      return true; // link-local fe80::/10
    }
    if (v6.startsWith('fc') || v6.startsWith('fd')) return true; // unique-local fc00::/7
    return false;
  }

  // Not a literal IP at all: treat as forbidden; callers resolve hostnames first.
  return true;
}

export type UrlValidation =
  | { ok: true; url: URL }
  | { ok: false; reason: 'invalid_url' | 'not_https' | 'forbidden_port' | 'has_credentials' };

/** Structural checks that need no network: scheme, port, userinfo. */
export function validateExternalUrl(raw: string): UrlValidation {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: 'invalid_url' };
  }
  if (url.protocol !== 'https:') return { ok: false, reason: 'not_https' };
  if (url.port !== '' && url.port !== '443') return { ok: false, reason: 'forbidden_port' };
  if (url.username || url.password) return { ok: false, reason: 'has_credentials' };
  return { ok: true, url };
}

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxRedirects?: number;
  /** Sent as the Accept header when provided. */
  accept?: string;
}

export type SafeFetchFailure =
  | 'invalid_url'
  | 'not_https'
  | 'forbidden_port'
  | 'has_credentials'
  | 'forbidden_address'
  | 'too_many_redirects'
  | 'timeout'
  | 'network';

export type SafeFetchResult =
  | { ok: true; response: Response; finalUrl: string }
  | { ok: false; reason: SafeFetchFailure };

/** Resolve the host and require every returned address to be public. */
async function hostIsPublic(hostname: string): Promise<boolean> {
  // URL keeps IPv6 literals bracketed; strip for isIP/lookup.
  const bare = hostname.replace(/^\[|\]$/g, '');
  if (isIP(bare)) return !isForbiddenAddress(bare);
  try {
    const addrs = await dns.lookup(bare, { all: true, verbatim: true });
    if (addrs.length === 0) return false;
    return addrs.every((a) => !isForbiddenAddress(a.address));
  } catch {
    return false;
  }
}

/**
 * Fetch with the full guard. Returns the response un-consumed; pair with
 * readBodyCapped so an attacker-sized body cannot balloon memory.
 */
export async function safeFetch(
  rawUrl: string,
  opts: SafeFetchOptions = {}
): Promise<SafeFetchResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRedirects = opts.maxRedirects ?? DEFAULT_MAX_REDIRECTS;

  let current = rawUrl;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const structural = validateExternalUrl(current);
    if (!structural.ok) return { ok: false, reason: structural.reason };

    if (!(await hostIsPublic(structural.url.hostname))) {
      return { ok: false, reason: 'forbidden_address' };
    }

    let response: Response;
    try {
      response = await fetch(structural.url, {
        redirect: 'manual',
        signal: AbortSignal.timeout(timeoutMs),
        headers: opts.accept ? { accept: opts.accept } : undefined,
      });
    } catch (err) {
      const timedOut = err instanceof Error && err.name === 'TimeoutError';
      return { ok: false, reason: timedOut ? 'timeout' : 'network' };
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      // Drain the redirect body so the socket is released before the next hop.
      response.body?.cancel().catch(() => {});
      if (!location) return { ok: false, reason: 'network' };
      try {
        current = new URL(location, structural.url).toString();
      } catch {
        return { ok: false, reason: 'invalid_url' };
      }
      continue;
    }

    return { ok: true, response, finalUrl: structural.url.toString() };
  }

  return { ok: false, reason: 'too_many_redirects' };
}

/** Stream-read a response body, returning null once it exceeds maxBytes. */
export async function readBodyCapped(res: Response, maxBytes: number): Promise<Buffer | null> {
  if (!res.body) return Buffer.alloc(0);
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > maxBytes) {
        reader.cancel().catch(() => {});
        return null;
      }
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks);
}
