import { appHomepage, sparkApps } from '@/lib/data/apps';
import { seoConfig } from '@/lib/seo/config';

export function GET() {
  const { name, url, description, supportEmail, pricing, competitors, links } = seoConfig;

  const docsLine = links.docs ? `- Docs: ${links.docs}` : '';
  const repoLine = links.repository ? `- Repository: ${links.repository}` : '';

  /* Absolute, always. This file is read by a model with no page context, so a
     relative link (the on-site privacy policy an app falls back to) would be
     unresolvable. An app with no link at all gets none. */
  const appLines = sparkApps
    .map((app) => {
      const home = appHomepage(app);
      const link = home && !home.startsWith('http') ? `${url}${home}` : home;
      return `- **${app.name}** (${app.tagline}), ${app.description}${link ? ` ${link}` : ''}`;
    })
    .join('\n');

  const body = `# ${name}

> ${description}

${name} is a studio that builds and maintains a suite of ${sparkApps.length} productivity and developer tools, web apps, Chrome extensions, npm CLIs and MCP servers. This site is the catalogue; each app links straight out to its own domain, store listing or package.

- Website: ${url}
${docsLine}
${repoLine}
- Support: ${supportEmail}
- Full AI reference: ${url}/llms-full.txt

## Apps

${appLines}

## Pricing

${pricing.map((t) => `- ${t.name}: ${t.description}`).join('\n')}

## Compared To

${competitors.map((c) => `### vs ${c.name}\n\n${c.statement}`).join('\n\n')}

## Contact

${supportEmail}
`.replace(/\n{3,}/g, '\n\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
