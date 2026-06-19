import { type NeonQueryFunction, neon } from '@neondatabase/serverless';

/** Raw SQL query function for the connected Neon database.
 *  Deferred: throws at call time (not import time) when DATABASE_URL is absent,
 *  so static pages can build without a database connection. */
export const sql: NeonQueryFunction<false, false> = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : (new Proxy((() => {}) as unknown as NeonQueryFunction<false, false>, {
      apply() {
        throw new Error('DATABASE_URL environment variable is not set');
      },
    }) as NeonQueryFunction<false, false>);
