import { seoConfig } from '@/lib/seo/config';

export function GET() {
  const { name, url, description, supportEmail, features, pricing, competitors, links } = seoConfig;

  const docsLine = links.docs ? `- Docs: ${links.docs}` : '';
  const repoLine = links.repository ? `- Repository: ${links.repository}` : '';

  const body = `# ${name}

> ${description}

${name} is a full-stack SaaS starter kit that gives you auth, database, dashboard, and deployment out of the box. Clone it, configure your env vars, and ship.

- Website: ${url}
${docsLine}
${repoLine}
- Support: ${supportEmail}
- Full AI reference: ${url}/llms-full.txt

## Core Features

${features.map((f) => `- ${f}`).join('\n')}

## Quick Start

\`\`\`bash
git clone ${links.repository || `${url}.git`}
cd ${name}
cp .env.example .env.local
bun install
bun db:push
bun dev
\`\`\`

## Pricing

${pricing.map((t) => `- ${t.name}${t.price !== '0' ? ` ($${t.price}/mo)` : ''}: ${t.description}`).join('\n')}

## Compared To

${competitors.map((c) => c.statement).join('\n\n')}

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
