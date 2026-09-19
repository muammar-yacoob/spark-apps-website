'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

/**
 * An app's demo Short, in a phone-shaped frame.
 *
 * Every demo in the portfolio is a 9:16 YouTube Short, so the frame is
 * portrait: a landscape shell around a portrait video is mostly black bars.
 *
 * ## Why a facade rather than an iframe on load
 *
 * A YouTube embed costs roughly half a megabyte of script and a handful of
 * third-party cookies before anyone has decided to watch anything, and this
 * page is one of twenty-odd static app pages that are otherwise nearly free
 * to serve. So the frame holds a still and a play button, and the iframe is
 * mounted only once someone presses it - at which point `autoplay=1` starts
 * it immediately, so the click still does what a play button should.
 *
 * The still is the app's own icon on the page's own background rather than
 * YouTube's thumbnail: there is no per-app poster export in this repo, the
 * icon is already here at the right size, and it keeps the whole frame
 * same-origin. A YouTube outage therefore costs a click that does nothing,
 * never a broken page.
 *
 * Each app has one cut, so `playlist` names it again rather than naming a
 * second: that is the documented way to make `loop` work on a single video,
 * and it is what sends the clip back to its own first frame instead of to an
 * end screen of somebody else's videos.
 *
 * The plain link underneath is deliberate. It is the crawlable one - an
 * iframe that only exists after a click is invisible to anything reading the
 * page - and it is the way out for anyone who would rather watch on YouTube.
 */
export function DemoVideo({
  videoId,
  appName,
  icon,
}: {
  videoId: string;
  appName: string;
  icon: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mt-14 flex flex-col items-center">
      <h2 className="text-sm font-semibold text-white/90 tracking-wide">
        See {appName} in under a minute
      </h2>

      <div className="relative mt-5 group">
        {/* Soft halo, sat behind the frame so the rounded corners stay crisp. */}
        <div
          aria-hidden="true"
          className="absolute -inset-6 rounded-[2.5rem] bg-white/[0.06] blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative w-[240px] sm:w-[280px] aspect-[9/16] rounded-[2rem] overflow-hidden border border-white/[0.14] bg-black shadow-2xl shadow-black/60 ring-1 ring-inset ring-white/[0.06]">
          {playing ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?playlist=${videoId}&loop=1&autoplay=1&rel=0&playsinline=1`}
              title={`${appName} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play the ${appName} demo`}
              className="absolute inset-0 w-full h-full cursor-pointer bg-gradient-to-b from-gray-900 to-black"
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-30">
                <Image src={icon} alt="" width={160} height={160} className="rounded-[2rem]" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex size-12 sm:size-14 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-play-radiate" />
                  <span className="absolute inset-0 rounded-full bg-white/30 blur-xl scale-150 transition-transform duration-700 ease-out group-hover:scale-[2.2]" />
                  <span className="relative flex size-full items-center justify-center rounded-full border-[3px] border-black/15 bg-white/95 text-black shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:brightness-110">
                    <span className="flex translate-x-[4.2%]">
                      <span className="flex animate-play-turn [transform-origin:45.8%_50%]">
                        <Play
                          className="size-5 sm:size-6 transition-transform duration-300 group-hover:scale-125"
                          fill="currentColor"
                          suppressHydrationWarning
                        />
                      </span>
                    </span>
                  </span>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <a
        href={`https://www.youtube.com/shorts/${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
      >
        Watch on YouTube
      </a>
    </div>
  );
}
