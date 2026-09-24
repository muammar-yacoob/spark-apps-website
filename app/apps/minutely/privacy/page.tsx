import type { Metadata } from 'next';
import { LegalCompanyByline } from '@/app/_components/layout/LegalCompany';
import { LegalLastUpdated, LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';

export const metadata: Metadata = {
  title: 'Minutely — Privacy Policy',
  description:
    'Privacy policy for Minutely, the meeting-minutes Chrome extension. Transcripts stay on your computer; nothing is sent until you press Summarise.',
  alternates: { canonical: '/apps/minutely/privacy' },
};

export default function MinutelyPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Minutely — Privacy Policy</h1>
          <p className="text-gray-400 mb-2">Meeting minutes, written where the meeting happens.</p>
          <LegalCompanyByline />

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">The short version</p>
              <p className="mt-2">
                Minutely reads the captions your meeting is already showing, keeps the transcript on
                your own computer, and sends it nowhere unless you press <strong>Summarise</strong>.
                There is one optional switch that uses your microphone; it is off until you turn it
                on, and it is described below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What It Reads</h2>
              <p>
                The text of the live captions displayed by Google Meet, Microsoft Teams or Zoom in
                your browser, together with the speaker names those clients attach to them, the
                meeting title and the participant list.
              </p>
              <p className="mt-2">
                <strong>By default it does not listen to anything.</strong> Minutely declares no
                microphone permission and no tab capture permission, and captions are the only
                source it uses unless you switch on the one below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                The Microphone, If You Switch It On
              </h2>
              <p>
                Settings has a switch called <strong>Transcribe my microphone</strong>. It is{' '}
                <strong>off when you install Minutely</strong> and does nothing until you turn it
                on. Turned on, it does one thing: while the meeting&rsquo;s captions are unreadable,
                and only then, it asks Chrome to transcribe your default microphone so your own half
                of the conversation is not lost. The moment captions come back it stops.
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
                <li>
                  <strong>It is Chrome&rsquo;s speech recognition, not ours.</strong> Minutely asks
                  for on-device recognition where Chrome offers it (Chrome 138 and later, on
                  supported machines). Where it does not,{' '}
                  <strong>Chrome sends that audio to Google</strong> to transcribe. That is
                  Chrome&rsquo;s own Web Speech API behaviour and it is outside our control, which
                  is why the switch carries the same warning next to it.
                </li>
                <li>
                  <strong>It captures you, not the room.</strong> Chrome&rsquo;s speech recognition
                  listens to the browser&rsquo;s default input device and cannot be pointed at the
                  tab&rsquo;s audio, so the other participants are never transcribed this way. Lines
                  it produces are attributed to &ldquo;You&rdquo;.
                </li>
                <li>
                  <strong>No new permission is requested.</strong> It works because the meeting site
                  you are on already has microphone access, which you granted it in order to be on
                  the call. Minutely uses that grant on that site and cannot obtain one anywhere
                  else.
                </li>
              </ul>
              <p className="mt-4">
                A microphone glyph appears on the Minutely button in the meeting page for as long as
                it is listening, so it is never doing this out of sight.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Where It Is Kept</h2>
              <p>
                In <code>chrome.storage.local</code>, in this browser profile, on this computer.
              </p>
              <p className="mt-2">
                Be aware of what that means: extension storage is <strong>not encrypted</strong>. It
                sits in your Chrome profile directory like any other extension&rsquo;s data, and
                anyone with access to your logged-in computer can read it.
              </p>
              <p className="mt-2">
                Transcripts are never synced. Not to Google, not between your devices, not anywhere.
                Chrome&rsquo;s sync storage caps a single item at 8KB and a half-hour transcript is
                around 60KB, so this is a hard property rather than a policy.
              </p>
              <p className="mt-2">
                Transcripts are deleted automatically after your retention period (90 days by
                default; configurable, including <em>forever</em>).{' '}
                <strong>Delete every transcript</strong> in Settings removes all of it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                What Leaves Your Computer, and When
              </h2>
              <p>
                Nothing, until you press <strong>Summarise</strong> on a meeting. Then, depending on
                which engine is in use:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
                <li>
                  <strong>On-device (Gemini Nano, the default).</strong> Nothing leaves your
                  computer at all. The model runs inside Chrome.
                </li>
                <li>
                  <strong>With your own Gemini API key.</strong> The transcript is sent to
                  Google&rsquo;s Gemini API (<code>generativelanguage.googleapis.com</code>) under{' '}
                  <strong>your</strong> key and <strong>your</strong> account, governed by
                  Google&rsquo;s terms for that account, not by ours. It is not routed through any
                  server of ours. We operate none.
                </li>
              </ul>
              <blockquote className="mt-4 border-l-2 border-gray-700 pl-4 text-gray-400">
                <strong className="text-gray-300">
                  Please check Google&rsquo;s current data-use terms for your key before summarising
                  other people&rsquo;s meetings.
                </strong>{' '}
                Google has historically treated free-tier and paid API usage differently with
                respect to using submitted content to improve their products, and a meeting
                transcript is other people&rsquo;s speech, not just your own words. This is the one
                part of Minutely where &ldquo;it stays on your machine&rdquo; stops being true, and
                it is your call to make with the facts in front of you.
              </blockquote>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                What Is Never Sent Anywhere
              </h2>
              <p>
                Your API key (it is stored locally and sent only to Google, as the{' '}
                <code>x-goog-api-key</code> header on your own requests), your identity, any
                analytics, any telemetry, any crash reports. Minutely has no analytics of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Google Calendar</h2>
              <p>
                Minutely <strong>never writes to your calendar</strong> and never asks for calendar
                access. The calendar button opens Google Calendar&rsquo;s own event page with the
                fields filled in; you press Save. Nothing is created unless you do.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Recording Other People</h2>
              <p>
                Keeping a written record of a meeting is recording it, whatever the source of the
                text. In most workplaces, and under the law in some places, the people in the room
                should know. Minutely shows a notice before it captures anything and displays a
                visible indicator while it is recording, both in the meeting page and in the side
                panel. Please use it openly. This is a product requirement, not legal advice; if you
                need legal advice, ask a lawyer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Permissions</h2>
              <p>Minutely requests four things, and nothing that could be avoided:</p>
              <ul className="list-disc list-inside space-y-3 ml-4 mt-4">
                <li>
                  <strong>
                    <code>storage</code>:
                  </strong>{' '}
                  holds the transcripts, the minutes, your settings and your Gemini API key, all in{' '}
                  <code>chrome.storage.local</code> on this computer.
                </li>
                <li>
                  <strong>
                    <code>sidePanel</code>:
                  </strong>{' '}
                  Minutely&rsquo;s entire interface is a Chrome side panel, deliberately rather than
                  a panel injected into the meeting page &mdash; an injected panel disappears the
                  moment anyone presents, and is captured when the user shares that tab, which would
                  broadcast a private transcript to the room.
                </li>
                <li>
                  <strong>
                    <code>unlimitedStorage</code>:
                  </strong>{' '}
                  a long call can exceed the default quota mid-meeting, and a quota rejection does
                  not truncate, it rejects silently. This permission adds no warning to the install
                  dialog and prevents silent data loss.
                </li>
                <li>
                  <strong>
                    <code>https://generativelanguage.googleapis.com/*</code>:
                  </strong>{' '}
                  the only network destination Minutely can reach, used solely for the Gemini API
                  call described above. Not contacted at all when the on-device model is used.
                </li>
              </ul>
              <p className="mt-4">
                Alongside those, Minutely declares content scripts for the three meeting sites it
                supports &mdash; <code>meet.google.com</code>, <code>teams.microsoft.com</code> /{' '}
                <code>teams.live.com</code>, and <code>*.zoom.us/wc/*</code>. Those scripts read
                caption text and participant names from the page you are already on, and send
                nothing to any network destination.
              </p>
              <p className="mt-4">
                Minutely deliberately does <strong>not</strong> request <code>tabs</code>,{' '}
                <code>activeTab</code>, <code>scripting</code>, <code>downloads</code>,{' '}
                <code>audioCapture</code>, <code>tabCapture</code>, <code>identity</code>, calendar
                OAuth scopes, or any other host permission.
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
