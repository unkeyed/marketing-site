import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm inline-flex items-center w-fit tracking-[0.03em] leading-snug rounded-[0.375rem] border',
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

const labelTextVariants = cva('font-label uppercase', {
  variants: {
    variant: {
      dark: 'text-white',
      light: 'text-background',
    },
    size: {
      sm: 'text-xs',
      md: 'text-[0.8125rem] md:text-sm',
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
  md: 'h-[0.625rem] w-[0.625rem]',
  lg: 'h-3 w-3',
  plain: 'h-[0.625rem] w-[0.625rem]',
};

const dotColorMap = {
  blue: {
    darkGlow: 'bg-blue-glow',
    darkDot: 'bg-cyan',
    lightDot: 'bg-blue-dot',
  },
  yellow: {
    darkGlow: 'bg-yellow-glow',
    darkDot: 'bg-yellow',
    lightDot: 'bg-yellow',
  },
  orange: {
    darkGlow: 'bg-orange-glow',
    darkDot: 'bg-orange',
    lightDot: 'bg-orange',
  },
  purple: {
    darkGlow: 'bg-purple-glow',
    darkDot: 'bg-purple-dot',
    lightDot: 'bg-purple-dot',
  },
  green: {
    darkGlow: 'bg-green-glow',
    darkDot: 'bg-green-dot',
    lightDot: 'bg-green-dot',
  },
  red: {
    darkGlow: 'bg-red-glow',
    darkDot: 'bg-red-dot',
    lightDot: 'bg-red-dot',
  },
  lightblue: {
    darkGlow: 'bg-lightblue-glow',
    darkDot: 'bg-lightblue-dot',
    lightDot: 'bg-lightblue-dot',
  },
  lime: {
    darkGlow: 'bg-lime-glow',
    darkDot: 'bg-lime-dot',
    lightDot: 'bg-lime-dot',
  },
  pink: {
    darkGlow: 'bg-pink-glow',
    darkDot: 'bg-pink-dot',
    lightDot: 'bg-pink-dot',
  },
  gray: {
    darkGlow: 'bg-gray-glow',
    darkDot: 'bg-gray-dot',
    lightDot: 'bg-gray-dot',
  },
} as const;

type TLabelDotColor = keyof typeof dotColorMap;

export interface LabelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof labelVariants> {
  labelClassName?: string;
  dotColor?: TLabelDotColor;
}

function Label({
  children,
  variant = 'dark',
  size = 'md',
  dotColor = 'blue',
  className,
  labelClassName,
  ...props
}: LabelProps) {
  const dotSize = dotSizeMap[size ?? 'md'];
  const colors = dotColorMap[dotColor];

  return (
    <div className={cn(labelVariants({ variant, size }), className)} {...props}>
      {variant === 'dark' ? (
        <span className={cn('relative', dotSize)}>
          <span className={cn('absolute inset-0 rounded-[2px] blur-[5px]', colors.darkGlow)} />
          <span className={cn('absolute inset-0 rounded-[2px] blur-[2px]', colors.darkDot)} />
          <span className={cn('absolute inset-0 rounded-[2px]', colors.darkDot)} />
        </span>
      ) : (
        <span className={cn('rounded-[2px]', dotSize, colors.lightDot)} />
      )}
      <span className={cn(labelTextVariants({ variant, size }), labelClassName)}>{children}</span>
    </div>
  );
}

export { Label, labelVariants, labelTextVariants };
