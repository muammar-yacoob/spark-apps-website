import { SITE_NAME } from '@/lib/config/site';
import type { Metadata } from 'next';
import { TeamPageClient } from './TeamPageClient';

export const metadata: Metadata = {
  title: 'Team',
  description: `Meet the talented team behind ${SITE_NAME}. Passionate developers creating amazing experiences.`,
  alternates: { canonical: '/team' },
};

export default function TeamPage() {
  return <TeamPageClient />;
}
