import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

import AboutTeamSlider from './about-team-slider';
import AboutQaFounders, { IAboutFounder, IAboutQaItem } from './qa-founders';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 sm:px-16 2xl:px-24';

interface IAboutTeamSectionProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  badgeLabel: string;
  qaItems: IAboutQaItem[];
  quote: React.ReactNode;
  founders: IAboutFounder[];
}

export default function AboutTeamSection({
  title,
  subtitle,
  badgeLabel,
  qaItems,
  quote,
  founders,
}: IAboutTeamSectionProps) {
  return (
    <section className="pt-12 md:pt-32">
      <div className={cn(CONTAINER, 'flex flex-col')}>
        <Label>{badgeLabel}</Label>

        <div className="mt-5 md:mt-8">
          <h2 className="font-heading text-[30px] leading-[1.125] whitespace-pre-wrap text-white sm:text-[40px] xl:text-[44px]">
            {title}
            <br />
            <span className="text-gray-60">{subtitle}</span>
          </h2>
        </div>
      </div>
      <AboutTeamSlider />
      <AboutQaFounders qaItems={qaItems} quote={quote} founders={founders} />
    </section>
  );
}
