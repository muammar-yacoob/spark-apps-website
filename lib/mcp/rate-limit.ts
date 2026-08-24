/**
 * Per-IP rate limiting for the public MCP server.
 *
 * Every tool here is public and read-only, so there is no API key to count
 * against and the caller's IP is the only handle there is. In-memory and
 * per-instance on purpose: the catalogue is a static array, so the thing being
 * protected is the request budget rather than a database, and a limiter that
 * needed its own store would cost more than the reads it guards.
 */

const WINDOW_MS = 60_000;
const MAX_CALLS = 60;

const hits = new Map<string, number[]>();

/** Whether this caller has spent its budget for the current minute. */
export function overRateLimit(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  const recent = (hits.get(ip) ?? []).filter((t) => t > cutoff);
  recent.push(now);
  hits.set(ip, recent);

  // Drop callers that have gone quiet, so an instance that has served many
  // distinct IPs does not hold every one of them forever.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => t <= cutoff)) hits.delete(key);
    }
  }

  return recent.length > MAX_CALLS;
}

/**
 * The caller's IP, as far as the proxy in front of us will say.
 *
 * Takes the MCP SDK's header shape rather than a `Headers`: a value there may
 * be a repeated-header array, which `new Headers()` will not accept.
 */
export function callerIp(headers: Record<string, string | string[] | undefined>): string {
  const first = (name: string): string => {
    const value = headers[name] ?? headers[name.toLowerCase()];
    return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
  };

  // x-forwarded-for is a client-to-proxy chain; the client is the first entry.
  const forwarded = first('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return first('x-real-ip') || 'unknown';
}
