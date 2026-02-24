'use client';

import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import config from '@/configs/website-config';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/ui/search-bar';

import MobileMenu from './mobile-menu';
import Nav from './nav';

interface IHeaderProps {
  className?: string;
  menuItems: IMenuItem[];
  logoUrl?: string | null;
}

const LOGO_BOX_HEIGHT = 22;

function Header({ className, menuItems, logoUrl }: IHeaderProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const logoSrc = logoUrl ?? config.logo.dark;
  const logoHref = config.logoLink ?? '/';
  const logoAlt =
    typeof config.logoAlt === 'string' && config.logoAlt.trim().length > 0
      ? config.logoAlt
      : config.projectName;

  // Observer for visual styling based on scroll position
  useEffect(() => {
    if (!triggerRef.current) return;

    /*
     Using IntersectionObserver instead of scroll events because:
      - More performant and accurate
      - No need for manual scroll calculations or throttling
    */
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      },
    );

    observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/*
          Sentinel element used to detect when header scrolls out of view.
          Positioned at the top of the document so it can leave the viewport even
          when the header itself is sticky.
      */}
      <div className="pointer-events-none -mt-px h-px w-full" ref={triggerRef} aria-hidden="true" />
      <header
        className={cn(
          'sticky top-0 z-50 flex min-h-[3.3125rem] items-center border-b border-transparent bg-background/90 py-3 backdrop-blur lg:py-2.5',
          isIntersecting && 'border-border',
          className,
        )}
      >
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 md:px-8 lg:justify-start">
          <NextLink className="mr-5 inline-flex shrink-0 rounded lg:mr-7" href={logoHref}>
            <img
              className="block h-[22px] w-auto shrink-0"
              src={logoSrc}
              alt={logoAlt}
              height={LOGO_BOX_HEIGHT}
            />
          </NextLink>
          <Nav className="hidden lg:flex" items={menuItems} />
          <SearchBar className="max-w-80 lg:hidden" showOnRoute={[]} enableCmdK={false} />
          <div className="hidden grow items-center justify-end gap-x-2.5 lg:flex">
            <Button size="sm" variant="outline">
              Login
            </Button>
            <Button size="sm" asChild>
              <NextLink href="/">Get Started</NextLink>
            </Button>
          </div>
          <MobileMenu items={menuItems} />
        </div>
      </header>
    </>
  );
}

export default Header;
