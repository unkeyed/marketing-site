import * as React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 sm:px-16 2xl:px-24';

export interface IAboutQaItem {
  question: string;
  answer: string;
}

export interface IAboutFounder {
  name: string;
  title: string;
  imageSrc: string;
  imageAlt?: string;
}

interface IAboutQaFoundersProps {
  qaItems: IAboutQaItem[];
  quote: React.ReactNode;
  founders: IAboutFounder[];
}

export default function AboutQaFounders({ qaItems, quote, founders }: IAboutQaFoundersProps) {
  return (
    <div className={cn(CONTAINER, 'pt-12 pb-16 md:pt-20 md:pb-20 xl:pt-41 xl:pb-49')}>
      <div className="flex flex-col gap-16 lg:flex-row lg:justify-between lg:gap-16">
        <dl className="flex flex-col gap-8 md:gap-9.5 lg:max-w-120 xl:max-w-160">
          {qaItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 md:gap-5">
              <div className="h-px w-full shrink-0 bg-gray-20" aria-hidden />
              <div className="grid grid-cols-1 gap-x-16 gap-y-0.5 xl:grid-cols-[224px_1fr]">
                <dt className="font-sans text-xl leading-[1.375] font-normal tracking-[-0.48px] text-foreground md:text-2xl">
                  {item.question}
                </dt>
                <dd className="font-sans text-[15px] leading-[1.5] font-normal tracking-[-0.375px] text-gray-70">
                  {item.answer}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="flex max-w-127 flex-col gap-12 lg:gap-20">
          <blockquote className="font-sans text-xl leading-[1.25] font-normal text-foreground md:text-2xl xl:text-[32px]">
            {quote}
          </blockquote>
          <div className="flex flex-wrap gap-8 md:gap-10 xl:gap-16">
            {founders.map((founder) => (
              <div key={founder.name} className="flex items-start gap-4.5">
                <Image
                  src={founder.imageSrc}
                  alt={founder.imageAlt ?? founder.name}
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-md object-cover"
                  quality={90}
                />
                <div className="flex h-full flex-col justify-center gap-1">
                  <p className="font-sans text-base leading-[1.25] font-medium tracking-[-0.4px] text-foreground">
                    {founder.name}
                  </p>
                  <p className="font-sans text-sm leading-[1.25] font-normal tracking-[-0.35px] text-gray-60">
                    {founder.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
