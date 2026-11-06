import type { Metadata } from 'next';
import { LegalAppHeading } from '@/app/_components/layout/LegalAppHeading';
import { LegalCompanyByline } from '@/app/_components/layout/LegalCompany';
import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';

export const metadata: Metadata = {
  title: 'GoNoGo: Privacy Policy',
  description:
    'Privacy policy for GoNoGo, the training readiness app. Your health data is read on your phone, scored on your phone, and never sent anywhere.',
  alternates: { canonical: '/apps/gonogo/privacy' },
};

export default function GoNoGoPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <LegalAppHeading
            icon="gonogo.png"
            name="GoNoGo"
            tagline="Train hard today, or back off. One honest answer every morning."
          />
          <LegalCompanyByline />

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">The short version</p>
              <p className="mt-2">
                GoNoGo reads health data your phone already holds, works out how recovered you are,
                and shows you the answer. All of that happens on your phone. There is no account, no
                server of ours, and no analytics. Your health data is never transmitted anywhere,
                because there is nowhere for it to go.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What It Reads</h2>
              <p>
                GoNoGo asks your phone&rsquo;s health store for six daily figures, and nothing else:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>
                  <strong>Heart rate variability</strong> and <strong>resting heart rate</strong>,
                  the two strongest signals of how recovered you are
                </li>
                <li>
                  <strong>Sleep duration</strong>
                </li>
                <li>
                  <strong>Workout duration</strong>, to work out how hard you have been training
                  lately
                </li>
                <li>
                  <strong>Steps</strong> and <strong>active energy</strong>, as a fallback when your
                  device reports calories but not workout durations
                </li>
              </ul>
              <p className="mt-4">
                It asks for <strong>read access only</strong>. GoNoGo cannot write to your health
                store, cannot modify or delete anything in it, and does not request the permission
                that would allow it to.
              </p>
              <p className="mt-2">
                It does not read, and does not ask for, your location, your heart rate during the
                day, your ECG, blood oxygen, blood pressure, blood glucose, body measurements,
                menstrual or reproductive health data, medications, clinical records, or any other
                category your health store may hold.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Where It Comes From</h2>
              <p>
                On iPhone, from <strong>Apple Health</strong>. On Android, from{' '}
                <strong>Health Connect</strong>. GoNoGo does not talk to your watch directly. It
                reads whatever your watch has already synced into one of those two stores, which
                means it works with an Apple Watch, a Galaxy Watch, a Pixel Watch, a Fitbit, or a
                Garmin, without needing to know which.
              </p>
              <p className="mt-2">
                You grant that access in your operating system&rsquo;s own permission screen, not
                ours, and you can withdraw it there at any time. If you do, GoNoGo stops being able
                to read anything new and says so rather than failing silently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Where It Is Kept</h2>
              <p>
                In the app&rsquo;s own storage, on your phone. GoNoGo keeps the last{' '}
                <strong>90 days</strong> of those six daily figures and discards anything older
                automatically. It needs the history because a readiness score is a comparison
                against your own recent baseline; a single day&rsquo;s reading on its own means
                nothing.
              </p>
              <p className="mt-2">
                Be aware of what on-device storage means: it is{' '}
                <strong>not separately encrypted by us</strong>. It sits inside the app&rsquo;s
                private container, protected by your phone&rsquo;s own passcode and disk encryption
                like any other app&rsquo;s data.
              </p>
              <p className="mt-2">
                <strong>Clear stored history</strong> in Settings deletes all of it immediately.
                Deleting the app removes it too. Neither action touches the original data in Apple
                Health or Health Connect, which is yours and stays where it is.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Leaves Your Phone</h2>
              <p className="text-lg text-white font-medium">Nothing.</p>
              <p className="mt-2">
                There is no account to create, no sign-in, no sync between your devices, and no
                server of ours for your health data to reach. The readiness score is calculated on
                your phone by code running inside the app. We never see your figures, and we could
                not produce them if we were asked to.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                No Analytics, No Tracking, No Advertising
              </h2>
              <p>
                GoNoGo contains no analytics, no crash reporting, no telemetry, no advertising
                identifiers and no third-party trackers. It does not know how often you open it, and
                it does not report that you did.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Garmin, If We Add It Later</h2>
              <p>
                We would like GoNoGo to read Garmin&rsquo;s own training figures, such as Body
                Battery and HRV status, which Garmin does not pass into Apple Health or Health
                Connect. Reaching those requires Garmin&rsquo;s own interface, which works
                server-to-server rather than on the phone.
              </p>
              <p className="mt-2">
                <strong>
                  That is not built, and this policy describes the app as it is today.
                </strong>{' '}
                If we add it, it would be an <strong>optional</strong> connection you switch on, it
                would mean your Garmin figures passing through a server we operate, and{' '}
                <strong>
                  this policy will be updated to say exactly what is stored and for how long before
                  the feature ships
                </strong>
                , not after.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights Over This Data</h2>
              <p>
                Health data is special category personal data under UK and EU data protection law,
                which is the reason for the design above rather than an afterthought to it.
              </p>
              <p className="mt-2">
                Because your data never leaves your phone, you do not have to ask us to exercise
                your rights over it, and there is no request we could usefully answer: we hold no
                copy to give you, correct, or erase. Access it in Apple Health or Health Connect,
                where it originates. Erase GoNoGo&rsquo;s copy with{' '}
                <strong>Clear stored history</strong> or by deleting the app. Withdraw consent in
                your phone&rsquo;s permission settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">This Is Not Medical Advice</h2>
              <p>
                GoNoGo is a training aid for healthy adults. It is{' '}
                <strong>not a medical device</strong>, it does not diagnose, treat, monitor or
                prevent any condition, and its score is not a clinical assessment. A low score means
                your recent numbers differ from your own recent average, which has many innocent
                explanations.
              </p>
              <p className="mt-2">
                Do not use it to make a decision about your health, and do not ignore a symptom
                because the app showed a high number. If you feel unwell, or your readings concern
                you, speak to a doctor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Children</h2>
              <p>
                GoNoGo is not directed to children. It is intended for adults aged 18 and over, and
                we do not knowingly collect anything from a child, which is straightforward here
                because we do not collect anything from anyone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. Changes are posted on this page with
                the &ldquo;Last Updated&rdquo; date revised. Where a change means your data would
                leave your phone for the first time, it will be described here, and asked for in the
                app, before it happens.
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
