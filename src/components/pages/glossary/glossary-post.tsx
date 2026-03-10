import Image from 'next/image';

import type { IGlossaryTerm } from '@/types/glossary';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import ArticleWithSidebar from '@/components/pages/article-with-sidebar';
import BackToTop from '@/components/pages/back-to-top';
import GlossaryFaq from '@/components/pages/glossary/glossary-faq';
import GlossaryTakeaways from '@/components/pages/glossary/glossary-takeaways';
import TableOfContents from '@/components/pages/table-of-contents';

interface IGlossaryPostProps {
  className?: string;
  glossaryTerm: IGlossaryTerm;
}

function GlossaryPost({ className, glossaryTerm }: IGlossaryPostProps) {
  const breadcrumbItems = [{ label: 'Glossary', href: '/glossary' }, { label: glossaryTerm.term }];

  return (
    <ArticleWithSidebar
      className={className}
      header={
        <header className="post-header">
          <Breadcrumbs items={breadcrumbItems} showBackIconOnFirst />
          <h1 className="mt-2 font-display text-4xl leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
            {glossaryTerm.h1}
          </h1>
        </header>
      }
      content={
        <div>
          <div className="not-prose mb-5 flex w-full flex-col gap-4 border border-gray-20 p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-9 items-center justify-center border border-gray-30">
                <Image
                  src="/icons/glossary/tldr.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <p className="pt-1 text-xl leading-snug font-medium tracking-tight text-foreground">
                TL;DR
              </p>
            </div>
            <p className="w-full text-base leading-normal tracking-tight text-gray-80/90">
              {glossaryTerm.tldr}
            </p>
          </div>
          <GlossaryTakeaways className="mb-14" takeaways={glossaryTerm.takeaways} />
          {glossaryTerm.content}
          <GlossaryFaq term={glossaryTerm.term} items={glossaryTerm.faq} />
        </div>
      }
      contentClassName="prose-clear-first-child prose-lg"
      sidebar={
        <>
          <TableOfContents
            className="mt-2"
            title="On this page"
            items={glossaryTerm.tableOfContents}
          />
          <BackToTop withSeparator />
        </>
      }
    />
  );
}

export default GlossaryPost;
