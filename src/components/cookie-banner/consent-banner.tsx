import { ConsentManagerDialog, CookieBanner } from '@c15t/nextjs';

const acceptButtonClassName =
  'inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-none px-5 text-sm font-medium bg-foreground text-background hover:bg-gray-90 sm:min-w-28 sm:flex-none';
const rejectButtonClassName =
  'inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-none border border-input bg-background hover:bg-accent hover:text-accent-foreground px-5 text-sm font-medium sm:min-w-28 sm:flex-none';
const customizeButtonClassName =
  'inline-flex h-10 items-center justify-center gap-2 px-0 text-center text-sm font-medium text-foreground underline decoration-muted-foreground underline-offset-[0.375rem] hover:decoration-foreground sm:justify-start sm:text-left';
const bannerCardClassName = '!bg-popover rounded-none';
const bannerFooterClassName = '!bg-transparent !border-none !shadow-none';

const bannerTheme = {
  'banner.card': {
    className: bannerCardClassName,
  },
  'banner.footer': {
    className: bannerFooterClassName,
  },
  'banner.header.description': {
    className: '!text-sm !text-muted-foreground',
  },
  'banner.footer.customize-button': {
    className: customizeButtonClassName,
    noStyle: true,
  },
  'banner.footer.reject-button': {
    className: rejectButtonClassName,
    noStyle: true,
  },
  'banner.footer.accept-button': {
    className: acceptButtonClassName,
    noStyle: true,
  },
} as const;

// Dialog theme (semantic tokens)
const themeColors = {
  bgColor: 'hsl(var(--popover))',
  bgColorDark: 'hsl(var(--popover))',
  primaryColor: 'var(--color-foreground)',
  get focusRing() {
    return `${this.primaryColor} !important`;
  },
  get focusShadow() {
    return `0 0 0 2px ${this.primaryColor}`;
  },
} as const;

export function ConsentBanner() {
  const { bgColor, bgColorDark, primaryColor, focusRing, focusShadow } = themeColors;

  return (
    <>
      <CookieBanner
        trapFocus={false}
        customizeButtonText="Cookie settings"
        theme={bannerTheme}
      />
      <ConsentManagerDialog
        theme={{
          'dialog.root': {
            style: {
              '--accordion-focus-ring-dark': focusRing,
              '--accordion-focus-ring': focusRing,
              '--accordion-focus-shadow-dark': focusShadow,
              '--accordion-focus-shadow': focusShadow,
              '--dialog-background-color-dark': bgColorDark,
              '--dialog-background-color': bgColor,
              '--dialog-branding-focus-color-dark': `var(--button-shadow), inset 0 0 0 1px ${primaryColor}`,
              '--dialog-branding-focus-color': `var(--button-shadow), inset 0 0 0 1px ${primaryColor}`,
              '--dialog-footer-background-color-dark': bgColorDark,
              '--switch-background-color-checked-dark': primaryColor,
              '--switch-background-color-checked': primaryColor,
              '--switch-background-color-unchecked-dark': bgColorDark,
              '--switch-background-color-unchecked': bgColor,
              '--switch-focus-shadow-dark': focusShadow,
              '--switch-focus-shadow': focusShadow,
              '--widget-accordion-background-color-dark': bgColorDark,
              '--widget-accordion-background-color': bgColor,
            },
          },
          'dialog.card': {
            className: '!bg-popover rounded-none',
          },
          'widget.accordion.item': {
            className: '!rounded-none',
          },
          'widget.accordion.trigger-inner': {
            className:
              'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:transition-none',
          },
          'widget.footer.accept-button': {
            className: rejectButtonClassName,
            noStyle: true,
          },
          'widget.footer.reject-button': {
            className: rejectButtonClassName,
            noStyle: true,
          },
          'widget.footer.save-button': {
            className: acceptButtonClassName,
            noStyle: true,
          },
        }}
      />
    </>
  );
}
