import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Vitest, not jest and not `bun test`.
 *
 * `bun test` is faster and needed no config, which is why it was here — but it
 * pins the test suite to a bun runtime, and these tests are the only thing in
 * the repo that could not then run anywhere else. jest is the other direction:
 * it needs `next/jest` plus a `transformIgnorePatterns` carve-out purely
 * because next-auth ships ESM, which is a workaround for the runner rather than
 * anything to do with this app.
 *
 * The `@/` and `@lib/` aliases mirror tsconfig's `paths`, since Vite does not
 * read it.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    server: {
      deps: {
        // next-auth v5 and @auth/core ship ESM that resolves `next/server` in
        // a way Vite's SSR module runner can't follow; inline them instead.
        inline: ['next-auth', '@auth/core'],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, '.'),
      '@lib': resolve(import.meta.dirname, 'lib'),
    },
  },
});
