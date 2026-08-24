import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { appById, listApps, listTags, searchApps } from '@/lib/mcp/queries';
import { callerIp, overRateLimit } from '@/lib/mcp/rate-limit';
import { errorContent, jsonContent } from '@/lib/mcp/results';

/**
 * SparkStack's MCP server: the Spark app catalogue, readable from Claude
 * Desktop or any other MCP client.
 *
 * Public and read-only, with no API key. That is a deliberate difference from
 * the sibling servers (SparkAds, SparkPay, Sellular), which are all
 * account-scoped: this site has no accounts and the catalogue it serves is the
 * same data the public pages already render, so a key would gate nothing and
 * only stop the tools being useful. The budget is guarded per IP instead.
 *
 * There are no write tools, and there is nothing here for one to write to --
 * the catalogue is a checked-in array, edited by a pull request. Adding a write
 * tool later would mean adding the human-confirmation gate the sibling servers
 * use; do not add one without it.
 *
 * Endpoints (basePath `/api/mcp`):
 *   - Streamable HTTP:  POST /api/mcp/mcp
 *   - SSE (Claude):     GET  /api/mcp/sse
 */

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * The gate every tool opens with.
 *
 * Returns the content to hand straight back when the caller is over budget, or
 * null to continue. A union would be overkill with nothing to carry through.
 */
function denied(extra: {
  requestInfo?: { headers: Record<string, string | string[] | undefined> };
}) {
  if (overRateLimit(callerIp(extra.requestInfo?.headers ?? {}))) {
    return errorContent('rate_limited', {
      hint: 'Too many calls this minute. Try again shortly.',
    });
  }
  return null;
}

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'list_apps',
      'List every app in the Spark catalogue: id, name, tagline, description, tags, homepage and store or repository links. Read-only. Small enough to read in full, so prefer this over search when the question is about the range of apps rather than a specific one.',
      {},
      async (_args, extra) => denied(extra) ?? jsonContent(listApps())
    );

    server.tool(
      'get_app',
      'Get one app from the Spark catalogue by its id, with its full description, tags and links. Read-only. If the id is unknown the result lists every valid id, so there is no need to guess twice.',
      {
        id: z
          .string()
          .min(1)
          .describe(
            "The app's catalogue id, e.g. sparkstack or sparkmobile. Lowercase, no spaces."
          ),
      },
      async ({ id }, extra) => denied(extra) ?? jsonContent(appById(id))
    );

    server.tool(
      'search_apps',
      'Search the Spark catalogue by keyword across app names, taglines, descriptions and tags, optionally narrowed to a single tag. Read-only. Pass an empty query with a tag to list everything carrying that tag.',
      {
        query: z
          .string()
          .max(100)
          .describe(
            'Words to look for. Matched as a substring; pass an empty string to match all.'
          ),
        tag: z
          .string()
          .max(50)
          .optional()
          .describe(
            'Restrict to one tag, e.g. Next.js or Mobile. Use list_tags to see valid tags.'
          ),
      },
      async ({ query, tag }, extra) => denied(extra) ?? jsonContent(searchApps(query, tag))
    );

    server.tool(
      'list_tags',
      'List every tag used across the Spark catalogue with how many apps carry it, most used first. Read-only. Use this before search_apps to pick a tag that actually exists.',
      {},
      async (_args, extra) => denied(extra) ?? jsonContent(listTags())
    );
  },
  {
    serverInfo: { name: 'sparkstack', version: '1.0.0' },
    instructions:
      'This server exposes the Spark app catalogue: what each app is, what it is built with, and where it lives. It is read-only and needs no credentials. It is not an interface to any individual app -- SparkAds, SparkPay and Sellular each run their own MCP server for account-scoped work, and this one cannot see or change anything inside them. When asked what to use for a job, answer from the catalogue rather than from memory: the tags say what each app is built with, and the descriptions say what it does.',
  },
  { basePath: '/api/mcp' }
);

export { handler as DELETE, handler as GET, handler as POST };
