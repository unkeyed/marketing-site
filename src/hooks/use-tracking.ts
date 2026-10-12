'use client';

import { useCallback } from 'react';
import { track as vercelTrack } from '@vercel/analytics';
import { useConsent } from 'c15t/next';

type TrackParams = Parameters<typeof vercelTrack>;

/**
 * Returns a track function that only sends events to Vercel Analytics when the user has given analytics cookie consent.
 */
export function useTrack() {
  const hasMarketing = useConsent('marketing');
  const hasConsent = hasMarketing;

  return useCallback(
    (...args: TrackParams) => {
      if (hasConsent) {
        vercelTrack(...args);
      }
    },
    [hasConsent],
  );
}
