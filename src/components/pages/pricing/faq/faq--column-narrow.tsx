'use client';

import { Minus, Plus } from 'lucide-react';

import { IFaqSection } from '@/types/landing';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface IFaqProps extends Omit<IFaqSection, 'title'> {
  className?: string;
  title?: string;
}

function Faq({ title, className, items }: IFaqProps) {
  return (
    <div className={cn('faq w-full', className)}>
      <div className="mx-auto flex w-full flex-col gap-y-5">
        {title && (
          <h2 className="mb-5 text-3xl leading-tight font-medium tracking-tighter text-foreground md:text-4xl">
            {title}
          </h2>
        )}
        <Accordion type="single" collapsible className="border-y border-border text-foreground">
          {items.map(({ question, answer }, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="relative">
              <AccordionTrigger
                iconClosed={<Plus />}
                iconOpen={<Minus />}
                className="w-full gap-x-4 py-5.5 text-left tracking-tight hover:text-foreground/80 hover:no-underline [&_svg]:size-6"
              >
                <span className="text-lg leading-tight font-medium tracking-tight text-pretty whitespace-pre-line md:text-xl md:leading-tight">
                  {question}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-y-5 pr-8 pb-3 text-base tracking-tight text-muted-foreground md:pt-0 md:pr-10 lg:leading-normal lg:whitespace-pre-line">
                  {answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Faq;
