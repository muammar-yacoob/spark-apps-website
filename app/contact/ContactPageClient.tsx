'use client';

import { ContactForm } from '@/app/_components/ContactUs';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/config/site';
import { TOAST_CONFIG } from '@/lib/config/toast';
import { Toaster } from 'sonner';

export function ContactPageClient() {
  return (
    <>
      <Toaster {...TOAST_CONFIG} />
      <ContactForm appName={SITE_NAME} appTagline={SITE_DESCRIPTION} />
    </>
  );
}
