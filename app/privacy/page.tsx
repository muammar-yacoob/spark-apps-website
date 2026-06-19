import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SupportEmailLink } from '@/app/_components/layout/SupportEmailLink';
import { SITE_NAME } from '@/lib/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal information.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Controller</h2>
              <p>
                This Privacy Policy is issued by <strong>Your Company Name</strong>, a company
                registered in England and Wales (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                &ldquo;our&rdquo;). We are the data controller responsible for your personal
                information processed in connection with this service. For any privacy-related
                enquiries, please contact us using the details at the bottom of this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <p className="mb-4">We collect information you provide directly to us when you:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create an account or subscription</li>
                <li>Make a purchase or payment</li>
                <li>Contact our support team</li>
              </ul>
              <p className="mt-4">
                This may include your name, email address, payment information, and usage data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process your payments and subscriptions</li>
                <li>Send you receipts and important service updates</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to
                provide you services. You may request deletion of your data by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
              <p className="mb-4">We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Google:</strong> Authentication
                </li>
                <li>
                  <strong>Neon:</strong> Database hosting
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <p className="mb-4">
                Under the UK General Data Protection Regulation (UK GDPR) and the Data Protection
                Act 2018, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information (Subject Access Request)</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request erasure of your data (&ldquo;right to be forgotten&rdquo;)</li>
                <li>Restrict or object to processing of your data</li>
                <li>Receive your data in a portable format</li>
                <li>Opt-out of direct marketing communications at any time</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at <SupportEmailLink />. We will
                respond within one month as required by UK GDPR. You also have the right to lodge a
                complaint with the{' '}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Information Commissioner&apos;s Office (ICO)
                </a>
                , the UK supervisory authority for data protection.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookies</h2>
              <p>
                We use essential cookies to maintain your session and authentication. We do not use
                tracking or advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p>
                This Privacy Policy is governed by the laws of England and Wales. Any disputes
                arising in connection with this policy shall be subject to the exclusive
                jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <SupportEmailLink />
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
