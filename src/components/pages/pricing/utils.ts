import { IPricingPlan } from '@/types/pricing';

/**
 * Configuration for price number formatting
 * Uses standard Intl.NumberFormat options and locale identifiers
 */
export const priceNumberFormat = {
  locales: 'en-US',
  options: {
    style: 'currency' as const,
    currency: 'USD',
    maximumFractionDigits: 0,
    trailingZeroDisplay: 'stripIfInteger' as const,
  },
};

/**
 * Get price display value based on price type and period
 *
 * @param plan The pricing plan object
 * @param isAnnual Whether to use annual or monthly pricing
 * @returns The formatted price display
 */
export function getPriceDisplay(plan: IPricingPlan, isAnnual: boolean): string {
  if (!plan) return '';

  const { priceType } = plan;

  // For "string" type prices (like "Free" or "Contact Us")
  if (priceType === 'string') {
    return isAnnual ? plan.annualPriceDisplay : plan.monthlyPriceDisplay;
  }

  // For "number" type prices
  if (priceType === 'number') {
    const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
    if (price === undefined) return '';
    return price.toString();
  }

  return '';
}

/**
 * Get price period label based on pricing period
 *
 * @param plan The pricing plan object
 * @param isAnnual Whether to use annual or monthly period
 * @returns The period label
 */
export function getPricePeriod(plan: IPricingPlan, isAnnual: boolean): string {
  if (!plan) return '';
  return isAnnual ? plan.priceAnnualLabel || '' : plan.priceMonthlyLabel || '';
}

/**
 * Get the price value based on pricing period
 *
 * @param plan The pricing plan object
 * @param isAnnual Whether to use annual or monthly price
 * @returns The price value
 */
export function getPriceValue(plan: IPricingPlan, isAnnual: boolean): number {
  if (!plan || !plan.monthlyPrice) return 0;
  return isAnnual && plan.annualPrice ? plan.annualPrice : plan.monthlyPrice;
}

/**
 * Get all price-related information for a plan
 *
 * @param plan The pricing plan object
 * @param isAnnual Whether to use annual or monthly pricing
 * @returns Object containing price display, value and period
 */
export function getPriceInfo(plan: IPricingPlan, isAnnual: boolean) {
  return {
    display: getPriceDisplay(plan, isAnnual),
    value: getPriceValue(plan, isAnnual),
    period: getPricePeriod(plan, isAnnual),
  };
}
