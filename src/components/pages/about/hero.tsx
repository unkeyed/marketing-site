import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface IHeroValue {
  title: string;
  description: string;
}

interface IHeroProps {
  title: ReactNode;
  description: ReactNode;
  values: IHeroValue[];
}

export default function Hero({ title, description, values }: IHeroProps) {
  return (
    <section className="border-b border-gray-20">
      <div className="container py-12 md:pt-[92px] md:pb-[88px] lg:pb-24 xl:pt-29 xl:pb-32">
        <div className="grid gap-8 md:gap-10 xl:grid-cols-[1fr_1fr] 2xl:gap-48">
          <div className="flex flex-col">
            <h1 className="marked-title font-display text-4xl leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-5xl lg:text-[52px] xl:text-[64px]">
              {title}
            </h1>
            <p className="mt-6 font-sans text-[18px] leading-[1.375] font-normal tracking-[-0.015em] text-muted-foreground md:mt-7 md:max-w-xl lg:mt-8 lg:max-w-2xl xl:max-w-128">
              {description}
            </p>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-16 sm:gap-x-15 sm:gap-y-11 md:mt-6 lg:grid-cols-3 xl:grid-cols-2">
            {values.map((value) => (
              <li key={value.title} className="flex flex-col gap-1.5">
                <h2 className="font-sans text-base leading-[1.375] font-medium text-foreground">
                  {value.title}
                </h2>
                <p className="max-w-78 font-sans text-base leading-[1.375] font-normal text-gray-80">
                  {value.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
