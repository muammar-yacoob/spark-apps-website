import { describe, expect, it } from 'vitest';
import {
  appHomepage,
  externalHomepage,
  getApp,
  hasPublicDestination,
  isChromeExtension,
  isOpenSource,
  sparkApps,
} from '../../../lib/data/apps';

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

  it('counts any publishable link as a destination', () => {
    // A bare *.vercel.app or no links at all is not one; those cards are
    // hidden from the landing grid.
    const expected: Record<string, boolean> = {
      vidlet: true, // own domain
      textpert: true, // store listing only
      quickpeek: true, // npm only
      'clipboard-image-terminal': true, // npm + public repo
      minutely: true, // a privacy page on this site
      'chat-faker': false, // bare *.vercel.app
      flexcel: false, // bare *.vercel.app
      klean: false, // no links at all
    };
    for (const [id, destination] of Object.entries(expected)) {
      const app = getApp(id);
      if (!app) throw new Error(`${id} missing from the catalogue`);
      expect(hasPublicDestination(app)).toBe(destination);
    }
  });

  it('calls an app open source only when its repo is public', () => {
    // npm is a distribution channel, not a licence: QuickPeek publishes a
    // tarball from a private repo, so it is not open source.
    const expected: Record<string, boolean> = {
      quickpeek: false, // npm only, repo is private
      vidlet: false, // own domain + npm, repo is private
      'clipboard-image-terminal': true, // public repo
      'gmail-manager-mcp': true, // public repo
    };
    for (const [id, open] of Object.entries(expected)) {
      const app = getApp(id);
      if (!app) throw new Error(`${id} missing from the catalogue`);
      expect(isOpenSource(app)).toBe(open);
    }
  });

  it('groups an extension by its tag, with or without a store link', () => {
    const extensions = sparkApps.filter(isChromeExtension).map((a) => a.id);
    // Minutely ships before its store URL does; the tag is what groups it.
    expect(extensions).toContain('minutely');
    expect(extensions).toContain('screenful');
    expect(extensions).not.toContain('still-applying'); // bundles one, is not one
    for (const id of extensions) {
      expect(getApp(id)?.tags).toContain('Chrome Extension');
    }
  });

  it('resolves every id back to its app', () => {
    for (const app of sparkApps) {
      expect(getApp(app.id)?.name).toBe(app.name);
    }
    expect(getApp('nope')).toBeUndefined();
  });
});
