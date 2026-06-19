export interface TableInfo {
  name: string;
  columns: number;
  rows: number;
}

export interface ColumnInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
}

export interface DbStats {
  connected: boolean;
  version?: string;
  size?: string;
  tables?: TableInfo[];
  columns?: ColumnInfo[];
  error?: string;
}

export type View = 'home' | 'settings';

export const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
