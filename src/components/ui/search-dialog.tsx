'use client';

import { KeyboardEvent, useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import { BookOpen, FileText } from 'lucide-react';

import type { IBlogSearchItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import useDebounce from '@/hooks/use-debounce';
import { useTouchDevice } from '@/hooks/use-touch-device';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type ContentCategory = 'documentation' | 'api' | 'guide' | 'component' | 'tutorial' | 'blog';

/** Unified search result item; supports blog and future doc categories. */
interface SearchItem {
  id: number | string;
  title: string;
  icon?: 'book-open' | 'file-text';
  description?: string;
  category: ContentCategory;
  url: string;
  searchableText?: string;
}

const BLOG_SEARCH_RECENT_KEY = 'blog-search-recent';
const BLOG_SEARCH_RECENT_LIMIT = 5;

const CATEGORY_LABELS: Record<ContentCategory, string> = {
  documentation: 'Documentation',
  api: 'API Reference',
  guide: 'Guides',
  component: 'Components',
  tutorial: 'Tutorials',
  blog: 'Blog posts',
};

function loadRecents(): SearchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(BLOG_SEARCH_RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecents(items: SearchItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BLOG_SEARCH_RECENT_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function useSearch(searchItems: SearchItem[]) {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const q = searchQuery.toLowerCase();
        const withPriority = searchItems
          .map((item) => {
            const inTitle = item.title.toLowerCase().includes(q);
            const inDescription = item.description?.toLowerCase().includes(q) ?? false;
            const inBody = item.searchableText?.toLowerCase().includes(q) ?? false;
            if (!inTitle && !inDescription && !inBody) return null;
            const priority = inTitle ? 0 : inDescription ? 1 : 2;
            return { item, priority };
          })
          .filter((entry): entry is { item: SearchItem; priority: number } => entry !== null)
          .sort((a, b) => a.priority - b.priority)
          .map(({ item }) => item);

        setResults(withPriority);
      } finally {
        setIsLoading(false);
      }
    },
    [searchItems],
  );

  return {
    results,
    isLoading,
    performSearch,
  };
}

interface SearchInputProps {
  className?: string;
  query: string;
  setQuery: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

const SearchInput = ({ query, setQuery, className, inputRef }: SearchInputProps) => {
  return (
    <input
      className={cn(
        'w-full border-b border-border bg-transparent py-3.5 pr-16 pl-4 leading-snug tracking-tight remove-autocomplete-styles placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0',
        className,
      )}
      type="text"
      placeholder="What are you searching for?"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputRef}
      tabIndex={1}
    />
  );
};
SearchInput.displayName = 'SearchInput';

interface SearchHintProps extends Pick<SearchItem, 'title' | 'description' | 'url' | 'icon'> {
  isSelected?: boolean;
  dataIndex: number;
  isLast?: boolean;
  onMouseEnter: () => void;
  onSelect?: () => void;
}

function SearchHint({
  url,
  title,
  description,
  icon,
  isSelected,
  dataIndex,
  isLast,
  onMouseEnter,
  onSelect,
}: SearchHintProps) {
  const isFirst = dataIndex === 0;
  const IconComp = icon === 'book-open' ? BookOpen : FileText;

  return (
    <Link
      className={cn(
        'group flex w-full cursor-pointer items-center gap-x-3 rounded-lg py-2.5 text-left outline-hidden transition-colors duration-150 focus-within:bg-muted/50 sm:pr-6 sm:pl-3',
        isSelected && 'sm:bg-muted/50',
        isFirst && 'scroll-mt-12',
        !isFirst && !isLast && 'scroll-my-2',
        isLast && 'scroll-mb-5',
      )}
      href={url}
      onMouseEnter={onMouseEnter}
      onClick={onSelect}
      tabIndex={-1}
      data-index={dataIndex}
    >
      <IconComp
        className={cn(
          'hidden size-5 shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground sm:inline-block',
          isSelected && 'sm:text-foreground',
        )}
      />
      <div className="flex flex-col gap-y-0.5">
        <p
          className={cn(
            'line-clamp-1 max-w-full text-sm leading-tight font-medium tracking-tight text-popover-foreground transition-colors duration-150',
          )}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn(
              'line-clamp-1 max-w-full text-[0.8125rem] leading-snug font-medium tracking-tight text-muted-foreground transition-colors duration-150',
            )}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

interface SearchGroupProps {
  title: string;
  entries: { item: SearchItem; index: number }[];
  selectedIndex: number | null;
  totalItems: number;
  onItemChange: (index: number) => void;
  onSelectItem?: (item: SearchItem) => void;
}

function SearchGroup({
  title,
  entries,
  selectedIndex,
  totalItems,
  onItemChange,
  onSelectItem,
}: SearchGroupProps) {
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-y-3">
      <h3 className="text-[0.8125rem] leading-none font-medium tracking-tight text-muted-foreground">
        {title}
      </h3>
      <ul>
        {entries.map(({ item, index: itemIndex }) => (
          <li key={String(item.id)}>
            <SearchHint
              title={item.title}
              description={item.description}
              url={item.url}
              icon={item.icon}
              isSelected={selectedIndex === itemIndex}
              isLast={itemIndex === totalItems - 1}
              dataIndex={itemIndex}
              onMouseEnter={() => onItemChange(itemIndex)}
              onSelect={onSelectItem ? () => onSelectItem(item) : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const NoResultsFound = () => (
  <p className="pt-3 text-center text-sm leading-tight font-medium tracking-tight text-muted-foreground">
    No results found.
  </p>
);

interface SearchDialogProps {
  open: boolean;
  searchItems?: SearchItem[];
  suggestions?: SearchItem[];
}

export default function SearchDialog({
  open,
  searchItems = [],
  suggestions = [],
}: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { results, isLoading, performSearch } = useSearch(searchItems);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const isTouchDevice = useTouchDevice();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setRecentSearches(loadRecents());
    }
  }, [open]);

  const addRecent = useCallback((item: SearchItem) => {
    setRecentSearches((prev) => {
      const next = [item, ...prev.filter((r) => r.url !== item.url)].slice(
        0,
        BLOG_SEARCH_RECENT_LIMIT,
      );
      saveRecents(next);
      return next;
    });
  }, []);

  const allItems = useCallback((): { item: SearchItem; index: number }[] => {
    if (!query) {
      return [
        ...recentSearches.map((item, index) => ({ item, index })),
        ...suggestions.map((item, index) => ({
          item,
          index: recentSearches.length + index,
        })),
      ];
    }
    return results.map((item, index) => ({ item, index }));
  }, [query, results, recentSearches, suggestions]);

  const items = allItems();
  const totalItems = items.length;

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleOpenAutoFocus = (event: Event) => {
    if (isTouchDevice) return;
    event.preventDefault();
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (selectedIndex < totalItems - 1) {
        setSelectedIndex(selectedIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    } else if (e.key === 'Enter' && selectedIndex !== null) {
      // handle escape button focus
      if ((e.target as HTMLElement)?.tabIndex === 2) {
        return;
      }

      e.preventDefault();
      const selectedElement = document.querySelector(
        `[data-index="${selectedIndex}"]`,
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.click();
      }
    } else if (e.key === 'Escape') {
      setSelectedIndex(0);
    }
  };

  const handleItemChange = (index: number) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [results, query]);

  // Auto-scroll to selected item
  useEffect(() => {
    if (isTouchDevice) return;

    if (selectedIndex !== null) {
      const selectedElement = document.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        const blockOption = cn({
          start: selectedIndex === 0,
          end: selectedIndex === totalItems - 1,
          nearest: selectedIndex > 0 && selectedIndex < totalItems - 1,
        }) as ScrollLogicalPosition;
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: blockOption,
        });
      }
    }
  }, [selectedIndex, totalItems, isTouchDevice]);

  const renderSearchResults = () => {
    if (results.length === 0) return <NoResultsFound />;

    const withIndex = results.map((item, index) => ({ item, index }));
    const resultsByCategory = withIndex.reduce(
      (acc, entry) => {
        const cat = entry.item.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(entry);
        return acc;
      },
      {} as Record<ContentCategory, { item: SearchItem; index: number }[]>,
    );

    const categoryOrder: ContentCategory[] = [
      'documentation',
      'api',
      'guide',
      'component',
      'tutorial',
      'blog',
    ];

    return (
      <>
        {categoryOrder.map((category) => {
          const entries = resultsByCategory[category];
          if (!entries || entries.length === 0) return null;

          return (
            <SearchGroup
              key={category}
              title={CATEGORY_LABELS[category]}
              entries={entries}
              selectedIndex={selectedIndex}
              totalItems={totalItems}
              onItemChange={handleItemChange}
              onSelectItem={addRecent}
            />
          );
        })}
      </>
    );
  };

  return (
    <DialogContent
      className="top-auto bottom-0 h-[75dvh] w-full max-w-(--breakpoint-sm) translate-y-0 rounded-t-xl p-0 shadow-none outline-hidden data-[state=closed]:zoom-out-100 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=open]:zoom-in-100 data-[state=open]:slide-in-from-bottom-1/2 sm:top-[20dvh] sm:bottom-auto sm:h-auto sm:rounded-lg sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:slide-out-to-bottom-1 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-1"
      onOpenAutoFocus={handleOpenAutoFocus}
      onCloseAutoFocus={handleCloseAutoFocus}
    >
      <DialogTitle className="sr-only">Search</DialogTitle>
      <div className="relative flex flex-col" onKeyDown={handleKeyDown}>
        <div className="relative">
          <SearchInput
            className={cn(isTouchDevice && 'pr-4')}
            inputRef={inputRef}
            query={query}
            setQuery={setQuery}
          />
          <DialogClose asChild>
            <Button
              className={cn(
                'absolute top-1/2 right-4 -translate-y-1/2 rounded border border-muted px-3 py-1.5 outline-hidden',
                isTouchDevice && 'hidden',
              )}
              variant="outline"
              tabIndex={2}
              size="xs"
            >
              <span className="sr-only">To close the search dialog, press Escape</span>
              <span className="text-xs leading-none tracking-tight" aria-hidden>
                Esc
              </span>
            </Button>
          </DialogClose>
        </div>

        <ScrollArea className="max-h-[calc(75dvh-3.125rem)] sm:max-h-[min(calc(40rem-3.5rem),calc(60dvh-3.5rem))]">
          <div className="relative flex min-h-20 flex-col gap-y-5 overflow-hidden px-4 py-5">
            {isLoading && (
              <div className="flex justify-center pt-3">
                <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"></div>
              </div>
            )}

            {!isLoading && !query && (
              <>
                <SearchGroup
                  title="Recent"
                  entries={recentSearches.map((item, index) => ({ item, index }))}
                  selectedIndex={selectedIndex}
                  totalItems={totalItems}
                  onItemChange={handleItemChange}
                  onSelectItem={addRecent}
                />
                <SearchGroup
                  title="Suggestions"
                  entries={suggestions.map((item, index) => ({
                    item,
                    index: recentSearches.length + index,
                  }))}
                  selectedIndex={selectedIndex}
                  totalItems={totalItems}
                  onItemChange={handleItemChange}
                  onSelectItem={addRecent}
                />
              </>
            )}

            {!isLoading && query && renderSearchResults()}
          </div>
          <ScrollBar className="invisible" orientation="horizontal" />
        </ScrollArea>
      </div>
    </DialogContent>
  );
}
