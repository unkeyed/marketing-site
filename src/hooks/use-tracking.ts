'use client';

import { useCallback } from 'react';
import { track as databuddyTrack } from '@databuddy/sdk';
import { track as vercelTrack } from '@vercel/analytics';
import { useConsent } from 'c15t/next';

type TrackParams = Parameters<typeof vercelTrack>;

const databuddyEnabled = Boolean(process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID);

/**
 * Returns a track function that only sends events to Vercel Analytics and Databuddy when the user has given analytics cookie consent.
 */
export function useTrack() {
  const hasMarketing = useConsent('marketing');
  const hasConsent = hasMarketing;

  return useCallback(
    (...args: TrackParams) => {
      if (!hasConsent) {
        return;
      }
      vercelTrack(...args);
      // Without a client ID the tracker script never loads, and the SDK queues calls then warns after 15s.
      if (databuddyEnabled) {
        const [name, properties] = args;
        databuddyTrack(name, properties);
      }
    },
    [hasConsent],
  );
}
