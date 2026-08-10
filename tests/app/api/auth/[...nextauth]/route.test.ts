/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';

describe('module', () => {
  it('should work', async () => {
    await expect(import('../../../../../app/api/auth/[...nextauth]/route')).resolves.toBeDefined();
  });
});
