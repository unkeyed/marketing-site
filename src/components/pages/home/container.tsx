import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const homeContainerVariants = cva('mx-auto w-full px-5 md:px-8 xl:px-10 2xl:px-0', {
  variants: {
    size: {
      content: 'max-w-[var(--spacing-content)]',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'content',
  },
});

interface IContainerProps
  extends ComponentProps<'div'>,
    VariantProps<typeof homeContainerVariants> {}

export default function Container({ className, size, ...props }: IContainerProps) {
  return <div className={cn(homeContainerVariants({ size }), className)} {...props} />;
}
