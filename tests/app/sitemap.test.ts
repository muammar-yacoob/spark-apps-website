import { describe, expect, it } from 'vitest';

describe('module', () => {
  it('should work', async () => {
    await expect(import('../../app/sitemap')).resolves.toBeDefined();
  });
});
