import type { Metadata } from 'next';
import { LegalCompanyByline } from '@/app/_components/layout/LegalCompany';
import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';

export const metadata: Metadata = {
  title: 'Screenful — Privacy Policy',
  description:
    'Privacy policy for Screenful, the full-page screenshot Chrome extension. Captures stay in your browser; nothing is uploaded.',
  alternates: { canonical: '/apps/screenful/privacy' },
};

export default function ScreenfulPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Screenful — Privacy Policy</h1>
          <p className="text-gray-400 mb-2">Full-page screenshots in one keystroke.</p>
          <LegalCompanyByline />

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">
                Screenful collects nothing, sends nothing, and has no servers.
              </p>
              <p className="mt-2">
                Screenshots are captured, stitched, and saved entirely inside your browser. The
                finished image is handed straight to Chrome&rsquo;s downloads or your clipboard. No
                image, URL, page title, or byte of page content is ever transmitted anywhere.
              </p>
              <p className="mt-2">
                There is no analytics, no telemetry, no crash reporting, no account, and no network
                request of any kind &mdash; the extension ships with no host permissions, so it is
                not technically capable of contacting a server.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Is Stored</h2>
              <p>
                Your two preferences only &mdash; whether repeated sticky headers are removed, and
                whether the preview is skipped. These live in <code>chrome.storage.sync</code>,
                which means Chrome may sync them between your own signed-in browsers. Uninstalling
                the extension removes them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Permissions and Why</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>
                    <code>activeTab</code>:
                  </strong>{' '}
                  temporary access to the one tab you invoke Screenful on, granted by Chrome only at
                  the moment you press the shortcut or click the icon, and revoked when you navigate
                  away.
                </li>
                <li>
                  <strong>
                    <code>scripting</code>:
                  </strong>{' '}
                  injects the capture script into that tab to measure the page and step the scroll
                  position. It is not a persistent content script &mdash; nothing runs on pages you
                  never capture.
                </li>
                <li>
                  <strong>
                    <code>storage</code>:
                  </strong>{' '}
                  saves the two preferences listed above.
                </li>
              </ul>
              <p className="mt-4">
                Screenful deliberately does <strong>not</strong> request{' '}
                <code>&lt;all_urls&gt;</code>, <code>host_permissions</code>, <code>downloads</code>
                , <code>tabs</code>, or <code>identity</code>.
              </p>
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
                Questions about this policy? Reach us at{' '}
                <a
                  href="https://spark-apps.co/contact"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  spark-apps.co
                </a>
                .
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
