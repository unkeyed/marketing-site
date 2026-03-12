import type { ReactNode } from 'react';
import type { Viewport } from 'next';
// import { cookieBanner } from '@/configs/cookie-banner-config';
import config from '@/configs/website-config';
import { MENUS } from '@/constants/menus';

// import CookieBanner from '@/components/cookie-banner';
import Footer from '@/components/footer';
import Header from '@/components/header';

export const viewport: Viewport = {
  themeColor: config.metaThemeColors.light,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div
      className="flex min-h-svh grow flex-col rounded-none bg-background aria-hidden:[-webkit-mask-image:-webkit-radial-gradient(white,black)]"
      vaul-drawer-wrapper=""
    >
      <Header menuItems={MENUS.header} />
      <div className="grow">{children}</div>
      <Footer />
      {/* <CookieBanner
        description={cookieBanner.description}
        allowSettingsCustomization={cookieBanner.allowSettingsCustomization}
        isInitiallyExpanded={cookieBanner.isInitiallyExpanded}
      />*/}
    </div>
  );
}
