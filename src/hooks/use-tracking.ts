'use client';

import { useCallback } from 'react';
import { useCookieContext } from '@/contexts/cookie-banner-context';
import { track as vercelTrack } from '@vercel/analytics';

const ANALYTICS_CONSENT_KEY = 'analytics';

/** When unset or not "true", analytics is disabled (no script, no events). */
export const isAnalyticsEnabledByEnv = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

export function useHasAnalyticsConsent(): boolean {
  const { checkboxValues } = useCookieContext();
  const analyticsConsent = checkboxValues.find((item) => item.value === ANALYTICS_CONSENT_KEY);
  return analyticsConsent?.isChecked ?? false;
}

type TrackParams = Parameters<typeof vercelTrack>;

/**
 * Returns a track function that only sends events to Vercel Analytics when
 * NEXT_PUBLIC_ANALYTICS_ENABLED is "true" and the user has given analytics cookie consent.
 */
export function useTrack() {
  const hasConsent = useHasAnalyticsConsent();
  return useCallback(
    (...args: TrackParams) => {
      if (isAnalyticsEnabledByEnv && hasConsent) {
        vercelTrack(...args);
      }
    },
    [hasConsent],
  );
}
