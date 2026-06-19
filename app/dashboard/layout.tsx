import type { Metadata } from 'next';
import { DashboardProviders } from './DashboardProviders';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardProviders>{children}</DashboardProviders>;
}
