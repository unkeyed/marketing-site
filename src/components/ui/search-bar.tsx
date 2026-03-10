'use client';

import { useEffect, useState } from 'react';
import { Route } from 'next';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

import type { IBlogSearchItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import { useTouchDevice } from '@/hooks/use-touch-device';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import SearchDialog from '@/components/ui/search-dialog';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  showOnRoute?: (Route<string> | URL)[];
  enableCmdK?: boolean;
  searchItems?: IBlogSearchItem[];
  suggestions?: IBlogSearchItem[];
}

function SearchBar({
  placeholder = 'Search...',
  className,
  showOnRoute,
  enableCmdK = true,
  searchItems,
  suggestions,
  ...props
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isTouchDevice = useTouchDevice();

  useEffect(() => {
    if (!enableCmdK || isTouchDevice) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableCmdK, isTouchDevice]);

  if (showOnRoute && showOnRoute.length > 0) {
    const isShow = showOnRoute.find((route) => pathname.startsWith(route.toString()));
    if (!isShow) {
      return null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          aria-label="Search"
          className={cn(
            'relative !h-12 w-full justify-start rounded-lg border border-input bg-muted/50 px-2 text-sm font-normal text-muted-foreground shadow-none hover:bg-muted md:!h-8 lg:!h-9 lg:pl-2.5 [&_svg]:size-4',
            className,
          )}
          size="sm"
          {...props}
        >
          <Search />
          <span className="mr-auto ml-2 inline-flex text-[0.8125rem] font-normal">
            {placeholder}
          </span>
          {!isTouchDevice && enableCmdK && (
            <kbd className="pointer-events-none flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-xs leading-snug tracking-tight select-none">
              <span className="text-base">⌘</span>K
            </kbd>
          )}
        </Button>
      </DialogTrigger>
      <SearchDialog open={open} searchItems={searchItems} suggestions={suggestions} />
    </Dialog>
  );
}

export default SearchBar;
