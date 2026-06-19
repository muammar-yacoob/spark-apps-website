// sparkstripe-server.ts (push/nextjs) | Spark AI | https://discord.gg/sparkstripe
// Server-side: types, status, gating, guards, limits, webhook. No React/CSS.
// For React components (SparkBadge, SparkGate, hooks), see SparkStripe.tsx.
// env: SPARK_STRIPE_WEBHOOK_SECRET=<from dashboard>
// Webhook: https://sparkbrain.app/api/webhooks/spark-stripe
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
const j = <T>(p: Promise<Response>): Promise<T> =>
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
const tag = (e: string) => `spark-status-${e.toLowerCase()}`;
export const getStatus = (e: string) => fetchStatus(e, { cache: 'no-store' });
// biome-ignore format: compact
export const getStatusCached = (e: string) => fetchStatus(e, { next: { revalidate: 60, tags: [tag(e)] } } as RequestInit);
// biome-ignore format: compact
export const revalidateStatus = async (email: string): Promise<void> => { const { revalidateTag } = await import('next/cache'); revalidateTag(tag(email)); };
// biome-ignore format: compact
export const refreshStatus = async (email: string): Promise<SparkStatus> => { await revalidateStatus(email); return getStatus(email); };
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
export const getTierLimitsCached = async (email: string) => { try { const d = await getStatusCached(email); const tier = getTier(d); return { tier, limits: d.plan?.limits ?? (tier ? LIMITS[tier] : undefined) ?? {} }; } catch { return { tier: null, limits: {} as Record<string, number> }; } };

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
