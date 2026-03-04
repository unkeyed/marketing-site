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
  const siteUrl = (process.env.NEXT_PUBLIC_DEFAULT_SITE_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
  );
  const canonicalUrl = new URL(pathname, siteUrl).toString();
  const imageUrl = imagePath.startsWith('http')
    ? imagePath
    : new URL(imagePath, siteUrl).toString();
  const siteName = `${config.projectName.slice(0, 1).toUpperCase()}${config.projectName.slice(1)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
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
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex ? 'noindex' : undefined,
  } as NextMetadata;
}
