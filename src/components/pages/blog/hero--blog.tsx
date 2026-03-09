import { cn } from '@/lib/utils';

interface IHeroProps {
  className?: string;
  title: string;
  titleTag?: 'h1' | 'p';
  description: string;
}

export default function Hero({
  className,
  title,
  titleTag: TitleTag = 'h1',
  description,
}: IHeroProps) {
  return (
    <div
      className={cn(
        'section-container flex flex-col justify-between gap-4 md:gap-6 lg:flex-row lg:items-end lg:gap-8 2xl:justify-start 2xl:gap-58',
        className,
      )}
    >
      <TitleTag className="font-display text-[2rem] leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem]">
        {title}
      </TitleTag>
      <p className="w-full max-w-[34rem] text-base leading-[1.5] tracking-tight text-gray-60 md:max-w-[33.75rem] md:text-lg lg:w-[25rem] lg:max-w-none xl:w-[32.625rem] xl:whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
