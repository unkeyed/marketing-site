import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

type TNumberInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

const NumberInput = React.forwardRef<HTMLInputElement, TNumberInputProps>(function NumberInput(
  { className, disabled, value, ...props },
  ref,
) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const handleStepUp = React.useCallback(() => {
    inputRef.current?.stepUp();
    inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
    inputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
  }, []);

  const handleStepDown = React.useCallback(() => {
    inputRef.current?.stepDown();
    inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
    inputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
  }, []);

  const normalizedValue = value === undefined || value === null ? undefined : String(value);

  return (
    <div
      className={cn(
        'flex h-9 w-full overflow-hidden rounded-md border border-border bg-background transition-colors duration-300 has-[:focus]:border-accent-foreground',
        className,
      )}
      data-slot="number-input"
    >
      <input
        ref={mergedRef}
        type="number"
        disabled={disabled}
        value={normalizedValue}
        className={cn(
          'remove-number-spinners min-w-0 flex-1 rounded-l-md border-0 border-transparent bg-transparent px-3.5 py-2 text-sm leading-snug tracking-tight outline-none placeholder:text-muted-foreground focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
        {...props}
      />
      <div className="flex w-7 shrink-0 flex-col border-l border-border bg-background" aria-hidden>
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          onClick={handleStepUp}
          onPointerDown={(e) => e.preventDefault()}
          aria-label="Increase value"
        >
          <ChevronUp className="size-3.5 shrink-0" strokeWidth={2.5} />
        </button>
        <div className="h-px shrink-0 bg-border" role="separator" />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          onClick={handleStepDown}
          onPointerDown={(e) => e.preventDefault()}
          aria-label="Decrease value"
        >
          <ChevronDown className="size-3.5 shrink-0" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
});

export { NumberInput };
export type { TNumberInputProps };
