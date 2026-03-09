const DEFAULT_SITE_URL = 'http://localhost:3000';

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_DEFAULT_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '');
}

export function toAbsoluteSiteUrl(pathname: string): string {
  return new URL(pathname, getSiteUrl()).toString();
}
