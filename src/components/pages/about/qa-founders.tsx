import { ReactNode } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface IQaItem {
  question: string;
  answer: string;
}

export interface IFounder {
  name: string;
  title: string;
  imageSrc: string;
  imageAlt?: string;
}

interface IQaFoundersProps {
  qaItems: IQaItem[];
  quote: ReactNode;
  founders: IFounder[];
}

export default function QaFounders({ qaItems, quote, founders }: IQaFoundersProps) {
  return (
    <div className="section-container pt-12 pb-16 md:pt-20 md:pb-[92px] lg:pt-24 xl:pt-41 xl:pb-52">
      <div className="flex flex-col gap-16 md:gap-18 lg:flex-row lg:justify-between lg:gap-20">
        <div className="flex flex-col gap-8 md:gap-9.5 lg:max-w-120 xl:max-w-160">
          {qaItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-4 md:gap-5">
              <div className="h-px w-full shrink-0 bg-gray-20" aria-hidden />
              <div className="grid grid-cols-1 gap-x-16 gap-y-1 md:gap-y-1.5 lg:gap-y-2 xl:grid-cols-[224px_1fr]">
                <div className="font-sans text-[1.125rem] leading-[1.375] font-normal tracking-tight text-foreground md:text-[1.25rem] lg:text-[1.25rem]">
                  {item.question}
                </div>
                <div className="font-sans text-[0.9375rem] leading-[1.5] font-normal tracking-tight text-gray-70 md:max-w-xl">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <figure className="flex max-w-127 flex-col gap-12 md:max-w-none md:pr-16 lg:max-w-127 lg:gap-20 lg:pr-0">
          <blockquote className="font-sans text-xl leading-[1.25] font-normal text-foreground md:text-2xl xl:text-[2rem]">
            {quote}
          </blockquote>
          <figcaption>
            <ul className="flex flex-wrap gap-8 md:gap-10 xl:gap-16">
              {founders.map((founder) => (
                <li key={founder.name} className="flex items-start gap-4.5">
                  <Image
                    src={founder.imageSrc}
                    alt=""
                    aria-hidden="true"
                    width={64}
                    height={64}
                    className="size-12 shrink-0 object-cover md:size-14"
                    quality={90}
                  />
                  <div className="flex h-full flex-col justify-center gap-1">
                    <p className="font-sans text-[0.9375rem] leading-[1.25] font-medium tracking-tight text-foreground">
                      {founder.name}
                    </p>
                    <p className="font-sans text-sm leading-[1.25] font-normal tracking-tight text-gray-60">
                      {founder.title}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
