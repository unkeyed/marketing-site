import { Metadata as NextMetadata } from 'next';
import config from '@/configs/website-config';

/**
 * Metadata configuration options for page SEO
 * @interface Metadata
 */
type Metadata = {
  /** Page title */
  title: string;
  /** Page description for SEO */
  description: string;
  /** URL pathname (without domain) */
  pathname: string;
  /** Path to social sharing image (defaults to site config) */
  imagePath?: string;
  /** OpenGraph content type (defaults to "website") */
  type?: string;
  /** Whether search engines should index this page */
  noIndex?: boolean;
};

/**
 * Generates metadata for Next.js pages including OpenGraph and Twitter card data
 *
 * @param {Metadata} options - Metadata configuration options
 * @param {string} options.title - Page title
 * @param {string} options.description - Page description
 * @param {string} options.pathname - URL pathname (without domain)
 * @param {string} [options.imagePath=config.defaultSocialImage] - Path to social sharing image
 * @param {string} [options.type="website"] - OpenGraph content type
 * @param {boolean} [options.noIndex=false] - Whether search engines should index this page
 *
 * @returns {NextMetadata} Next.js compatible metadata object
 */
export function getMetadata({
  title,
  description,
  pathname,
  imagePath = config.defaultSocialImage,
  type = 'website',
  noIndex = false,
}: Metadata) {
  const SITE_URL = process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
  const canonicalUrl = SITE_URL + pathname;
  const imageUrl = imagePath.startsWith('http') ? imagePath : SITE_URL + imagePath;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    // FIXME: Generate favicons with Favpie - https://github.com/pixel-point/favpie
    // manifest: `${SITE_URL}/manifest.json`,
    // icons: {
    //   icon: '/favicon/favicon.png',
    //   apple: [
    //     { url: '/favicon/favicon.png' },
    //     { url: '/favicon/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    //     { url: '/favicon/favicon-72x72.png', sizes: '72x72', type: 'image/png' },
    //     { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    //     { url: '/favicon/favicon-144x144.png', sizes: '144x144', type: 'image/png' },
    //     { url: '/favicon/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
    //     { url: '/favicon/favicon-256x256.png', sizes: '256x256', type: 'image/png' },
    //     { url: '/favicon/favicon-384x384.png', sizes: '384x384', type: 'image/png' },
    //     { url: '/favicon/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    //   ],
    // },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: config.projectName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: noIndex ? 'noindex' : null,
  } as NextMetadata;
}
