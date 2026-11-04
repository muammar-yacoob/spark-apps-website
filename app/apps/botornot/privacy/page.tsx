import type { Metadata } from 'next';
import { LegalAppHeading } from '@/app/_components/layout/LegalAppHeading';
import { LegalCompanyByline } from '@/app/_components/layout/LegalCompany';
import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';

export const metadata: Metadata = {
  title: 'BotOrNot: Privacy Policy',
  description:
    'Privacy policy for BotOrNot, the AI-content detection Chrome extension. Images are analysed on your device; nothing about them is uploaded.',
  alternates: { canonical: '/apps/botornot/privacy' },
};

export default function BotOrNotPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <LegalAppHeading
            icon="botornot.png"
            name="BotOrNot"
            tagline="Spot AI-generated images and video as you browse."
          />
          <LegalCompanyByline />

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">The short version</p>
              <p className="mt-2">
                BotOrNot looks at the images and videos on the pages you visit, works out on your
                own computer how likely each is to be AI-generated, and shows a badge. The images
                and the results stay in your browser. We run no server that receives them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What It Looks At</h2>
              <p>
                On the pages you visit, BotOrNot finds images and videos and examines their
                addresses, embedded metadata, known AI-tool signatures and pixel statistics such as
                colour counts. To read an image&rsquo;s bytes and metadata it asks the site that
                hosts the image for it, reusing the copy your browser has already downloaded.
              </p>
              <p className="mt-2">
                It does not collect your browsing history, your IP address, what you type, or
                anything from your accounts. It does not run on a short list of e-signature services
                (DocuSign, Adobe Sign, HelloSign, PandaDoc and similar).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Where It Is Kept</h2>
              <p>
                Your settings, cached results and any examples you label are held in Chrome&rsquo;s
                extension storage (<code>chrome.storage.sync</code> and{' '}
                <code>chrome.storage.local</code>) in this browser profile. Settings can sync
                between your own Chrome installs if you have Chrome Sync on. We cannot see any of
                it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                What Can Leave Your Computer
              </h2>
              <p>Two optional things, and neither sends an image:</p>
              <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
                <li>
                  <strong>AI-assisted analysis (off by default).</strong> If you switch it on, the
                  derived numbers (colour counts, detected signatures, confidence scores) are given
                  to Chrome&rsquo;s built-in Gemini Nano, which runs on your computer. If you paste
                  your own Google AI Studio key into settings, those same numbers go to
                  Google&rsquo;s Gemini API (<code>generativelanguage.googleapis.com</code>) under{' '}
                  <strong>your</strong> key and your terms with Google. The image is never uploaded.
                  Leave the key empty and everything stays local.
                </li>
                <li>
                  <strong>Subscription check.</strong> The current version never asks for your
                  email. If an earlier version stored one on this computer, it is sent with the app
                  identifier to our billing service (<code>sparkpay.dev</code>) to look up your
                  plan. No browsing or image data goes with it.
                </li>
              </ul>
              <p className="mt-4">
                Earlier versions used an analysis service of ours. That no longer happens at all.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                What Is Never Sent Anywhere
              </h2>
              <p>
                Images, video, page content, browsing history, analytics, telemetry and crash
                reports. BotOrNot has no analytics of any kind and no advertising.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Permissions</h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>
                    <code>storage</code>:
                  </strong>{' '}
                  holds the settings, cached results and labels described above.
                </li>
                <li>
                  <strong>
                    <code>contextMenus</code>:
                  </strong>{' '}
                  the right-click &ldquo;analyse this image&rdquo; option.
                </li>
                <li>
                  <strong>
                    <code>activeTab</code>:
                  </strong>{' '}
                  lets the extension act on the tab you invoke it from.
                </li>
                <li>
                  <strong>Access to all sites:</strong> a content script runs on the pages you visit
                  to find images and mark them, and the extension may fetch an image from the site
                  that hosts it in order to analyse it. This is why the install dialog says it can
                  read data on all sites; it does that locally and sends none of it to us.
                </li>
                <li>
                  <strong>
                    <code>sparkpay.dev</code> and <code>generativelanguage.googleapis.com</code>:
                  </strong>{' '}
                  the only two outside addresses it can contact, used solely for the optional
                  features above.
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
