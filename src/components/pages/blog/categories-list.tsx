'use client';

import { useEffect, useRef, useState } from 'react';
import { Route } from 'next';
import { usePathname } from 'next/navigation';
import { cva } from 'class-variance-authority';

import { type ICategory } from '@/types/blog';
import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';

interface ICategoriesListProps {
  className?: string;
  categories: ICategory[];
  variant?: 'underline' | 'outline' | 'sidebar';
}

const activeTabVariants = cva('absolute', {
  variants: {
    variant: {
      underline: 'inset-x-0 bottom-0 h-0.5 bg-primary',
      outline: 'inset-0 rounded-full border',
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
});

function CategoriesList({ className, categories, variant = 'outline' }: ICategoriesListProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<Route<string> | URL | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUnderlineVariant = variant === 'underline';
  const isSidebarVariant = variant === 'sidebar';

  const handleMouseEnter = (url: Route<string> | URL) => {
    setHoveredItem(url);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || container.scrollWidth <= container.clientWidth) {
      return;
    }

    const activeItem = container.querySelector<HTMLElement>('[data-active="true"]');
    if (!activeItem) {
      return;
    }

    requestAnimationFrame(() => {
      activeItem.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center',
      });
    });
  }, [pathname]);

  if (isSidebarVariant) {
    return (
      <section className={cn('categories-list w-full max-w-full min-w-0', className)}>
        <h2 className="sr-only">Categories</h2>
        <nav
          className="relative mx-[calc(50%-50vw)] w-screen lg:mx-0 lg:w-full"
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={scrollContainerRef}
            className="scrollbar-none w-full max-w-full min-w-0 overflow-x-auto lg:overflow-visible"
          >
            <ul className="flex w-max min-w-full flex-nowrap gap-6 px-5 md:px-8 lg:w-full lg:flex-col lg:gap-0 lg:px-0">
              {categories.map(({ title, url }, index) => {
                const isActive =
                  url === '/blog'
                    ? pathname === '/blog' || pathname.startsWith('/blog/page')
                    : pathname === url || pathname.startsWith(`${url}/page`);
                const isHovered = hoveredItem === url;
                const shouldUseForegroundText = isActive || isHovered;

                return (
                  <li key={index}>
                    <Link
                      className={cn(
                        'h-auto justify-start gap-2.5 py-[.56rem] font-mono text-sm leading-[1.375] font-normal tracking-[0.42px] whitespace-nowrap uppercase transition-colors duration-200 lg:whitespace-normal',
                        shouldUseForegroundText
                          ? 'text-foreground'
                          : 'text-gray-70 hover:text-foreground',
                      )}
                      data-active={isActive}
                      href={url}
                      onClick={() => handleMouseEnter(url)}
                      onMouseEnter={() => handleMouseEnter(url)}
                      size="none"
                      variant="ghost"
                    >
                      <span
                        className={cn(
                          'relative inline-flex size-2.5 items-center justify-center rounded-sm transition-opacity duration-200',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        <span className="absolute size-2.5 rounded-sm bg-cyan/80 blur-[2px]" />
                        <span className="absolute size-2.5 rounded-sm bg-blue-glow/50 blur-[5px]" />
                        <span className="relative size-2.5 rounded-sm bg-cyan" />
                      </span>
                      <span>{title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </section>
    );
  }

  return (
    <section className={cn('categories-list max-w-full md:overflow-hidden', className)}>
      <h2 className="sr-only">Categories</h2>
      <nav className="relative -mx-5 lg:mx-0" onMouseLeave={handleMouseLeave}>
        <div ref={scrollContainerRef} className="scrollbar-none w-full overflow-x-auto">
          <ul
            className={cn(
              'flex h-8 w-max min-w-full flex-nowrap items-center px-5 lg:px-0',
              isUnderlineVariant ? 'gap-x-5' : 'gap-x-0.5',
            )}
          >
            {categories.map(({ title, url }) => {
              const isActive =
                url === '/blog'
                  ? pathname === '/blog' || pathname.startsWith('/blog/page')
                  : pathname === url || pathname.startsWith(`${url}/page`);
              const isHovered = hoveredItem === url;
              const shouldShowHighlight = isHovered || (isActive && !hoveredItem);

              return (
                <li key={url}>
                  <Link
                    className={cn(
                      'relative h-8 justify-center rounded-full leading-none font-medium whitespace-nowrap transition-colors duration-200 ring-inset',
                      shouldShowHighlight
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                      !isUnderlineVariant && 'px-3.5',
                    )}
                    data-active={isActive}
                    href={url}
                    onClick={() => handleMouseEnter(url)}
                    onMouseEnter={() => handleMouseEnter(url)}
                    size="small"
                    variant="ghost"
                  >
                    <span className="relative z-10">{title}</span>
                    <span
                      className={cn(
                        'pointer-events-none z-0 transition-opacity duration-300',
                        activeTabVariants({ variant }),
                        !isUnderlineVariant && isActive && 'border-muted-foreground',
                        !isUnderlineVariant &&
                          !isActive &&
                          isHovered &&
                          'border-muted-foreground/50',
                        shouldShowHighlight ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 flex w-6 bg-linear-to-r from-transparent via-background/80 via-50% to-background"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-20 flex w-6 bg-linear-to-l from-transparent via-background/80 via-50% to-background md:hidden"
        />
      </nav>
    </section>
  );
}

export default CategoriesList;
