import type { Metadata } from 'next';
import { LegalAppHeading } from '@/app/_components/layout/LegalAppHeading';
import { LegalCompanyByline } from '@/app/_components/layout/LegalCompany';
import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';

export const metadata: Metadata = {
  title: 'Calendify: Privacy Policy',
  description:
    'Privacy policy for Calendify, the page-to-calendar Chrome extension. No account, no server of ours; nothing leaves your computer unless you add your own key.',
  alternates: { canonical: '/apps/calendify/privacy' },
};

export default function CalendifyPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <LegalAppHeading
            icon="calendify.png"
            name="Calendify"
            tagline="Turn an event on any page into a prefilled calendar entry."
          />
          <LegalCompanyByline />

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">The short version</p>
              <p className="mt-2">
                Calendify reads one page, proposes one calendar event, and shows it to you before
                anything happens. It has no account, no server of ours and no database.
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
                <li>
                  <strong>Chrome&rsquo;s built-in model (the default).</strong> Reading happens on
                  your own computer. Nothing leaves it.
                </li>
                <li>
                  <strong>Your own Gemini API key, if you paste one in.</strong> The page text is
                  then sent to Google&rsquo;s Gemini API under <strong>your</strong> account and its
                  terms.
                </li>
              </ul>
              <p className="mt-4">
                With neither, Calendify still works: the form is filled from the page&rsquo;s own
                structured markup and you type in the rest.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                What Leaves Your Computer, and When
              </h2>
              <p>
                Nothing leaves until you ask for an event, and then only if you have pasted in an
                API key and the page&rsquo;s own markup did not already give a title and a date.
                Calendify then sends Google:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
                <li>
                  the text you selected, or at most 4,000 characters of the visible text of the page
                  if you selected nothing
                </li>
                <li>the page&rsquo;s URL and title</li>
              </ul>
              <p className="mt-4">
                It does not send the page source, images, cookies, form contents, other tabs or
                anything from any other page. Selecting the event text first is the narrower option
                and the more accurate one.
              </p>
              <blockquote className="mt-4 border-l-2 border-gray-700 pl-4 text-gray-400">
                On Google&rsquo;s <strong className="text-gray-300">free</strong> Gemini API tier,
                Google may use what is sent to improve its models. If what is on screen is
                confidential, use the built-in model, select only the event text, or fill the form
                in by hand.
              </blockquote>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your API Key</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  It is stored unencrypted in <code>chrome.storage.local</code>, in this Chrome
                  profile.
                </li>
                <li>
                  It is sent only to <code>generativelanguage.googleapis.com</code>, as the request
                  header Google&rsquo;s API requires.
                </li>
                <li>It is never displayed again after you save it, and Remove deletes it.</li>
                <li>
                  Permission to reach that address is requested when you save a key, not when you
                  install. Decline it and Calendify never contacts Google&rsquo;s API at all.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Calendify Does Not Do</h2>
              <p>
                No analytics, tracking, telemetry or crash reporting. No browsing history is
                collected. No account or sign-in, and no server operated by us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Google Calendar</h2>
              <p>
                Calendify never writes to your calendar and never asks for access to it. It builds a
                Google Calendar link with the fields filled in and opens it, and{' '}
                <strong>you</strong> press Save. Nothing is created unless you do. Details a model
                inferred rather than read off the page are marked as inferred in the event
                description, so check them before you save.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Permissions</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>
                    <code>contextMenus</code>:
                  </strong>{' '}
                  the right-click Calendify option.
                </li>
                <li>
                  <strong>
                    <code>activeTab</code> and <code>scripting</code>:
                  </strong>{' '}
                  read event details from the page you are looking at, when you ask.
                </li>
                <li>
                  <strong>
                    <code>storage</code>:
                  </strong>{' '}
                  holds your API key if you set one, and passes the event details to the popup.
                </li>
                <li>
                  <strong>
                    <code>notifications</code>:
                  </strong>{' '}
                  confirms when the event is ready.
                </li>
                <li>
                  <strong>Gemini API access (optional):</strong> requested only when you save a key.
                </li>
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
