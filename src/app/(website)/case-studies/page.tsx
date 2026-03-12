import { homeContentData } from '@/constants/home';

import { getMetadata } from '@/lib/get-metadata';
import Hero from '@/components/pages/blog/hero--blog';
import CaseStudiesGrid from '@/components/pages/case-studies/case-studies-grid';
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
  caseStudies: [
    {
      variant: 'compact' as const,
      category: 'Artificial Intelligence',
      title: 'Operational intelligence at scale.',
      description:
        'How a fast-growing SaaS team unified workflows to support product-led expansion.',
      href: '/case-studies/case-study-example',
      logoSrc: '/images/case-studies/logos/logo-example-2.svg',
      logoAlt: 'Customer logo',
      logoWidth: 80,
      logoHeight: 32,
    },
    {
      variant: 'compact' as const,
      category: 'Artificial Intelligence',
      title: 'From fragmented tools to one system.',
      description:
        'How an operations team reduced complexity and accelerated execution across teams.',
      href: '/case-studies/case-study-example',
      logoSrc: '/images/case-studies/logos/logo-example-3.svg',
      logoAlt: 'Customer logo',
      logoWidth: 143,
      logoHeight: 32,
    },
    {
      category: 'Artificial Intelligence',
      title: 'From fragmented tools to one system.',
      description:
        'How an operations team reduced complexity and accelerated execution across teams.',
      href: '/case-studies/case-study-example',
      imageSrc: '/images/case-studies/image-1.jpg',
      imageAlt: 'Case study visual for artificial intelligence customer',
    },
    {
      variant: 'compact' as const,
      category: 'Artificial Intelligence',
      title: 'From fragmented tools to one system.',
      description:
        'How an operations team reduced complexity and accelerated execution across teams.',
      href: '/case-studies/case-study-example',
      logoSrc: '/images/case-studies/logos/logo-example.svg',
      logoAlt: 'Customer logo',
      logoWidth: 127,
      logoHeight: 25,
    },
    {
      variant: 'compact' as const,
      category: 'Artificial Intelligence',
      title: 'Operational intelligence at scale.',
      description:
        'How a fast-growing SaaS team unified workflows to support product-led expansion.',
      href: '/case-studies/case-study-example',
      logoSrc: '/images/case-studies/logos/logo-example-2.svg',
      logoAlt: 'Customer logo',
      logoWidth: 80,
      logoHeight: 32,
    },
  ],
};

export default function CaseStudiesPage() {
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
      <CaseStudiesGrid items={contentData.caseStudies} />
      <Cta {...homeContentData.cta} />
    </main>
  );
}
