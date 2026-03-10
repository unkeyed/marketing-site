'use client';

import { Minus, Plus } from 'lucide-react';

import type { IGlossaryFaqItem } from '@/types/glossary';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface IGlossaryFaqProps {
  className?: string;
  term: string;
  items: IGlossaryFaqItem[];
}

function GlossaryFaq({ className, term, items }: IGlossaryFaqProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section className={cn('not-prose mt-14', className)}>
      <h2 className="font-display text-2xl leading-tight font-normal tracking-tight text-foreground md:text-3xl md:leading-tight">
        Questions & Answers about {term}
      </h2>
      <Accordion
        type="single"
        collapsible
        defaultValue="item-0"
        className="mt-7 w-full border-y border-border text-foreground"
      >
        {items.map((item, index) => (
          <AccordionItem
            key={`${item.question}-${index}`}
            value={`item-${index}`}
            className="border-b border-border last:border-b-0"
          >
            <AccordionTrigger
              iconClosed={<Plus />}
              iconOpen={<Minus />}
              className="w-full gap-6 py-6 text-left tracking-tight hover:text-foreground/80 hover:no-underline [&_svg]:size-6"
            >
              <span className="text-xl leading-tight font-medium tracking-tight text-pretty">
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pr-12 pb-6 text-base leading-normal tracking-tight text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default GlossaryFaq;
