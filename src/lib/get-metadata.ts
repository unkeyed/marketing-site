import { Metadata as NextMetadata } from 'next';
import config from '@/configs/website-config';

import { toAbsoluteSiteUrl } from '@/lib/site-url';

// Pass `title` → "{title} | Unkey". Pass `tagline` (hero pages) → "Unkey | {tagline}".
type Metadata = {
  title?: string;
  tagline?: string;
  description: string;
  pathname: string;
  imagePath?: string;
  type?: string;
  noIndex?: boolean;
};

export function getMetadata({
  title,
  tagline,
  description,
  pathname,
  imagePath = config.defaultSocialImage,
  type = 'website',
  noIndex = false,
}: Metadata) {
  const canonicalUrl = toAbsoluteSiteUrl(pathname);
  const imageUrl = imagePath.startsWith('http') ? imagePath : toAbsoluteSiteUrl(imagePath);
  const siteName = `${config.projectName.slice(0, 1).toUpperCase()}${config.projectName.slice(1)}`;
  const fullTitle = tagline ? `${siteName} | ${tagline}` : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
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
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} social preview`,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex ? 'noindex' : undefined,
  } as NextMetadata;
}
