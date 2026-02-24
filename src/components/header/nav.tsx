'use client';

import { useMemo, useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';

interface IHeaderNavProps {
  className?: string;
  items: IMenuItem[];
}

function Nav({ className, items }: IHeaderNavProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeIndex = useMemo(
    () =>
      items.findIndex(({ href }) =>
        href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`),
      ),
    [pathname, items],
  );

  return (
    <nav
      className={cn('flex items-center gap-10', className)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map(({ href, label, children }, index) => {
        const isActive = index === activeIndex;
        const isHovered = index === hoveredIndex;
        const hasChildren = Array.isArray(children);

        return (
          <NextLink
            key={index}
            href={href ?? '#'}
            onMouseEnter={() => setHoveredIndex(index)}
            className={cn(
              'inline-flex items-center gap-0.5 text-sm leading-none font-medium tracking-[-0.35px] transition-colors',
              isHovered ? 'text-gray-30' : 'text-background',
            )}
          >
            {label}
            {hasChildren && <ChevronDown className="size-3.5 opacity-70" strokeWidth={2} />}
          </NextLink>
        );
      })}
    </nav>
  );
}

export default Nav;
