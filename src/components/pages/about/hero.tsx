import * as React from 'react';

import { cn } from '@/lib/utils';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 sm:px-16 2xl:px-24';

export interface IAboutHeroValue {
  title: string;
  description: string;
}

interface IAboutHeroProps {
  title: React.ReactNode;
  description: React.ReactNode;
  values: IAboutHeroValue[];
}

export default function AboutHero({ title, description, values }: IAboutHeroProps) {
  return (
    <section className="border-b border-gray-20">
      <div className={cn(CONTAINER, 'py-12 md:py-20 xl:pt-29 xl:pb-32')}>
        <div className="grid gap-8 md:gap-16 2xl:grid-cols-[1fr_1fr] 2xl:gap-48">
          <div className="flex flex-col">
            <h1 className="font-display text-4xl leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-5xl lg:text-6xl xl:text-[64px] [&_mark]:-ml-1 [&_mark]:inline-flex [&_mark]:h-[1em] [&_mark]:min-h-[0.6em] [&_mark]:items-center [&_mark]:bg-yellow [&_mark]:box-decoration-clone [&_mark]:px-1.5 [&_mark]:pb-0.5 [&_mark]:text-black">
              {title}
            </h1>
            <p className="mt-8 font-sans text-xl leading-[1.375] font-normal tracking-[-0.015em] text-muted-foreground md:mt-12 xl:max-w-128">
              {description}
            </p>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-16 sm:gap-x-15 sm:gap-y-11 md:mt-11 xl:grid-cols-3 2xl:grid-cols-2">
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
