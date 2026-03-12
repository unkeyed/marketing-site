import Link from 'next/link';
import { pricingContentData } from '@/constants/pricing';

import { Button } from '@/components/ui/button';

import Calculator from './calculator';

export default function UsageCalculator() {
  return (
    <section className="mt-30 mb-30 flex flex-col gap-16 lg:mt-58 lg:mb-60 xl:flex-row">
      <div className="flex shrink-0 flex-col gap-5">
        <h2 className="marked-title font-display text-3xl leading-[1.125] whitespace-pre-line text-foreground sm:text-4xl md:whitespace-normal lg:text-[40px] xl:max-w-[640px] xl:text-[2.75rem] xl:whitespace-pre-line">
          {pricingContentData.usageCalculator.title}
        </h2>
        <p className="text-base tracking-[-0.01em] text-gray-70 md:max-w-130 md:text-lg xl:max-w-none xl:text-xl xl:whitespace-pre-line">
          {pricingContentData.usageCalculator.subtitle}
        </p>
        <Button asChild className="mt-5 rounded-none px-5 py-2.5">
          <Link
            href={pricingContentData.usageCalculator.actionHref}
            className="text-base tracking-tight"
            target="_blank"
            rel="noopener noreferrer"
          >
            {pricingContentData.usageCalculator.actionText}
          </Link>
        </Button>
      </div>
      <Calculator />
    </section>
  );
}
