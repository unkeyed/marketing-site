'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

interface ITooltipContextValue {
  canToggleOnClick: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TooltipContext = React.createContext<ITooltipContextValue | null>(null);

function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarse(mediaQuery.matches);

    update();
    mediaQuery.addEventListener?.('change', update);

    return () => {
      mediaQuery.removeEventListener?.('change', update);
    };
  }, []);

  return isCoarse;
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const isCoarsePointer = useIsCoarsePointer();
  const [open, setOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const canToggleOnClick = isCoarsePointer && !isControlled;

  const rootProps = canToggleOnClick
    ? { open, onOpenChange: setOpen }
    : { open: controlledOpen, onOpenChange: controlledOnOpenChange };

  return (
    <TooltipProvider>
      <TooltipContext.Provider value={{ canToggleOnClick, setOpen }}>
        <TooltipPrimitive.Root data-slot="tooltip" {...rootProps} {...props} />
      </TooltipContext.Provider>
    </TooltipProvider>
  );
}

function TooltipTrigger({
  onClick,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const tooltipContext = React.useContext(TooltipContext);

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || !tooltipContext?.canToggleOnClick) {
          return;
        }

        tooltipContext.setOpen((current) => !current);
      }}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 inline-block w-max max-w-72 origin-(--radix-tooltip-content-transform-origin) animate-in bg-primary px-3 py-1.5 text-xs break-words whitespace-normal text-primary-foreground fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 lg:max-w-none',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
