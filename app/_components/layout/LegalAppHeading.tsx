import Image from 'next/image';

/**
 * The app's own mark beside the title of its legal page.
 *
 * The four app privacy policies each opened with the product name set in plain
 * text, which made them indistinguishable at a glance and left the reader
 * trusting the URL to tell them whose policy they had landed on. One component
 * so the size and the spacing cannot drift apart between them.
 *
 * No plate or tile behind the mark. These icons are already square artwork
 * carrying their own padding, and a container behind them only shrinks the one
 * thing the reader is trying to recognise.
 *
 * alt is deliberately empty: the name sits immediately beside it, so a screen
 * reader announcing the icon as well would read the product name twice.
 */
export function LegalAppHeading({
  icon,
  name,
  tagline,
}: {
  /** File name inside /public/imgs/apps, e.g. 'minutely.png'. */
  icon: string;
  name: string;
  tagline?: string;
}) {
  return (
    <>
      <div className="flex items-center gap-4 mb-2">
        <Image
          src={`/imgs/apps/${icon}`}
          alt=""
          width={56}
          height={56}
          className="w-14 h-14 shrink-0"
        />
        <h1 className="text-4xl font-bold text-white">{name}: Privacy Policy</h1>
      </div>
      {tagline ? <p className="text-gray-400 mb-2">{tagline}</p> : null}
    </>
  );
}
