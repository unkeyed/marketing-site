import { type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

interface IHeaderPopoverProps extends ComponentProps<'div'> {
  isOpen: boolean;
  children: ReactNode;
}

function HeaderPopover({ isOpen, className, children, ...props }: IHeaderPopoverProps) {
  return (
    <div
      className={cn(
        'absolute top-full mt-1.5 w-82.5 transition-all duration-200',
        isOpen ? 'visible opacity-100' : 'invisible opacity-0',
        className,
      )}
      {...props}
    >
      <ul className="flex w-full flex-col bg-foreground shadow-lg">{children}</ul>
    </div>
  );
}

interface IHeaderPopoverItemProps {
  className?: string;
  children: ReactElement;
}

function HeaderPopoverItem({ className, children }: IHeaderPopoverItemProps) {
  return (
    <li>
      <Slot
        className={cn(
          'flex items-start gap-3 px-5 py-4 transition-colors hover:bg-gray-94',
          className,
        )}
      >
        {children}
      </Slot>
    </li>
  );
}

function HeaderPopoverPreview({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex size-9 shrink-0 items-center justify-center border border-gray-70 bg-foreground',
        className,
      )}
      {...props}
    />
  );
}

interface IHeaderPopoverTextProps {
  label: string;
  description?: string;
  className?: string;
}

function HeaderPopoverText({ label, description, className }: IHeaderPopoverTextProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <span className="text-sm leading-none font-medium tracking-tight text-background">
        {label}
      </span>
      {description && (
        <span className="text-xs leading-tight tracking-tight text-gray-40">{description}</span>
      )}
    </div>
  );
}

export { HeaderPopover, HeaderPopoverItem, HeaderPopoverPreview, HeaderPopoverText };
