'use client';

/**
 * The phone-snapshot strip: every app in the catalogue that ships a real mobile
 * UI, shown as a screenshot in a device frame.
 *
 * Deliberately screenshots rather than a rebuilt mockup — these are shipped
 * apps, so the honest thing to show is what the app actually looks like. The
 * generated multiscreen mockup (PhoneDemo, in spark-stack and the SparkMobile
 * site) is for previewing an app that does not exist yet.
 *
 * Renders nothing until an app has a `mobile` entry with its screenshot in
 * place, so a missing PNG degrades to an absent section rather than a broken
 * image on the landing page. The entry alone is not enough: the data lands in
 * apps.ts before the PNG does, so a frame that fails to load drops itself and
 * the section goes with the last one.
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { PhoneSnapshot } from '@/app/_components/ui/PhoneSnapshot';
import { sparkApps } from '@/lib/data/apps';

export function MobileShowcase() {
  const [missing, setMissing] = useState<string[]>([]);
  const apps = sparkApps.filter((app) => app.mobile && !missing.includes(app.id));
  if (apps.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">In your pocket</h2>
          <p className="mt-2 text-sm text-gray-400">
            The apps you can install, exactly as they look on a phone.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-start justify-center gap-10 sm:gap-14">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <PhoneSnapshot
                src={app.mobile?.screenshot ?? ''}
                alt={app.mobile?.alt ?? app.name}
                accent={app.mobile?.accent}
                caption={app.mobile?.caption}
                width={240}
                height={486}
                pan
                onError={() => setMissing((prev) => [...prev, app.id])}
              />
              <p className="mt-4 text-sm font-semibold text-white">{app.name}</p>
              <p className="text-[11px] text-gray-500">{app.tagline}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
