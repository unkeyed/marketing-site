'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { useConsent } from 'c15t/next';

export function Tracking() {
  const [isMounted, setIsMounted] = useState(false);
  const hasMarketing = useConsent('marketing');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !hasMarketing) {
    return null;
  }

  return <Analytics />;
}
