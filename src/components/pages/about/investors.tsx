import type { ReactNode } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export interface IInvestor {
  name: string;
  role: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface IInvestorsProps {
  label: string;
  heading: ReactNode;
  description: string;
  list: IInvestor[];
}

export default function Investors({ label, heading, description, list }: IInvestorsProps) {
  return (
    <section className="bg-[linear-gradient(180deg,#b6cdfb_0%,#ecf2fe_80.629%)]">
      <div className="section-container py-12 md:py-[5.75rem] xl:pt-46 xl:pb-49">
        <div className="flex flex-col gap-[1.125rem] md:gap-[1.125rem] lg:flex-row lg:items-end lg:justify-between lg:gap-5 lg:gap-16">
          <div className="flex flex-col gap-5 md:gap-7">
            <Label variant="light" labelClassName="md:text-sm">
              {label}
            </Label>
            <h2 className="marked-title font-display text-3xl leading-[1.125] text-background sm:text-4xl md:max-w-md lg:max-w-[40rem] lg:text-[2.5rem] xl:text-[2.75rem]">
              {heading}
            </h2>
          </div>
          <p className="font-sans text-base leading-[1.375] text-gray-20 md:max-w-xl md:text-lg lg:max-w-[26rem] lg:text-xl lg:tracking-[-0.01em]">
            {description}
          </p>
        </div>

        <div className={cn('mt-7 border-t border-gray-50 pt-10 md:mt-8 md:pt-16 lg:mt-8 xl:pt-20')}>
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
                  <p className="font-sans text-base leading-[1.375] font-normal tracking-[-0.025em] whitespace-pre-line text-gray-30">
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
