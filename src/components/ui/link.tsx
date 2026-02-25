import * as React from 'react';
import type { Route } from 'next';
import NextLink from 'next/link';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const linkVariants = cva(
  'inline-flex items-center justify-center h-11  gap-1 font-medium leading-none tracking-[-0.35px] transition duration-200 ease-in-out',
  {
    variants: {
      variant: {
        primary: 'bg-foreground text-background hover:bg-gray-90',
        secondary: 'border bg-transparent border-foreground text-foreground hover:bg-gray-12',
      },
      size: {
        small: 'px-6 text-sm',
        medium: 'px-5 py-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);

export interface LinkProps<T extends string = string>
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
  href: string | URL | Route<T>;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps<string>>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    const isInternalLink = typeof href === 'string' && href.startsWith('/');

    if (isInternalLink) {
      return (
        <NextLink
          className={cn(linkVariants({ variant, size, className }))}
          href={href}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <Comp
        className={cn(linkVariants({ variant, size, className }))}
        href={href.toString()}
        ref={ref}
        {...props}
      />
    );
  },
);
Link.displayName = 'Link';

export { Link, linkVariants };
