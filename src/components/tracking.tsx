'use client';

import { useEffect, useState } from 'react';
import { useConsentManager } from '@c15t/nextjs';
import { Analytics } from '@vercel/analytics/next';

export function Tracking() {
  const [isMounted, setIsMounted] = useState(false);
  const { has } = useConsentManager();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !has('marketing')) {
    return null;
  }

  return <Analytics />;
}
