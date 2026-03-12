import Link from 'next/link';

import type { IChangelogPost } from '@/lib/changelog/posts';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Heading from '@/components/content/heading';
import Content from '@/components/pages/content';

import Date from '../date';

interface PostsListProps {
  className?: string;
  posts: IChangelogPost[];
  currentPage: number;
  hasNewer: boolean;
  hasOlder: boolean;
}

interface PaginationNavProps {
  hasNewer: boolean;
  hasOlder: boolean;
  currentPage: number;
}

function PaginationNav({ hasNewer, hasOlder, currentPage }: PaginationNavProps) {
  const newerLink = hasNewer
    ? currentPage === 2
      ? '/changelog'
      : `/changelog/page/${currentPage - 1}`
    : '#';

  const olderLink = hasOlder ? `/changelog/page/${currentPage + 1}` : '#';

  if (!hasNewer && !hasOlder) {
    return null;
  }

  return (
    <nav className="mx-auto mt-10 flex w-full max-w-176 justify-between border-t border-border pt-7 xl:mt-12">
      {hasNewer && (
        <div className="flex flex-col gap-y-3">
          <span className="text-[0.8125rem] leading-none font-medium tracking-tight text-muted-foreground">
            See What&apos;s New
          </span>
          <Link
            className="leading-none text-foreground transition-colors duration-200 hover:text-gray-80"
            href={newerLink}
          >
            Newer posts
          </Link>
        </div>
      )}
      {hasOlder && (
        <div className="ml-auto flex flex-col items-end gap-y-3">
          <span className="text-[0.8125rem] leading-none font-medium tracking-tight text-muted-foreground">
            Explore the Past
          </span>
          <Link
            className="leading-none text-foreground transition-colors duration-200 hover:text-gray-80"
            href={olderLink}
          >
            Older posts
          </Link>
        </div>
      )}
    </nav>
  );
}

function PostsList({ posts, currentPage, hasNewer, hasOlder, className }: PostsListProps) {
  return (
    <section className={cn('posts-list pb-12 md:pb-14 lg:pb-24', className)}>
      <div className="mx-auto w-full max-w-3xl px-5 md:px-8 xl:max-w-7xl">
        <h2 className="sr-only">All changelog posts</h2>
        {posts.map(({ slug, publishedAt, title, tags = [], content }, index) => (
          <article
            className={cn(
              'grid max-w-240 scroll-mt-24 grid-cols-1 gap-x-16 gap-y-7 border-t border-border pt-12 md:pt-14 lg:pt-20 xl:grid-cols-4',
              index < posts.length - 1 && 'pb-12 md:pb-14 lg:pb-20',
            )}
            key={slug}
          >
            <div className="relative col-span-1 xl:pt-2">
              <p className="xl:sticky xl:top-20 xl:left-0">
                <Date
                  className="text-[0.8125rem] leading-none font-normal tracking-tight text-gray-70"
                  publishedAt={publishedAt}
                />
              </p>
            </div>
            <div className="xl:col-span-3">
              {tags.length > 0 && (
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  {tags.map((tag) => (
                    <Label
                      className="gap-2 px-2 py-1"
                      labelClassName="!text-[0.8125rem] tracking-[0.01em]"
                      dotColor={tag.dotColor}
                      key={`${slug}-${tag.label}`}
                    >
                      {tag.label}
                    </Label>
                  ))}
                </div>
              )}
              <Heading
                tag="h1"
                id={slug}
                className="font-display text-2xl leading-[1.25] font-normal text-foreground md:text-3xl"
              >
                {title}
              </Heading>
              <Content className="prose-clear-first-child mt-4" content={content} />
            </div>
          </article>
        ))}
        <PaginationNav hasNewer={hasNewer} hasOlder={hasOlder} currentPage={currentPage} />
      </div>
    </section>
  );
}

export default PostsList;
