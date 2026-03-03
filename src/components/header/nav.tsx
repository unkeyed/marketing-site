'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';

interface IHeaderNavProps {
  className?: string;
  items: IMenuItem[];
  ariaLabel?: string;
}

function Nav({ className, items, ariaLabel = 'Primary navigation' }: IHeaderNavProps) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const activeIndex = useMemo(
    () =>
      items.findIndex(({ href }) =>
        href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`),
      ),
    [pathname, items],
  );

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('flex items-center gap-10', className)}
      onMouseLeave={() => {
        setHoveredIndex(null);
        setOpenDropdown(null);
      }}
    >
      {items.map(({ href, label, children }, index) => {
        const isHovered = index === hoveredIndex;
        const hasChildren = Array.isArray(children) && children.length > 0;
        const isOpen = openDropdown === index;

        if (hasChildren) {
          return (
            <div
              key={index}
              className="relative flex items-center justify-center"
              onMouseEnter={() => {
                setHoveredIndex(index);
                setOpenDropdown(index);
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
                setOpenDropdown(null);
              }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={cn(
                  'relative inline-flex items-center gap-0.5 p-0 text-sm leading-none font-medium tracking-tight transition-colors',
                  isOpen && 'after:absolute after:top-full after:left-0 after:h-4.5 after:w-full',
                  isHovered ? 'text-gray-30' : 'text-background',
                )}
              >
                {label}
                <ChevronDown
                  className={cn(
                    'size-3.5 opacity-70 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  strokeWidth={2}
                />
              </button>

              <div
                className={cn(
                  'absolute top-full left-0 mt-4.5 w-82.5 transition-all duration-200',
                  isOpen ? 'visible opacity-100' : 'invisible opacity-0',
                )}
              >
                <ul className="flex w-full flex-col gap-1.5 bg-foreground p-4 shadow-lg">
                  {children.map((child, childIndex) => {
                    return (
                      <li key={childIndex}>
                        <NextLink
                          href={child.href ?? '#'}
                          className="flex items-start gap-3 py-2.5 pl-2.5 transition-colors hover:bg-gray-94"
                        >
                          {child.icon && (
                            <div className="flex size-9 items-center justify-center border border-gray-70 bg-foreground">
                              <Image
                                src={child.icon}
                                alt=""
                                width={20}
                                height={20}
                                className="size-5 shrink-0"
                                aria-hidden
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-sm leading-none font-medium tracking-tight text-background">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="text-xs leading-tight tracking-tight text-gray-40">
                                {child.description}
                              </span>
                            )}
                          </div>
                        </NextLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        }

        return (
          <NextLink
            key={index}
            href={href ?? '#'}
            aria-current={index === activeIndex ? 'page' : undefined}
            onMouseEnter={() => setHoveredIndex(index)}
            className={cn(
              'inline-flex items-center gap-0.5 text-sm leading-none font-medium tracking-tight transition-colors',
              isHovered ? 'text-gray-30' : 'text-background',
            )}
          >
            {label}
          </NextLink>
        );
      })}
    </nav>
  );
}

export default Nav;
