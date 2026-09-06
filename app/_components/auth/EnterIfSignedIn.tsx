'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

/**
 * Signed in, the landing page is not where you meant to be - go to the
 * dashboard.
 *
 * Same destination the header control and the hero CTA already take, so a
 * visit that arrives with a session in hand ends up where the click would
 * have put it anyway.
 *
 * Client-side rather than a server redirect, so / stays statically rendered
 * for the signed-out visitors the pitch is actually for. replace() rather
 * than assign(), or Back out of the dashboard would bounce straight in again.
 * `?stay` opts out, so pricing and the rest of the pitch stay reachable to
 * someone signed in who came to read them.
 *
 * Carries its own SessionProvider, like DashboardCta: the landing page sits
 * outside the providers the dashboard mounts.
 */
function Redirect({ to }: { to: string }) {
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (new URLSearchParams(window.location.search).has('stay')) return;
    window.location.replace(to);
  }, [status, to]);

  return null;
}

export function EnterIfSignedIn({ to = '/dashboard' }: { to?: string }) {
  // Mounted from the landing page only, but guarded anyway: a session fetch
  // on every other route would be a cost for nothing.
  const [onLanding, setOnLanding] = useState(false);
  useEffect(() => setOnLanding(window.location.pathname === '/'), []);
  if (!onLanding) return null;

  return (
    <SessionProvider>
      <Redirect to={to} />
    </SessionProvider>
  );
}
