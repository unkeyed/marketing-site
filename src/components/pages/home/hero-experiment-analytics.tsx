'use client';

import { useEffect } from 'react';
import { APP_URL } from '@/configs/website-config';

import type { HomepageHeroVariant } from '@/lib/homepage-hero';
import { useTrack } from '@/hooks/use-tracking';

function pathnameOf(href: string): string {
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return href;
  }
}

export function HeroExperimentAnalytics({
  variant,
  founderCallHref,
}: {
  variant: HomepageHeroVariant;
  founderCallHref: string;
}) {
  const track = useTrack();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';
      const label = anchor.textContent?.trim() ?? '';
      const heroSection = document.querySelector('main > section');
      const flags = { flags: ['homepage-hero'] };

      if (label === 'Start for free' && href === APP_URL && heroSection?.contains(anchor)) {
        track('signup', { location: 'homepage-hero', variant }, flags);
        return;
      }

      if (href === founderCallHref && heroSection?.contains(anchor)) {
        track('founder_call_click', { location: 'homepage-hero', variant }, flags);
        return;
      }

      const pathname = pathnameOf(href);
      if (pathname === '/pricing' || pathname.startsWith('/pricing/')) {
        track('pricing_click', { location: 'homepage', variant }, flags);
        return;
      }

      if (pathname === '/docs' || pathname.startsWith('/docs/')) {
        track('docs_click', { location: 'homepage', variant }, flags);
      }
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [founderCallHref, track, variant]);

  return null;
}
