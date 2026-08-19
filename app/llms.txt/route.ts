import { sparkApps } from '@/lib/data/apps';
import { seoConfig } from '@/lib/seo/config';

/**
 * The app's own homepage if it has one, else wherever it can be installed.
 * Relative links (an on-site privacy page) are never a useful primary link,
 * so an app without an external home just gets its detail page below.
 */
function primaryLink(app: (typeof sparkApps)[number]): string {
  const external = app.links.filter((l) => l.url.startsWith('http'));
  const preferred =
    external.find((l) => l.type === 'website') ??
    external.find((l) => l.type === 'app') ??
    external.find((l) => l.type === 'chrome') ??
    external.find((l) => l.type === 'npm') ??
    external.find((l) => l.type === 'github');
  return preferred?.url ?? '';
}

export function GET() {
  const { name, url, description, supportEmail, pricing, competitors, links } = seoConfig;

  const docsLine = links.docs ? `- Docs: ${links.docs}` : '';
  const repoLine = links.repository ? `- Repository: ${links.repository}` : '';

  const appLines = sparkApps
    .map((app) => {
      const link = primaryLink(app);
      const detail = `${url}/apps/${app.id}`;
      return `- **${app.name}** (${app.tagline}) — ${app.description} ${link ? `${link} · ` : ''}${detail}`;
    })
    .join('\n');

  const body = `# ${name}

> ${description}

${name} is a studio that builds and maintains a suite of ${sparkApps.length} productivity and developer tools — web apps, Chrome extensions, npm CLIs and MCP servers. This site is the catalogue; each app has its own page here and, where it has one, its own domain.

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
