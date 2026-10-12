'use client';

import { ConsentBanner as C15tConsentBanner, ConsentDialog } from 'c15t/next';

export function ConsentBanner() {
  return (
    <>
      <C15tConsentBanner trapFocus={false} customizeButtonText="Cookie settings" />
      <ConsentDialog />
    </>
  );
}
