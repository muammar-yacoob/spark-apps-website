'use client';
// SparkStripe (push/nextjs) | Spark AI | https://discord.gg/sparkstripe
// env: SPARK_STRIPE_WEBHOOK_SECRET=<from dashboard>
// Webhook: https://sparkbrain.app/api/webhooks/spark-stripe
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import './sparkstripe-kit.css';
import _PLANS from './plans.json';

export const TRIAL_DAYS = 7;
const APP_ID = 'spark-ai';
const BASE = 'https://sparkstripe.com';
// biome-ignore format: compact
type _PlanDef = { name?: string; features?: string[]; limits?: Record<string, number>; unit_prices?: Record<string, number> };
const PLANS = _PLANS as Partial<Record<Tier, _PlanDef>>;
// biome-ignore format: compact
const LIMITS: Partial<Record<Tier, Record<string, number>>> = Object.fromEntries(Object.entries(PLANS).filter(([, v]) => v?.limits).map(([k, v]) => [k, v!.limits!]));
export { PLANS as plans };

// ─── Types ─────────────────────────────────────────────────────────────────
export type Tier = 'free' | 'startup' | 'ai_brain' | 'galaxy_brains';
// biome-ignore format: compact
export type SparkPlan = { tier: Tier; name: string; rank: number; features: string[]; limits: Record<string, number>; unit_prices?: Record<string, number>; is_recommended: boolean; billing_interval: 'monthly' | 'yearly' | 'one_time' };
// biome-ignore format: compact
export type SparkSub = { payment_type: 'subscription' | 'one_time' | 'payg'; status: 'active' | 'trialing' | 'past_due' | 'canceled'; is_lifetime: boolean; is_payg: boolean; current_period_end: string | null; cancel_at_period_end: boolean; billing_interval: 'monthly' | 'yearly' | 'one_time'; price_id: string | null; created_at: string };
// biome-ignore format: compact
export type SparkAccess = { tier: Tier | null; rank: number; is_paid: boolean; has_trial_remaining: boolean; show_paywall: boolean; is_canceling: boolean };
// biome-ignore format: compact
export type SparkTrial = { is_expired: boolean; days_remaining: number; uses_remaining: number; max_days: number; max_uses: number };
// biome-ignore format: compact
export type SparkStatus = { subscription: SparkSub | null; verified: boolean; registered: boolean; usage_count: number; trial: SparkTrial | null; plan: SparkPlan | null; access: SparkAccess; tiers: { tier: Tier; rank: number }[]; referral_code: string | null; message?: string };
// biome-ignore format: compact
export type SparkCoupon = { code: string; discountPercent: number; description: string | null; expiresAt: string | null; appliesToTiers: Tier[] | null };
// biome-ignore format: compact
export type SparkWebhookEvent = 'checkout.completed' | 'subscription.activated' | 'subscription.trial_started' | 'subscription.past_due' | 'subscription.canceled' | 'referral.completed';
// biome-ignore format: compact
// biome-ignore format: compact
export type SparkWebhookData = { status: string; payment_type: string | null; price_id: string | null; tier: Tier | null; plan_name: string | null; limits: Record<string, number>; features: string[]; current_period_end: string | null; is_lifetime: boolean; cancel_at_period_end: boolean; billing_interval: 'monthly' | 'yearly' | 'one_time' };
export type SparkWebhookPayload = {
  event: SparkWebhookEvent | string;
  email: string;
  data: SparkWebhookData;
};
export type SparkIdentity = { email: string; [k: string]: unknown };
export type SparkGateOpts = { minTier?: Tier; requireVerified?: boolean; gracePastDue?: boolean };
export type SparkRegisterResult = {
  success: true;
  pendingVerification: boolean;
  alreadyVerified: boolean;
};

// ─── Fetch (shared) ────────────────────────────────────────────────────────
const j = <T,>(p: Promise<Response>): Promise<T> =>
  p.then((r) => (r.ok ? (r.json() as Promise<T>) : Promise.reject(r.status)));
// biome-ignore format: compact
const jGet = <T,>(path: string, fallback: T): Promise<T> => fetch(`${BASE}${path}`).then((r) => r.ok ? r.json() : fallback).catch(() => fallback);
// biome-ignore format: compact
const jPost = <T,>(path: string, body: unknown): Promise<T> => j<T>(fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }));
const urlOf = (path: string, params: Record<string, string | undefined> = {}) => {
  const u = new URL(path, BASE);
  for (const [k, v] of Object.entries(params)) if (v) u.searchParams.set(k, v);
  return u.toString();
};
const eq = encodeURIComponent;
const ranksOf = (d: SparkStatus): Record<string, number> =>
  Object.fromEntries(d.tiers.map((t) => [t.tier, t.rank]));

// ─── Status ────────────────────────────────────────────────────────────────
// biome-ignore format: compact
const fetchStatus = (email: string, init?: RequestInit): Promise<SparkStatus> => j<SparkStatus>(fetch(`${BASE}/api/public/subscription/status-public?email=${eq(email)}&app_id=${APP_ID}`, init));
const _mem = new Map<string, { d: SparkStatus; t: number }>();
const _notify = new Map<string, Set<() => void>>();
// biome-ignore format: compact
const _subscribe = (email: string, fn: () => void): (() => void) => { const k = email.toLowerCase(); if (!_notify.has(k)) _notify.set(k, new Set()); _notify.get(k)!.add(fn); return () => _notify.get(k)?.delete(fn); };
const tag = (e: string) => `spark-status-${e.toLowerCase()}`;
export const getStatus = (e: string) => fetchStatus(e, { cache: 'no-store' });
// biome-ignore format: compact
export const getStatusCached = (e: string) => fetchStatus(e, { next: { revalidate: 60, tags: [tag(e)] } } as RequestInit);
// revalidateStatus is server-only (uses revalidateTag). Call refreshStatus() client-side to notify mounted hooks.
// biome-ignore format: compact
export const revalidateStatus = async (email: string): Promise<void> => { const { revalidateTag } = await import('next/cache'); revalidateTag(tag(email)); };
// biome-ignore format: compact
export const refreshStatus = async (email: string): Promise<SparkStatus> => { const k = email.toLowerCase(); _mem.delete(k); const d = await getStatus(email); _mem.set(k, { d, t: Date.now() }); _notify.get(k)?.forEach(fn => fn()); return d; };
// biome-ignore format: compact
export const confirmPayment = async (email: string): Promise<SparkStatus> => { await revalidateStatus(email); return getStatus(email); };

// ─── Accessors & limits ───────────────────────────────────────────────────
export const getTier = (d: SparkStatus) => d.access.tier;
export const isPaid = (d: SparkStatus) => d.access.is_paid;
export const isPastDue = (d: SparkStatus) => d.subscription?.status === 'past_due';
export const hasTrialRemaining = (d: SparkStatus) => d.access.has_trial_remaining;
export const showPaywall = (d: SparkStatus) => d.access.show_paywall;
export const isCanceling = (d: SparkStatus) => d.access.is_canceling;
export const expiresAt = (d: SparkStatus) => d.subscription?.current_period_end ?? null;
export const isTrialExpired = (d: SparkStatus) => d.trial?.is_expired ?? true;
export const trialDaysLeft = (d: SparkStatus) => d.trial?.days_remaining ?? 0;
export const trialUsesLeft = (d: SparkStatus) => d.trial?.uses_remaining ?? 0;
export const hasFeature = (d: SparkStatus, f: string) => d.plan?.features?.includes(f) ?? false;
export const getPlanFeatures = (tier: Tier): string[] => PLANS[tier]?.features ?? [];
// biome-ignore format: compact
export const getTierByEmail = async (email: string) => { try { return getTier(await getStatusCached(email)); } catch { return null; } };
// biome-ignore format: compact
export const isVerified = async (email: string) => { try { return (await getStatusCached(email)).verified; } catch { return false; } };
export const hasAccess = (d: SparkStatus, min: Tier): boolean => {
  if (d.access.tier == null) return false;
  const r = ranksOf(d);
  return r[min] != null && (r[d.access.tier] ?? 0) >= r[min];
};
// biome-ignore format: compact
export const getLimit = (d: SparkStatus, key: string, fallback = 0): number => d.plan?.limits?.[key] ?? (d.access.tier ? LIMITS[d.access.tier]?.[key] : undefined) ?? fallback;
// biome-ignore format: compact
export const hasReachedLimit = (d: SparkStatus, key: string, count: number, fallback = 0) => { const cap = getLimit(d, key, fallback); return cap !== -1 && count >= cap; };
// biome-ignore format: compact
export const getLimitOrUnlimited = (d: SparkStatus, key: string): number | null => { const v = getLimit(d, key, 0); return v === -1 ? null : v; };
export const isUnlimited = (d: SparkStatus, key: string) => getLimit(d, key, 0) === -1;
export const isPayg = (d: SparkStatus) => d.subscription?.is_payg ?? false;
export const getUnitPrice = (d: SparkStatus, key: string): number | null =>
  d.plan?.unit_prices?.[key] ?? null;
// biome-ignore format: compact
export const resolveEffectiveLimits = (appLimits: Partial<Record<string, number>>, tierLimits: Record<string, number>): Record<string, number> => Object.fromEntries(Object.keys(tierLimits).map((k) => [k, appLimits[k] ?? tierLimits[k]]));
export const nextTier = (d: SparkStatus): Tier | null => {
  const sorted = [...d.tiers].sort((a, b) => a.rank - b.rank);
  const idx = d.access.tier == null ? -1 : sorted.findIndex((t) => t.tier === d.access.tier);
  return (sorted[idx + 1]?.tier ?? null) as Tier | null;
};
// biome-ignore format: compact
export const getTierLimitsCached = async (email: string) => { const d = await getStatusCached(email); const tier = getTier(d); return { tier, limits: d.plan?.limits ?? (tier ? LIMITS[tier] : undefined) ?? {} }; };

// ─── Actions ───────────────────────────────────────────────────────────────
// biome-ignore format: compact
export const registerUser = (email: string, name?: string): Promise<SparkRegisterResult> => jPost('/api/public/register-free', { email, name, app_id: APP_ID });
// biome-ignore format: compact
export const trackUsage = (email: string, increment = 1, limitKey?: string) => jPost('/api/public/usage', { email, app_id: APP_ID, increment, ...(limitKey ? { limit_key: limitKey } : {}) });
// biome-ignore format: compact
export const getUsage = (email: string): Promise<number> => jGet<{ usage_count?: number }>(`/api/public/usage?email=${eq(email)}&app_id=${APP_ID}`, {}).then((d) => d.usage_count ?? 0);
// biome-ignore format: compact
export const getCoupons = (): Promise<SparkCoupon[]> => jGet<{ coupons?: SparkCoupon[] }>(`/api/public/coupons/list?app_id=${APP_ID}`, {}).then((d) => d.coupons ?? []);
// biome-ignore format: compact
export const convertPrices = (): Promise<Record<string, unknown>[]> => jGet<{ plans?: Record<string, unknown>[] }>(`/api/public/convert-prices?app_id=${APP_ID}`, {}).then((d) => d.plans ?? []);
// biome-ignore format: compact
export const verifyCheckoutSession = (sessionId: string): Promise<boolean> => jPost<unknown>('/api/checkout/verify-session', { session_id: sessionId, app_id: APP_ID }).then(() => true, () => false);
// biome-ignore format: compact
export const validateCoupon = async (code: string, priceId?: string): Promise<SparkCoupon | null> => {
  const q = new URLSearchParams({ app_id: APP_ID, code });
  if (priceId) q.set('price_id', priceId);
  // biome-ignore format: compact
  const d = await jGet<{ valid?: boolean; code: string; discountPercent: number; description?: string; expiresAt?: string; appliesToTiers?: Tier[] }>(`/api/public/coupons/validate?${q}`, null as unknown as { valid?: boolean; code: string; discountPercent: number });
  // biome-ignore format: compact
  return d?.valid ? { code: d.code, discountPercent: d.discountPercent, description: d.description ?? null, expiresAt: d.expiresAt ?? null, appliesToTiers: d.appliesToTiers ?? null } : null;
};
// biome-ignore format: compact
export type SparkCheckoutOpts = { priceId: string; email: string; couponCode?: string; ref?: string; successUrl?: string; cancelUrl?: string; returnUrl?: string };
export const checkout = async (opts: SparkCheckoutOpts): Promise<string> => {
  const d = await jPost<{ checkout_url?: string; error?: string }>('/api/checkout/create-public', {
    app_id: APP_ID,
    price_id: opts.priceId,
    customer_email: opts.email,
    ...(opts.couponCode && { coupon_code: opts.couponCode }),
    ...(opts.ref && { ref: opts.ref }),
    ...(opts.successUrl && { success_url: opts.successUrl }),
    ...(opts.cancelUrl && { cancel_url: opts.cancelUrl }),
    ...(opts.returnUrl && { return_url: opts.returnUrl }),
  });
  if (!d.checkout_url) throw new Error(d.error ?? 'checkout failed');
  return d.checkout_url;
};
// biome-ignore format: compact
export const pricingUrl = (opts?: { email?: string; coupon?: string; ref?: string; returnUrl?: string }) => urlOf(`/pricing/${APP_ID}`, { email: opts?.email, coupon: opts?.coupon, ref: opts?.ref, return_url: opts?.returnUrl });
// biome-ignore format: compact
export const referralUrl = (code: string, opts?: { returnUrl?: string }) => pricingUrl({ ref: code, returnUrl: opts?.returnUrl });
// biome-ignore format: compact
export const manageUrl = (email: string, opts?: { returnUrl?: string }) => urlOf(`/pricing/${APP_ID}`, { email, manage: '1', return_url: opts?.returnUrl });

// ─── Gate ──────────────────────────────────────────────────────────────────
export const isAllowed = (d: SparkStatus, opts: SparkGateOpts = {}): boolean => {
  if (opts.requireVerified && !d.verified) return false;
  const pastDue = d.subscription?.status === 'past_due';
  if (pastDue && !opts.gracePastDue) return false;
  if (opts.minTier) return d.registered && d.access.tier != null && hasAccess(d, opts.minTier);
  return !showPaywall(d) || (pastDue && !!opts.gracePastDue);
};
export const checkGate = async (email: string, opts: SparkGateOpts = {}) => {
  const status = await getStatusCached(email);
  return { allowed: isAllowed(status, opts), status, upgradeUrl: pricingUrl({ email }) };
};

// ─── Guards ────────────────────────────────────────────────────────────────
// biome-ignore format: compact
export type SparkHandler<I extends SparkIdentity, C> = (req: Request, ctx: C, status: SparkStatus, identity: I) => Promise<Response>;
// biome-ignore format: compact
export const createGuard = <I extends SparkIdentity = SparkIdentity>(opts: { getIdentity: (req: Request) => I | null | Promise<I | null> } & SparkGateOpts) => <C = undefined>(handler: SparkHandler<I, C>) => async (req: Request, ctx?: C): Promise<Response> => {
  const id = await opts.getIdentity(req);
  if (!id?.email) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const g = await checkGate(id.email, opts);
  return g.allowed ? handler(req, ctx as C, g.status, id) : Response.json({ error: 'upgrade required', upgradeUrl: g.upgradeUrl }, { status: 402 });
};
// biome-ignore format: compact
export const defineGuards = <I extends SparkIdentity = SparkIdentity>(base: { getIdentity: (req: Request) => I | null | Promise<I | null> } & SparkGateOpts) => (extra: SparkGateOpts = {}) => createGuard<I>({ ...base, ...extra });
/** Server Component / page gate: redirects to the pricing page on denial. */
// biome-ignore format: compact
export const gatePage = async (email: string, opts: SparkGateOpts = {}): Promise<SparkStatus> => {
  const g = await checkGate(email, opts);
  // biome-ignore format: compact
  if (!g.allowed) { const { redirect } = await import('next/navigation'); redirect(g.upgradeUrl); }
  return g.status;
};

// ── Next 15 app-router route guards ────────────────────────────────────────
// biome-ignore format: compact
export type NextRouteCtx<P = Record<string, string | string[]>> = { params: Promise<P> };
// biome-ignore format: compact
export type NextPlanHandler<I extends SparkIdentity = SparkIdentity, P = Record<string, string | string[]>> = (req: Request, ctx: NextRouteCtx<P>, status: SparkStatus, identity: I) => Promise<Response>;
// biome-ignore format: compact
export type NextPlanRoute<P = Record<string, string | string[]>> = (req: Request, ctx: NextRouteCtx<P>) => Promise<Response>;

// biome-ignore format: compact
export const createNextPlanGuard = <I extends SparkIdentity = SparkIdentity>(opts: { getIdentity: (req: Request) => I | null | Promise<I | null> } & SparkGateOpts) => <P = Record<string, string | string[]>>(handler: NextPlanHandler<I, P>): NextPlanRoute<P> => async (req, ctx) => {
  const id = await opts.getIdentity(req);
  if (!id?.email) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const g = await checkGate(id.email, opts);
  return g.allowed ? handler(req, ctx, g.status, id) : Response.json({ error: 'upgrade required', upgradeUrl: g.upgradeUrl }, { status: 402 });
};

/**
 * Wire SparkStripe guards to your auth. Call once in your own file and
 * re-export the guards from there — re-downloading the kit won't clobber
 * your wiring.
 *
 *   // app/_lib/spark-guards.ts
 *   export const { guard, guardStartup, guardAiBrain, guardGalaxyBrains } = defineSparkGuards({
 *     getIdentity: async () => {
 *       const s = await getServerSession(authOptions);
 *       return s?.user?.email ? { email: s.user.email, userId: s.user.id } : null;
 *     },
 *   });
 */
// biome-ignore format: compact
export const defineSparkGuards = <I extends SparkIdentity = SparkIdentity>(opts: { getIdentity: (req: Request) => I | null | Promise<I | null> } & SparkGateOpts) => {
  const mk = (extra: SparkGateOpts = {}) => createNextPlanGuard<I>({ ...opts, ...extra });
  return { guard: mk(), guardStartup: mk({ minTier: 'startup' }), guardAiBrain: mk({ minTier: 'ai_brain' }), guardGalaxyBrains: mk({ minTier: 'galaxy_brains' }) };
};

// ── Pre-bound Next.js guards ──────────────────────────────────────────────
// Replace `getIdentity` ONCE with your auth. Returning null => 401.
export type Identity = { email: string; [k: string]: unknown };
const getIdentity = async (_req: Request): Promise<Identity | null> => null;
const _mkg = defineGuards<Identity>({ getIdentity });
/** Any registered user with current access (no tier requirement). */
export const guard = _mkg();
/** Requires at least the `startup` plan. */
export const guardStartup = _mkg({ minTier: 'startup' });

/** Requires at least the `ai_brain` plan. */
export const guardAiBrain = _mkg({ minTier: 'ai_brain' });

/** Requires at least the `galaxy_brains` plan. */
export const guardGalaxyBrains = _mkg({ minTier: 'galaxy_brains' });

// ─── Webhook (push) ────────────────────────────────────────────────────────
const WH_SECRET = (process.env.SPARK_STRIPE_WEBHOOK_SECRET ?? '').trim();
// biome-ignore format: compact
export const verifyWebhookSignature = async (body: string, sig: string, secret = WH_SECRET) => {
  if (!secret) throw new Error('SPARK_STRIPE_WEBHOOK_SECRET is not set');
  const enc = new TextEncoder();
  // biome-ignore format: compact
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  // biome-ignore format: compact
  const hex = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(body))), (b) => b.toString(16).padStart(2, '0')).join('');
  let m = 0;
  // biome-ignore format: compact
  for (let i = 0, n = Math.max(hex.length, sig.length); i < n; i++) m |= (hex.charCodeAt(i) || 0) ^ (sig.charCodeAt(i) || 0);
  return m === 0;
};
// biome-ignore format: compact
export type SparkWebhookHandlers<E extends string = SparkWebhookEvent> = Partial<Record<E, (email: string, data: SparkWebhookData) => void | Promise<void>>>;
// biome-ignore format: compact
export const createWebhookHandler = <E extends string = SparkWebhookEvent>(handlers?: SparkWebhookHandlers<E>) => async (req: Request) => {
  const body = await req.text();
  // biome-ignore format: compact
  if (!(await verifyWebhookSignature(body, req.headers.get('spark-signature') ?? ''))) return Response.json({ error: 'Invalid signature' }, { status: 401 });
  const { event, email, data }: SparkWebhookPayload = JSON.parse(body);
  await revalidateStatus(email);
  await handlers?.[event as E]?.(email, data);
  return Response.json({ received: true });
};
export const POST = createWebhookHandler();

// ─── Badge / Gate UI ───────────────────────────────────────────────────────
const NAMES: Record<string, string> = {
  free: 'Free',
  startup: 'Essentials',
  ai_brain: 'Pro',
  galaxy_brains: 'Galaxy Brains',
};
const CROWN = new Set<string>(['ai_brain', 'galaxy_brains']);
// biome-ignore format: compact
const COLORS: Record<string, { bg: string; fg: string }> = { free: { bg: '#27272a', fg: '#a1a1aa' }, active: { bg: '#052e16', fg: '#4ade80' }, trialing: { bg: '#1e1b4b', fg: '#a78bfa' }, past_due: { bg: '#431407', fg: '#fb923c' }, canceled: { bg: '#1c1917', fg: '#78716c' } };
const PAID = new Set(['active', 'trialing']);
// biome-ignore format: compact
const tierName = (t?: Tier | null) => { const k = t ?? 'free'; return NAMES[k] ?? k.charAt(0).toUpperCase() + k.slice(1); };
// biome-ignore format: compact
const statusOf = (d: SparkStatus) => d.subscription?.status ?? (d.access.is_paid ? 'active' : 'free');
// biome-ignore format: compact
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

const REFRESH_MIN_MS = 30_000;
export const useSparkStatus = (email: string | null) => {
  // biome-ignore format: compact
  const [status, setStatus] = useState<SparkStatus | null>(() => (email ? _mem.get(email.toLowerCase())?.d ?? null : null));
  const [loading, setLoading] = useState(() => !!email && !_mem.has(email.toLowerCase()));
  useEffect(() => {
    if (!email) return;
    let off = false;
    const k = email.toLowerCase();
    // biome-ignore format: compact
    const fetchNow = (fresh: boolean) => (fresh ? getStatus(email) : getStatusCached(email)).then((d) => { if (off) return; _mem.set(k, { d, t: Date.now() }); setStatus(d); setLoading(false); }).catch(() => { if (!off) setLoading(false); });
    const hit = _mem.get(k);
    if (hit) {
      setStatus(hit.d);
      setLoading(false);
    } else fetchNow(false);
    // biome-ignore format: compact
    const onFocus = () => { if (document.visibilityState !== 'visible') return; const e = _mem.get(k); if (!e || Date.now() - e.t >= REFRESH_MIN_MS) fetchNow(true); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    const unsub = _subscribe(email, () => {
      if (!off) fetchNow(true);
    });
    // biome-ignore format: compact
    return () => { off = true; window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onFocus); unsub(); };
  }, [email]);
  return {
    status,
    loading,
    tier: status ? tierName(status.plan?.tier ?? status.access.tier) : null,
    isPaid: status?.access.is_paid ?? false,
    showPaywall: status ? showPaywall(status) : false,
  };
};

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const go = async (opts: SparkCheckoutOpts) => {
    setLoading(true);
    setError(null);
    try {
      window.location.href = await checkout(opts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'checkout failed');
    } finally {
      setLoading(false);
    }
  };
  return { checkout: go, loading, error };
};

let _coupons: Promise<SparkCoupon[]> | null = null;
// biome-ignore format: compact
const pickPromo = (cs: SparkCoupon[], s: SparkStatus): SparkCoupon | null => {
  const r = ranksOf(s);
  const cur = s.access.is_paid && s.access.tier ? (r[s.access.tier] ?? 0) : -1;
  // biome-ignore format: compact
  const rel = cs.filter((c) => { const ts = c.appliesToTiers?.length ? c.appliesToTiers : s.tiers.map((t) => t.tier); return ts.some((t) => (r[t] ?? -Infinity) > cur); });
  return rel.sort((a, b) => a.discountPercent - b.discountPercent)[0] ?? null;
};

export function SparkBadge({
  email,
  className,
  classNames,
}: {
  email: string;
  className?: string;
  classNames?: { root?: string; label?: string; link?: string };
}) {
  const { status: d } = useSparkStatus(email);
  const [promo, setPromo] = useState<SparkCoupon | null>(null);
  const [tip, setTip] = useState<{ rect: DOMRect; exit: boolean } | null>(null);
  const [welcome, setWelcome] = useState<{ label: string; visible: boolean } | null>(null);
  const ref = useRef<HTMLAnchorElement>(null);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pkey = `ss-promo-${email.toLowerCase()}`;
  const skey = `ss-status-${email.toLowerCase()}`;

  useEffect(() => {
    if (!d || localStorage.getItem(pkey)) return;
    // biome-ignore format: compact
    (_coupons ??= getCoupons().catch(() => [])).then((cs) => setPromo(pickPromo(cs, d)));
  }, [d, pkey]);

  useEffect(() => {
    if (!d) return;
    const cur = statusOf(d),
      prev = localStorage.getItem(skey);
    localStorage.setItem(skey, cur);
    if (!PAID.has(cur) || (prev && PAID.has(prev))) return;
    setWelcome({ label: tierName(d.plan?.tier ?? (cur as Tier)), visible: true });
    const t1 = setTimeout(() => setWelcome((w) => w && { ...w, visible: false }), 3500);
    const t2 = setTimeout(() => setWelcome(null), 4100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [d, skey]);

  if (!d) return null;
  const c = COLORS[statusOf(d)] ?? COLORS.free;
  const hasPromo = !!promo;
  const linkable = (!d.access.is_paid && d.access.show_paywall) || hasPromo;
  const tier = d.plan?.tier ?? d.access.tier;
  // biome-ignore format: compact
  const openTip = () => { if (!hasPromo || !ref.current) return; if (tipTimer.current) clearTimeout(tipTimer.current); setTip({ rect: ref.current.getBoundingClientRect(), exit: false }); };
  // biome-ignore format: compact
  const closeTip = () => { setTip((t) => (t ? { ...t, exit: true } : null)); tipTimer.current = setTimeout(() => setTip(null), 220); };
  // biome-ignore format: compact
  const style = { '--ss-bg': c.bg, '--ss-fg': c.fg, '--ss-border': `${c.fg}33`, cursor: linkable ? 'pointer' : 'default' } as CSSProperties;

  return (
    <span className="ss-wrap" onMouseEnter={openTip} onMouseLeave={closeTip}>
      <a
        ref={ref}
        href={linkable ? pricingUrl({ email, coupon: promo?.code }) : undefined}
        className={cx('ss-badge', className, classNames?.root)}
        style={style}
        data-promo={hasPromo ? '' : undefined}
        onClick={(e) => !linkable && e.preventDefault()}
      >
        {!!tier && CROWN.has(tier) && (
          <svg className="ss-crown" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 8l4.5 3L12 5l4.5 6L21 8l-2 10H5L3 8zm2 12h14v2H5v-2z" />
          </svg>
        )}
        <span className={classNames?.label}>{tierName(tier)}</span>
        {linkable && (
          <>
            <span className="ss-sep" />
            <span className={cx('ss-upgrade', hasPromo && 'ss-discount', classNames?.link)}>
              {hasPromo ? `${promo!.discountPercent}% off` : 'Upgrade'}
            </span>
          </>
        )}
      </a>
      {hasPromo &&
        tip &&
        createPortal(
          <span
            className="ss-promo-tip"
            style={{ top: tip.rect.bottom + 8, left: tip.rect.left + tip.rect.width / 2 }}
            onMouseEnter={openTip}
            onMouseLeave={closeTip}
            {...(tip.exit ? { 'data-ss-exit': '' } : { 'data-ss-enter': '' })}
          >
            <span className="ss-promo-tip-code">{promo!.code}</span>
            <span className="ss-promo-tip-desc">Claim your discount while it lasts</span>
            <button
              type="button"
              className="ss-promo-tip-x"
              onClick={(e) => {
                e.stopPropagation();
                setPromo(null);
                localStorage.setItem(pkey, '1');
              }}
            >
              ✕
            </button>
          </span>,
          document.body
        )}
      {welcome && (
        <span className="ss-toast" style={{ opacity: welcome.visible ? 1 : 0 }}>
          Welcome to {welcome.label}!
        </span>
      )}
    </span>
  );
}

export function SparkGate({
  status,
  children,
  minTier,
}: { status: SparkStatus | null; children: React.ReactNode; minTier?: Tier }) {
  if (!status) return null;
  const allowed = minTier ? hasAccess(status, minTier) : !showPaywall(status);
  if (allowed) return <>{children}</>;
  return (
    <div className="spark-gate-wall">
      <p className="spark-gate-msg">
        {trialDaysLeft(status) > 0
          ? `${trialDaysLeft(status)} trial day(s) left`
          : 'Your free trial has ended'}
      </p>
      <a href={pricingUrl()} className="spark-gate-cta">
        Upgrade to continue
      </a>
    </div>
  );
}
