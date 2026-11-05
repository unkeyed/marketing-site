'use client';

import { useEffect, useState } from 'react';
import { Databuddy } from '@databuddy/sdk/react';
import { Analytics } from '@vercel/analytics/next';
import { useConsent } from 'c15t/next';

const databuddyClientId = process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID;

export function Tracking() {
  const [isMounted, setIsMounted] = useState(false);
  const hasMarketing = useConsent('marketing');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !hasMarketing) {
    return null;
  }

  return (
    <>
      <Analytics />
      {databuddyClientId && <Databuddy clientId={databuddyClientId} trackWebVitals trackErrors />}
    </>
  );
}
