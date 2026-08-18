import type { CSSProperties } from 'react';

/**
 * The SparkAds cross-promo unit, defined by the bundle at
 * `https://sparkads.dev/embed.js` rather than by anything in this repository.
 *
 * Declared here because a custom element is invisible to TypeScript's JSX
 * checker: there is no import that would introduce it, which is the whole
 * point of the thing. The attributes below are the element's entire contract;
 * see `app/_components/ads/SparkAdsCarousel.tsx` for the one place it is
 * mounted.
 */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'spark-ads-carousel': {
        /** This app's SparkPay app_id. Also the key SparkAds files every beacon under. */
        app: string;
        /** The heading drawn above the carousel. */
        title?: string;
        /** Names the carousel for assistive tech. Defaults to a sensible line. */
        label?: string;
        style?: CSSProperties;
      };
    }
  }
}
