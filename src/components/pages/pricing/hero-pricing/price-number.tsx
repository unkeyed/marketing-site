import React, { HTMLAttributes } from 'react';
import NumberFlow, { type Format } from '@number-flow/react';

import { cn } from '@/lib/utils';

import { priceNumberFormat } from '../utils';

const noMaskStyle = {
  '--number-flow-mask-height': '0px',
  '--number-flow-mask-width': '0px',
} as React.CSSProperties;

interface PriceNumberProps extends HTMLAttributes<HTMLElement> {
  value: number;
  currency?: string;
  suffix?: string;
  prefix?: string;
  className?: string;
  animated?: boolean;
  format?: Format;
  locales?: Intl.LocalesArgument;
}

/**
 * PriceNumber component for displaying animated prices
 *
 * A wrapper around the NumberFlow library that:
 * - Disables the mask to avoid Safari sub-pixel shift during animation
 * - Applies consistent price formatting defaults
 *
 * @see {@link https://number-flow.barvian.me/ NumberFlow documentation}
 *
 * @example
 * // Basic usage
 * <PriceNumber value={29} currency="USD" suffix=" per month" />
 *
 * // Custom format
 * <PriceNumber value={99.5} format={{ maximumFractionDigits: 2, notation: 'compact' }} />
 */
function PriceNumber({
  value,
  currency,
  suffix,
  prefix,
  className,
  animated = true,
  format,
  locales,
  ...props
}: PriceNumberProps) {
  return (
    <NumberFlow
      willChange
      value={value}
      className={cn('text-foreground part-[suffix]:text-muted-foreground', className)}
      style={noMaskStyle}
      locales={locales ?? priceNumberFormat.locales}
      format={
        format ?? {
          ...priceNumberFormat.options,
          currency: currency || priceNumberFormat.options.currency,
        }
      }
      suffix={suffix}
      prefix={prefix}
      animated={animated}
      {...props}
    />
  );
}

export default PriceNumber;
