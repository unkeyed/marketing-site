'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useThrottleCallback } from '@react-hook/throttle';

import { ITableOfContentsItem } from '@/types/common';
import { cn } from '@/lib/utils';

interface ITableOfContentsProps {
  className?: string;
  title?: string;
  items: readonly ITableOfContentsItem[];
}

function useActiveAnchor(
  items: readonly ITableOfContentsItem[],
  viewportOffset = 0.5,
  throttleMs = 100,
) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const headingRefs = useRef<{ id: string; getTop: () => number }[]>([]);

  useEffect(() => {
    headingRefs.current = items
      .map(({ anchor }) => {
        const el = document.getElementById(anchor);
        return el ? { id: anchor, getTop: () => el.getBoundingClientRect().top } : null;
      })
      .filter(Boolean) as { id: string; getTop: () => number }[];
  }, [items]);

  const calcActive = useCallback(() => {
    if (!headingRefs.current.length) return;

    const activationLine = window.innerHeight * viewportOffset;
    let currentId: string | null = null;

    if (headingRefs.current[0].getTop() > activationLine) {
      setActiveAnchor(null);
      return;
    }

    for (const { id, getTop } of headingRefs.current) {
      if (getTop() <= activationLine) currentId = id;
      else break;
    }

    setActiveAnchor(currentId);
  }, [viewportOffset]);

  const throttled = useThrottleCallback(calcActive, throttleMs);

  useEffect(() => {
    calcActive();
    window.addEventListener('scroll', throttled);
    window.addEventListener('resize', throttled);
    return () => {
      window.removeEventListener('scroll', throttled);
      window.removeEventListener('resize', throttled);
    };
  }, [throttled, calcActive]);

  return activeAnchor;
}

function TableOfContents({ className, title = 'Table of contents', items }: ITableOfContentsProps) {
  const activeAnchor = useActiveAnchor(items);
  const baseDepth = Math.min(...items.map((item) => item.depth));

  const handleLinkClick = useCallback(
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      history.pushState(null, '', `#${id}`);
    },
    [],
  );

  if (!items.length) return null;

  return (
    <nav
      className={cn('table-of-contents flex w-full flex-col items-start gap-3.5', className)}
      aria-label={title}
    >
      <h2 className="text-sm leading-snug font-medium tracking-tight text-foreground">{title}</h2>

      <ol className="flex w-full flex-col gap-y-3.5">
        {items.map(({ title, anchor, depth }) => (
          <li className="flex w-full" key={anchor}>
            <a
              className={cn(
                'line-clamp-2 w-full text-left text-sm leading-snug tracking-tight transition-colors duration-200',
                depth > baseDepth && 'pl-2.5',
                activeAnchor === anchor
                  ? 'font-medium text-primary'
                  : 'font-normal text-muted-foreground hover:text-foreground',
              )}
              href={`#${anchor}`}
              aria-current={activeAnchor === anchor ? 'location' : undefined}
              onClick={handleLinkClick(anchor)}
            >
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default TableOfContents;
