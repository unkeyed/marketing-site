'use client';

import { useEffect } from 'react';
import { ConsentBanner as C15tConsentBanner, ConsentDialog } from 'c15t/next';

import '@/styles/consent-banner.css';

const BANNER_ROOT = '[data-testid="consent-banner-root"]';

/**
 * Title, disclosure, and the policy's buttons on one row.
 * Compound parts keep the actions the active policy requires.
 */
export function ConsentBanner() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest('button[data-action]');
      const root = button?.closest(BANNER_ROOT);
      if (!(button instanceof HTMLButtonElement) || !(root instanceof HTMLElement)) {
        return;
      }

      const clone = root.cloneNode(true);
      if (!(clone instanceof HTMLElement)) {
        return;
      }

      clone.removeAttribute('data-testid');
      clone.querySelectorAll('[data-testid]').forEach((node) => {
        node.removeAttribute('data-testid');
      });
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      clone.style.animation = 'none';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);
      root.style.visibility = 'hidden';
      clone.getBoundingClientRect();
      clone.dataset.closing = 'true';

      const remove = () => {
        clone.remove();
      };
      clone.addEventListener('transitionend', (transitionEvent) => {
        if (transitionEvent.target === clone && transitionEvent.propertyName === 'transform') {
          remove();
        }
      });
      window.setTimeout(remove, 500);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return (
    <>
      <C15tConsentBanner.Root
        variant="bar"
        position="bottom"
        blocking={false}
        trapFocus={false}
        className="consent-banner-root p-0"
      >
        <C15tConsentBanner.Card className="consent-bar">
          <C15tConsentBanner.Header className="consent-bar__text">
            <C15tConsentBanner.Title className="consent-bar__title" />
            <C15tConsentBanner.Description className="consent-bar__description" />
          </C15tConsentBanner.Header>
          <C15tConsentBanner.PolicyActions />
        </C15tConsentBanner.Card>
      </C15tConsentBanner.Root>
      <ConsentDialog />
    </>
  );
}
