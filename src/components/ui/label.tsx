import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm inline-flex items-center w-fit tracking-[0.03em] leading-snug rounded-[6px] border',
  {
    variants: {
      variant: {
        dark: 'border-gray-20',
        light: 'border-[rgba(4,4,6,0.2)]',
      },
      size: {
        sm: 'gap-2 px-2.5 py-1.5',
        md: 'gap-2.5 px-3 py-1.75',
        lg: 'gap-3 px-4 py-2.5',
        plain: 'gap-2.5 p-0 border-none',
      },
    },
    defaultVariants: {
      variant: 'dark',
      size: 'md',
    },
  },
);

const labelTextVariants = cva('font-mono uppercase', {
  variants: {
    variant: {
      dark: 'text-white',
      light: 'text-background',
    },
    size: {
      sm: 'text-xs',
      md: 'text-[0.8125rem]',
      lg: 'text-base',
      plain: 'text-sm',
    },
  },
  defaultVariants: {
    variant: 'dark',
    size: 'md',
  },
});

const dotSizeMap: Record<string, string> = {
  sm: 'h-2 w-2',
  md: 'h-[10px] w-[10px]',
  lg: 'h-3 w-3',
  plain: 'h-[10px] w-[10px]',
};

export interface LabelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof labelVariants> {
  labelClassName?: string;
}

function Label({
  children,
  variant = 'dark',
  size = 'md',
  className,
  labelClassName,
  ...props
}: LabelProps) {
  const dotSize = dotSizeMap[size ?? 'md'];

  return (
    <div className={cn(labelVariants({ variant, size }), className)} {...props}>
      {variant === 'dark' ? (
        <span className={cn('relative', dotSize)}>
          <span className="absolute inset-0 rounded-[2px] bg-blue-glow blur-[5px]" />
          <span className="absolute inset-0 rounded-[2px] bg-cyan blur-[2px]" />
          <span className="absolute inset-0 rounded-[2px] bg-cyan" />
        </span>
      ) : (
        <span className={cn('rounded-[2px] bg-legacy-blue', dotSize)} />
      )}
      <span className={cn(labelTextVariants({ variant, size }), labelClassName)}>{children}</span>
    </div>
  );
}

export { Label, labelVariants, labelTextVariants };
