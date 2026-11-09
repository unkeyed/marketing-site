'use client';

import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import copy from 'copy-to-clipboard';
import { Link } from 'lucide-react';
import type { Variants } from 'motion/react';
import { AnimatePresence, domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import { cn } from '@/lib/utils';

interface HeadingProps {
  tag: 'h1' | 'h2' | 'h3';
  children: ReactNode;
  className?: string;
  id?: string;
}

const iconVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const checkIconVariants: Variants = {
  initial: { opacity: 0, pathLength: 0 },
  animate: {
    opacity: 1,
    pathLength: 1,
    transition: {
      opacity: { duration: 0.22 },
      pathLength: { duration: 0.3, ease: 'easeOut' },
    },
  },
  exit: { opacity: 0 },
};

function Heading({
  tag: Tag,
  children,
  className,
  id,
  ...rest
}: HeadingProps & HTMLAttributes<HTMLHeadingElement>) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const showCopyControl = isHovered || isFocused || copied;

  const handleCopyClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${location.origin}${pathname}#${id}`;
    copy(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleHeadingClick = (e: MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('a, button, input, select, textarea')) {
      return;
    }
    handleCopyClick(e);
  };

  return (
    <Tag
      id={id}
      className={cn(
        'w-fit font-semibold text-pretty text-foreground',
        '!scroll-mt-[calc(var(--sticky-header-height)+2rem)]',
        id && 'cursor-pointer',
        className,
      )}
      {...rest}
      onMouseEnter={() => (id ? setIsHovered(true) : undefined)}
      onMouseLeave={() => (id ? setIsHovered(false) : undefined)}
      onClick={id ? handleHeadingClick : undefined}
    >
      {children}
      {id && (
        <span className="inline-flex min-w-4 shrink-0 lg:min-w-14">
          <LazyMotion features={domAnimation}>
            <m.button
              type="button"
              className="will-change-transform"
              aria-label="Copy link to section"
              title="Copy link"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onClick={handleCopyClick}
              initial={{ opacity: 0, x: 0, filter: 'blur(6px)' }}
              animate={{
                opacity: showCopyControl ? 1 : 0,
                x: showCopyControl ? 9 : 0,
                filter: showCopyControl ? 'blur(0px)' : 'blur(6px)',
              }}
              transition={{ duration: 0.3, ease: [0, 0, 0.58, 1] }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <m.span
                    className="flex items-center gap-x-0.5 text-muted-foreground will-change-transform"
                    key="icon-copied"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <m.svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <m.polyline
                        points="4 12 9 17 20 6"
                        variants={checkIconVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      />
                    </m.svg>
                    <span className="hidden text-xs font-medium lg:block">Copied</span>
                  </m.span>
                ) : (
                  <m.span
                    key="icon-link"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="will-change-transform"
                  >
                    <Link className="text-muted-foreground" width={16} height={16} />
                  </m.span>
                )}
              </AnimatePresence>
            </m.button>
          </LazyMotion>
        </span>
      )}
    </Tag>
  );
}

export default Heading;
