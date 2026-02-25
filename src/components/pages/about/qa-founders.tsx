import * as React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

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
    <div className={cn(CONTAINER, 'pt-16 pb-20 md:pt-20 xl:pt-41 xl:pb-49')}>
      <div className="flex justify-between px-24">
        <dl className="flex max-w-160 flex-col gap-9.5">
          {qaItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-5">
              <div className="h-px w-full shrink-0 bg-gray-20" aria-hidden />
              <div className="grid grid-cols-1 gap-x-16 gap-y-0.5 xl:grid-cols-[224px_1fr]">
                <dt className="font-sans text-2xl leading-[1.375] font-normal tracking-[-0.48px] text-foreground">
                  {item.question}
                </dt>
                <dd className="font-sans text-[15px] leading-[1.5] font-normal tracking-[-0.375px] text-gray-70">
                  {item.answer}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="flex max-w-128 flex-col gap-20">
          <blockquote className="text-[32px] leading-[1.25] font-normal text-foreground">
            {quote}
          </blockquote>
          <div className="flex flex-wrap gap-10 xl:gap-16">
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
