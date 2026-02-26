import type { ReactNode } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 sm:px-16 2xl:px-24';

export interface IAboutInvestor {
  name: string;
  role: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface IAboutInvestorsProps {
  label: string;
  heading: ReactNode;
  description: string;
  list: IAboutInvestor[];
}

export default function AboutInvestors({
  label,
  heading,
  description,
  list,
}: IAboutInvestorsProps) {
  return (
    <section className="bg-[linear-gradient(180deg,#b6cdfb_0%,#ecf2fe_80.629%)]">
      <div className={cn(CONTAINER, 'py-12 md:py-20 xl:pt-46 xl:pb-49')}>
        <div className="flex flex-col gap-6 md:gap-8 xl:flex-row xl:items-end xl:justify-between xl:gap-16">
          <div className="flex flex-col gap-5 md:gap-7">
            <Label variant="light">{label}</Label>
            <h2 className="font-heading text-3xl leading-[1.125] text-background sm:text-4xl xl:max-w-[640px] xl:text-[44px] [&_mark]:-ml-1 [&_mark]:inline-flex [&_mark]:h-[1em] [&_mark]:min-h-[0.6em] [&_mark]:items-center [&_mark]:bg-yellow [&_mark]:box-decoration-clone [&_mark]:px-1.5 [&_mark]:pb-0.5 [&_mark]:text-black">
              {heading}
            </h2>
          </div>
          <p className="font-sans text-base leading-[1.375] text-gray-20 md:text-lg xl:max-w-[416px] xl:text-xl xl:tracking-[-0.01em]">
            {description}
          </p>
        </div>

        <div className={cn('mt-6 border-t border-gray-50 pt-10 md:mt-8 md:pt-16 xl:pt-20')}>
          <ul
            className={cn(
              'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 md:gap-x-8 md:gap-y-12',
              'xl:grid-cols-5 xl:gap-x-15 xl:gap-y-16',
            )}
          >
            {list.map((investor) => (
              <li key={investor.name} className="flex flex-col gap-3 md:gap-4">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-sm bg-gray-12 md:h-40 md:w-40">
                  <Image
                    src={investor.imageSrc}
                    alt={investor.imageAlt ?? investor.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-sans text-base leading-[1.375] font-medium tracking-[-0.02em] text-background">
                    {investor.name}
                  </p>
                  <p className="font-sans text-base leading-[1.375] font-normal tracking-[-0.025em] text-gray-30">
                    {investor.role}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
