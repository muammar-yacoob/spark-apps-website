import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SupportEmailLink } from '@/app/_components/layout/SupportEmailLink';
import { SITE_NAME } from '@/lib/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of service for ${SITE_NAME}. Read our terms before using the platform.`,
  alternates: { canonical: '/terms' },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                These Terms of Service (&ldquo;Terms&rdquo;) are entered into between you and{' '}
                <strong>Your Company Name</strong>, a company registered in England and Wales
                (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By accessing and using this
                service, you accept and agree to be bound by these Terms. If you do not agree,
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Description of Service</h2>
              <p>We provide a web application platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Accounts</h2>
              <p className="mb-4">When you create an account with us, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptable Use</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use the service to send spam or malicious content</li>
                <li>Share your account credentials with others</li>
                <li>Reverse engineer or attempt to extract source code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p>
                We strive to maintain high service availability but do not guarantee uninterrupted
                access. We may temporarily suspend service for maintenance, updates, or unforeseen
                circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, we shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, or any loss of profits or
                revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
              <p className="mb-4">
                All content, features, and functionality of this service, including but not limited
                to the software, source code, design, text, graphics, and trade marks, are the
                exclusive property of Your Company Name and are protected by copyright and other
                intellectual property laws of England and Wales and applicable international
                treaties. Nothing in these Terms transfers any intellectual property rights to you.
              </p>
              <p>
                Unauthorised copying, modification, distribution, or use of any part of this service
                is strictly prohibited and may result in civil and criminal liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data & Privacy</h2>
              <p>
                Your use of the service is also governed by our{' '}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </a>
                . By using the service, you consent to our collection and use of your data as
                described in the Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account if you violate these terms
                or engage in fraudulent activity. Upon termination, your right to use the service
                will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <p>
                We may revise these terms from time to time. The most current version will always be
                available on this page. By continuing to use the service after changes are posted,
                you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of
                England and Wales. Each party irrevocably submits to the exclusive jurisdiction of
                the courts of England and Wales to resolve any dispute arising out of or in
                connection with these Terms or the use of this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:{' '}
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
