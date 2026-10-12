'use client';

import { ConsentBanner as C15tConsentBanner, ConsentDialog } from 'c15t/next';

import '@/styles/consent-banner.css';

/**
 * Title, disclosure, and the policy's buttons on one row.
 * Compound parts keep the actions the active policy requires.
 */
export function ConsentBanner() {
  return (
    <>
      <C15tConsentBanner.Root
        variant="bar"
        position="bottom"
        blocking={false}
        trapFocus={false}
        className="z-40 p-0"
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
