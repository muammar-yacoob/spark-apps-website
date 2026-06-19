'use client';

import { StatusBadge } from '@/app/_components/ui/StatusBadge';
import { Tooltip } from '@/app/_components/ui/Tooltip';
import { BarChart3, ChevronDown, Columns3, Database, HardDrive, Rows3, Table2 } from 'lucide-react';
import { useState } from 'react';
import styles from '../dashboard.module.css';
import { DonutChart, MiniBarChart } from './Charts';
import type { ColumnInfo, DbStats, TableInfo } from './types';
import { CHART_COLORS } from './types';

// ── Expandable table row ─────────────────────────────────────────────────────

function TableRow({
  table,
  color,
  columns,
  isLast,
}: {
  table: TableInfo;
  color: string;
  columns: ColumnInfo[];
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const tableCols = columns.filter((c) => c.table_name === table.name);

  return (
    <div className={!isLast ? 'border-b border-white/[0.04]' : ''}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-sm text-gray-200 font-mono">{table.name}</span>
          <span className="text-[10px] text-gray-600">{table.columns} cols</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 font-mono">
            {table.rows.toLocaleString()} rows
          </span>
          <ChevronDown
            suppressHydrationWarning
            className={`w-3.5 h-3.5 text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {expanded && (
        <div className={`px-5 pb-3 ${styles.customDateRow}`}>
          <div className="bg-black/20 rounded-lg border border-white/[0.04] overflow-hidden">
            <div className="grid grid-cols-3 gap-px text-[10px] text-gray-500 uppercase tracking-wider px-3 py-1.5 border-b border-white/[0.04]">
              <span>Column</span>
              <span>Type</span>
              <span>Nullable</span>
            </div>
            {tableCols.map((col) => (
              <div
                key={col.column_name}
                className="grid grid-cols-3 gap-px px-3 py-1.5 text-xs border-b border-white/[0.02] last:border-0"
              >
                <span className="text-gray-300 font-mono">{col.column_name}</span>
                <span className="text-gray-500 font-mono">{col.data_type}</span>
                <span className="text-gray-600">{col.is_nullable === 'YES' ? 'yes' : 'no'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Overview panel ───────────────────────────────────────────────────────────

export function OverviewPanel({
  session,
  loading,
  db,
}: {
  session: { user?: { name?: string | null; email?: string | null } } | null;
  loading: boolean;
  db: DbStats;
}) {
  const tables = db.tables ?? [];
  const columns = db.columns ?? [];
  const totalRows = tables.reduce((sum, t) => sum + t.rows, 0);
  const totalCols = tables.reduce((sum, t) => sum + t.columns, 0);

  return (
    <div className={styles.contentPanel}>
      {/* Welcome card */}
      <div className={`${styles.panel} ${styles.appCard} p-6 mb-6`}>
        <h2 className="text-lg font-semibold text-white mb-1">
          Welcome back, {session?.user?.name?.split(' ')[0] ?? 'there'}
        </h2>
        <p className="text-sm text-gray-400">
          Signed in as {session?.user?.email ?? 'unknown'}. Here is an overview of your connected
          database.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 py-8 text-center">Connecting to database...</div>
      ) : !db.connected ? (
        <div className={`${styles.panel} p-6 text-center`}>
          <StatusBadge status="canceled" />
          <p className="text-sm text-gray-400 mt-3">
            {db.error ?? 'Could not connect to database'}
          </p>
          <p className="text-xs text-gray-600 mt-1">Check your DATABASE_URL in .env.local</p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Database} color="text-emerald-400" label="Connected" delay={0}>
              <StatusBadge status="active" />
            </StatCard>
            <StatCard icon={Table2} color="text-blue-400" label="Tables" delay={80}>
              <span key={tables.length} className={styles.numFlip}>
                {tables.length}
              </span>
            </StatCard>
            <StatCard icon={Columns3} color="text-violet-400" label="Columns" delay={160}>
              <span key={totalCols} className={styles.numFlip}>
                {totalCols}
              </span>
            </StatCard>
            <StatCard icon={Rows3} color="text-amber-400" label="Rows" delay={240}>
              <span key={totalRows} className={styles.numFlip}>
                {totalRows.toLocaleString()}
              </span>
            </StatCard>
          </div>

          {/* DB info bar */}
          <div
            className={`${styles.panel} ${styles.appCard} px-5 py-3 mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500`}
            style={{ animationDelay: '280ms' }}
            suppressHydrationWarning
          >
            <HardDrive suppressHydrationWarning className="w-3.5 h-3.5 text-gray-600" />
            <span>
              Size: <span className="text-gray-300">{db.size ?? 'N/A'}</span>
            </span>
            <span className="text-gray-700">|</span>
            <span className="text-gray-500 truncate max-w-xs sm:max-w-md" title={db.version}>
              {db.version?.split(' ').slice(0, 2).join(' ') ?? 'PostgreSQL'}
            </span>
          </div>

          {/* Charts */}
          {tables.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div
                className={`${styles.panel} ${styles.appCard} p-5`}
                style={{ animationDelay: '320ms' }}
              >
                <div className="flex items-center gap-2 mb-4" suppressHydrationWarning>
                  <BarChart3 suppressHydrationWarning className="w-3.5 h-3.5 text-gray-500" />
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Rows per table
                  </h3>
                </div>
                <MiniBarChart
                  data={tables.map((t, i) => ({
                    label: t.name,
                    value: t.rows,
                    color: CHART_COLORS[i % CHART_COLORS.length],
                  }))}
                />
              </div>

              <div
                className={`${styles.panel} ${styles.appCard} p-5`}
                style={{ animationDelay: '400ms' }}
              >
                <div className="flex items-center gap-2 mb-4" suppressHydrationWarning>
                  <Database suppressHydrationWarning className="w-3.5 h-3.5 text-gray-500" />
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Distribution
                  </h3>
                </div>
                <div className="flex items-center justify-around flex-wrap gap-4">
                  {tables.slice(0, 6).map((t, i) => (
                    <Tooltip
                      key={t.name}
                      title={t.name}
                      content={
                        <p className="text-[11px] text-gray-400">
                          <span className="text-white font-semibold">{t.rows}</span> of {totalRows}{' '}
                          rows
                        </p>
                      }
                    >
                      <DonutChart
                        value={t.rows}
                        max={Math.max(totalRows, 1)}
                        label={t.name}
                        color={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Table detail list */}
          <div
            className={`${styles.panel} ${styles.appCard} overflow-hidden`}
            style={{ animationDelay: '480ms' }}
          >
            <div
              className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2"
              suppressHydrationWarning
            >
              <Table2 suppressHydrationWarning className="w-3.5 h-3.5 text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Schema tables
              </h3>
              <span className="text-[10px] text-gray-600 ml-auto">Click to expand columns</span>
            </div>
            {tables.map((t, i) => (
              <TableRow
                key={t.name}
                table={t}
                color={CHART_COLORS[i % CHART_COLORS.length]}
                columns={columns}
                isLast={i === tables.length - 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Stat card (DRY helper) ───────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  color,
  label,
  delay,
  children,
}: {
  icon: React.ComponentType<{ suppressHydrationWarning?: boolean; className?: string }>;
  color: string;
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Tooltip title={label} content={<p className="text-[11px] text-gray-400">{label}</p>}>
      <div
        className={`${styles.statCard} ${styles.appCard} w-full ${styles.iconPopTrigger}`}
        style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
        suppressHydrationWarning
      >
        <Icon suppressHydrationWarning className={`w-4 h-4 ${color} mb-1 ${styles.iconPop}`} />
        <span className={styles.statValue}>{children}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </Tooltip>
  );
}
