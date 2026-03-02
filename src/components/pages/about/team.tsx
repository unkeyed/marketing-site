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
    <section className="pt-12 md:pt-[88px] lg:pt-24">
      <div className="container flex flex-col">
        <Label labelClassName="font-jetbrains">{badgeLabel}</Label>

        <div className="mt-5 md:mt-8">
          <h2 className="font-display text-[30px] leading-[1.125] whitespace-pre-wrap text-foreground sm:text-[40px] md:text-[36px] xl:text-[44px]">
            {title}
            <br />
            <span className="text-gray-60">{subtitle}</span>
          </h2>
        </div>
      </div>
      <TeamSlider />
      <QaFounders qaItems={qaItems} quote={quote} founders={founders} />
    </section>
  );
}
