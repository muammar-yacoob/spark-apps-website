'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import PageLoader from './PageLoader';

type NavContextType = { startLoading: () => void };

const NavContext = createContext<NavContextType>({ startLoading: () => {} });

export function useNavLoading() {
  return useContext(NavContext);
}

export function NavigationLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const mounted = useRef(false);

  // Clear loading state once the new route's pathname is committed
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, not consumed in the body
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setLoading(false);
  }, [pathname]);

  return (
    <NavContext.Provider value={{ startLoading: () => setLoading(true) }}>
      {loading && (
        <div className="fixed inset-0 z-[9999]">
          <PageLoader />
        </div>
      )}
      {children}
    </NavContext.Provider>
  );
}
