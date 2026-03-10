import { homeContentData } from '@/constants/home';

import { getMetadata } from '@/lib/get-metadata';
import {
  getGlossaryGroups,
  getGlossarySearchItems,
  getGlossarySearchSuggestions,
} from '@/lib/glossary/posts';
import Hero from '@/components/pages/blog/hero--blog';
import GlossaryDirectory from '@/components/pages/glossary/glossary-directory';
import Cta from '@/components/pages/home/cta';

export const metadata = getMetadata({
  title: 'Glossary',
  description: 'Clear definitions for API terms',
  pathname: '/glossary',
});

const contentData = {
  title: (
    <>
      {'A practical '}<mark>API glossary</mark>{'\r\nfor everyday development'}
    </>
  ),
  description: 'Definitions and examples for the concepts\r\nthat show up in everyday API work.',
};

export default function GlossaryPage() {
  const glossaryGroups = getGlossaryGroups();
  const glossarySearchItems = getGlossarySearchItems();
  const glossarySuggestions = getGlossarySearchSuggestions();

  return (
    <main className="flex-col pt-16 sm:pt-24 xl:pt-35">
      <Hero
        title={contentData.title}
        titleTag="h1"
        description={contentData.description}
        className="!gap-4 md:!gap-6 lg:flex-row lg:items-end xl:!justify-between xl:!px-40"
        titleClassName="marked-title !leading-[1.125] text-[2.25rem] md:text-[2.5rem] lg:text-[2.75rem] xl:text-[3.5rem] [&_mark]:!h-[1.15em]"
        descriptionClassName="w-full max-w-[34rem] text-base leading-[1.5] tracking-tight text-gray-70 md:max-w-[33.75rem] md:text-lg lg:max-w-[24.375rem] lg:text-xl xl:max-w-[24.375rem] xl:whitespace-pre-line"
      />
      <GlossaryDirectory
        groups={glossaryGroups}
        searchItems={glossarySearchItems}
        suggestions={glossarySuggestions}
      />
      <Cta {...homeContentData.cta} />
    </main>
  );
}
