import { describe, expect, it } from 'vitest';
import { appHomepage, externalHomepage, getApp, sparkApps } from '../../../lib/data/apps';

describe('app catalogue', () => {
  it('has a unique id per app', () => {
    const ids = sparkApps.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every app a homepage, with or without a domain of its own', () => {
    for (const app of sparkApps) {
      const home = appHomepage(app);
      expect(home === externalHomepage(app)?.url || home === `/apps/${app.id}`).toBe(true);
      expect(home).not.toBe('');
    }
  });

  it('ignores relative privacy links when looking for the app’s own site', () => {
    const screenful = getApp('screenful');
    if (!screenful) throw new Error('screenful missing from the catalogue');
    expect(screenful.links.some((l) => l.url.startsWith('/'))).toBe(true);
    expect(externalHomepage(screenful)).toBeUndefined();
    expect(appHomepage(screenful)).toBe('/apps/screenful');
  });

  it('keeps bare deployment URLs off the homepage slot', () => {
    for (const app of sparkApps) {
      expect(externalHomepage(app)?.url ?? '').not.toMatch(/\.vercel\.app/);
    }
  });

  it('resolves every id back to its app', () => {
    for (const app of sparkApps) {
      expect(getApp(app.id)?.name).toBe(app.name);
    }
    expect(getApp('nope')).toBeUndefined();
  });
});
