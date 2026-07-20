import { homeContentData } from '@/constants/home';

import { type ICaseStudyData } from '@/types/case-study';
import { getAllCaseStudies } from '@/lib/case-studies/posts';
import { getMetadata } from '@/lib/get-metadata';
import Hero from '@/components/pages/blog/hero--blog';
import CaseStudiesGrid from '@/components/pages/case-studies/case-studies-grid';
import { type TCaseStudyCardProps } from '@/components/pages/case-studies/case-study-card';
import Cta from '@/components/pages/home/cta';

export const metadata = getMetadata({
  title: 'Case Studies',
  description:
    'Case studies showing how teams integrated the platform, scaled confidently, and kept production predictable.',
  pathname: '/case-studies',
});

const contentData = {
  title: (
    <>
      {'Built for Real Workloads.\r\nBacked by '}
      <mark>Real Stories.</mark>
    </>
  ),
  description:
    'Case studies showing how teams integrated\r\nthe platform, scaled confidently, and kept\r\nproduction predictable.',
};

function toCaseStudyCard(caseStudy: ICaseStudyData): TCaseStudyCardProps {
  const category =
    caseStudy.companyOverview?.items.find((item) => item.label === 'Industry')?.content ??
    'Case Study';

  const base = {
    category,
    title: caseStudy.title,
    description: caseStudy.caption,
    href: caseStudy.pathname,
  };

  if (caseStudy.cover) {
    return {
      ...base,
      imageSrc: caseStudy.cover,
      imageAlt: `${caseStudy.title} cover image`,
    };
  }

  return {
    ...base,
    variant: 'compact' as const,
    logoSrc: caseStudy.companyOverview?.logoSrc ?? '',
    logoAlt: caseStudy.companyOverview?.logoAlt ?? caseStudy.title,
    logoWidth: caseStudy.companyOverview?.logoWidth,
    logoHeight: caseStudy.companyOverview?.logoHeight,
  };
}

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies().map(toCaseStudyCard);

  return (
    <main className="pt-10 md:pt-24">
      <Hero
        title={contentData.title}
        titleTag="h1"
        description={contentData.description}
        className="gap-4 md:gap-6 lg:flex-row lg:items-end lg:gap-8 xl:!justify-between"
        titleClassName="marked-title !leading-[1.125] text-[1.8rem] min-[380px]:text-[2rem] md:text-[2.5rem] lg:text-[3rem]"
        descriptionClassName="text-base md:text-lg md:max-w-[33.25rem] lg:max-w-[22.5rem] min-[1025px]:max-w-[26rem] !tracking-[-0.01em]"
      />
      <CaseStudiesGrid items={caseStudies} />
      <Cta {...homeContentData.cta} />
    </main>
  );
}
