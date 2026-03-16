import type { ReactNode } from 'react';

import '@/styles/globals.css';

import { Inter, JetBrains_Mono } from 'next/font/google';
import { ConsentManagerProvider } from '@c15t/nextjs';

import { ConsentBanner } from '@/components/cookie-banner/consent-banner';
import { Tracking } from '@/components/tracking';

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // suppressHydrationWarning added according to https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://use.typekit.net/af/2c0cee/000000000000000077524f49/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.typekit.net/tcb4uyw.css" />
      </head>
      <body
        className={`bg-background ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ConsentManagerProvider
          options={{
            ...(process.env.NEXT_PUBLIC_C15T_MODE
              ? { mode: 'c15t', backendURL: '/api/c15t' }
              : { mode: 'offline' }),
            react: {
              colorScheme: 'dark',
            },
          }}
        >
          {children}
          <Tracking />
          <ConsentBanner />
        </ConsentManagerProvider>
      </body>
    </html>
  );
}
