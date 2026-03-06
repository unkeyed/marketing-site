'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';
import { Info } from 'lucide-react';

import { IPricingPlan, IPricingPlanTier } from '@/types/pricing';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { getPriceInfo } from '../utils';
import DiscountBadge from './discount-badge';
import DynamicIcon from './dynamic-icon';
import PriceNumber from './price-number';

const DEFAULT_VISIBLE_FEATURES = 7;

interface IPricingCardProps {
  isAnnual?: boolean;
  className?: string;
  as?: 'div' | 'li';
  plan: IPricingPlan;
  showDescriptionAfterButton?: boolean;
  showPeriodInRow?: boolean;
  isLast?: boolean;
}

function PricingCard({
  isAnnual,
  plan,
  className,
  as = 'div',
  showDescriptionAfterButton = false,
  showPeriodInRow = true,
  isLast: _isLast = false,
}: IPricingCardProps) {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const hasTiers = plan.priceTiers && plan.priceTiers.length > 0;
  const [selectedTierValue, setSelectedTierValue] = useState<string>(
    hasTiers ? plan.priceTiers![0].value : '',
  );
  const {
    name,
    description,
    lucideIcon,
    features,
    priceType,
    isMostPopular: _isMostPopular,
    labelBeforePrice,
    link,
    currency,
  } = plan;

  const selectedTier: IPricingPlanTier | undefined = hasTiers
    ? (plan.priceTiers!.find((t) => t.value === selectedTierValue) ?? plan.priceTiers![0])
    : undefined;

  const {
    display: priceDisplay,
    value: price,
    period,
  } = hasTiers
    ? (() => {
        const tier = selectedTier!;
        const p = (isAnnual ?? false) ? (tier.annualPrice ?? tier.monthlyPrice) : tier.monthlyPrice;
        const periodLabel =
          (isAnnual ?? false)
            ? (plan.priceAnnualLabel ?? plan.priceMonthlyLabel ?? '')
            : (plan.priceMonthlyLabel ?? '');
        return { display: String(p), value: p, period: periodLabel };
      })()
    : getPriceInfo(plan, isAnnual ?? false);

  const hasMoreFeatures = features.items.length > DEFAULT_VISIBLE_FEATURES;
  const baseVisibleItems = showAllFeatures
    ? features.items
    : features.items.slice(0, DEFAULT_VISIBLE_FEATURES);
  const visibleFeatures = baseVisibleItems.map((item) => {
    const overriddenLabel =
      selectedTier?.featureOverrides && item.id && selectedTier.featureOverrides[item.id];
    return { ...item, label: overriddenLabel ?? item.label };
  });

  const Component = as;

  return (
    <Component
      className={cn(
        'pricing-card row-span-5 grid grid-rows-subgrid gap-y-0 border-r border-b border-border px-6 pt-7 pb-8 md:px-8 md:pt-9 md:pb-10',
        className,
      )}
    >
      <div className="row-start-1 grid grid-cols-2 gap-y-4">
        {lucideIcon && (
          <span
            className="bg-card flex size-12 items-center justify-center rounded-full"
            aria-hidden
          >
            <Slot className="size-5">
              <DynamicIcon icon={lucideIcon} />
            </Slot>
          </span>
        )}
        <div
          className={cn(
            'flex items-center gap-x-2 self-start',
            lucideIcon && 'col-span-full row-start-2',
          )}
        >
          <h3 className="text-lg leading-snug font-medium tracking-tight text-foreground">
            {name}
          </h3>
          {!!plan?.monthlyPrice && !!plan?.annualPrice && (
            <DiscountBadge
              monthlyPrice={plan.monthlyPrice}
              annualPrice={plan.annualPrice}
              showSwitchDiscount={isAnnual}
            />
          )}
        </div>
      </div>

      <p
        className={cn(
          'text-base leading-snug tracking-tight text-muted-foreground',
          showDescriptionAfterButton ? 'row-start-4 mt-4' : 'row-start-2 mt-2',
        )}
      >
        {description}
      </p>

      <div className={cn(showDescriptionAfterButton ? 'row-start-2 mt-5' : 'row-start-3 mt-6')}>
        <div
          className={cn(
            'flex gap-x-1',
            showPeriodInRow ? 'flex-row items-end gap-x-3' : 'flex-col',
            hasTiers &&
              'flex-col items-start justify-start gap-x-4.5 text-left md:items-start md:justify-start md:text-left lg:items-start lg:justify-start lg:text-left xl:items-center xl:justify-between 2xl:flex-row',
          )}
        >
          <span className="flex flex-col gap-y-1">
            {labelBeforePrice && (
              <span className="text-sm leading-tight font-medium tracking-tight text-muted-foreground">
                {labelBeforePrice}
              </span>
            )}
            {priceType === 'number' && (
              <PriceNumber
                className="font-display text-5xl leading-[1.25] font-[500] tracking-tight [font-variation-settings:'wght'_500] part-[suffix]:font-sans part-[suffix]:font-normal part-[suffix]:[font-variation-settings:'wght'_400] part-[suffix]:text-2xl"
                value={price}
                currency={currency}
                suffix={` ${period}`}
              />
            )}
            {priceType === 'string' && (
              <span className="font-display text-5xl leading-[1.25] font-[500] tracking-tight text-foreground">
                {priceDisplay}
              </span>
            )}
          </span>
          {hasTiers && (
            <Select
              value={selectedTierValue}
              onValueChange={setSelectedTierValue}
              aria-label="Request volume"
            >
              <SelectTrigger className="mt-3 h-auto min-w-0 shrink border-border bg-background py-2 text-foreground 2xl:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {plan.priceTiers!.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Button
        className={cn(
          'h-11 w-full rounded-none text-base leading-none',
          showDescriptionAfterButton ? 'row-start-3 mt-5' : 'row-start-4 mt-5',
        )}
        variant="secondary"
        asChild
      >
        <Link href={link.href}>{link.label}</Link>
      </Button>

      {features.items.length > 0 && (
        <div
          className={cn(
            'row-start-5 flex flex-col gap-y-5',
            showDescriptionAfterButton ? 'mt-6 border-t border-border pt-6' : 'mt-7',
          )}
        >
          {features.title && <p className="text-foreground">{features.title}</p>}
          <ul className="flex flex-col gap-y-2.5">
            {visibleFeatures.map((item, index) => {
              const { label, lucideIcon, tooltip } = item;
              return (
                <li key={index} className="flex items-start text-sm">
                  {lucideIcon && (
                    <Slot className="mt-0.5 mr-2 size-3.5 shrink-0 text-foreground/80">
                      <DynamicIcon icon={lucideIcon} />
                    </Slot>
                  )}
                  <span className="text-base leading-tight tracking-[-0.01em] text-foreground/80">
                    {label}
                  </span>
                  {tooltip && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1.5 cursor-pointer" aria-label={tooltip}>
                            <Info className="size-3.5 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-foreground text-background">
                          <p>{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </li>
              );
            })}
          </ul>

          {hasMoreFeatures && !showAllFeatures && (
            <Button
              className="size-fit p-0 text-left text-sm leading-tight font-normal text-foreground"
              variant="link"
              onClick={() => setShowAllFeatures(!showAllFeatures)}
            >
              And more...
            </Button>
          )}
        </div>
      )}
    </Component>
  );
}

export default PricingCard;
