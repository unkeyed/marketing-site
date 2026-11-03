'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { pageScrollTo } from '@/lib/page-scroll';

export function useNavigationScrollReset() {
  const pathname = usePathname();
  const pendingDestination = useRef<string | null>(null);

  // Next.js resets the document scroll, but this layout scrolls inside #page-scroll.
  useEffect(() => {
    if (pendingDestination.current === pathname) {
      pageScrollTo({ top: 0, behavior: 'instant' });
    }
    pendingDestination.current = null;
  }, [pathname]);

  return (href: string) => {
    if (!href.startsWith('/') || href.startsWith('//') || href.includes('#')) return {};

    const destination = href.split('?')[0];

    return {
      scroll: false,
      onNavigate: () => {
        if (pathname === destination) {
          pageScrollTo({ top: 0, behavior: 'instant' });
        } else {
          pendingDestination.current = destination;
        }
      },
    };
  };
}
