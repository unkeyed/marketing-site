import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Check, Danger, Info, Note, Tip, Warning } from './callouts';

// Rewrite relative links (e.g. /platform/instances/overview) to absolute docs URLs
function ChangelogAnchor({ href, className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const resolvedHref = href?.startsWith('/') ? `https://unkey.com/docs${href}` : href;
  return (
    <a
      {...props}
      href={resolvedHref}
      aria-label={props['aria-label'] ?? 'Link'}
      className={cn('text-foreground underline hover:text-muted-foreground', className)}
    />
  );
}

function CardGroup({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  const colMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4',
  };
  return <div className={cn('my-6 grid gap-4', colMap[cols] ?? colMap[2])}>{children}</div>;
}

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <figure
      className={cn(
        'not-prose my-6 overflow-hidden rounded-lg border border-border bg-background p-2',
        className,
      )}
    >
      {children}
    </figure>
  );
}

function Badge({
  children,
  className,
  variant = 'default',
}: {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}) {
  return (
    <span
      className={cn(
        'not-prose inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-tight',
        variant === 'outline'
          ? 'border border-border text-foreground'
          : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}

function Columns({
  children,
  cols = 2,
  className,
}: {
  children: ReactNode;
  cols?: number;
  className?: string;
}) {
  const colMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4',
  };
  return (
    <div className={cn('my-6 grid gap-6', colMap[cols] ?? colMap[2], className)}>{children}</div>
  );
}

function CodeGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('my-6 flex flex-col gap-3', className)}>{children}</div>;
}

export const changelogMdxComponents: Record<string, unknown> = {
  a: ChangelogAnchor,
  Note,
  Info,
  Tip,
  Check,
  Warning,
  Danger,
  Frame,
  CardGroup,
  Badge,
  Columns,
  CodeGroup,
};
