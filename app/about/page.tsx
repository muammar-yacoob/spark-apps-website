import { SITE_NAME } from '@/lib/config/site';
import type { Metadata } from 'next';
import { AboutPageClient } from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About',
  description: `Crafting seasonal gaming wonders and developer solutions. Discover the story behind ${SITE_NAME} and explore our interactive 3D portfolio.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
