import { ArrowLeft } from 'lucide-react';

import type { IBreadcrumbItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';

interface IBreadcrumbsProps {
  className?: string;
  items: readonly IBreadcrumbItem[];
  /** Show back arrow on the first link (e.g. for blog). */
  showBackIconOnFirst?: boolean;
}

function Breadcrumbs({ className, items, showBackIconOnFirst }: IBreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;
          const showIcon = showBackIconOnFirst && isFirst && item.href;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span
                  className="mx-2.5 text-sm leading-none font-medium tracking-tight text-muted-foreground"
                  aria-hidden
                >
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <Link
                  className={cn(
                    'gap-x-0.5 px-0 leading-none whitespace-nowrap',
                    isFirst
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'hover:text-foreground',
                    showIcon && 'group',
                  )}
                  variant={isFirst ? 'muted' : 'foreground'}
                  size="small"
                  href={item.href}
                >
                  {showIcon && (
                    <ArrowLeft
                      className="size-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
                      size={14}
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="px-0 text-sm leading-none whitespace-nowrap text-foreground"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
