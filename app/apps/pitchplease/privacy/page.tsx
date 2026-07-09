import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SupportEmailLink } from '@/app/_components/layout/SupportEmailLink';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pitch Please — Privacy Policy',
  description:
    'Privacy policy for Pitch Please, the Chrome dark-mode extension. Collects no personal data, makes no network requests.',
  alternates: { canonical: '/apps/pitchplease/privacy' },
};

export default function PitchPleasePrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Pitch Please — Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Dark mode for every website, with attitude.</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">
                Pitch Please collects no personal data. None. Zero.
              </p>
              <p className="mt-2">
                It makes no network requests, runs entirely on your device, and has no servers,
                analytics, tracking, telemetry, or ads.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What We Access and Why</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>Web page content (host permission):</strong> Pitch Please runs a content
                  script on the pages you visit so it can apply its dark-mode styling. It reads the
                  domain of the current tab (to know which site you&rsquo;re on) and restyles the
                  page you&rsquo;re already looking at. It does <strong>not</strong> read, save, or
                  transmit your page content or browsing history.
                </li>
                <li>
                  <strong>
                    Storage (<code>storage</code> permission):
                  </strong>{' '}
                  your settings are saved locally so they last. Synced settings (master switch,
                  mood/palette, contrast, per-site choices, schedule) use{' '}
                  <code>chrome.storage.sync</code>, so they follow you across the Chrome profiles
                  you&rsquo;re signed into &mdash; staying inside your own Google account. A small
                  device-local cache (<code>chrome.storage.local</code>) remembers which sites are
                  already dark so we don&rsquo;t re-detect them. We never receive any of it.
                </li>
                <li>
                  <strong>
                    Alarms (<code>alarms</code> permission):
                  </strong>{' '}
                  used only to wake the extension at the start and end of your optional dark-mode
                  schedule, so it can flip dark on/off at the times you set. No data is involved.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What We Do NOT Do</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No analytics, no tracking, no telemetry.</li>
                <li>No external servers and no network requests of any kind.</li>
                <li>No selling, sharing, or sending of any data.</li>
                <li>No ads.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the &ldquo;Last
                Updated&rdquo; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                Questions about this policy? Reach us at <SupportEmailLink />.
              </p>
            </section>

            <LegalLastUpdated />
          </div>
        </div>
      </div>

      <LegalPageFooter />
    </div>
  );
}
