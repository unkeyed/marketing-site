import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import Aside from '@/components/pages/aside';

interface IArticleWithSidebarProps {
  className?: string;
  /** Header block (breadcrumbs + title + optional meta). */
  header: ReactNode;
  /** Main content (e.g. compiled MDX). */
  content: ReactNode;
  /** Prose/content wrapper class (e.g. prose-clear-first-child prose-lg). */
  contentClassName?: string;
  /** Sidebar content (e.g. TableOfContents, nav list). */
  sidebar: ReactNode;
  /** Sidebar sticky. */
  sidebarSticky?: boolean;
}

function ArticleWithSidebar({
  className,
  header,
  content,
  contentClassName,
  sidebar,
  sidebarSticky = true,
}: IArticleWithSidebarProps) {
  return (
    <section className={cn('post', className)}>
      <div className="post-container">
        <article className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-12 gap-y-10 md:gap-y-16 lg:grid-cols-[minmax(0,1fr)_12rem] xl:max-w-[72rem] xl:grid-cols-[48rem_18rem] xl:gap-x-24 xl:gap-y-15">
          <header className="col-start-1 row-start-1 w-full">{header}</header>
          <div className={cn('content col-start-1 row-start-2 prose max-w-none', contentClassName)}>
            {content}
          </div>
          <Aside
            className="col-start-2 row-start-2 hidden w-full shrink-0 flex-col lg:flex"
            sticky={sidebarSticky}
          >
            {sidebar}
          </Aside>
        </article>
      </div>
    </section>
  );
}

export default ArticleWithSidebar;
