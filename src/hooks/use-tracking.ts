'use client';

import { useCallback } from 'react';
import { useConsentManager } from '@c15t/nextjs';
import { track as vercelTrack } from '@vercel/analytics';

type TrackParams = Parameters<typeof vercelTrack>;

/**
 * Returns a track function that only sends events to Vercel Analytics when the user has given analytics cookie consent.
 */
export function useTrack() {
  const { hasConsentFor } = useConsentManager();
  const hasConsent = hasConsentFor('measurement');

  return useCallback(
    (...args: TrackParams) => {
      if (hasConsent) {
        vercelTrack(...args);
      }
    },
    [hasConsent],
  );
}
