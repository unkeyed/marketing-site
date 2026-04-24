'use client';

import { ConsentBanner as C15tConsentBanner, ConsentDialog } from '@c15t/nextjs';

export function ConsentBanner() {
  return (
    <>
      <C15tConsentBanner trapFocus={false} customizeButtonText="Cookie settings" />
      <ConsentDialog />
    </>
  );
}
