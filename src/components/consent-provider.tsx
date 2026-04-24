'use client';

import type { ReactNode } from 'react';
import { ConsentManagerProvider } from '@c15t/nextjs';

const isC15tMode = process.env.NEXT_PUBLIC_C15T_MODE === 'c15t';

const acceptButtonClassName =
  'inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-none px-5 text-sm font-medium bg-foreground text-background hover:bg-gray-90 sm:min-w-28 sm:flex-none';
const rejectButtonClassName =
  'inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-none border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground px-5 text-sm font-medium sm:min-w-28 sm:flex-none';

const brandColors = {
  surface: 'var(--color-popover)',
  surfaceHover: 'var(--color-popover)',
  border: 'var(--color-border)',
  borderHover: 'var(--color-border)',
  text: 'var(--color-foreground)',
  textMuted: 'var(--color-muted-foreground)',
  primary: 'var(--color-foreground)',
  primaryHover: 'var(--color-gray-90)',
  textOnPrimary: 'var(--color-background)',
  overlay: 'hsla(0, 0%, 0%, 0.5)',
  switchTrack: 'var(--color-gray-30)',
  switchTrackActive: 'var(--color-foreground)',
  switchThumb: 'var(--color-foreground)',
} as const;

export function ConsentProvider({ children }: { children: ReactNode }) {
  return (
    <ConsentManagerProvider
      options={{
        ...(isC15tMode ? { mode: 'hosted', backendURL: '/api/c15t' } : { mode: 'offline' }),
        networkBlocker: {
          rules: [
            { domain: 'unpkg.com', category: 'necessary' },
            { domain: 'cdn.jsdelivr.net', category: 'necessary' },
          ],
        },
        colorScheme: 'dark',
        consentCategories: ['necessary', 'marketing'],
        theme: {
          radius: { sm: '0', md: '0', lg: '0', full: '0' },
          colors: brandColors,
          dark: brandColors,
          consentActions: {
            accept: { variant: 'primary', mode: 'stroke' },
            reject: { variant: 'neutral', mode: 'stroke' },
            customize: { variant: 'neutral', mode: 'ghost' },
          },
          slots: {
            consentBannerCard: { className: 'rounded-none bg-popover' },
            consentBannerFooter: {
              className: 'bg-transparent border-none shadow-none',
            },
            consentBannerDescription: { className: 'text-sm text-muted-foreground' },
            consentBannerTag: { className: 'hidden' },
            consentDialogCard: { className: 'rounded-none bg-popover' },
            consentDialogTag: { className: 'hidden' },
            consentWidgetAccordion: { className: 'rounded-none' },
            consentWidgetTag: { className: 'hidden' },
            buttonPrimary: { className: acceptButtonClassName, noStyle: true },
            buttonSecondary: { className: rejectButtonClassName, noStyle: true },
          },
        },
      }}
    >
      {children}
    </ConsentManagerProvider>
  );
}
