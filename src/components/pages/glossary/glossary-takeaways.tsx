'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';

import type { IGlossaryTakeaways } from '@/types/glossary';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface IGlossaryTakeawaysProps {
  className?: string;
  takeaways: IGlossaryTakeaways;
}

function splitTags(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function hasTakeawaysContent(takeaways: IGlossaryTakeaways): boolean {
  return Boolean(
    (takeaways.definitionAndStructure && takeaways.definitionAndStructure.length > 0) ||
      (takeaways.historicalContext && takeaways.historicalContext.length > 0) ||
      takeaways.usageInAPIs ||
      (takeaways.bestPractices && takeaways.bestPractices.length > 0) ||
      (takeaways.recommendedReading && takeaways.recommendedReading.length > 0) ||
      takeaways.didYouKnow,
  );
}

function GlossaryTakeaways({ className, takeaways }: IGlossaryTakeawaysProps) {
  const definitionAndStructure = takeaways.definitionAndStructure ?? [];
  const historicalContext = takeaways.historicalContext ?? [];
  const bestPractices = takeaways.bestPractices ?? [];
  const recommendedReading = takeaways.recommendedReading ?? [];
  const usageTags = (takeaways.usageInAPIs?.tags ?? []).flatMap((tag) => splitTags(tag));
  const usageDescription = takeaways.usageInAPIs?.description?.trim() ?? '';

  const hasDefinitionAndStructure = definitionAndStructure.length > 0;
  const hasHistoricalContext = historicalContext.length > 0;
  const hasUsageInApis = Boolean(usageDescription || usageTags.length > 0);
  const hasBestPractices = bestPractices.length > 0;
  const hasRecommendedReading = recommendedReading.length > 0;
  const hasDidYouKnow = Boolean(takeaways.didYouKnow?.trim());

  const defaultValue =
    (hasDefinitionAndStructure && 'definition-and-structure') ||
    (hasHistoricalContext && 'historical-context') ||
    (hasUsageInApis && 'usage-in-apis') ||
    (hasBestPractices && 'best-practices') ||
    (hasRecommendedReading && 'recommended-reading') ||
    (hasDidYouKnow && 'did-you-know') ||
    undefined;

  if (!hasTakeawaysContent(takeaways)) {
    return null;
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn('not-prose border border-gray-20', className)}
    >
      {hasDefinitionAndStructure ? (
        <AccordionItem
          value="definition-and-structure"
          className="border-b border-gray-20 last:border-b-0"
        >
          <AccordionTrigger
            iconClosed={<Plus className="size-6 text-foreground" />}
            iconOpen={<Minus className="size-6 text-foreground" />}
            className="gap-4 px-5 py-5 text-left hover:no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center border border-gray-30">
                <Image
                  src="/icons/glossary/definition-and-structure.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <p className="pt-1 text-xl leading-snug font-medium tracking-tight text-foreground">
                Definition & Structure
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="flex flex-col gap-4">
              {definitionAndStructure.map((item) => (
                <div key={item.key} className="flex flex-col gap-2">
                  <p className="text-base leading-normal tracking-tight text-gray-80/90">
                    {item.key}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {splitTags(item.value).map((value) => (
                      <span
                        key={`${item.key}-${value}`}
                        className="inline-flex w-fit bg-gray-12 px-3.5 py-2 font-mono text-sm leading-none tracking-tight text-foreground"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {hasHistoricalContext ? (
        <AccordionItem
          value="historical-context"
          className="border-b border-gray-20 last:border-b-0"
        >
          <AccordionTrigger
            iconClosed={<Plus className="size-6 text-foreground" />}
            iconOpen={<Minus className="size-6 text-foreground" />}
            className="gap-4 px-5 py-5 text-left hover:no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center border border-gray-30">
                <Image
                  src="/icons/glossary/historical-context.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <p className="pt-1 text-xl leading-snug font-medium tracking-tight text-foreground">
                Historical Context
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="flex flex-col gap-4">
              {historicalContext.map((item) => (
                <div key={item.key} className="flex flex-col gap-2">
                  <p className="text-base leading-normal tracking-tight text-gray-80/90">
                    {item.key}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {splitTags(item.value).map((value) => (
                      <span
                        key={`${item.key}-${value}`}
                        className="inline-flex w-fit bg-gray-12 px-3.5 py-2 font-mono text-sm leading-none tracking-tight text-foreground"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {hasUsageInApis ? (
        <AccordionItem value="usage-in-apis" className="border-b border-gray-20 last:border-b-0">
          <AccordionTrigger
            iconClosed={<Plus className="size-6 text-foreground" />}
            iconOpen={<Minus className="size-6 text-foreground" />}
            className="gap-4 px-5 py-5 text-left hover:no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center border border-gray-30">
                <Image
                  src="/icons/glossary/usage-in-apis.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <p className="pt-1 text-xl leading-snug font-medium tracking-tight text-foreground">
                Usage in APIs
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="flex flex-col gap-4">
              {usageDescription ? (
                <p className="text-base leading-normal tracking-tight text-gray-80/90">
                  {usageDescription}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {usageTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex bg-gray-12 px-3.5 py-2 font-mono text-sm leading-none tracking-tight text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {hasBestPractices ? (
        <AccordionItem value="best-practices" className="border-b border-gray-20 last:border-b-0">
          <AccordionTrigger
            iconClosed={<Plus className="size-6 text-foreground" />}
            iconOpen={<Minus className="size-6 text-foreground" />}
            className="gap-4 px-5 py-5 text-left hover:no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center border border-gray-30">
                <Image
                  src="/icons/glossary/best-practices.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <p className="pt-1 text-xl leading-snug font-medium tracking-tight text-foreground">
                Best Practices
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <ul className="list-disc pl-6">
              {bestPractices.map((practice) => (
                <li
                  key={practice}
                  className="text-base leading-normal tracking-tight text-gray-80/90"
                >
                  {practice}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {hasRecommendedReading ? (
        <AccordionItem
          value="recommended-reading"
          className="border-b border-gray-20 last:border-b-0"
        >
          <AccordionTrigger
            iconClosed={<Plus className="size-6 text-foreground" />}
            iconOpen={<Minus className="size-6 text-foreground" />}
            className="gap-4 px-5 py-5 text-left hover:no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center border border-gray-30">
                <Image
                  src="/icons/glossary/recommended-reading.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <p className="pt-1 text-xl leading-snug font-medium tracking-tight text-foreground">
                Recommended Reading
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="flex flex-col gap-3">
              {recommendedReading.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base leading-normal font-normal tracking-tight text-foreground underline decoration-gray-40 decoration-dashed decoration-[1px] underline-offset-[0.26em] transition-colors duration-300 hover:text-foreground/85 hover:decoration-gray-70"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ) : null}

      {hasDidYouKnow ? (
        <AccordionItem value="did-you-know" className="border-b border-gray-20 last:border-b-0">
          <AccordionTrigger
            iconClosed={<Plus className="size-6 text-foreground" />}
            iconOpen={<Minus className="size-6 text-foreground" />}
            className="gap-4 px-5 py-5 text-left hover:no-underline"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center border border-gray-30">
                <Image
                  src="/icons/glossary/did-you-know.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden
                />
              </div>
              <p className="pt-1 text-xl leading-snug font-medium tracking-tight text-foreground">
                Did you know?
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <p className="text-base leading-normal tracking-tight text-gray-80/90">
              {takeaways.didYouKnow}
            </p>
          </AccordionContent>
        </AccordionItem>
      ) : null}
    </Accordion>
  );
}

export default GlossaryTakeaways;
