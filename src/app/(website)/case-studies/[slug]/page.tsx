import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import config from '@/configs/website-config';
import { homeContentData } from '@/constants/home';

import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyDataBySlug,
} from '@/lib/case-studies/posts';
import { getMetadata } from '@/lib/get-metadata';
import { toAbsoluteSiteUrl } from '@/lib/site-url';
import CaseStudyPost from '@/components/pages/case-studies/case-study-post';
import Cta from '@/components/pages/home/cta';

interface ICaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CaseStudyPage({ params }: ICaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const caseStudyUrl = toAbsoluteSiteUrl(`/case-studies/${caseStudy.slug.current}`);
  const authors = (caseStudy.authors || []).map((author) => ({
    '@type': 'Person',
    name: author.name,
    ...(author.photo ? { image: author.photo } : {}),
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.seo?.title || caseStudy.title,
    description: caseStudy.seo?.description || '',
    datePublished: caseStudy.publishedAt,
    url: caseStudyUrl,
    image:
      caseStudy.seo?.socialImage ||
      toAbsoluteSiteUrl(`/api/og?template=blog&title=${encodeURIComponent(caseStudy.title)}`),
    author: authors.length > 0 ? authors : [{ '@type': 'Person', name: 'Unknown' }],
  };

  return (
    <main className="pt-8 md:pt-11 lg:pt-21">
      <CaseStudyPost caseStudy={caseStudy} />
      <Cta {...homeContentData.cta} className="mt-51.75" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </main>
  );
}

export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();

  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug.current,
  }));
}

export async function generateMetadata({ params }: ICaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyDataBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  const { seo } = caseStudy;

  return getMetadata({
    title: `${seo.title} | ${config.projectName}`,
    description: seo.description,
    pathname: `/case-studies/${caseStudy.slug.current}`,
    imagePath: seo.socialImage,
    // noIndex: seo.noIndex,
    // @TODO: Remove this once as soon as the pages are published
    noIndex: true,
  });
}
