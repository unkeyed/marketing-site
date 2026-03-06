'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  );
}

interface IAccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  iconClosed?: React.ReactNode;
  iconOpen?: React.ReactNode;
}

function AccordionTrigger({
  className,
  children,
  iconClosed,
  iconOpen,
  ...props
}: IAccordionTriggerProps) {
  const hasCustomIcons = iconClosed != null || iconOpen != null;
  const defaultIcon = (
    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" />
  );

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group flex flex-1 items-center justify-between rounded py-4 text-left text-sm font-medium transition-all hover:underline',
          !hasCustomIcons && '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        {hasCustomIcons ? (
          <span className="relative flex size-6 shrink-0 items-center justify-center text-foreground">
            <span className="group-data-[state=closed]:block group-data-[state=open]:hidden">
              {iconClosed}
            </span>
            <span className="absolute inset-0 flex items-center justify-center group-data-[state=closed]:hidden group-data-[state=open]:block">
              {iconOpen}
            </span>
          </span>
        ) : (
          defaultIcon
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
