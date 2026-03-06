import { AnimatePresence, domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import { cn } from '@/lib/utils';

interface BaseDiscountBadgeProps {
  className?: string;
  showSwitchDiscount?: boolean;
}

interface DirectDiscountProps extends BaseDiscountBadgeProps {
  discountPercentage: number;
  monthlyPrice?: never;
  annuallyPrice?: never;
}

interface PriceBasedDiscountProps extends BaseDiscountBadgeProps {
  discountPercentage?: never;
  monthlyPrice: number;
  annualPrice: number;
}

// There are two ways to specify a discount:
// 1. DirectDiscountProps: When you already know the discount percentage and want to pass it directly (e.g., for a fixed promo or external calculation).
// 2. PriceBasedDiscountProps: When you want the component to calculate the discount percentage based on monthly and annual prices (e.g., for dynamic pricing tables).
type DiscountBadgeProps = DirectDiscountProps | PriceBasedDiscountProps;

function calculateDiscountPercentage(props: DiscountBadgeProps): number {
  if ('discountPercentage' in props && props.discountPercentage !== undefined) {
    return props.discountPercentage;
  }

  const { monthlyPrice, annualPrice } = props as PriceBasedDiscountProps;

  if (!monthlyPrice || !annualPrice) return 0;

  const savingsPercent = Math.round(((monthlyPrice - annualPrice) / monthlyPrice) * 100);

  return savingsPercent;
}

function DiscountBadge(props: DiscountBadgeProps) {
  const { className, showSwitchDiscount = true } = props;

  const discountPercentage = calculateDiscountPercentage(props);

  if (!discountPercentage || discountPercentage <= 0) return null;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {showSwitchDiscount && (
          <m.span
            className={cn(
              'flex h-5 items-center justify-center rounded border border-border bg-background p-1 text-xs leading-none font-semibold tracking-tight whitespace-nowrap text-foreground',
              className,
            )}
            initial={{ x: -10, opacity: 0, filter: 'blur(2px)' }}
            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ x: -10, opacity: 0, filter: 'blur(2px)' }}
            transition={{
              x: { ease: 'easeOut', duration: 0.2 },
              opacity: { duration: 0.2 },
              filter: { duration: 0.2 },
            }}
            aria-label={`Discount: ${discountPercentage}%`}
          >
            -{discountPercentage}%
          </m.span>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

export default DiscountBadge;
