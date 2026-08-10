/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';

describe('GET', () => {
  it('should work', async () => {
    await expect(import('../../../../app/api/dashboard/route')).resolves.toBeDefined();
  });
});
