'use client';

import { useEffect, useRef } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { IFooterMenuSection } from '@/types/common';
import { pageScrollTo } from '@/lib/page-scroll';
import { cn, isExternalLink } from '@/lib/utils';

interface IFooterNavProps {
  className?: string;
  sections: IFooterMenuSection[];
  ariaLabel?: string;
}

function Nav({ className, sections, ariaLabel = 'Footer navigation' }: IFooterNavProps) {
  const pathname = usePathname();
  const pendingDestination = useRef<string | null>(null);

  // Next.js resets the document scroll, but this layout scrolls inside #page-scroll.
  useEffect(() => {
    if (pendingDestination.current === pathname) {
      pageScrollTo({ top: 0, behavior: 'instant' });
    }
    pendingDestination.current = null;
  }, [pathname]);

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'grid w-full grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[repeat(2,minmax(10rem,10rem))] md:gap-y-12 lg:grid-cols-4 lg:gap-8 2xl:gap-16',
        className,
      )}
    >
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-y-5">
          <h3 className="text-[0.9375rem] leading-snug font-medium tracking-tight text-white">
            {section.title}
          </h3>
          <ul className="flex flex-col gap-y-3 text-[0.9375rem] leading-snug font-medium tracking-tight text-gray-60">
            {section.items.map((item) => {
              const isExternal = isExternalLink(item.href);
              const shouldResetScroll = !isExternal && !item.href.includes('#');

              return (
                <li key={item.label}>
                  <NextLink
                    className="transition-colors duration-200 hover:text-white"
                    href={item.href}
                    scroll={shouldResetScroll ? false : undefined}
                    onNavigate={
                      shouldResetScroll
                        ? () => {
                            if (pathname === item.href) {
                              pageScrollTo({ top: 0, behavior: 'instant' });
                            } else {
                              pendingDestination.current = item.href;
                            }
                          }
                        : undefined
                    }
                    prefetch={isExternal ? false : undefined}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default Nav;
