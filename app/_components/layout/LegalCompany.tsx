import Image from 'next/image';

/**
 * The registered entity behind this app, shown on the legal pages.
 *
 * The data controller under UK GDPR is the legal person, not the product — so
 * these pages name the company, not the app. Kept in one place so the name,
 * number and link can never drift between the privacy policy and the terms.
 * Verified against Companies House: SPARK GAMES LTD, no. 15379140.
 */
export const COMPANY_NAME = 'Spark Games Ltd';
export const COMPANY_NUMBER = '15379140';
export const COMPANY_URL = 'https://spark-apps.co/';

/** The company name as a link back to the company site. */
export function LegalCompanyName() {
  return (
    <a
      href={COMPANY_URL}
      target="_blank"
      rel="noreferrer"
      className="text-blue-400 hover:text-blue-300 underline"
    >
      {COMPANY_NAME}
    </a>
  );
}

/** Company mark + name, sits under the page title on the legal pages. */
export function LegalCompanyByline() {
  return (
    <a
      href={COMPANY_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 mb-8 text-sm text-gray-400 hover:text-white transition-colors"
    >
      <Image src="/spark-games.png" alt="" width={28} height={28} className="rounded" />
      <span>
        {COMPANY_NAME} &middot; company no. {COMPANY_NUMBER}
      </span>
    </a>
  );
}
