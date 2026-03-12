import { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

import QaFounders, { IFounder, IQaItem } from './qa-founders';
import TeamSlider from './team-slider';

interface ITeamSectionProps {
  title: ReactNode;
  subtitle: ReactNode;
  badgeLabel: string;
  qaItems: IQaItem[];
  quote: ReactNode;
  founders: IFounder[];
}

export default function TeamSection({
  title,
  subtitle,
  badgeLabel,
  qaItems,
  quote,
  founders,
}: ITeamSectionProps) {
  return (
    <section className="pt-12 md:pt-[5.5rem] lg:pt-24 2xl:pt-32">
      <div className="section-container flex flex-col">
        <Label labelClassName="md:text-sm">{badgeLabel}</Label>

        <div className="mt-5 md:mt-8">
          <h2 className="font-display text-3xl leading-[1.125] text-foreground sm:text-[2.5rem] md:text-[2.25rem] md:whitespace-pre-wrap xl:text-[2.75rem]">
            {title}
            {'\n'}
            <span className="text-gray-60">{subtitle}</span>
          </h2>
        </div>
      </div>
      <TeamSlider />
      <QaFounders qaItems={qaItems} quote={quote} founders={founders} />
    </section>
  );
}
