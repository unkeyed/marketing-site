import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface IHeroProps {
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  title: string | ReactNode;
  titleTag?: 'h1' | 'p';
  description: string;
}

export default function Hero({
  className,
  titleClassName,
  descriptionClassName,
  title,
  titleTag: TitleTag = 'h1',
  description,
}: IHeroProps) {
  return (
    <div
      className={cn(
        'section-container flex flex-col justify-between gap-8 xl:flex-row xl:items-end 2xl:justify-start 2xl:gap-58',
        className,
      )}
    >
      <TitleTag
        className={cn(
          'font-display text-4xl leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]',
          titleClassName,
        )}
      >
        {title}
      </TitleTag>
      <p
        className={cn(
          'max-w-3xl text-base leading-[1.5] tracking-tight text-gray-60 sm:text-lg xl:max-w-none xl:whitespace-pre-line',
          descriptionClassName,
        )}
      >
        {description}
      </p>
    </div>
  );
}
