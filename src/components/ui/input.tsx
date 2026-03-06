import * as React from 'react';

import { cn } from '@/lib/utils';

const inputBaseClasses =
  'flex h-11 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-base leading-snug tracking-tight transition-colors duration-300 remove-autocomplete-styles file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus:border-accent-foreground focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50';

interface IInputProps extends React.ComponentProps<'input'> {
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(function Input(
  { className, type, suffix, ...props },
  ref,
) {
  if (suffix != null && suffix !== '') {
    return (
      <div
        className={cn(
          'flex h-11 w-full items-center gap-1.5 overflow-hidden rounded-md border border-border bg-background pr-3.5 transition-colors duration-300 has-[:focus]:border-accent-foreground',
          className,
        )}
        data-slot="input"
      >
        <input
          ref={ref}
          type={type}
          className={cn(
            'remove-number-spinners min-w-0 flex-1 border-0 bg-transparent px-3.5 py-2.5 text-base leading-snug tracking-tight outline-none remove-autocomplete-styles file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          )}
          {...props}
        />
        <span className="shrink-0 text-sm leading-none tracking-tight text-muted-foreground">
          {suffix}
        </span>
      </div>
    );
  }

  return (
    <input
      ref={ref}
      type={type}
      className={cn(inputBaseClasses, className)}
      data-slot="input"
      {...props}
    />
  );
});

export { Input };
export type { IInputProps };
