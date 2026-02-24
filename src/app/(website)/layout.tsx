import type { Viewport } from 'next';
import { Inter } from 'next/font/google';
import config from '@/configs/website-config';
import { MENUS } from '@/constants/menus';
import { Providers } from '@/contexts';

import Footer from '@/components/footer';
import Header from '@/components/header';

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: config.metaThemeColors.light,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <body
        className={`flex min-h-svh flex-col bg-background ${inter.variable} font-sans antialiased`}
      >
        <Providers>
          <div
            className="flex grow flex-col rounded-none bg-background aria-hidden:[-webkit-mask-image:-webkit-radial-gradient(white,black)]"
            vaul-drawer-wrapper=""
          >
            <Header menuItems={MENUS.header} />
            <div className="grow">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </>
  );
}
