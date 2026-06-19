import { SITE_NAME } from '@/lib/config/site';
import type { Metadata } from 'next';
import { CareersPageClient } from './CareersPageClient';

export const metadata: Metadata = {
  title: 'Careers',
  description: `Join the ${SITE_NAME} team! We're looking for talented developers and artists.`,
  alternates: { canonical: '/careers' },
};

export default function CareersPage() {
  return <CareersPageClient />;
}
