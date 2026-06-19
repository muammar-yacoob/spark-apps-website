import { SITE_NAME } from '@/lib/config/site';
import type { Metadata } from 'next';
import { ContactPageClient } from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${SITE_NAME}. We would love to hear from you.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
