import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Database version
    const [{ version }] = await sql`SELECT version()`;

    // Tables with column counts (via JOIN) and fast row estimates (pg_stat_user_tables).
    // Avoids the expensive query_to_xml / dynamic SQL pattern.
    const tables = await sql`
      SELECT
        t.table_name AS name,
        COUNT(DISTINCT c.column_name)::int AS columns,
        COALESCE(s.n_live_tup, 0)::int AS rows
      FROM information_schema.tables t
      LEFT JOIN information_schema.columns c
        ON c.table_schema = t.table_schema AND c.table_name = t.table_name
      LEFT JOIN pg_stat_user_tables s
        ON s.schemaname = t.table_schema AND s.relname = t.table_name
      WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_name, t.table_schema, s.n_live_tup
      ORDER BY t.table_name
    `;

    // Per-table column details
    const columns = await sql`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;

    // Database size
    const [{ size }] =
      await sql`SELECT pg_size_pretty(pg_database_size(current_database())) AS size`;

    return NextResponse.json({
      connected: true,
      version,
      size,
      tables,
      columns,
    });
  } catch (e) {
    return NextResponse.json(
      { connected: false, error: e instanceof Error ? e.message : 'Connection failed' },
      { status: 500 }
    );
  }
}
