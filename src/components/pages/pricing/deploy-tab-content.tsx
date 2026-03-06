import Image from 'next/image';
import NextLink from 'next/link';
import { deployPricingPlans, enterpriseData, tableFeatures } from '@/constants/pricing';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';

import ComparisonTable from './comparison-table';
import Hero from './hero-pricing/hero--pricing';
import UsageCalculator from './usage-calculator';

const EnterpriseContent = ({
  enterpriseData,
}: {
  enterpriseData: {
    title: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonUrl: string;
  };
}) => {
  return (
    <div className="relative border border-border bg-repeat px-6 pt-7 pb-8 md:px-8 md:py-7">
      <Image
        alt=""
        fill
        sizes="100vw"
        priority
        className="z-0 object-cover"
        src="/images/pricing/enterprise-bg.jpg"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--spacing-content)] flex-col items-start justify-between gap-y-10 sm:flex-row sm:items-end lg:gap-x-20">
        <div className="flex min-w-0 flex-1 flex-col gap-6 pr-0 sm:pr-10">
          <div className="flex flex-col gap-1">
            <h3 className="font-sans text-lg leading-snug font-medium tracking-tight text-foreground">
              {enterpriseData.title}
            </h3>
            <p className="font-sans text-base leading-snug tracking-tight text-muted-foreground">
              {enterpriseData.description}
            </p>
          </div>
          <ul
            className="grid gap-x-18 gap-y-2.5 lg:grid-cols-[18rem_18rem]"
            aria-label="Enterprise features"
          >
            {enterpriseData.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-foreground/80" aria-hidden />
                <span className="font-sans text-base leading-5 tracking-tight text-foreground/80">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Button className="h-11 shrink-0 rounded-none px-5 text-base" asChild>
          <NextLink href={enterpriseData.buttonUrl}>{enterpriseData.buttonText}</NextLink>
        </Button>
      </div>
    </div>
  );
};

export default function DeployTabContent() {
  return (
    <>
      <Hero
        plans={deployPricingPlans}
        bottomContent={<EnterpriseContent enterpriseData={enterpriseData} />}
      />
      <ComparisonTable plans={deployPricingPlans} featureCategories={tableFeatures} />
      <UsageCalculator />
    </>
  );
}
