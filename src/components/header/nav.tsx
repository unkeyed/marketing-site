'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { IMenuItem } from '@/types/common';
import { cn, isExternalLink } from '@/lib/utils';

import {
  HeaderPopover,
  HeaderPopoverItem,
  HeaderPopoverPreview,
  HeaderPopoverText,
} from './header-popover';

interface IHeaderNavProps {
  className?: string;
  items: IMenuItem[];
  ariaLabel?: string;
}

function Nav({ className, items, ariaLabel = 'Primary navigation' }: IHeaderNavProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const lastPointerTypeRef = useRef<string>('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openedByTouch, setOpenedByTouch] = useState(false);

  const closeDropdown = useCallback(() => {
    setHoveredIndex(null);
    setOpenDropdown(null);
    setOpenedByTouch(false);
  }, []);

  const activeIndex = useMemo(
    () =>
      items.findIndex(({ href }) =>
        href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`),
      ),
    [pathname, items],
  );

  useEffect(() => {
    closeDropdown();
  }, [pathname, closeDropdown]);

  useEffect(() => {
    if (openDropdown === null) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [openDropdown, closeDropdown]);

  useEffect(() => {
    if (!openedByTouch || openDropdown === null) {
      return;
    }

    const handleTouchScroll = () => {
      closeDropdown();
    };

    window.addEventListener('touchmove', handleTouchScroll, { passive: true });
    window.addEventListener('scroll', handleTouchScroll, { passive: true });

    return () => {
      window.removeEventListener('touchmove', handleTouchScroll);
      window.removeEventListener('scroll', handleTouchScroll);
    };
  }, [openedByTouch, openDropdown, closeDropdown]);

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={cn('flex', className)}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') {
          return;
        }
        closeDropdown();
      }}
    >
      {items.map(({ href, label, children }, index) => {
        const isHovered = index === hoveredIndex;
        const hasChildren = Array.isArray(children) && children.length > 0;
        const isOpen = openDropdown === index;
        const isExternal = isExternalLink(href);

        if (hasChildren) {
          return (
            <div
              key={index}
              className="relative flex items-center justify-center"
              onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse') {
                  return;
                }
                setHoveredIndex(index);
                setOpenDropdown(index);
                setOpenedByTouch(false);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'mouse') {
                  return;
                }
                closeDropdown();
              }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onPointerDown={(event) => {
                  lastPointerTypeRef.current = event.pointerType;
                }}
                onClick={(event) => {
                  const isOpening = openDropdown !== index;
                  const isKeyboardActivation = event.detail === 0;
                  const openedWithTouch =
                    !isKeyboardActivation && lastPointerTypeRef.current === 'touch';

                  setHoveredIndex(isOpening ? index : null);
                  setOpenDropdown(isOpening ? index : null);
                  setOpenedByTouch(isOpening && openedWithTouch);
                  lastPointerTypeRef.current = '';
                }}
                className={cn(
                  'relative inline-flex h-full items-center gap-0.5 px-5 py-0 text-sm leading-none font-medium tracking-tight transition-colors',
                  isOpen && 'after:absolute after:top-full after:left-0 after:h-4.5 after:w-full',
                  isOpen
                    ? 'bg-gray-94 text-background'
                    : isHovered
                      ? 'text-background hover:bg-gray-94'
                      : 'text-background',
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

              <HeaderPopover isOpen={isOpen} className="left-0">
                {children.map((child, childIndex) => (
                  <HeaderPopoverItem key={childIndex}>
                    <NextLink
                      href={child.href ?? '#'}
                      onClick={closeDropdown}
                      target={isExternalLink(child.href) ? '_blank' : undefined}
                      rel={isExternalLink(child.href) ? 'noopener noreferrer' : undefined}
                    >
                      {child.icon && (
                        <HeaderPopoverPreview>
                          <Image
                            src={child.icon}
                            alt=""
                            width={20}
                            height={20}
                            className="size-5 shrink-0"
                            aria-hidden
                          />
                        </HeaderPopoverPreview>
                      )}
                      <HeaderPopoverText label={child.label} description={child.description} />
                    </NextLink>
                  </HeaderPopoverItem>
                ))}
              </HeaderPopover>
            </div>
          );
        }

        return (
          <NextLink
            key={index}
            href={href ?? '#'}
            aria-current={index === activeIndex ? 'page' : undefined}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'mouse') {
                return;
              }
              setHoveredIndex(index);
            }}
            onClick={closeDropdown}
            className={cn(
              'inline-flex items-center gap-0.5 px-5 text-sm leading-none font-medium tracking-tight transition-colors first:pl-0 last:pr-6',
              isHovered ? 'text-background hover:bg-gray-94' : 'text-background',
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
