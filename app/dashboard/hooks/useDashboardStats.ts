'use client';

import type { DbStats } from '@/app/dashboard/_components/types';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../_lib/query-keys';

export function useDashboardStats({ enabled }: { enabled: boolean }) {
  return useQuery<DbStats>({
    queryKey: queryKeys.dashboard,
    queryFn: () => fetch('/api/dashboard').then((r) => r.json()),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: { connected: false },
  });
}
