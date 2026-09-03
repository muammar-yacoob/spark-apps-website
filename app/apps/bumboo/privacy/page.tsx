import type { Metadata } from 'next';
import { LegalCompanyByline } from '@/app/_components/layout/LegalCompany';
import { LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';

export const metadata: Metadata = {
  title: 'BumBoo — Privacy Policy',
  description:
    'Privacy policy for BumBoo, the used-vehicle history Chrome extension. Plates are read on your machine; identifiers go only to the public register of the country they belong to.',
  alternates: { canonical: '/apps/bumboo/privacy' },
};

/**
 * Mirrors PRIVACY.md in the bumboo repo. Change both together — the store
 * listing points here, and the file ships beside the extension.
 */
const LAST_UPDATED = '31 August 2026';

export default function BumbooPrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">BumBoo — Privacy Policy</h1>
          <p className="text-gray-400 mb-2">
            The official record of a used vehicle, on the advert itself.
          </p>
          <LegalCompanyByline />

          <div className="space-y-8 text-gray-300">
            <section>
              <p className="text-lg text-white font-medium">
                BumBoo does not sell or share personal information. There is no analytics, no
                telemetry and no tracking of you, and nothing on any page is an advert.
              </p>
              <p className="mt-2">
                There is one commercial link, and it is easier to state plainly than to bury. The
                panel lists places to get an insurance quote, and those links are tagged with the
                name of this extension so the insurer can see that the visit came from it. Some of
                them may in future pay a commission for that traffic. The tag names the source, not
                you: no identifier, no registration, no vehicle and nothing about the person
                clicking travels with it, and nothing is sent at all unless you click the link
                yourself. Where a link does earn a commission the panel labels it &ldquo;paid
                link&rdquo; on the link itself.
              </p>
              <p className="mt-2">
                Nothing is sent to the developer, who receives no data from the extension at all.
                Plate reading happens on your machine, and the identifier you are checking goes only
                to the public register for the country it belongs to: GOV.UK for a British
                registration, RDW for a Dutch kenteken, NHTSA for a VIN. Nowhere else.
              </p>
              <p className="mt-2">
                One feature reaches a third party, and only when you press it. The locate button
                beside the postcode field asks your browser where you are and sends those
                coordinates to <code>postcodes.io</code> &mdash; a free public service over Ordnance
                Survey&rsquo;s open postcode data &mdash; to get the nearest postcode, so a vehicle
                search can be centred without you typing it. The coordinates are used for that one
                request and discarded; the postcode is kept on your machine so you do not have to do
                it twice. Nothing happens on install, on startup, or on opening the popup, and you
                can always just type the postcode instead.
              </p>
              <p className="mt-2">
                An AI verdict feature exists in the code and is switched off: the build carries no
                key for it and does not request the permissions it would need. If a release turns it
                on, this policy and the permissions it asks for will both say so before it does.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What the Extension Handles</h2>
              <ul className="space-y-3">
                <li>
                  <strong className="text-white">Vehicle identifiers.</strong> A registration, a
                  Dutch kenteken or a VIN, read from the page text, from the advert&rsquo;s
                  photographs, or typed by you. An identifier identifies a vehicle, not a person,
                  and every record returned is published as open data by the government that holds
                  it.
                </li>
                <li>
                  <strong className="text-white">Advert details.</strong> Make, model, colour, fuel
                  type, year and mileage are read from the page you are already viewing, and used
                  only to check that the MOT record found actually belongs to the advertised
                  vehicle. They never leave your browser.
                </li>
                <li>
                  <strong className="text-white">
                    Your approximate location (only on request).
                  </strong>{' '}
                  If you press the locate button beside the postcode field, your browser&rsquo;s
                  position is read and exchanged for the nearest postcode, which is then kept
                  locally so you do not have to type it. The coordinates themselves are not stored.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Where Data Goes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-white">
                      <th className="py-2 pr-4 font-semibold">Destination</th>
                      <th className="py-2 pr-4 font-semibold">What is sent</th>
                      <th className="py-2 font-semibold">Why</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-gray-900">
                      <td className="py-2 pr-4">
                        <code>m.atcdn.co.uk</code>
                      </td>
                      <td className="py-2 pr-4">
                        a request for advert photos already shown on the page
                      </td>
                      <td className="py-2">so the plate can be read locally</td>
                    </tr>
                    <tr className="border-b border-gray-900">
                      <td className="py-2 pr-4">
                        <code>www.check-mot.service.gov.uk</code>
                      </td>
                      <td className="py-2 pr-4">a British registration number</td>
                      <td className="py-2">to retrieve the public MOT history</td>
                    </tr>
                    <tr className="border-b border-gray-900">
                      <td className="py-2 pr-4">
                        <code>opendata.rdw.nl</code>
                      </td>
                      <td className="py-2 pr-4">a Dutch kenteken</td>
                      <td className="py-2">
                        to retrieve the public APK expiry and recorded defects
                      </td>
                    </tr>
                    <tr className="border-b border-gray-900">
                      <td className="py-2 pr-4">
                        <code>vpic.nhtsa.dot.gov</code>
                      </td>
                      <td className="py-2 pr-4">a VIN</td>
                      <td className="py-2">to decode what the vehicle is</td>
                    </tr>
                    <tr className="border-b border-gray-900">
                      <td className="py-2 pr-4">
                        <code>api.nhtsa.gov</code>
                      </td>
                      <td className="py-2 pr-4">the make, model and year that VIN decoded to</td>
                      <td className="py-2">
                        to retrieve safety recalls and owner complaints for that model
                      </td>
                    </tr>
                    <tr className="border-b border-gray-900">
                      <td className="py-2 pr-4">
                        <code>api.postcodes.io</code>
                      </td>
                      <td className="py-2 pr-4">your approximate coordinates</td>
                      <td className="py-2">
                        only when you press the locate button, to return the nearest postcode
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">an insurer or comparison site</td>
                      <td className="py-2 pr-4">
                        nothing but the fact that BumBoo sent you, and only if you click
                      </td>
                      <td className="py-2">
                        so a quote can be obtained, and so the traffic can be counted
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                Nothing is sent anywhere else. In particular, nothing is sent to the developer.
              </p>
              <p className="mt-2">
                The insurance row above those links is worked out entirely on your machine, from
                what the advert already says. Nothing is asked of anyone to produce it, which is
                also why it is a wide band and not a quote.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Image Processing</h2>
              <p>
                Plate reading happens entirely on your computer, using an OCR engine bundled inside
                the extension. Photographs are never uploaded anywhere, and no image leaves your
                browser. No remotely hosted code is executed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Is Stored, and Where</h2>
              <p>
                Everything is kept in Chrome&rsquo;s local extension storage on your own machine:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>MOT lookup results, cached for 7 days to avoid repeat requests</li>
                <li>your shortlist, and the search postcode, radius and budget you last used</li>
              </ul>
              <p className="mt-4">
                Cached lookups are clearable from the settings page, and the shortlist from the
                popup. Removing the extension deletes all of it. Nothing is stored in the cloud, and
                nothing is synced between devices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Permissions, and Why Each Is Needed
              </h2>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li>
                  <strong>
                    <code>storage</code>:
                  </strong>{' '}
                  cache lookups and hold your shortlist and search settings locally.
                </li>
                <li>
                  <strong>
                    <code>offscreen</code>:
                  </strong>{' '}
                  run the bundled OCR engine in an extension document, so image processing stays off
                  the web page.
                </li>
                <li>
                  <strong>
                    <code>activeTab</code>:
                  </strong>{' '}
                  let the popup act on the tab you are looking at.
                </li>
                <li>
                  <strong>
                    Host access to <code>autotrader.co.uk</code>:
                  </strong>{' '}
                  display the panel on adverts.
                </li>
                <li>
                  <strong>
                    Host access to <code>atcdn.co.uk</code>:
                  </strong>{' '}
                  fetch the advert&rsquo;s own photographs so the plate can be read on your machine.
                </li>
                <li>
                  <strong>
                    Host access to <code>check-mot.service.gov.uk</code>:
                  </strong>{' '}
                  read the public MOT history.
                </li>
                <li>
                  <strong>
                    Host access to <code>opendata.rdw.nl</code>:
                  </strong>{' '}
                  read the Dutch register&rsquo;s public APK and defect records.
                </li>
                <li>
                  <strong>
                    Host access to <code>vpic.nhtsa.dot.gov</code> and <code>api.nhtsa.gov</code>:
                  </strong>{' '}
                  decode a VIN and read the safety recalls and complaints published against that
                  model.
                </li>
                <li>
                  <strong>
                    <code>geolocation</code>:
                  </strong>{' '}
                  fill in the postcode a search is centred on, on request.
                </li>
                <li>
                  <strong>
                    Host access to <code>api.postcodes.io</code>:
                  </strong>{' '}
                  turn those coordinates into a postcode.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Sources</h2>
              <p>
                MOT and vehicle data are published by the Driver and Vehicle Standards Agency under
                the{' '}
                <a
                  href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Open Government Licence v3.0
                </a>
                . Dutch vehicle, APK and defect data is published by RDW as open data. American
                vehicle, recall and complaint data is published by the National Highway Traffic
                Safety Administration as a work of the United States government.
              </p>
              <p className="mt-2">
                BumBoo is not affiliated with, endorsed by, or connected to DVSA, GOV.UK, RDW,
                NHTSA, Auto Trader or any other site or service it reads.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What We Do NOT Do</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No analytics, no tracking, no telemetry.</li>
                <li>No accounts, no sign-in, no user profiles.</li>
                <li>
                  No selling, sharing, or sending of any data to the developer or anyone else.
                </li>
                <li>No ads, and no remotely hosted code.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Children</h2>
              <p>BumBoo is not directed at children and collects no information from anyone.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
              <p>
                Any change to this policy will be published on this page and alongside the
                extension, and reflected in the &ldquo;Last Updated&rdquo; date below.
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

            <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
              Last Updated: {LAST_UPDATED}
            </div>
          </div>
        </div>
      </div>

      <LegalPageFooter />
    </div>
  );
}
