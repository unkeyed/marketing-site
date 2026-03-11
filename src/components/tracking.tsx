'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';

import { isAnalyticsEnabledByEnv, useHasAnalyticsConsent } from '@/hooks/use-tracking';

export function Tracking() {
  const [isMounted, setIsMounted] = useState(false);
  const hasConsentForMeasurement = useHasAnalyticsConsent();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isAnalyticsEnabledByEnv || !hasConsentForMeasurement) {
    return null;
  }

  return <Analytics />;
}
