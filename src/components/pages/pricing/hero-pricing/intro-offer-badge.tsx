import { Gift } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IntroOfferBadgeProps {
  label: string;
  className?: string;
}

function IntroOfferBadge({ label, className }: IntroOfferBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit max-w-full items-center gap-1.5 rounded-full bg-yellow px-2.5 py-1 text-[13px] leading-tight font-medium text-black',
        className,
      )}
    >
      <Gift className="size-3.5 shrink-0 text-black" aria-hidden />
      {label}
    </span>
  );
}

export default IntroOfferBadge;
