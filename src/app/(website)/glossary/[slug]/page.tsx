import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { homeContentData } from '@/constants/home';

import { getMetadata } from '@/lib/get-metadata';
import {
  getAllGlossaryTerms,
  getGlossaryDataBySlug,
  getGlossaryTermBySlug,
} from '@/lib/glossary/posts';
import GlossaryPost from '@/components/pages/glossary/glossary-post';
import Cta from '@/components/pages/home/cta';

interface IGlossaryPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GlossaryPostPage({ params }: IGlossaryPostPageProps) {
  const { slug } = await params;
  const glossaryTerm = await getGlossaryTermBySlug(slug);

  if (!glossaryTerm) {
    notFound();
  }

  return (
    <main className="pt-8 md:pt-11 lg:pt-21">
      <GlossaryPost glossaryTerm={glossaryTerm} />
      <Cta {...homeContentData.cta} className="mt-51.75" />
    </main>
  );
}

export async function generateStaticParams() {
  const glossaryTerms = getAllGlossaryTerms();

  return glossaryTerms.map((glossaryTerm) => ({
    slug: glossaryTerm.slug,
  }));
}

export async function generateMetadata({ params }: IGlossaryPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const glossaryTerm = getGlossaryDataBySlug(slug);

  if (!glossaryTerm) {
    return {};
  }

  return getMetadata({
    title: glossaryTerm.seo.title,
    description: glossaryTerm.seo.description,
    pathname: glossaryTerm.pathname,
    imagePath: glossaryTerm.seo.socialImage,
    noIndex: glossaryTerm.seo.noIndex,
  });
}
