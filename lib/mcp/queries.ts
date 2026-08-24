/**
 * Read-only views of the Spark app catalogue, shaped for MCP callers.
 *
 * The catalogue is a static array (lib/data/apps.ts), so nothing here touches a
 * database and nothing needs caching. What these functions do add is
 * absolutisation: a tool result is read by a model that has no page context, so
 * a relative `/apps/<id>` homepage is useless to it and every URL goes out
 * fully qualified.
 */

import { SITE_URL } from '@/lib/config/site';
import { appHomepage, getApp, type SparkApp, sparkApps } from '@/lib/data/apps';

/** Make a possibly-relative catalogue URL absolute. */
function absolute(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${SITE_URL}${url}`;
}

/** The shape every tool returns for an app. `mobile` is presentation, so it is dropped. */
function shape(app: SparkApp) {
  return {
    id: app.id,
    name: app.name,
    tagline: app.tagline,
    description: app.description,
    tags: app.tags,
    homepage: absolute(appHomepage(app)),
    page: `${SITE_URL}/apps/${app.id}`,
    icon: absolute(app.icon),
    links: app.links.map((l) => ({ label: l.label, url: l.url, type: l.type })),
  };
}

export function listApps() {
  return {
    count: sparkApps.length,
    apps: sparkApps.map(shape),
  };
}

export function appById(id: string) {
  const app = getApp(id.trim());
  if (!app) {
    return {
      error: 'app_not_found',
      id,
      // Hand back the valid ids rather than only refusing: the usual cause is a
      // model guessing "spark-stack" for an id that is written "sparkstack",
      // and a bare refusal makes it guess again.
      known_ids: sparkApps.map((a) => a.id),
    };
  }
  return shape(app);
}

/** Every tag in the catalogue, most used first. */
export function listTags() {
  const counts = new Map<string, number>();
  for (const app of sparkApps) {
    for (const tag of app.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return {
    tags: [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count })),
  };
}

/**
 * Substring search over name, tagline, description and tags.
 *
 * Deliberately not a relevance ranking: 23 apps is small enough that a caller
 * can read every match, and a scored search would mostly hide the app somebody
 * was looking for behind one that repeated the query word.
 */
export function searchApps(query: string, tag?: string) {
  const q = query.trim().toLowerCase();
  const t = tag?.trim().toLowerCase();

  const matches = sparkApps.filter((app) => {
    if (t && !app.tags.some((x) => x.toLowerCase() === t)) return false;
    if (!q) return true;
    const haystack = [app.name, app.tagline, app.description, ...app.tags].join(' ').toLowerCase();
    return haystack.includes(q);
  });

  return {
    query: query.trim(),
    tag: tag?.trim(),
    count: matches.length,
    apps: matches.map(shape),
  };
}
