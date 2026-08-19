import { sparkApps } from '@/lib/data/apps';
import { seoConfig } from '@/lib/seo/config';

export function GET() {
  const { name, url, description, supportEmail, pricing, competitors, stack, links } = seoConfig;

  const appSections = sparkApps
    .map((app) => {
      const linkLines = app.links
        .map((l) => `- ${l.label}: ${l.url.startsWith('http') ? l.url : `${url}${l.url}`}`)
        .join('\n');
      return `### ${app.name} — ${app.tagline}

${app.description}

- Category: ${app.tags.join(', ')}
- Page: ${url}/apps/${app.id}
${linkLines}`;
    })
    .join('\n\n');

  const body = `# ${name} - Complete Reference

> ${description}

Website: ${url}
${links.docs ? `Docs: ${links.docs}` : ''}
${links.repository ? `Repository: ${links.repository}` : ''}
Support: ${supportEmail}

---

## What ${name} Is

${name} is an independent software studio that builds and maintains a suite of ${sparkApps.length} productivity and developer tools. The range covers web apps, Chrome extensions, npm command-line tools and MCP servers for AI assistants.

This site is the catalogue for that suite, not a product in itself. Every app below has a detail page here; most also have their own domain, npm package or store listing, which is the canonical place to install or buy it.

The apps are built to compose. The payment backend (SparkPay), the embeddable AI chat (SparkAI), the email sending (Bottled) and the video pipeline (VidLet, ViralCat, QuickPeek) are used by the other apps in the suite, so they are tested against real production traffic rather than only against demos.

---

## The Apps

${appSections}

---

## How This Site Is Built

${stack.map((t) => `- ${t}`).join('\n')}

---

## Pricing

${pricing.map((t) => `### ${t.name}\n- ${t.description}`).join('\n\n')}

Pricing is set per app. Check the individual app's own site for current tiers.

---

## Compared To

${competitors.map((c) => `### vs ${c.name}\n\n${c.statement}`).join('\n\n')}

---

## Supported Platforms

- Web apps: any modern browser
- Chrome extensions: Chrome and Chromium-based browsers via the Chrome Web Store
- CLI tools and MCP servers: Node.js 20+ or Bun, on Linux, macOS and Windows (WSL)
- Mobile: apps marked as PWAs install to the home screen on iOS and Android

---

## Security and Privacy

- Authentication via NextAuth v5 with CSRF protection
- Session tokens stored as HTTP-only cookies
- All database queries via parameterized Drizzle ORM
- No tracking or advertising cookies on this site
- Individual apps publish their own privacy policies; see each app's page

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
