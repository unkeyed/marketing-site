'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

interface MobileMenuProps {
  items: IMenuItem[];
}

function hasActiveDescendant(item: IMenuItem, currentPath: string): boolean {
  if (item.href === currentPath) return true;
  if (item.children) {
    return item.children.some((child) => hasActiveDescendant(child, currentPath));
  }
  return false;
}

interface RecursiveMenuItemComponentProps {
  item: IMenuItem;
  depth: number;
  currentPath: string;
}

function RecursiveMenuItemComponent({ item, depth, currentPath }: RecursiveMenuItemComponentProps) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isActive = hasActiveDescendant(item, currentPath);
  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive, currentPath]);

  if (hasChildren) {
    return (
      <li>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="group flex h-9 w-full items-center justify-between rounded px-0 text-left text-sm font-medium text-foreground transition-colors hover:text-primary [&[data-state=open]>svg]:rotate-90">
            {item.href ? (
              <Link href={item.href} className="text-base leading-snug font-medium tracking-tight">
                {item.label}
              </Link>
            ) : (
              <span className="text-base leading-snug font-medium tracking-tight text-foreground">
                {item.label}
              </span>
            )}
            <ChevronRight className="size-4 shrink-0 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden">
            {item.children && <RecursiveMenu items={item.children} depth={depth + 1} />}
          </CollapsibleContent>
        </Collapsible>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href ?? '#'}
        className={cn(
          'flex h-9 flex-1 items-center text-base leading-snug font-medium tracking-tight hover:text-primary',
          isActive ? 'text-primary' : 'text-foreground',
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}

function RecursiveMenu({ items, depth = 0 }: { items: IMenuItem[]; depth?: number }) {
  const pathname = usePathname();

  return (
    <ul className={cn('flex flex-col', depth > 0 && 'border-l border-border pl-4')}>
      {items.map((item, idx) => (
        <RecursiveMenuItemComponent key={idx} item={item} depth={depth} currentPath={pathname} />
      ))}
    </ul>
  );
}

function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  if (!items || items.length === 0) {
    return null;
  }

  // TODO: Consider how we can fix the positioning issues of the menu documentation button
  //  and make sure background scroll position is calculated correctly.
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
      preventScrollRestoration
    >
      <DrawerTrigger className="relative ml-4 flex size-6 text-foreground outline-hidden lg:hidden">
        <span className="absolute -inset-3 lg:hidden" />
        <svg
          className="-mr-1.5 shrink-0"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.99902 7.71436H19.999"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.99902 16.2856H19.999"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="sr-only">Open menu</span>
      </DrawerTrigger>
      <DrawerContent className="flex h-[45dvh] flex-col rounded-t-xl border border-border p-0 lg:hidden">
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-6 pb-12 md:px-8">
          <RecursiveMenu items={items} />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full bg-linear-to-b from-transparent to-background"
          aria-hidden
        />
      </DrawerContent>
    </Drawer>
  );
}

export default MobileMenu;
