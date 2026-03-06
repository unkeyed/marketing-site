export type PricingPlanId = string;

export type PricingMatrixValue = boolean | string | { title: string; description: string };

export interface IPricingTablePlanValue {
  planId: PricingPlanId;
  value: PricingMatrixValue;
}

export interface IPricingTableFeatureRow {
  name: string;
  description?: string;
  tooltip?: string;
  plans: IPricingTablePlanValue[];
}

export interface IPricingTableFeatures {
  name?: string;
  features: IPricingTableFeatureRow[];
}

export type ILucideIcon = {
  lucideIcon: string;
};

export interface IPricingPlanFeature extends Partial<ILucideIcon> {
  id?: string;
  label: string;
  tooltip?: string;
}

export interface IPricingPlanTier {
  value: string;
  label: string;
  monthlyPrice: number;
  annualPrice?: number;
  featureOverrides?: Record<string, string>;
}

// Base interface for pricing plans
interface IPricingPlanBase extends Partial<ILucideIcon> {
  id: string;
  name: string;
  description: string;
  currency: string;
  labelBeforePrice?: string;
  isMostPopular?: boolean;
  priceTiers?: IPricingPlanTier[];
  features: {
    title?: string;
    items: IPricingPlanFeature[];
  };
  link: {
    label: string;
    href: string;
  };
}

// Plan with number-based pricing
export interface INumberPricingPlan extends IPricingPlanBase {
  priceType: 'number';
  monthlyPrice: number;
  annualPrice: number;
  monthlyPriceDisplay?: string;
  annualPriceDisplay?: string;
  priceMonthlyLabel: string;
  priceAnnualLabel: string;
}

// Plan with string-based pricing
export interface IStringPricingPlan extends IPricingPlanBase {
  priceType: 'string';
  monthlyPrice?: number;
  annualPrice?: number;
  monthlyPriceDisplay: string;
  annualPriceDisplay: string;
  priceMonthlyLabel?: string;
  priceAnnualLabel?: string;
}

// Union type for all pricing plans
export type IPricingPlan = INumberPricingPlan | IStringPricingPlan;
