'use client';

import type { ReactNode } from 'react';
import { ConsentProvider as C15tConsentProvider } from 'c15t/next';
import { hosted, offline } from 'c15t/react';

import { consentTheme } from '@/lib/consent-theme';

const isHostedMode = process.env.NEXT_PUBLIC_C15T_MODE === 'hosted';

export function ConsentProvider({ children }: { children: ReactNode }) {
  return (
    <C15tConsentProvider
      options={{
        mode: isHostedMode
          ? hosted({ backendURL: 'https://production-unkey.inth.app/' })
          : offline(),
        networkBlocker: {
          rules: [
            { domain: 'unpkg.com', category: 'necessary' },
            { domain: 'cdn.jsdelivr.net', category: 'necessary' },
          ],
        },
        colorScheme: 'dark',
        consentCategories: ['necessary', 'marketing'],
        theme: consentTheme,
      }}
    >
      {children}
    </C15tConsentProvider>
  );
}
