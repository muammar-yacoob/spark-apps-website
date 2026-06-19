# SparkStack Setup Guide

A quick-start reference for spinning up a new project from this starter.

---

## 1. Prerequisites

- **Bun** (runtime + package manager)
- **Neon** PostgreSQL database
- **Google Cloud** OAuth credentials
- **Vercel** account (deployment)

## 2. Quick Setup

```bash
# Clone and install
git clone <your-repo-url> && cd <project>
bun install

# Copy env template and fill in values
cp .env.example .env.local

# Push DB schema to Neon
bun db:push

# Start dev server
bun dev
```

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `ALLOWED_EMAILS` | Comma-separated email whitelist for access |
| `NEXT_PUBLIC_SPARK_AI_API_KEY` | Spark AI API key (for local dev only) |
| `SPARK_STRIPE_WEBHOOK_SECRET` | SparkStripe webhook HMAC secret |

## 3. Project Structure

```
app/
  _animations/               # Background animations
  _components/               # Shared components (feedback/, layout/, ui/, hooks/, bg-anims/, svgs/)
  api/auth/[...nextauth]/    # NextAuth route handler
  dashboard/                 # Protected dashboard (SessionProvider layout)
  contact/                   # Contact form page
  privacy/                   # Privacy policy
  terms/                     # Terms of service
  error/                     # Generic error page

lib/
  auth/                      # NextAuth v5 config (Google OAuth + email whitelist)
  db/                        # Drizzle ORM schema, connection, config
  utils/                     # crypto, currency, slug, format, rate-limiter
  og/                        # OpenGraph image generation config
  spark-ai/                  # AI wand components (PROJECT-SPECIFIC, see below)
  spark-stripe/              # Billing, gating, subscriptions (PROJECT-SPECIFIC, see below)

docs/
  bottled-api-reference.md   # Bottled email API reference
  setup-guide.md             # This file
```

### Key Conventions

- **Runtime**: Always use `bun`, never `npm`/`yarn`/`node`
- **Linting**: Biome with single quotes, 100-char lines, trailing commas (es5), always semicolons
- **Imports**: Use `@/` path alias for all project-relative imports
- **Directories**: Underscore prefix for private folders (`_components/`, `_lib/`)
- **Hydration**: Use `useEffect()` for client-only code; `dynamic()` for third-party libs
- **Punctuation**: Never use the em dash character (U+2014)

---

## 4. Replaceable Kits

The following directories contain drop-in kits that are **project-specific**. When forking SparkStack for a new project, you will need to replace these with versions configured for your app. Do not modify them in the starter itself.

### lib/spark-ai/ -- AI Wand Kit

An AI-powered input enhancement kit from [sparkbrain.app](https://sparkbrain.app). Provides drop-in AI wand buttons that attach to any input or textarea, enabling AI-assisted text improvement, rephrasing, and generation.

**Files:**

| File | Purpose |
|------|---------|
| `spark-ai.tsx` | Core: `useAi` hook, `AiWand`, `AiInput`, `AiTextarea`, `configure()` |
| `wands.tsx` | Specialized wands: `AiRephraseWand`, `AiLimitsWand`, `AiReviseFeatures`, `AiComparisonWand`, `AiConfirmWand` |
| `spark-ai.css` | Wand animations, tooltips, field wrapper styles |

**How it works:**
- Calls the sparkbrain.app API directly from the client -- no server code needed
- Auth is automatic via your domain in production
- For local dev (localhost), set `NEXT_PUBLIC_SPARK_AI_API_KEY` in your env

**Per-project setup:**
1. Register your domain at sparkbrain.app
2. Get an API key from the dashboard
3. Replace the kit files with the ones downloaded for your app
4. For local dev, call `configure({ apiKey: process.env.NEXT_PUBLIC_SPARK_AI_API_KEY })` in your app entry

**Usage examples:**

```tsx
import { AiWand, AiInput, useAi } from '@/lib/spark-ai/spark-ai';
import { AiRephraseWand, AiComparisonWand } from '@/lib/spark-ai/wands';

// Wand button that improves text
<AiWand tooltip="Improve" prompt={(v) => `Improve this: ${v}`} value={text} onResult={setText} />

// Input with built-in AI wand
<AiInput value={title} onChange={setTitle} prompt={(v) => `Improve: "${v}"`} placeholder="Title" />

// Rephrase wand (backend handles prompt)
<AiRephraseWand value={text} onChange={setText} />

// Programmatic access
const { available, loading, ask, action } = useAi();
const reply = await ask('Summarize this');
```

---

### lib/spark-stripe/ -- Billing & Subscription Kit

A self-contained billing integration kit from [sparkstripe.com](https://sparkstripe.com). Handles subscription status, plan gating, usage limits, checkout, webhooks, and UI badges.

**Files:**

| File | Purpose |
|------|---------|
| `SparkStripe.tsx` | Client: React hooks (`useSparkStatus`, `useCheckout`) and UI (`SparkBadge`, `SparkGate`) |
| `sparkstripe-server.ts` | Server: types, status fetching, gating, guards, limits, webhook handler. No React/CSS |
| `plans.json` | Per-tier plan data (name, features, limits). Edit without touching code |
| `sparkstripe-kit.css` | Badge, gate wall, promo tip, toast styles |

**How it works:**
- Communicates with sparkstripe.com API for subscription status, checkout, and plan data
- `APP_ID` in both `.tsx` and `.ts` files identifies your app (public, not a secret)
- Webhook verification uses HMAC-SHA256 via `SPARK_STRIPE_WEBHOOK_SECRET`
- Status is cached (60s TTL) with automatic revalidation via Next.js tags

**Per-project setup:**
1. Create your app on sparkstripe.com
2. Download the kit files configured for your app (they contain your `APP_ID` and tier slugs)
3. Replace all five files in `lib/spark-stripe/`
4. Set `SPARK_STRIPE_WEBHOOK_SECRET` in your env
5. Wire `getIdentity` in both `SparkStripe.tsx` and `sparkstripe-server.ts` to your auth:

```ts
const getIdentity = async (req: Request): Promise<Identity | null> => {
  const session = await auth(); // your NextAuth helper
  return session?.user?.email ? { email: session.user.email } : null;
};
```

6. Create the webhook route:

```ts
// app/api/webhooks/spark-stripe/route.ts
export { POST } from '@/lib/spark-stripe/SparkStripe';
```

**Import rules:**
- Server code: import from `sparkstripe-server.ts`
- Client code: import from `SparkStripe.tsx`
- Never create wrapper files -- the kit is the complete integration layer

**Key exports:**

```ts
// Status & gating
import { getStatusCached, isPaid, hasAccess, showPaywall, getLimit } from '@/lib/spark-stripe/sparkstripe-server';

// Route protection
import { guardStartup, guardAiBrain, gatePage } from '@/lib/spark-stripe/sparkstripe-server';

// UI
import { SparkBadge, SparkGate, useSparkStatus } from '@/lib/spark-stripe/SparkStripe';
```

**Plan tiers (current config):** `free` | `startup` | `ai_brain` | `galaxy_brains`

Each project will have its own tier slugs and limits defined in `plans.json`.

---

## 5. Bottled Email Integration

The project includes a reference for the [Bottled](https://bottled.email) transactional email API. See `docs/bottled-api-reference.md` for the full specification.

**Quick overview:**

| What | Details |
|------|---------|
| Base URL | `https://bottled.email/api/v1` |
| Auth | `Authorization: Bearer btl_YOUR_API_KEY` (per-domain, shown once) |
| Send email | `POST /send` with `from`, `to`, `subject`, and `text`/`html` |
| Domains | `GET /domains`, `POST /domains/:name` (verify DNS) |
| Email addresses | `GET /emails`, `POST /emails` (create forwarding address) |
| Usage | `GET /status` returns sent/received counts and plan limits |

**Plan limits:**

| Plan | Domains | Emails/Domain | Sent/Month |
|------|---------|---------------|------------|
| Free | 1 | 2 | 25 |
| Pro | 3 | 10 | 300 |
| Business | 15 | 50 | 5,000 |

**Integration tips:**
- Always send both `text` and `html` for better deliverability
- HTML content is auto-wrapped in an email-safe shell (no `<html>`/`<body>` needed)
- Use tables for layout (Outlook compatibility)
- Inline all styles on each element
- Validate recipients before sending -- the API checks syntax, role addresses, and MX records
- New domains have a warmup window with daily send caps that lift automatically

---

## 6. OG Image Configuration (lib/og/)

A portable OG image pipeline that generates dynamic, branded social cards with mascots, taglines, feature badges, and color-matched layouts. Uses `sharp` + `next/og` (Satori).

**Per-project setup:**

1. Edit `lib/og/config.ts` -- this is the ONLY file with project-specific imports:
   - `ogConfig.name` and `ogConfig.url` come from `lib/config/site.ts`
   - `ogConfig.taglines` come from `lib/config/taglines.ts`
   - `ogConfig.favicon` points to `app/favicon.png` (must be PNG, not ICO)
   - Update `ogConfig.cta`, `ogConfig.socialProof`, `ogConfig.features`, `ogConfig.badge`

2. Replace resources in `lib/og/res/`:
   - `res/fonts/` -- TTF files for heading, body, brand text (default: Sora 700, Inter 400)
   - `res/mascots/` -- drop PNG/JPG images here, auto-discovered via `readdirSync`
   - `res/badges/` -- optional badge overlay PNGs

3. Update `app/twitter-image.tsx` alt text to match your app name

4. Add `outputFileTracingIncludes` to `next.config.ts` for EVERY OG route:

```ts
outputFileTracingIncludes: {
  '/opengraph-image': ['./lib/og/res/**/*', './app/favicon.png'],
  '/twitter-image':   ['./lib/og/res/**/*', './app/favicon.png'],
}
```

**Critical pitfalls:**
- `public/` files are NOT on the serverless function filesystem -- all resources must live in `lib/og/res/`
- `import.meta.url` breaks after bundling -- use `process.cwd()` for all paths
- `twitter-image.tsx` must declare `runtime`, `dynamic`, `size`, `contentType` inline (re-exporting from opengraph-image silently breaks)
- Both OG routes need their own `outputFileTracingIncludes` entry (separate serverless functions)
- Sharp cannot read `.ico` files -- use `.png` for the favicon
- Unused files importing uninstalled deps break `bun type-check` even if never imported

---

## 7. SEO Kit (seo/)

Reusable prompts, checklists, and templates for search engine + AI discoverability. Not code -- reference material for humans and Claude Code agents.

**Files:**

| File | Purpose |
|------|---------|
| `audit.txt` | Full SEO/GEO audit prompt -- feed to Claude Code on any project |
| `per-page-checklist.md` | What every HTML page needs (meta, OG, Twitter, JSON-LD) |
| `post-deploy-checklist.md` | Validation steps after shipping (Lighthouse, GSC, social previews) |
| `directory-listings.md` | Manual submission guide ranked by ROI (Product Hunt, G2, Reddit, etc.) |
| `templates/` | Skeleton files: `llms.txt`, `llms-full.txt`, `robots.txt`, `security.txt`, `opensearch.xml`, `json-ld-homepage.json` |

**Per-project setup:**
1. Copy templates from `seo/templates/` into `public/` (or use App Router file conventions)
2. Replace `{placeholders}` with your app's details
3. Run `seo/audit.txt` as a Claude Code prompt against your project for a full audit
4. After deploy, walk through `seo/post-deploy-checklist.md`

---

## 8. Claude Code Prompts for Project Setup

Complete, copy-paste-ready prompts for common tasks. Each prompt is self-contained with enough context for a Claude Code agent to execute without further guidance.

---

### 8.1 Fork Starter into New Project

```
I'm forking SparkStack into a new SaaS project. Here's the info:

- Project name: [my-app-name]
- Description: [one-line description for package.json and metadata]
- Domain: [myapp.com]
- Support email: [hello@myapp.com]

Do the following:

1. Update package.json: set "name" to "[my-app-name]" and "description"
2. Update lib/config/site.ts: SITE_NAME derives from package.json name automatically, but verify
   the formatPackageName() output looks right for "[my-app-name]". If not, hardcode SITE_NAME.
3. Update lib/config/taglines.ts: replace all taglines with 5 taglines relevant to [describe what the app does].
   Keep each tagline under 35 chars. Format: "First half, second half" (split at comma for OG card).
4. Update app/layout.tsx metadata: title, description, openGraph, twitter card
5. Update app/twitter-image.tsx: change the alt text to match the new app name
6. Update CLAUDE.md: replace "SparkStack" with the new project name in the description
7. Update lib/og/config.ts:
   - ogConfig.cta: a call-to-action for the new app (e.g. "Start Free Trial")
   - ogConfig.socialProof: a social proof line (e.g. "Used by 500+ teams")
   - ogConfig.features: 6-8 feature pills relevant to the app with labels, icons, and colors
   - Available icon keys: zap, shield, video, mail, code, globe, creditCard, rocket

Do NOT touch lib/spark-ai/ or lib/spark-stripe/ -- those will be replaced separately.
Do NOT touch lib/og/utils/ or lib/og/res/ -- those are portable.
Run bun check after all changes.
```

---

### 8.2 Configure OG Images

```
Configure the OG image pipeline for this project. Read lib/og/DEPLOYMENT.txt for the full
deployment guide and pitfalls.

1. Read lib/og/config.ts and update:
   - ogConfig.features: replace with features relevant to this app
   - ogConfig.cta: update call-to-action text
   - ogConfig.socialProof: update social proof line
   - ogConfig.badge: set to a badge path in lib/og/res/badges/ or remove if not needed

2. Verify next.config.ts has outputFileTracingIncludes for BOTH routes:
   outputFileTracingIncludes: {
     '/opengraph-image': ['./lib/og/res/**/*', './app/favicon.png'],
     '/twitter-image':   ['./lib/og/res/**/*', './app/favicon.png'],
   }

3. Verify app/twitter-image.tsx declares route config INLINE (not re-exported):
   - runtime = 'nodejs'
   - dynamic = 'force-dynamic'
   - alt = '[App Name] - [domain]'
   - size = { width: 1200, height: 630 }
   - contentType = 'image/png'

4. Verify app/favicon.png exists (not .ico -- sharp cannot read ICO)

5. Start dev server with bun dev, then visit http://localhost:3000/opengraph-image
   to verify the card renders correctly.

Common issues:
- "Module not found: sharp" -- run bun add sharp
- Blank/broken image on Vercel -- missing outputFileTracingIncludes
- Wrong fonts on prod -- font .ttf files not traced
- public/ files not accessible -- resources must be in lib/og/res/, not public/
```

---

### 8.3 Run Full SEO Audit

```
Run a full SEO and AI discoverability audit on this project.

Read seo/audit.txt for the complete audit prompt -- it covers:
- Phase 1: Feature inventory and ranking
- Phase 2: AI discoverability (llms.txt, robots.txt, JSON-LD, answer-ready statements)
- Phase 3: Page-level SEO (metadata, content signals, sitemap)
- Phase 4: Trust & discovery files (security.txt, opensearch.xml, manifest.json)
- Phase 5-6: Content strategy and directory listings (manual action items)
- Phase 7: Validation

Use templates from seo/templates/ as starting points for any files that need to be created.
After applying changes, walk through seo/post-deploy-checklist.md to validate.

Important rules from the audit:
- Never include literal </script> in JSON-LD -- use \u003C and \u003E
- FAQPage and HowTo rich results are deprecated (2026) -- skip those schema types
- Answer-ready comparison statements are the highest-ROI AI discoverability tactic
- llms.txt must be served with Content-Type: text/plain and 24h+ cache headers
```

---

### 8.4 Wire SparkStripe Billing

```
Wire SparkStripe billing into this project. The kit is in lib/spark-stripe/.
Read lib/spark-stripe/readme.txt for the full API reference.

1. Wire getIdentity in BOTH files (SparkStripe.tsx AND sparkstripe-server.ts):

   import { auth } from '@/lib/auth';
   const getIdentity = async (_req: Request): Promise<Identity | null> => {
     const session = await auth();
     return session?.user?.email ? { email: session.user.email } : null;
   };

2. Create the webhook route:
   // app/api/webhooks/spark-stripe/route.ts
   export { POST } from '@/lib/spark-stripe/SparkStripe';

3. Add SparkBadge to the dashboard layout:
   import { SparkBadge } from '@/lib/spark-stripe/SparkStripe';
   <SparkBadge email={session.user.email} />

4. Add environment variable:
   SPARK_STRIPE_WEBHOOK_SECRET=<from SparkStripe dashboard>

Key rules:
- Import from sparkstripe-server.ts in server code, SparkStripe.tsx in client code
- NEVER create wrapper files -- the kit IS the integration layer
- Use hasFeature(status, 'feature-name') over hardcoded tier checks
- plans.json is the local fallback; dashboard data takes priority at runtime
- getLimit() returns -1 for unlimited, 0 for blocked
- guardStartup/guardAiBrain/guardGalaxyBrains are pre-bound route guards
- gatePage(email, { minTier: 'startup' }) gates Server Component pages (redirects on denial)
```

---

### 8.5 Wire Spark AI Kit

```
Wire the Spark AI kit into this project. The kit is in lib/spark-ai/.
Read lib/spark-ai/readme.txt for the full reference.

1. For local dev, add configure() call in your app's root client component or layout:

   import { configure } from '@/lib/spark-ai/spark-ai';
   configure({ apiKey: process.env.NEXT_PUBLIC_SPARK_AI_API_KEY });

2. Add environment variable:
   NEXT_PUBLIC_SPARK_AI_API_KEY=<from sparkbrain.app dashboard>

3. Usage examples:

   // Simple wand button on any text field
   import { AiWand } from '@/lib/spark-ai/spark-ai';
   <AiWand tooltip="Improve" prompt={(v) => `Improve: ${v}`} value={text} onResult={setText} />

   // Input with built-in wand
   import { AiInput } from '@/lib/spark-ai/spark-ai';
   <AiInput value={name} onChange={setName} prompt={(v) => `Better name: "${v}"`} placeholder="Name" />

   // Textarea with wand (wand appears top-right)
   import { AiTextarea } from '@/lib/spark-ai/spark-ai';
   <AiTextarea value={bio} onChange={setBio} prompt={(v) => `Improve this bio: ${v}`} rows={4} />

   // Rephrase wand (uses backend rephrase action)
   import { AiRephraseWand } from '@/lib/spark-ai/wands';
   <AiRephraseWand value={text} onChange={setText} />

   // Programmatic AI access
   const { available, loading, ask, action } = useAi();
   const reply = await ask('Summarize this in 2 sentences');
   const result = await action('rephrase', { value: 'Some rough text' });

Key rules:
- Auth is automatic via domain in production -- no API key needed
- API key is ONLY needed for localhost (no Origin header)
- The kit calls sparkbrain.app directly -- no /api/ai route needed in your app
- All wand buttons use suppressHydrationWarning on Lucide icons (Dark Reader fix)
```

---

### 8.6 Add Bottled Email Sending

```
Add transactional email sending via Bottled. Read docs/bottled-api-reference.md for the
full API spec.

Create a server-side email utility at lib/email.ts:

- Base URL: https://bottled.email/api/v1
- Auth: Authorization: Bearer ${process.env.BOTTLED_API_KEY}
- Use POST /send with { from, to, subject, text, html }
- Always send BOTH text and html (plain-text fallback improves deliverability)
- HTML is auto-wrapped in an email-safe shell -- only send body content, no <html>/<body> tags
- Use tables for layout (Outlook compatibility), inline all styles

Add environment variable:
  BOTTLED_API_KEY=btl_<your key from bottled.email dashboard>

Example send function:
  async function sendEmail({ to, subject, text, html }: EmailOpts) {
    const res = await fetch('https://bottled.email/api/v1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BOTTLED_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'hello@[yourdomain.com]',
        to, subject, text, html,
      }),
    });
    if (!res.ok) throw new Error(`Email failed: ${res.status}`);
    return res.json();
  }

Error codes to handle:
- 429 SEND_LIMIT_REACHED -- monthly quota exceeded, show upgrade prompt
- 429 DOMAIN_WARMUP_LIMIT -- new domain daily cap, auto-lifts as domain ages
- 422 INVALID_RECIPIENT -- bad syntax, role address, or no MX records

HTML formatting rules (from the API reference):
- Use tables, not divs, for layout
- Inline ALL styles (most clients strip <style> blocks)
- No CSS shorthand (write padding-top/padding-bottom, not padding: 12px 0)
- No background-image (Outlook ignores it)
- Set explicit width/height on images
- No JavaScript, <form>, <video>, <iframe>
- Include a plain-text link fallback below any CTA button
```

---

### 8.7 Add Plan-Gated API Route

```
Create an API route at app/api/[resource]/route.ts gated by SparkStripe plan.

Use the pre-bound guards from lib/spark-stripe/sparkstripe-server.ts:

  import { guardStartup } from '@/lib/spark-stripe/sparkstripe-server';
  import { NextResponse } from 'next/server';

  // Requires at least "startup" plan (returns 402 with upgradeUrl otherwise)
  export const POST = guardStartup(async (req, _ctx, status, { email }) => {
    const body = await req.json();
    // status.plan?.limits has the user's current limits
    // status.access.tier has their current tier
    return NextResponse.json({ success: true });
  });

For dynamic routes with params:
  import { guardAiBrain } from '@/lib/spark-stripe/sparkstripe-server';

  export const GET = guardAiBrain<{ id: string }>(async (_req, { params }, status, { email }) => {
    const { id } = await params;
    return NextResponse.json({ id, tier: status.access.tier });
  });

Available guards: guard (any registered), guardStartup, guardAiBrain, guardGalaxyBrains
For Server Component pages, use gatePage() instead (redirects to pricing on denial):
  import { gatePage } from '@/lib/spark-stripe/sparkstripe-server';
  const status = await gatePage(session.user.email, { minTier: 'startup' });
```

---

### 8.8 Generate plans.json for New App

```
Generate a plans.json for my app. Output ONLY valid JSON, no markdown fences.
The file will be imported into the SparkStripe dashboard to create pricing plans.

My app: [describe your app, target audience, key features, and what limits matter]

Follow this format exactly (see lib/spark-stripe/readme.txt for full field reference):

{
  "free": {
    "name": "Free",
    "payment_type": "free",
    "features": ["5 projects", "100 API calls/month", "Community support"],
    "limits": { "projects": 5, "api_calls": 100, "team_members": 1 }
  },
  "pro": {
    "name": "Pro",
    "monthly_price": 19,
    "yearly_price": 190,
    "currency": "usd",
    "recommended": true,
    "features": ["Everything in Free, plus:", "Unlimited projects", "Priority support"],
    "limits": { "projects": -1, "api_calls": 10000, "team_members": 5 }
  },
  "enterprise": {
    "name": "Enterprise",
    "monthly_price": 49,
    "yearly_price": 490,
    "currency": "usd",
    "is_elite": true,
    "features": ["Everything in Pro, plus:", "Unlimited everything", "Dedicated support"],
    "limits": { "projects": -1, "api_calls": -1, "team_members": -1 }
  }
}

Rules:
- Max 4 plans. Order: free first, ascending by price
- Every plan must have the SAME limit keys (different values, same keys)
- Limit values must increase with tier rank
- Use -1 for unlimited, 0 for blocked
- "recommended" on exactly one plan, "is_elite" on at most one
- payment_type: "free" for free tier, omit entirely for subscriptions, "one_time" for lifetime
- First feature line of paid plans: "Everything in [previous tier], plus:"
```

---

### 8.9 Add New Database Table

```
Add a new Drizzle table to lib/db/schema.ts.

Table name: [table_name]
Columns:
- [list each column with its type and constraints]

Follow the existing users table pattern:
- Use pgTable() from drizzle-orm/pg-core
- Include id (text, primaryKey, using createId() or cuid2)
- Include createdAt (timestamp, defaultNow, notNull)
- Include updatedAt (timestamp, defaultNow, notNull)
- Add a userId foreign key referencing users.id if this is user-owned data
- Export the table and its relations

After creating the schema, run: bun db:push

Example pattern from this project:
  export const projects = pgTable('projects', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  });
```

---

### 8.10 Add Protected Dashboard Page

```
Add a new protected page at app/dashboard/[feature-name]/page.tsx.

Follow the existing dashboard pattern:
1. Server component page.tsx that:
   - Gets the session via auth()
   - Redirects to /?login=true if no session (middleware handles this, but double-check)
   - Passes session data to a client component

2. Client component _components/[FeatureName].tsx that:
   - Is marked 'use client'
   - Receives session as prop
   - Uses useEffect() for any client-only code (hydration safety)
   - Uses suppressHydrationWarning on any SVG icons (Dark Reader fix)

The dashboard layout at app/dashboard/layout.tsx wraps children in SessionProvider.
Middleware at middleware.ts protects /dashboard/* routes automatically.
```

---

### 8.11 Full New Project Setup Sequence

```
I'm setting up a brand new SaaS project from the SparkStack boilerplate. Walk me through
the complete setup in order:

Project details:
- Name: [my-app]
- Domain: [myapp.com]
- Description: [what the app does]
- Target audience: [who it's for]

Setup sequence:
1. Update package.json (name, description)
2. Update lib/config/site.ts (verify SITE_NAME formatting)
3. Update lib/config/taglines.ts (5 app-relevant taglines, <35 chars each half)
4. Update app/layout.tsx metadata (title, description, OG, Twitter)
5. Update lib/og/config.ts (features, cta, socialProof, badge)
6. Update app/twitter-image.tsx alt text
7. Verify next.config.ts has outputFileTracingIncludes for OG routes
8. Replace app/favicon.png with the new app's favicon (must be PNG)
9. Update CLAUDE.md with new project name and description
10. Create .env.local with all required vars (see docs/setup-guide.md section 2)
11. Run bun install && bun db:push && bun check
12. Start bun dev and verify OG card at /opengraph-image

Do NOT modify:
- lib/spark-ai/ (will be replaced with project-specific kit from sparkbrain.app)
- lib/spark-stripe/ (will be replaced with project-specific kit from sparkstripe.com)
- lib/og/utils/ or lib/og/res/ (portable, no project-specific code)
- seo/ (reference material, not code)
```

---

## 9. Common Pitfalls

| Problem | Cause | Fix |
|---------|-------|-----|
| Hydration mismatch | Dynamic content in server-rendered component | Wrap in `useEffect()`, use `suppressHydrationWarning` on SVGs |
| OG image blank on Vercel | Missing `outputFileTracingIncludes` | Add tracing entries for BOTH `/opengraph-image` and `/twitter-image` |
| Twitter shows no card | No `app/twitter-image.tsx` file | Create it with inline route config (don't re-export from opengraph-image) |
| Sharp crash on Vercel | Running on Edge runtime | Set `export const runtime = 'nodejs'` in OG image routes |
| `Module not found: @/lib/...` | Wrong path alias | Use `@/lib/...` not `@lib/...` (note the slash) |
| SparkStripe 401 | `getIdentity` returns null | Wire it to your auth (see prompt 8.4) |
| SparkStripe 402 | User's plan doesn't meet `minTier` | This is working correctly -- show upgrade UI |
| Biome format errors | Wrong style | Single quotes, 100-char lines, trailing commas (es5), always semicolons |
| `public/` file not found in serverless | Vercel serves `public/` via CDN only | Move resources to `lib/og/res/` and use `process.cwd()` paths |
| Favicon color extraction fails | Using `.ico` file | Convert to `.png` -- sharp cannot read ICO format |
| Type-check fails on unused files | Dead imports of uninstalled packages | Remove unused files or install the deps |
| Dark Reader causes hydration errors | SVG attributes mutated by extension | Add `suppressHydrationWarning` to Lucide icon components |
| Bottled 429 on new domain | Warmup period daily cap | Wait -- cap lifts automatically as domain ages |

---

## 10. Development Commands Reference

```bash
bun dev              # Dev server with Turbopack
bun build            # Production build
bun deploy:check     # Full pre-deploy check (format + lint + type-check + build)
bun check            # Biome format + lint check
bun format           # Auto-format with Biome
bun lint             # Lint with Biome
bun type-check       # TypeScript type check (no emit)
bun db:push          # Push Drizzle schema to Neon
bun db:studio        # Open Drizzle Studio GUI
```
