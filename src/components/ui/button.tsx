import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-gray-90',
        primary: 'bg-foreground text-background hover:bg-gray-90',
        secondary: 'border border-foreground text-foreground hover:bg-gray-12',
        dark: 'border border-foreground bg-black text-foreground backdrop-blur-[10px] hover:bg-foreground/10',
        link: 'text-primary underline-offset-4 hover:underline',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        xs: 'h-6 rounded px-2.5 text-xs leading-none',
        sm: 'h-8 rounded-md px-4 text-[0.8125rem]',
        icon: 'size-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, children, ...rest }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild && React.isValidElement(children)) {
    const elementToClone = children as React.ReactElement<
      { className?: string; children?: React.ReactNode } & Record<string, unknown>
    >;
    return React.cloneElement(elementToClone, {
      ...rest,
      'data-slot': 'button',
      className: cn(classes, elementToClone.props.className),
    });
  }

  return (
    <button className={classes} data-slot="button" {...rest}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
