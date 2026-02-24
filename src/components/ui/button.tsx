import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  cn(
    'relative inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_a]:relative [&_a]:z-10',
    'before:absolute before:cursor-pointer before:inset-0 before:border before:border-transparent before:rounded-[inherit] before:bg-transparent before:opacity-0 before:transition-opacity before:ease-in-out hover:before:opacity-100',
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary',
          // INFO: use foreground and primary-foreground color in case of darken button color
          'text-primary-foreground before:bg-black/15 dark:before:bg-black/25',
          // INFO: use black text color in case of light button color
          // "text-black before:bg-black/10 dark:before:bg-black/15",
        ),
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'border border-secondary-foreground/10 before:-inset-px before:bg-black/5 dark:before:bg-white/8 bg-secondary text-secondary-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-10 rounded-md px-5 text-sm leading-none lg:h-11 lg:rounded-lg lg:text-base lg:leading-none',
        xs: 'h-6 rounded px-2.5 text-xs leading-none',
        sm: 'h-8 rounded-md px-4 text-[0.8125rem]',
        md: 'h-10 rounded-md px-4 text-[0.8125rem]',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
  const baseTextClasses =
    'relative z-10 inline-flex whitespace-nowrap items-center justify-center gap-1 w-full';

  if (asChild && React.isValidElement(children)) {
    const elementToClone = children as React.ReactElement<
      { className?: string; children?: React.ReactNode } & Record<string, unknown>
    >;
    return React.cloneElement(elementToClone, {
      ...rest,
      'data-slot': 'button',
      className: cn(classes, elementToClone.props.className),
      children: <span className={baseTextClasses}>{elementToClone.props.children}</span>,
    });
  }

  return (
    <button className={classes} data-slot="button" {...rest}>
      <span className={baseTextClasses}>{children}</span>
    </button>
  );
}

export { Button, buttonVariants };
