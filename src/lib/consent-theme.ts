import { defineTheme } from 'c15t/next';

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

const consentButtonClassName =
  'inline-flex h-9 shrink-0 items-center justify-center border border-foreground bg-transparent px-3 text-sm font-medium tracking-tight whitespace-nowrap text-foreground hover:bg-gray-12 sm:px-4';

const acceptButtonClassName =
  'inline-flex h-9 shrink-0 items-center justify-center border border-foreground bg-foreground px-3 text-sm font-medium tracking-tight whitespace-nowrap text-background hover:bg-gray-90 sm:px-4';

/**
 * Brand tokens, action styles, and slot classes for the consent UI.
 * `ConsentTheme` renders the tokens. The provider still reads
 * `consentActions` and `slots` from this same object.
 */
export const consentTheme = {
  ...defineTheme({
    radius: { sm: '0', md: '0', lg: '0', full: '0' },
    colors: brandColors,
    dark: brandColors,
  }),
  consentActions: {
    accept: { variant: 'neutral', mode: 'stroke' },
    reject: { variant: 'neutral', mode: 'stroke' },
    customize: { variant: 'neutral', mode: 'stroke' },
  },
  slots: {
    consentBannerTag: { className: 'hidden' },
    consentDialogCard: { className: 'rounded-none bg-popover' },
    consentDialogTag: { className: 'hidden' },
    consentWidgetAccordion: { className: 'rounded-none' },
    consentWidgetTag: { className: 'hidden' },
    buttonPrimary: { className: acceptButtonClassName, noStyle: true },
    buttonSecondary: { className: consentButtonClassName, noStyle: true },
  },
} as const;
