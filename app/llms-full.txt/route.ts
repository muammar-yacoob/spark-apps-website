import { seoConfig } from '@/lib/seo/config';

export function GET() {
  const { name, url, description, supportEmail, features, pricing, competitors, stack, links } =
    seoConfig;

  const body = `# ${name} - Complete Reference

> ${description}

Website: ${url}
${links.docs ? `Docs: ${links.docs}` : ''}
${links.repository ? `Repository: ${links.repository}` : ''}
Support: ${supportEmail}

---

## What ${name} Does

${name} is an open-source, production-ready SaaS starter kit built on Next.js 15 (App Router) with Bun. It provides authentication, database, a protected dashboard, and deployment configuration so you can go from zero to a working SaaS app in minutes.

The stack includes Google OAuth via NextAuth v5 with an email whitelist for access control, Neon PostgreSQL with Drizzle ORM for the database, and Vercel for deployment. Every page supports dark mode, and the project includes dynamic OG image generation, legal pages, a contact form, and PWA support.

${name} is designed to be forked. All configuration is centralized in a handful of files, making it straightforward to rebrand and extend for any SaaS product.

---

## Feature Details

${features.map((f, i) => `### ${i + 1}. ${f}`).join('\n\n')}

---

## Tech Stack

${stack.map((t) => `- ${t}`).join('\n')}

---

## Quick Start

### Clone and Install

\`\`\`bash
git clone ${links.repository || `${url}.git`}
cd ${name}
cp .env.example .env.local
bun install
\`\`\`

### Configure Environment

Required environment variables:
- \`NEXT_PUBLIC_APP_URL\` - Your production URL
- \`GOOGLE_CLIENT_ID\` / \`GOOGLE_CLIENT_SECRET\` - Google OAuth credentials
- \`DATABASE_URL\` - Neon PostgreSQL connection string
- \`NEXTAUTH_SECRET\` - Random secret for session encryption
- \`ALLOWED_EMAILS\` - Comma-separated email whitelist

### Push Database Schema

\`\`\`bash
bun db:push
\`\`\`

### Run Development Server

\`\`\`bash
bun dev
\`\`\`

---

## Project Structure

\`\`\`
app/
  _components/       Shared UI, layout, hooks, animations
  api/auth/          NextAuth route handler
  dashboard/         Protected dashboard (requires sign-in)
  contact/           Contact form page
  privacy/           Privacy policy
  terms/             Terms of service
lib/
  auth/              NextAuth v5 config
  db/                Drizzle ORM schema and connection
  config/            Site-wide configuration
  seo/               SEO configuration
  utils/             Crypto, currency, slug, format, rate-limiter
\`\`\`

---

## Pricing

${pricing
  .map((t) => `### ${t.name}${t.price !== '0' ? ` - $${t.price}/month` : ''}\n- ${t.description}`)
  .join('\n\n')}

---

## Compared To

${competitors.map((c) => `### vs ${c.name}\n\n${c.statement}`).join('\n\n')}

---

## Supported Platforms

- Hosting: Vercel (recommended), any Node.js/Bun host
- Database: Neon PostgreSQL (recommended), any PostgreSQL provider
- Auth: Google OAuth (extensible to other providers)
- Runtime: Bun (recommended), Node.js 20+
- Package manager: Bun
- OS: Linux, macOS, Windows (WSL)

---

## Security

- Authentication via NextAuth v5 with CSRF protection
- Email whitelist restricts dashboard access
- Rate-limited contact form
- Session tokens stored as HTTP-only cookies
- All database queries via parameterized Drizzle ORM
- No tracking or advertising cookies

---

## Contact

- Support: ${supportEmail}
- Website: ${url}
${links.repository ? `- Repository: ${links.repository}` : ''}
`.replace(/\n{3,}/g, '\n\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
