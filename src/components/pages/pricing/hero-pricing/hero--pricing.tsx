import Image from 'next/image';
import NextLink from 'next/link';

import { type ILogo } from '@/types/common';
import { IPricingPlan } from '@/types/pricing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Logos from '@/components/pages/logos';

import PricingCard from './pricing-card';

interface IHeroProps {
  className?: string;
  plans: IPricingPlan[];
  logos?: ILogo[];
  cta?: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
  bottomContent?: React.ReactNode;
}

function Hero({ className, plans, logos, cta, bottomContent }: IHeroProps) {
  return (
    <section className={cn('mt-8', className)}>
      <div className={cn('mx-auto w-full')}>
        <h2 className="sr-only">Pricing plans</h2>
        {plans.length > 0 && (
          <ul
            className={cn(
              'mx-auto grid border-t border-l border-border md:grid-cols-2',
              plans.length === 4 && 'xl:grid-cols-4',
              (plans.length === 3 || plans.length > 4) && 'lg:grid-cols-3',
              'auto-rows-min grid-rows-[auto_auto_auto_auto_1fr]',
            )}
          >
            {plans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} as="li" isLast={index === plans.length - 1} />
            ))}
          </ul>
        )}
        {logos && <Logos className="mt-16 items-center lg:mt-20" logos={logos} />}

        {cta && cta.title && cta.description && cta.buttonText && cta.buttonUrl && (
          <div className="mx-auto mt-16 flex w-full max-w-3xl flex-col items-start justify-between gap-x-10 gap-y-5 rounded-lg border border-border bg-background px-8 py-6 pb-7 sm:flex-row sm:items-center sm:pb-6 lg:mt-20">
            <div className="flex flex-col">
              <h3 className="text-2xl leading-snug font-semibold tracking-tight text-foreground">
                {cta.title}
              </h3>
              <p className="mt-1 max-w-lg text-base leading-snug tracking-tight text-pretty text-muted-foreground">
                {cta.description}
              </p>
            </div>
            <Button asChild className="h-11 w-full min-w-44 text-base sm:-mt-1 sm:w-fit">
              <NextLink href={cta.buttonUrl}>{cta.buttonText}</NextLink>
            </Button>
          </div>
        )}
      </div>
      <div className="relative h-16 border-x border-border bg-repeat">
        <Image
          alt=""
          fill
          priority
          sizes="100vw"
          className="z-0 object-cover"
          src={'/images/pricing/lines.png'}
        />
      </div>
      {bottomContent}
    </section>
  );
}

export default Hero;
