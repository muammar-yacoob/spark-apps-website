SparkStripe Integration Kit
Spark AI (push / nextjs)

FILES
  SparkStripe.tsx         React hooks (useSparkStatus, useCheckout) and UI (SparkBadge, SparkGate).
  sparkstripe-server.ts   Server-safe: types, status, gating, guards, limits, webhook. No React/CSS. Includes POST handler for webhooks.
  plans.json              Per-tier plan data (name, features, limits). Edit to tweak without re-downloading.
  sparkstripe-kit.css     Badge + gate wall + promo tip + toast styles.
  readme.txt              This file.

SETUP
  1. Copy all five files into your project in the same folder.
  2. Update imports to match your chosen location.
  3. APP_ID ('spark-ai') is a public identifier — safe to commit, not a secret.
  4. Add env vars:
     NEXT_PUBLIC_SPARK_APP_ID=spark-ai
     SPARK_STRIPE_WEBHOOK_SECRET=<from dashboard>

IMPORTS
  Server code (API routes, middleware, server components, CLI tools):
    import { getStatusCached, getLimit, isAllowed } from './sparkstripe-server';

  Client code (React components):
    import { SparkBadge, useSparkStatus } from './SparkStripe';

  Both files export the same helpers (getStatusCached, getLimit, etc.).
  Use sparkstripe-server.ts in server-only contexts to avoid pulling in
  React and CSS dependencies.

  IMPORTANT: Do NOT create wrapper files that re-export the kit. Import
  directly from SparkStripe.tsx or sparkstripe-server.ts. The kit is the
  complete integration layer -- no barrel files or adapters needed.

BADGE USAGE
  import { SparkBadge } from './SparkStripe';

  <SparkBadge email={user.email} />

  Shows the user's plan name. On free tier with expired trial, an "Upgrade"
  link appears. With public coupons, a discount tip fades in on hover.

  Props:
    email       (required)
    className   (optional) extra CSS class on the outer <span>
    classNames  (optional) per-part overrides: { root?, label?, link? }

  Auto-refresh: SparkBadge and useSparkStatus refetch when the tab regains
  focus or visibility. Built-in 30s throttle per email prevents hammering.
  Coupons are fetched ONCE per page load (deduped across all badge instances).

GATING USAGE
  import { getStatusCached, isPaid, hasAccess, hasFeature, showPaywall } from './SparkStripe';

  const data = await getStatusCached(email);
  if (isPaid(data))               // any paid plan
  if (hasAccess(data, 'pro'))     // pro tier or above (typos fail at compile time)
  if (hasFeature(data, 'tiktok')) // named feature from the dashboard plan config
  if (showPaywall(data))          // trial expired, show upgrade
  if (data.access.is_canceling) console.log('Expires:', data.subscription?.current_period_end);

  Prefer hasFeature over hardcoded tier chains -- unlocking a feature for a new
  tier becomes a dashboard edit with no code change.

LIMITS
  Per-tier limits live in plans.json under each tier's "limits" key.
  SparkStripe.tsx imports this file, so you can tweak caps without
  re-downloading the kit or editing TypeScript.

  Current plan limits:
    free: { apps: 1, api_access: 0, daily_messages: 5, monthly_messages: 50, user_daily_messages: 5, conversations_per_day: 8 }
    startup: { apps: 1, api_access: 1, daily_messages: 20, monthly_messages: 500, user_daily_messages: 20, conversations_per_day: 20 }
    ai_brain: { apps: 3, api_access: 1, daily_messages: 70, monthly_messages: 2000, user_daily_messages: 50, conversations_per_day: 30 }
    galaxy_brains: { apps: -1 (unlimited), api_access: 1, daily_messages: 1000, monthly_messages: 30000, user_daily_messages: 200, conversations_per_day: 50 }

  import { getLimit, hasReachedLimit, nextTier } from './SparkStripe';

  const appsCap = getLimit(data, 'apps');                   // number or -1 (unlimited)
  if (hasReachedLimit(data, 'apps', currentAppsCount)) {
    // block or show upgrade prompt
  }

  const api_accessCap = getLimit(data, 'api_access');                   // number or -1 (unlimited)
  if (hasReachedLimit(data, 'api_access', currentApiAccessCount)) {
    // block or show upgrade prompt
  }

  const daily_messagesCap = getLimit(data, 'daily_messages');                   // number or -1 (unlimited)
  if (hasReachedLimit(data, 'daily_messages', currentDailyMessagesCount)) {
    // block or show upgrade prompt
  }
  const upsellTo = nextTier(data);                           // next paid tier or null

  Updating plans.json:
    1. Open plans.json
    2. Edit limits (use -1 for unlimited, 0 to block), features, or names
    3. Save -- your app picks up the changes on next build/reload
    4. Optionally import the edited file back into the dashboard

  Note: the SparkStripe status API also returns live plan data from the
  dashboard, which takes priority at runtime. So dashboard edits propagate
  automatically -- plans.json acts as the local fallback.

CACHE & INVALIDATION
  The kit caches status per email (60s TTL, 500 entries max).

  revalidateStatus(email)    Clear cached status for a user (call after webhook events)
  refreshStatus(email)       Clear cache + refetch immediately (returns fresh SparkStatus)
  confirmPayment(email)      Clear cache + refetch (use after Stripe checkout return)

  getTierLimitsCached(email) Returns { tier, limits } with batched caching (refetches
                             every 10th call or after 60s). Ideal for hot-path limit
                             checks where you don't need the full SparkStatus object.

  Webhooks call revalidateStatus automatically. For manual cache clearing:
    import { revalidateStatus } from './sparkstripe-server';
    revalidateStatus(user.email);  // next getStatusCached() will refetch

PROTECTING ROUTES
  Minimum Next.js: 15 (Promise params in dynamic routes). The kit ships with
  pre-bound guards generated from your plan map. Replace the stub `getIdentity`
  at the bottom of SparkStripe.tsx with your auth, then import the guards:

  // app/api/projects/route.ts
  import { NextResponse } from 'next/server';
  import { guardStartup } from './sparkstripe-server';

  export const POST = guardStartup(async (_req, _ctx, status, { email }) =>
    NextResponse.json({ email, tier: status.access.tier })
  );

  Dynamic routes -- pass the params shape as a generic:
  export const GET = guardStartup<{ id: string }>(async (_req, { params }, status, id) => {
    const { id: projectId } = await params;
    return NextResponse.json({ projectId });
  });

  Mint your own guards from defineGuards:
  import { defineGuards } from './sparkstripe-server';
  const make = defineGuards<Identity>({ getIdentity, requireVerified: true, gracePastDue: true });
  export const guardEnterprise = make({ minTier: 'enterprise' });

  Or gate a Server Component page:
  import { gatePage } from './sparkstripe-server';
  const status = await gatePage(session.user.email, { minTier: 'startup' });

GATING SEMANTICS
  Four user states:
  1. Anonymous         -- access.tier=null on paid-only apps. Never satisfies any gate.
  2. Registered free   -- access.tier='free'. Passes `minTier: 'free'` on apps with a free plan.
  3. Trialing / active -- passes default gate and any minTier <= their tier.
  4. past_due          -- locked out by default. Pass `gracePastDue: true` to
                          keep them in-tier during Stripe's retry window (~1-7 days).

  The Tier union at the top of SparkStripe.tsx is generated from YOUR plans.
  Typo'd minTier values are a compile error.

POST-CHECKOUT REFRESH
  When a user returns from Stripe, their cached status may be stale. Call
  confirmPayment to flush the cache and return the fresh status in one call.

  import { confirmPayment } from './sparkstripe-server';
  // app/checkout/return/page.tsx (Server Component)
  const status = await confirmPayment(session!.user!.email!);

COUPONS
  import { getCoupons, validateCoupon, checkout, pricingUrl, convertPrices, getUsage } from './sparkstripe-server';

  const coupons = await getCoupons();                              // public coupons
  const coupon = await validateCoupon('SAVE20');                   // null if invalid/scoped-out
  const url = await checkout({ priceId, email, couponCode: 'SAVE20' });
  const link = pricingUrl({ email, coupon: 'SAVE20' });            // pricing page, pre-applied
  const plans = await convertPrices();                             // localised (currency by IP)
  const count = await getUsage(email);                             // raw usage counter

WEBHOOK SETUP
  SparkStripe.tsx ships an `export const POST = createWebhookHandler()` in
  push mode. Create app/api/webhooks/spark-stripe/route.ts:
    export { POST } from '<path>/SparkStripe';

  Or supply custom event handlers:
    import { createWebhookHandler, type SparkWebhookEvent } from './sparkstripe-server';
    type MyEvents = SparkWebhookEvent | 'subscription.renewed';
    export const POST = createWebhookHandler<MyEvents>({
      'checkout.completed':   async (email, data) => { /* welcome email */ },
      'subscription.renewed': async (email, data) => { /* custom event */ },
    });

  SparkWebhookPayload: { event: string; email: string; data: SparkWebhookData }
  SparkWebhookData fields:
    tier, plan_name, limits, features, status, payment_type,
    price_id, is_lifetime, billing_interval, cancel_at_period_end

  Example: update your own DB on plan change:
    export const POST = createWebhookHandler({
      'subscription.activated': async (email, data) => {
        await db.update(users).set({ tier: data.tier, limits: data.limits })
          .where(eq(users.email, email));
      },
    });

API REFERENCE
  Every export from sparkstripe-server.ts (and SparkStripe.tsx). Import
  directly -- do not wrap these in your own files.

  -- Status & Cache --
  getStatus(email)                Fetch fresh status (no cache)
  getStatusCached(email)          Fetch with 60s cache (Next.js revalidateTag)
  revalidateStatus(email)         Clear cached status for a user
  refreshStatus(email)            Clear + refetch, returns SparkStatus
  confirmPayment(email)           Clear + refetch (post-checkout)
  getTierLimitsCached(email)      Returns { tier, limits } with batched caching

  -- Accessors (all take SparkStatus) --
  getTier(d)                      Current tier string or null
  isPaid(d)                       Has active paid subscription
  isPastDue(d)                    Payment failed, in grace period
  hasTrialRemaining(d)            Trial still active
  showPaywall(d)                  Should show upgrade prompt
  isCanceling(d)                  Cancel scheduled at period end
  expiresAt(d)                    Period end date string or null
  isTrialExpired(d)               Trial expired
  trialDaysLeft(d)                Days remaining in trial
  trialUsesLeft(d)                Uses remaining in trial
  hasFeature(d, feature)          Plan includes named feature
  hasAccess(d, minTier)           Tier >= minTier (compile-time safe)
  isPayg(d)                       Is pay-as-you-go subscription
  nextTier(d)                     Next tier up or null

  -- Limits --
  getLimit(d, key, fallback?)     Limit value (-1 = unlimited), falls back to plans.json
  hasReachedLimit(d, key, count)  True if count >= limit (respects unlimited)
  getLimitOrUnlimited(d, key)     Number or null (null = unlimited)
  isUnlimited(d, key)             True if limit is -1
  getUnitPrice(d, key)            PAYG per-unit price in cents or null
  resolveEffectiveLimits(app, tier) Merge app-level overrides with tier defaults

  -- Plan Data (local from plans.json) --
  plans                           Local plan data: Record<Tier, { name, features, limits }>
  getPlanFeatures(tier)           Features array for a tier from plans.json

  -- Actions (API calls) --
  registerUser(email, name?)      Register for free tier
  trackUsage(email, n?, key?)     Increment usage counter
  getUsage(email)                 Get usage count
  getCoupons()                    List public coupons
  validateCoupon(code, priceId?)  Validate a coupon code
  convertPrices()                 Get localized prices (currency by IP)
  checkout(opts)                  Create Stripe checkout, returns URL
  verifyCheckoutSession(id)       Verify a completed session
  pricingUrl(opts?)               Build pricing page URL
  manageUrl(email, opts?)         Build subscription management URL

  -- Gating --
  isAllowed(d, opts?)             Check gate (minTier, requireVerified, gracePastDue)
  checkGate(email, opts?)         Fetch + check gate, returns { allowed, status, upgradeUrl }
  createGuard(opts)               Create route guard with getIdentity
  defineGuards(base)              Factory for multiple guards from shared auth
  gatePage(email, opts?)          Server Component gate (redirects on denial)
  createNextPlanGuard(opts)       Next.js route guard with params forwarding
  defineSparkGuards(opts)         All-in-one: returns { guard, guardStartup, guardAiBrain, guardGalaxyBrains }

  -- Pre-bound Guards (replace getIdentity stub first) --
  guard                           Any registered user with access
  guardStartup
  guardAiBrain
  guardGalaxyBrainsRequires >= that tier

  -- Webhook --
  verifyWebhookSignature(body, sig, secret?)   HMAC-SHA256 verification
  createWebhookHandler(handlers?)              Returns POST handler
  POST                                           Default webhook handler (re-export in route.ts)

  -- Types --
  Tier, SparkStatus, SparkPlan, SparkSub, SparkAccess, SparkTrial,
  SparkCoupon, SparkWebhookEvent, SparkWebhookData, SparkWebhookPayload,
  SparkIdentity, SparkGateOpts, SparkCheckoutOpts, SparkRegisterResult

AI AGENT PROMPT
  If you use an AI coding agent (Claude, Copilot, Cursor, etc.) in your
  project, add the following to your project instructions (CLAUDE.md,
  .cursorrules, etc.) to prevent it from creating unnecessary wrapper files:

  --- start prompt ---
  ## SparkStripe Kit

  This project uses the SparkStripe integration kit for billing, gating,
  and subscription management. The kit is self-contained -- do NOT create
  wrapper files, barrel re-exports, or adapter layers around it.

  Import directly from sparkstripe-server.ts (server) or SparkStripe.tsx
  (client). The kit exports everything you need -- check readme.txt API
  REFERENCE before writing any billing/subscription logic.

  DO (import from the kit directly):
    import { getStatusCached, getTier, getLimit, hasAccess } from './sparkstripe-server';
    import { getTierLimitsCached, revalidateStatus } from './sparkstripe-server';
    import { createWebhookHandler } from './sparkstripe-server';
    import { plans, getPlanFeatures } from './sparkstripe-server';

  DO NOT (never create these files):
    stripe.ts         -- barrel re-export of kit (the kit IS the barrel)
    billing.ts        -- getSubscriptionStatus wrapper (use getStatusCached directly)
    subscription.ts   -- cache wrapper (kit has 60s TTL + LRU built in)
    limits.ts         -- limit helpers (kit has getLimit, hasReachedLimit, getTierLimitsCached)

  Key exports you might not know about:
    getTierLimitsCached(email)   { tier, limits } with batched caching -- use for hot paths
    revalidateStatus(email)      clears the cache -- use after webhook events
    plans                        local plan data from plans.json (name, features, limits)
    getPlanFeatures(tier)        features array for a tier
    createWebhookHandler({...})  wire webhook events with one function call

  To configure plans: generate a plans.json (see GENERATING PLANS WITH AI
  in readme.txt) and import it into the SparkStripe dashboard. The dashboard
  creates plans and syncs prices to Stripe.

  The only files worth creating are app-specific side effects: syncing tier
  data to your own DB on webhook, or formatting plan info for an AI prompt.
  --- end prompt ---

GENERATING PLANS WITH AI
  Use the following prompt to generate a plans.json for your app. Import the
  output into the SparkStripe dashboard ("Import plans.json" on General tab).
  New tiers are created; existing tiers are updated. Max 4 plans.

  --- start prompt ---
  Generate a plans.json file for my app. Output ONLY valid JSON, no markdown
  fences. The file will be imported into SparkStripe to create pricing plans.

  Example (3 plans: free + subscription + one-time):

  {
    "free": {
      "name": "Free",
      "payment_type": "free",
      "features": [
        "5 projects",
        "100 API calls/month",
        "Community support"
      ],
      "limits": {
        "projects": 5,
        "api_calls": 100,
        "team_members": 1
      }
    },
    "pro": {
      "name": "Pro",
      "monthly_price": 19,
      "yearly_price": 190,
      "currency": "usd",
      "recommended": true,
      "features": [
        "Everything in Free, plus:",
        "Unlimited projects",
        "10,000 API calls/month",
        "Priority support"
      ],
      "limits": {
        "projects": -1,
        "api_calls": 10000,
        "team_members": 5
      }
    },
    "lifetime": {
      "name": "Lifetime",
      "payment_type": "one_time",
      "price": 299,
      "currency": "usd",
      "is_elite": true,
      "features": [
        "Everything in Pro, plus:",
        "Unlimited everything",
        "Pay once, use forever"
      ],
      "limits": {
        "projects": -1,
        "api_calls": -1,
        "team_members": -1
      }
    }
  }

  Field reference:
    Top-level keys    Tier slugs. Lowercase, hyphens ok. Examples: "free", "pro", "galaxy-brains"
    name              Display name on the pricing page
    payment_type      Required for non-subscription plans: "free", "one_time", "contact", "payg"
                      Omit entirely for recurring subscription plans (monthly/yearly)
    monthly_price     Dollars (not cents). Required for subscriptions. Example: 19 or 9.99
    yearly_price      Dollars. Optional. Enables annual billing toggle. Example: 190
    price             Dollars. For one_time plans only. Example: 299
    currency          ISO code, lowercase. Default: "usd"
    features          String array shown on pricing card. First line of paid plans should be
                      "Everything in [previous tier], plus:" to show tier inheritance
    limits            Object of snake_case keys to numeric caps. Used for feature gating.
                      -1 = unlimited, 0 = blocked. Keys must be consistent across all plans
    recommended       true on exactly one plan. Shows "MOST POPULAR" badge
    is_elite          true on the top tier. Shows "BEST VALUE" badge + crown icon
    trial_days        Number. Free trial days for this plan (overrides app default)
    contact_url       URL for "contact" payment_type plans
    unit_prices       PAYG only. Cents per unit: { "api_calls": 1 } = $0.01/call

  Constraints:
    - Max 4 plans. Order: free first, then ascending by price
    - Every plan must have the same limit keys (different values, same keys)
    - Limit values must increase with tier rank (free < pro < enterprise)
    - "recommended" on exactly one plan, "is_elite" on at most one

  My app: [describe your app, target audience, and what features/limits matter]
  --- end prompt ---
