'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';

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
    <nav className={cn('flex', className)} onMouseLeave={() => setHoveredIndex(null)}>
      {items.map(({ href, label }, index) => {
        const isActive = index === activeIndex;
        const isHovered = index === hoveredIndex;
        const shouldShowActive = isActive && hoveredIndex === null;
        const shouldShowHighlight = isHovered || shouldShowActive;

        return (
          <Link
            key={index}
            href={href}
            data-active={shouldShowActive}
            data-hovered={isHovered}
            onMouseEnter={() => setHoveredIndex(index)}
            className={cn(
              'relative gap-x-1.5 rounded-full px-3.5 py-2 text-sm leading-none tracking-normal transition-colors data-[active=true]:text-foreground data-[hovered=true]:text-foreground',
              isActive ? 'text-foreground' : 'text-foreground/80',
            )}
            size="none"
            variant="ghost"
          >
            <span
              className={cn(
                'pointer-events-none absolute inset-0 rounded-full bg-muted transition-opacity duration-300',
                shouldShowHighlight ? 'opacity-100' : 'opacity-0',
              )}
            />
            <span className="relative z-10">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default Nav;
