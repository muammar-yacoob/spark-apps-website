SPARKSTACK - SaaS BOILERPLATE GUIDE FOR CLAUDE AGENTS
=====================================================

Read this ENTIRE file before writing any code. This boilerplate has
centralized config, reusable components, and design tokens. Duplicating
any of them is a bug, not a feature.


1. WHAT THIS IS
---------------
A generic dark-theme SaaS starter: Next.js 15 App Router, Bun, Neon
PostgreSQL, NextAuth v5 (Google OAuth), Tailwind CSS v4, Biome linter.
Deployed on Vercel (lhr1 region). Every new SaaS project forks this.


2. COMMANDS
-----------
bun dev              Dev server (Turbopack)
bun build            Production build (use "npx next build" internally)
bun check            Biome check (format + lint, must pass before commit)
bun type-check       TypeScript strict check
bun deploy:check     Full pre-deploy: check + type-check + build
bun test             Jest tests


3. ENVIRONMENT VARIABLES
------------------------
Copy .env.example to .env.local. Required:

  DATABASE_URL              Neon PostgreSQL connection string
  NEXT_PUBLIC_GOOGLE_CLIENT_ID   Google OAuth client ID
  GOOGLE_CLIENT_SECRET           Google OAuth secret
  NEXT_PUBLIC_APP_URL            Canonical URL (http://localhost:3000 locally)

Optional:

  ALLOWED_EMAILS            Comma-separated email whitelist for dashboard
                            (empty = allow all authenticated users)
  AUTH_SECRET               NextAuth secret (auto-generated if omitted)
  NEXT_PUBLIC_SUPPORT_EMAIL Support email (defaults to hello@<domain>)
  BOTTLED_EMAIL_API_KEY     For contact form email delivery
  CONTACT_FROM_EMAIL        Sender/recipient for contact form


4. CENTRALIZED CONFIG -- DO NOT DUPLICATE
-----------------------------------------
All identity and branding flows from TWO files. When building a new
project from this boilerplate, edit these first and everything updates:

  lib/config/site.ts
    SITE_URL          - from NEXT_PUBLIC_APP_URL env var
    SITE_NAME         - auto-derived from package.json "name" field
    SITE_DESCRIPTION  - from package.json "description" field
    THEME_COLOR       - primary brand hex
    SUPPORT_EMAIL     - from env or derived from domain

  lib/config/taglines.ts
    TAGLINES[]        - rotating brand phrases used by PageLoader,
                        dashboard header, ShareModal, etc.

USAGE:
  import { SITE_NAME, SITE_URL, SUPPORT_EMAIL } from '@/lib/config/site';
  import { TAGLINES } from '@/lib/config/taglines';

DO NOT hardcode site names, URLs, or taglines anywhere. Always import.

To rebrand: change package.json "name" and "description", set
NEXT_PUBLIC_APP_URL in env, update THEME_COLOR in site.ts, and replace
TAGLINES. That's it. Layout, metadata, manifest, OG image, loader,
share modal, and legal footer all read from these sources.


5. DESIGN TOKENS (globals.css :root)
-------------------------------------
The entire dark UI is built on CSS custom properties. Use them.

  --color-brand / --color-brand-muted     Accent color
  --color-surface-base / raised / overlay Background layers
  --color-text / secondary / muted / faint  Text hierarchy
  --color-border / hover / active         Border states
  --radius-sm / md / lg / xl              Corner radii
  --shadow-modal                          Modal drop shadow

The dashboard CSS (dashboard.module.css) uses these tokens throughout.
When adding new panels, cards, or inputs, use var(--color-border) etc.
instead of hardcoded rgba() values.

CAVEAT: Tailwind gray-400/500/600 are overridden in @theme to be
brighter for dark backgrounds. If you use Tailwind grays, they are
already adjusted. Do not add your own overrides.

Global animations available as utility classes:
  .animate-blob, .animate-fade-in-up, .animate-fade-in,
  .animate-scale-in, .animate-pulse-gentle, .animate-shake
  .animation-delay-200 through .animation-delay-1200
  .btn-shimmer (diagonal sweep effect for CTA buttons)


6. PROJECT STRUCTURE
--------------------
app/
  _animations/            Lottie JSON files (loader, errors, search)
  _components/
    bg-anims/             8 animated backgrounds + BgAnimRotator
    ContactUs/            Full contact form system (see section 10)
    date-input/           DateInput CSS module
    feedback/             Loader, PageLoader, NavigationLoader
    layout/               LegalPageFooter, LegalBackButton, SupportEmailLink
    social/               ShareModal (8 platforms)
    ui/                   Tooltip, CloseButton, ColorPicker, DateInput, StatusBadge
    ServiceWorkerRegistrar.tsx
  api/
    auth/[...nextauth]/   NextAuth route handler
    contact/              Contact form POST handler
    dashboard/            Protected DB stats endpoint
  dashboard/              Protected area (SessionProvider + React Query)
    _components/          OverviewPanel, SettingsView, Charts
    _lib/                 query-keys
    hooks/                useDashboardStats
    dashboard.module.css  All dashboard styles (uses design tokens)
  contact/                Contact page (uses ContactForm component)
  error/                  Generic error page (Lottie + search params)
  privacy/ terms/         Legal pages
  layout.tsx              Root layout (metadata, SW, NavigationLoader)
  manifest.ts             PWA manifest (reads SITE_NAME, SITE_DESCRIPTION)
  opengraph-image.tsx     Dynamic OG card (gradient + tech pills)
  robots.ts               SEO + AI crawler rules
  sitemap.ts              Static sitemap
lib/
  auth/index.ts           NextAuth config (Google + email whitelist)
  config/site.ts          ALL identity constants (see section 4)
  config/taglines.ts      Brand taglines array
  db/index.ts             Neon raw SQL client
middleware.ts             Protects /dashboard/*, redirects to /?login=true
public/
  sw.js                   Service worker (cache-first + offline fallback)
  .well-known/security.txt

Naming convention: underscore prefix (_components, _lib, _animations,
_modals) for private/non-route folders.


7. AUTH
-------
  File: lib/auth/index.ts
  Provider: Google OAuth via NextAuth v5 (beta.31)
  Whitelist: ALLOWED_EMAILS env var (comma-separated, empty = allow all)
  Middleware: protects /dashboard/* only
  Session: available via useSession() in client components under
           dashboard/layout.tsx (SessionProvider wrapper)

To add a provider: add it to the providers[] array in lib/auth/index.ts
and update the signIn callback if needed.

CAVEAT: NextAuth v5 is still beta. Pin the version. The signIn page is
set to "/" which opens the login modal on the landing page via
?login=true search param.


8. DATABASE
-----------
  File: lib/db/index.ts
  Client: @neondatabase/serverless raw SQL via neon()
  Usage: import { sql } from '@/lib/db';
         const rows = await sql`SELECT * FROM users WHERE id = ${id}`;

There is no ORM. Add Drizzle if your project needs it. The boilerplate
intentionally uses raw SQL so you can choose your own schema approach.

Protected API example: app/api/dashboard/route.ts checks auth() session
before querying. Follow this pattern for all authenticated endpoints.


9. REUSABLE COMPONENTS -- USE THESE, DO NOT REBUILD
----------------------------------------------------

FEEDBACK:
  <Loader />                CSS spinner, takes className
  <PageLoader />            Full-screen Lottie + rotating taglines
  <NavigationLoader>        Wraps children, shows PageLoader on route change
                            (already in root layout -- do not add again)
  <ServiceWorkerRegistrar/> Registers SW in prod, cleans caches in dev
                            (already in root layout -- do not add again)

UI:
  <Tooltip title? content align? className?>
    Optional title with separator. Portalled, animated, hydration-safe.
    align: 'center' | 'left' | 'right'

  <CloseButton onClick size? className? />
    Lucide X icon, rotates+red on hover, suppressHydrationWarning built in.

  <ColorPicker id? value onChange />
    Hex input + swatch + HexColorPicker popover + EyeDropper API.

  <DateInput id? value onChange variant? min? max? />
    Calendar popover via react-day-picker. variant: 'underline' | 'pill'

  <StatusBadge status />
    Color-coded pill. Knows: active, trialing, lifetime, canceled,
    past_due, paused, unpaid. Falls back to gray for unknown values.

  <ShareModal isOpen onClose />
    8-platform share modal (X, Bluesky, Threads, LinkedIn, Facebook,
    Reddit, WhatsApp, Telegram). Uses TAGLINES for share text.

LAYOUT:
  <LegalPageFooter />       Footer with Home + Privacy + Terms + Contact
  <LegalBackButton />       Styled "Back" pill linking to /
  <LegalLastUpdated />      "Last Updated: <date>" with top border
  <LegalNavLinks showHome?/>  Just the nav links (composable)
  <SupportEmailLink />      mailto: link reading NEXT_PUBLIC_SUPPORT_EMAIL

BACKGROUND ANIMATIONS:
  <BgBokeh />, <BgBubbles />, <BgGradient />, <BgParticles />,
  <BgShootingStars />, <BgClickShootingStars />, <BgZoomout images? />
  <BgAnimRotator images? />   Cycles through 3 animations per session

  Import from '@/app/_components/bg-anims' (barrel export).
  Each has its own CSS file imported internally.

LOTTIE:
  import { LottiePlayer } from '@/app/_components/ContactUs/LottiePlayer';
  <LottiePlayer animationData={json} width? height? loop? />
  Lazy-loads lottie-react via next/dynamic. SSR-safe.

  Available animation JSONs in app/_animations/:
    loader-cat.json, error-space.json, error-something-wrong.json, search.json
  ContactUs animations in app/_components/ContactUs/animations/:
    contact.json, email-sent.json


10. CONTACT FORM SYSTEM
-----------------------
Two parts: a client component and a server route handler factory.

CLIENT (app/_components/ContactUs/ContactForm.tsx):
  import { ContactForm } from '@/app/_components/ContactUs';
  <ContactForm
    appName={SITE_NAME}
    appTagline={SITE_DESCRIPTION}
    apiEndpoint="/api/contact"   // default
    accentColor="#68b0f5"        // default
    minMessageLength={20}        // default
    redirectTo="/"               // after sent animation
    title="Get in touch"         // default
    subtitle="We typically reply within 24 hours."
  />

Built-in: honeypot spam trap, timing-based bot detection, email regex
validation, Lottie success animation, branded header/footer.

SERVER (app/_components/ContactUs/route-handler.ts):
  // app/api/contact/route.ts
  import { createContactHandler } from '@/app/_components/ContactUs/route-handler';
  export const POST = createContactHandler();

  // Or with custom email provider:
  export const POST = createContactHandler({
    sendEmail: async ({ from, to, replyTo, subject, text }) => {
      await yourService.send({ to: 'you@co.com', replyTo, subject, text });
    },
    rateLimit: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
  });

Default: 3 requests per 15 min per IP. Falls back to console.log if
no BOTTLED_EMAIL_API_KEY is configured (safe for dev).

IMPORTANT: Do NOT re-export route-handler.ts from the barrel index.ts.
It uses next/headers (server-only) and will break client bundles.


11. DASHBOARD CSS MODULE
------------------------
  File: app/dashboard/dashboard.module.css

All dashboard styling uses CSS module classes that reference the design
tokens from globals.css. Available classes:

  Layout:    .panel, .card, .cardEdit
  Sidebar:   .sidebarItem, .sidebarItemActive, .sidebarItemNoBorder
  Type:      .label, .mono
  Forms:     .input, .textarea, .select
  Tabs:      .tabBarWrap, .tabBar, .tabBtn, .tabBtnActive
  Stats:     .statCard, .statValue, .statLabel
  Toggles:   .periodToggle, .periodBtn, .periodBtnActive
  Modals:    .modalBackdrop/Out, .modalBox/Out
  Animations: .numFlip, .donutArc, .appCard, .contentPanel,
              .appPanelSlide, .customDateRow, .mobileTabDropdown,
              .mobileDrawer
  Icons:     .iconSpin/.iconSpinTrigger, .iconPop/.iconPopTrigger
  Menu:      .menuDropdown, .menuItem

Usage: import styles from './dashboard.module.css'; then styles.panel etc.


12. HYDRATION RULES (CRITICAL)
------------------------------
This project enforces dark mode and uses client-side libs that conflict
with SSR. Follow these rules or you WILL get hydration mismatches:

  1. useEffect() for anything that reads window, document, localStorage,
     sessionStorage, or navigator.

  2. dynamic(() => import('lottie-react'), { ssr: false }) for Lottie.
     Or use the <LottiePlayer /> wrapper which does this for you.

  3. suppressHydrationWarning on Lucide icons that Dark Reader or
     browser extensions mutate (CloseButton and DateInput already do this).

  4. Wrap useSearchParams() in a <Suspense> boundary. The landing page
     (app/page.tsx) demonstrates the correct pattern:
       export default function Page() {
         return <Suspense><PageContent /></Suspense>;
       }

  5. For components that render differently on client vs server, use a
     mounted state guard:
       const [mounted, setMounted] = useState(false);
       useEffect(() => setMounted(true), []);
       if (!mounted) return null;


13. ADDING NEW FEATURES -- CHECKLIST
-------------------------------------
Before writing any new component or utility, check this list:

  [ ] Does a component in app/_components/ already do this?
  [ ] Does a CSS class in dashboard.module.css or globals.css cover it?
  [ ] Does a design token in :root handle this color/radius/border?
  [ ] Is the site name, URL, or email hardcoded? Use lib/config/site.ts.
  [ ] Is a Lottie animation used? Use <LottiePlayer />, not raw import.
  [ ] Is there a close button? Use <CloseButton />, not a custom one.
  [ ] Is there a tooltip? Use <Tooltip />, not a custom one.
  [ ] Is there a date picker? Use <DateInput />, not a custom one.
  [ ] Is there a color picker? Use <ColorPicker />, not a custom one.
  [ ] Is there a contact form? Use <ContactForm />, not a custom one.
  [ ] Is there a share modal? Use <ShareModal />, not a custom one.
  [ ] Need an animated background? Use one from bg-anims/, not a new one.
  [ ] Legal page footer? Use <LegalPageFooter />, not a custom one.
  [ ] Status indicator? Use <StatusBadge />, not a custom one.

When adding a new route that needs auth protection:
  1. Add it to middleware.ts matcher array
  2. Use auth() in server components or API routes
  3. Wrap in SessionProvider if client components need useSession()


14. ADDING A NEW PROTECTED SECTION
-----------------------------------
Example: adding /admin/* routes.

  1. middleware.ts -- add to matcher:
       matcher: ['/dashboard/:path*', '/admin/:path*']

  2. app/admin/layout.tsx:
       import { SessionProvider } from 'next-auth/react';
       export default function AdminLayout({ children }) {
         return <SessionProvider>{children}</SessionProvider>;
       }

  3. app/admin/page.tsx -- build your UI using existing components.


15. CAVEATS AND COMMON MISTAKES
--------------------------------
  - NEVER use em dash (U+2014) anywhere in the codebase. Use -- or
    rephrase. This is a project convention.

  - NEVER use npm or yarn. This project uses Bun exclusively.

  - NEVER add Prettier. Biome handles formatting. Single quotes,
    trailing commas (es5), always semicolons, 100-char line width.

  - NEVER import from 'next/headers' in files that are reachable from
    client component trees. The ContactUs barrel index.ts only exports
    the client component for this reason.

  - DO NOT create README.md files unless explicitly asked.

  - DO NOT add error handling for impossible states. Trust internal
    code. Only validate at system boundaries (user input, external APIs).

  - DO NOT add docstrings, comments, or type annotations to code you
    didn't change.

  - DO NOT create helper abstractions for one-time operations. Three
    similar lines is better than a premature abstraction.

  - The project uses @/ path alias for ALL imports. Never use relative
    paths that go above the current directory (no ../../lib/...).
    Exception: relative imports within the same component folder are OK
    (e.g., './LottiePlayer' inside ContactUs/).


16. CLAUDE AGENT PROMPTS
-------------------------
When instructing another Claude agent to work on a project built from
this boilerplate, include these in your prompt:

--- START PROMPT FRAGMENT ---
This project is built on SparkStack, a dark-theme SaaS boilerplate.
Before writing ANY component, read readme.txt in the project root.

Key rules:
- All site identity (name, URL, description, email) comes from
  lib/config/site.ts. Never hardcode these values.
- Design tokens are CSS variables in globals.css :root. Use
  var(--color-brand), var(--color-border), var(--radius-lg) etc.
  instead of hardcoded colors or magic numbers.
- Reusable UI components exist in app/_components/ui/ (Tooltip,
  CloseButton, ColorPicker, DateInput, StatusBadge). Use them.
- Contact form with spam protection exists at app/_components/ContactUs/.
- Background animations exist at app/_components/bg-anims/.
- Dashboard CSS module at app/dashboard/dashboard.module.css has
  classes for panels, cards, inputs, tabs, modals, and animations.
- Hydration: use useEffect() for browser APIs, dynamic() for Lottie,
  Suspense for useSearchParams(), suppressHydrationWarning for icons.
- Runtime is Bun. Linter is Biome. No Prettier, no npm, no yarn.
- Never use em dash (U+2014). Never create README.md unless asked.
--- END PROMPT FRAGMENT ---


17. FILE-BY-FILE QUICK REFERENCE
---------------------------------
Config:
  package.json              Name, description, version, scripts, deps
  lib/config/site.ts        SITE_URL, SITE_NAME, SITE_DESCRIPTION, THEME_COLOR, SUPPORT_EMAIL
  lib/config/taglines.ts    TAGLINES[]
  .env.example              All env vars documented
  next.config.ts            Strict TS, no dev indicators, app version
  biome.json                Single quotes, 100 chars, trailing commas
  middleware.ts              Auth guard for /dashboard/*
  vercel.json               Bun, lhr1 region

Auth + DB:
  lib/auth/index.ts         Google OAuth, ALLOWED_EMAILS whitelist
  lib/db/index.ts           Neon raw SQL (no ORM)

Root app files:
  app/layout.tsx             Metadata, viewport, SW, NavigationLoader
  app/page.tsx               Landing page with login modal (Suspense-wrapped)
  app/manifest.ts            PWA manifest
  app/opengraph-image.tsx    Dynamic OG card
  app/robots.ts              SEO + AI crawlers
  app/sitemap.ts             Static sitemap
  app/globals.css            Design tokens + animations + cursor UX
  app/global-error.tsx       500 error (inline styles, no CSS deps)
  app/not-found.tsx          404 (Lottie, responsive)
  app/error/page.tsx         Generic error page (search params driven)
