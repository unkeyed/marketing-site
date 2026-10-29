import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IPaginationProps {
  currentPage: number;
  pageCount: number;
  path?: string;
  className?: string;
}

function Pagination({ currentPage, pageCount, className, path = '' }: IPaginationProps) {
  if (pageCount < 2) return null;

  const basePath = path ? `/blog/category/${path}` : '/blog';
  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`);
  const windowStart = Math.min(currentPage, pageCount - 1);
  const visiblePages = [...new Set([1, windowStart, windowStart + 1, pageCount])].sort(
    (a, b) => a - b,
  );
  const pages = visiblePages.flatMap((page, index): (number | string)[] => {
    const previous = visiblePages[index - 1];
    if (previous === undefined || page - previous === 1) return [page];
    if (page - previous === 2) return [previous + 1, page];
    return [`gap-${page}`, page];
  });
  const pageClassName =
    'flex size-8 items-center justify-center rounded-lg border border-transparent text-xs font-medium leading-none tracking-tight md:size-9';
  const previousLabel = (
    <>
      <ArrowLeft
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300"
        size={14}
        strokeWidth={2.5}
      />
      <span className="-ml-0.5 hidden leading-none tracking-tight md:inline-flex">Previous</span>
    </>
  );
  const nextLabel = (
    <>
      <span className="-mr-0.5 hidden leading-none tracking-tight md:inline-flex">Next</span>
      <ArrowRight
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300"
        size={14}
        strokeWidth={2.5}
      />
    </>
  );
  const directionClassName =
    'flex items-center gap-x-1.5 rounded text-sm font-semibold transition-colors duration-300';

  return (
    <nav aria-label="Pagination" className={className}>
      <ul className="flex items-center justify-center gap-x-2 md:gap-x-3 [&>li]:leading-snug">
        <li className="mr-auto flex self-stretch md:mr-12">
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              rel="prev"
              aria-label="Previous page"
              className={cn(
                directionClassName,
                'text-foreground hover:text-foreground/85 hover:[&_svg]:-translate-x-0.5',
              )}
            >
              {previousLabel}
            </Link>
          ) : (
            <span aria-hidden="true" className={cn(directionClassName, 'text-muted-foreground')}>
              {previousLabel}
            </span>
          )}
        </li>
        {pages.map((page) => (
          <li key={page}>
            {typeof page === 'string' ? (
              <span className={pageClassName} aria-hidden="true">
                …
              </span>
            ) : page === currentPage ? (
              <span aria-current="page" className={cn(pageClassName, 'border-border')}>
                {page}
              </span>
            ) : (
              <Link
                href={pageHref(page)}
                aria-label={`Page ${page}`}
                className={cn(pageClassName, 'transition-colors duration-300 hover:bg-muted/50')}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
        <li className="ml-auto flex self-stretch md:ml-12">
          {currentPage < pageCount ? (
            <Link
              href={pageHref(currentPage + 1)}
              rel="next"
              aria-label="Next page"
              className={cn(
                directionClassName,
                'text-foreground hover:text-foreground/85 hover:[&_svg]:translate-x-0.5',
              )}
            >
              {nextLabel}
            </Link>
          ) : (
            <span aria-hidden="true" className={cn(directionClassName, 'text-muted-foreground')}>
              {nextLabel}
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
