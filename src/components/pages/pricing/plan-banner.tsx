import Image from 'next/image';
import NextLink from 'next/link';
import enterpriseBackgroundImage from '@/assets/images/pricing/enterprise-bg.jpg';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PlanBanner({
  data,
  withBackground = false,
  buttonVariant,
  className,
}: {
  data: {
    title: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonUrl: string;
  };
  withBackground?: boolean;
  buttonVariant?: 'primary' | 'secondary';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative border border-border bg-repeat px-6 pt-7 pb-8 md:px-8 md:py-7',
        className,
      )}
    >
      {withBackground ? (
        <Image
          alt=""
          fill
          sizes="100vw"
          className="z-0 object-cover"
          src={enterpriseBackgroundImage}
        />
      ) : null}
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--spacing-content)] flex-col items-start justify-between gap-y-10 sm:flex-row sm:items-end lg:gap-x-20">
        <div className="flex min-w-0 flex-1 flex-col gap-6 pr-0 sm:pr-10">
          <div className="flex flex-col gap-1">
            <h3 className="font-sans text-lg leading-snug font-medium tracking-tight text-foreground">
              {data.title}
            </h3>
            <p className="font-sans text-base leading-snug tracking-tight text-muted-foreground">
              {data.description}
            </p>
          </div>
          <ul
            className="grid gap-x-18 gap-y-2.5 lg:grid-cols-[18rem_18rem]"
            aria-label={`${data.title} features`}
          >
            {data.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-foreground/80" aria-hidden />
                <span className="font-sans text-base leading-5 tracking-tight text-foreground/80">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          variant={buttonVariant}
          className="h-11 shrink-0 rounded-none px-5 text-base"
          asChild
        >
          <NextLink href={data.buttonUrl}>{data.buttonText}</NextLink>
        </Button>
      </div>
    </div>
  );
}
