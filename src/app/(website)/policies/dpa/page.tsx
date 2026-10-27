import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getMetadata } from '@/lib/get-metadata';
import { getLegalPageBySlug } from '@/lib/legal/pages';
import { getFormattedDate } from '@/lib/utils';
import LegalPage from '@/components/pages/legal/legal-page';

const category = '';
const fullSlug = (slug: string) => [category, slug].filter(Boolean).join('/');

function formatEffectiveDate(updatedAt: string) {
  if (Number.isNaN(Date.parse(updatedAt))) {
    return updatedAt;
  }

  return getFormattedDate(updatedAt, 'long');
}

export default async function DataProcessingAgreementPage() {
  const page = await getLegalPageBySlug(fullSlug('dpa'));

  if (!page) {
    notFound();
  }

  const { title, updatedAt, content, tableOfContents } = page;

  return (
    <LegalPage
      title={title}
      updatedAt={updatedAt}
      formattedDate={formatEffectiveDate(updatedAt)}
      content={content}
      tableOfContents={tableOfContents}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPageBySlug(fullSlug('dpa'));

  if (!page) {
    return {};
  }

  const { seo } = page;

  return getMetadata({
    title: seo.title,
    description: seo.description,
    pathname: '/policies/dpa',
    imagePath: seo.socialImage,
    noIndex: seo.noIndex,
  });
}
