import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const socialPreviewImage = "/og-images/social-preview.jpg";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unkey",
  description:
    "Unkey brings API deployment, gateways, and observability into one platform.",
  icons: {
    icon: [
      {
        url: "/favicon/favicon-light.svg",
        media: "(prefers-color-scheme: light)",
        type: "image/svg+xml",
      },
      {
        url: "/favicon/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Unkey",
    description:
      "Unkey brings API deployment, gateways, and observability into one platform.",
    images: [socialPreviewImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unkey",
    description:
      "Unkey brings API deployment, gateways, and observability into one platform.",
    images: [socialPreviewImage],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      nocache: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ido5ixw.css" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
