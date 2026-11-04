import type { Metadata } from 'next';
import { LegalAppHeading } from '@/app/_components/layout/LegalAppHeading';
import { LegalCompanyByline } from '@/app/_components/layout/LegalCompany';
import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';

export const metadata: Metadata = {
  title: 'TextPert: Privacy Policy',
  description:
    'Privacy policy for TextPert, the rewrite-and-reply Chrome extension. The default engine runs on your device; your text goes to Google only if you add your own key.',
  alternates: { canonical: '/apps/textpert/privacy' },
};

export default function TextPertPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <LegalAppHeading
            icon="textpert.png"
            name="TextPert"
            tagline="Polish your text or generate savage replies."
          />
          <LegalCompanyByline />

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">The short version</p>
              <p className="mt-2">
                You select text, right-click, and TextPert writes a rewrite or a reply. By default
                the writing is done by Chrome&rsquo;s built-in on-device model, so your text never
                leaves your computer. It goes to Google only if you paste in your own Gemini API
                key. It never passes through a server of ours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What It Reads</h2>
              <p>
                Only the text you select when you choose TextPert from the right-click menu. It does
                not watch your browsing, read other tabs or run in the background on its own.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Where It Is Kept</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>Your Gemini API key, if you add one.</strong> In{' '}
                  <code>chrome.storage.local</code> on this device only. Never synced.
                </li>
                <li>
                  <strong>Preferences, optional reply history and subscription status.</strong> In{' '}
                  <code>chrome.storage.sync</code>, which Chrome copies between your own devices if
                  you have Chrome Sync on. The history is optional and you can clear it in settings.
                </li>
                <li>
                  <strong>A short-lived cache.</strong> Generated replies are cached for an hour so
                  changing the sass level does not regenerate them needlessly.
                </li>
                <li>
                  <strong>The email of your Chrome profile.</strong> A copy is kept in{' '}
                  <code>chrome.storage.local</code> for the subscription check below.
                </li>
              </ul>
              <p className="mt-4">We store none of this on a server.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Leaves Your Computer</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>Your selected text, only with your own key.</strong> If you add a Google
                  AI Studio key, the selection is sent straight from your browser to Google&rsquo;s
                  Gemini API (<code>generativelanguage.googleapis.com</code>) under{' '}
                  <strong>your</strong> account and Google&rsquo;s terms. Google&rsquo;s free tier
                  may use submitted content to improve its models, so use the on-device engine for
                  anything confidential. Leave the key empty and nothing is sent.
                </li>
                <li>
                  <strong>Your email, for the subscription check.</strong> To tell whether you have
                  a paid plan, TextPert reads the email of the Google account signed in to Chrome
                  and sends it with the app identifier (<code>textpert</code>) to our billing
                  service (<code>sparkpay.dev</code>), which works with Stripe for payments. It is
                  used to check your plan and for subscription support, not for marketing. Ask us
                  and we will delete it from the billing service.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What We Do Not Do</h2>
              <p>
                No analytics, no telemetry, no advertising, no selling or sharing of your data, and
                we do not keep the replies it generates. Everything travels over HTTPS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Permissions</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>
                    <code>contextMenus</code>:
                  </strong>{' '}
                  adds TextPert to the right-click menu.
                </li>
                <li>
                  <strong>
                    <code>activeTab</code> and <code>scripting</code>:
                  </strong>{' '}
                  read your selection and show the reply in a small window on the page you are on,
                  when you ask.
                </li>
                <li>
                  <strong>
                    <code>storage</code>:
                  </strong>{' '}
                  the items listed under Where It Is Kept.
                </li>
                <li>
                  <strong>
                    <code>notifications</code>:
                  </strong>{' '}
                  success and error messages.
                </li>
                <li>
                  <strong>
                    <code>identity</code> and <code>identity.email</code>:
                  </strong>{' '}
                  read the email of your Chrome profile for the subscription check.
                </li>
                <li>
                  <strong>
                    <code>tabs</code>:
                  </strong>{' '}
                  used to open a page in a new tab, such as the upgrade page.
                </li>
                <li>
                  <strong>
                    <code>sparkpay.dev</code> and <code>generativelanguage.googleapis.com</code>:
                  </strong>{' '}
                  the only two outside addresses it can contact.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Children</h2>
              <p>
                TextPert is not aimed at anyone under 13 and we do not knowingly collect their data.
              </p>
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
