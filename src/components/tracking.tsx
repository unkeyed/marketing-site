'use client';

import { useEffect, useState } from 'react';
import { useConsentManager } from '@c15t/nextjs';
import { Analytics } from '@vercel/analytics/next';

export function Tracking() {
  const [isMounted, setIsMounted] = useState(false);
  const { hasConsentFor } = useConsentManager();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !hasConsentFor('measurement')) {
    return null;
  }

  return <Analytics />;
}
