import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import '@/styles/globals.css';

import { Inter, JetBrains_Mono } from 'next/font/google';
import { getMetadata } from '@/lib/get-metadata';

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

const baseMetadata = getMetadata({
  title: 'Unkey',
  description: 'Unkey brings API deployment, gateways, and observability into one platform.',
  pathname: '/',
});

export const metadata: Metadata = {
  ...baseMetadata,
  manifest: '/favicon/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      {
        url: '/favicon/favicon-light.svg',
        media: '(prefers-color-scheme: light)',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon/favicon-dark.svg',
        media: '(prefers-color-scheme: dark)',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // suppressHydrationWarning added according to https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ido5ixw.css" />
      </head>
      <body
        className={`bg-background ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
