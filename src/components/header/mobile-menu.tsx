'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { IMenuItem } from '@/types/common';
import { homeHeaderLinks } from '@/constants/home';
import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';
import { Icons } from '@/components/icons';

interface MobileMenuProps {
  items: IMenuItem[];
}

function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [discordLink, githubLink] = homeHeaderLinks.social;
  const [loginLink, signUpLink] = homeHeaderLinks.auth;
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
    setExpandedIndex(null);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  if (!items || items.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative z-60 flex size-11 items-center justify-center bg-foreground lg:hidden"
        style={open ? { boxShadow: '-0.375rem 0 0 0 var(--color-foreground)' } : undefined}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <div className="relative size-5">
          <span
            className={cn(
              'absolute left-0 block h-[1.5px] w-full bg-background transition-all duration-300',
              open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-1',
            )}
          />
          <span
            className={cn(
              'absolute top-1/2 left-0 block h-[1.5px] w-full -translate-y-1/2 bg-background transition-opacity duration-300',
              open ? 'opacity-0' : 'opacity-100',
            )}
          />
          <span
            className={cn(
              'absolute left-0 block h-[1.5px] w-full bg-background transition-all duration-300',
              open ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-1',
            )}
          />
        </div>
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/50 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute top-full right-5 left-5 z-50 max-h-[calc(100dvh-60px)] overflow-y-auto bg-foreground shadow-2xl transition-all duration-300 md:right-8 md:left-8 lg:hidden',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
        )}
      >
        <div className="px-5 py-5">
          <nav className="flex flex-col">
            {items.map((item, index) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isExpanded = expandedIndex === index;

              if (hasChildren) {
                return (
                  <div key={index} className="border-b border-foreground/10">
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="flex w-full items-center justify-between py-3.5 text-base font-medium tracking-tight text-background transition-colors hover:text-gray-30"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'size-4 opacity-70 transition-transform duration-200',
                          isExpanded && 'rotate-180',
                        )}
                        strokeWidth={2}
                      />
                    </button>
                    <div
                      className={cn(
                        'grid transition-all duration-200',
                        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="flex flex-col gap-1 pb-3">
                          {item.children!.map((child, ci) => (
                            <li key={ci}>
                              <NextLink
                                href={child.href ?? '#'}
                                className="flex items-start gap-3 py-2.5 transition-colors hover:bg-foreground/5"
                                onClick={() => setOpen(false)}
                              >
                                {child.icon && (
                                  <div className="flex size-9 shrink-0 items-center justify-center border border-gray-70">
                                    <Image
                                      src={child.icon}
                                      alt=""
                                      width={20}
                                      height={20}
                                      className="size-5"
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
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <NextLink
                  key={index}
                  href={item.href ?? '#'}
                  className="border-b border-foreground/10 py-3.5 text-base font-medium tracking-tight text-background transition-colors hover:text-gray-30"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NextLink>
              );
            })}
          </nav>

          <div className="mt-5 flex flex-col gap-2">
            <div className="flex gap-1">
              <Link href={discordLink.href} className="flex-1">
                {discordLink.label}
              </Link>
              <Link
                href={githubLink.href}
                className="flex-1 gap-1"
                aria-label={`${githubLink.label} repository (${githubLink.metric} stars)`}
              >
                <Icons.github className="text-background" size={18} aria-hidden="true" />
                <span className="sr-only">{githubLink.label}</span>
                <span>{githubLink.metric}</span>
              </Link>
            </div>
            <div className="flex gap-1">
              <Link
                href={loginLink.href}
                variant="secondary"
                className="flex-1 border-gray-70 text-background"
              >
                {loginLink.label}
              </Link>
              <Link
                href={signUpLink.href}
                className="flex-1 bg-background text-foreground hover:bg-gray-12"
              >
                {signUpLink.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
