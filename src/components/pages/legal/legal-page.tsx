import type { ReactElement } from 'react';

import { ITableOfContentsItem } from '@/types/common';
import Aside from '@/components/pages/aside';
import BackToTop from '@/components/pages/back-to-top';
import Content from '@/components/pages/content';
import TableOfContents from '@/components/pages/table-of-contents';

interface LegalPageProps {
  title: string;
  updatedAt: string;
  formattedDate: string;
  content: ReactElement;
  tableOfContents: ITableOfContentsItem[];
}

export default function LegalPage({
  title,
  updatedAt,
  formattedDate,
  content,
  tableOfContents,
}: LegalPageProps) {
  return (
    <main className="pt-10 pb-24 md:pt-16 md:pb-28 lg:pt-24 lg:pb-32 xl:pb-48">
      <div className="mx-auto flex max-w-7xl flex-col px-5 md:px-8">
        <article className="ml-auto grid max-w-5xl grow grid-cols-1 gap-10 md:gap-16 lg:grid-cols-[auto_12rem] xl:pl-16">
          <header className="flex flex-col gap-4">
            <h1 className="font-heading text-3xl leading-tight font-semibold tracking-tight md:text-5xl md:leading-tighter lg:text-6xl lg:leading-tighter">
              {title}
            </h1>
            <p className="text-lg leading-snug tracking-tight text-muted-foreground lg:text-2xl lg:leading-snug">
              Effective date: <time dateTime={updatedAt}>{formattedDate}</time>
            </p>
          </header>

          {content && (
            <Content className="prose-clear-first-child col-start-1 prose-lg" content={content} />
          )}

          <Aside
            className="col-start-2 row-start-2 hidden w-full shrink-0 flex-col overflow-auto lg:flex"
            sticky
          >
            <TableOfContents title="On this page" items={tableOfContents} />
            <BackToTop withSeparator />
          </Aside>
        </article>
      </div>
    </main>
  );
}
