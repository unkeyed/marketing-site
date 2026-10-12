'use client';

import { useEffect } from 'react';

const BANNER_SELECTOR = '[data-testid="consent-banner-root"]';

function bannerOffset() {
  const banner = document.querySelector(BANNER_SELECTOR);
  if (!(banner instanceof HTMLElement)) {
    return 0;
  }

  const style = getComputedStyle(banner);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    banner.getAttribute('aria-hidden') === 'true'
  ) {
    return 0;
  }

  return Math.ceil(banner.getBoundingClientRect().height);
}

/**
 * Reserves the open banner's height so fixed positioning cannot cover the page.
 */
export function ConsentBannerOffset() {
  useEffect(() => {
    const root = document.documentElement;
    const resizeObserver = new ResizeObserver(() => {
      schedule();
    });
    let frame = 0;

    const measure = () => {
      const banner = document.querySelector(BANNER_SELECTOR);
      resizeObserver.disconnect();
      if (banner instanceof HTMLElement) {
        resizeObserver.observe(banner);
      }
      root.style.setProperty('--consent-banner-offset', `${bannerOffset()}px`);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-hidden', 'class', 'hidden'],
      childList: true,
      subtree: true,
    });
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      root.style.removeProperty('--consent-banner-offset');
    };
  }, []);

  return null;
}
