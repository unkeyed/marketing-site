import { Check, X } from 'lucide-react';

import type { IPricingTableFeatureRow } from '@/types/pricing';

interface TableCellProps {
  feature: IPricingTableFeatureRow;
  planId: string;
}

export default function TableCell({ feature, planId }: TableCellProps) {
  const value = feature.plans.find((plan) => plan.planId === planId)?.value;

  return (
    <div
      className="relative z-10 flex min-h-13.5 flex-col items-start justify-center gap-y-0.5 border-b border-gray-12 py-3 pr-5 pl-4 last:border-b-0 md:pl-0"
      role="cell"
      aria-label={`${feature.name} for ${planId} plan`}
    >
      {typeof value === 'boolean' ? (
        value ? (
          <Check className="text-foreground/80" size={16} aria-label="Available" />
        ) : (
          <X className="text-muted-foreground/80" size={16} aria-label="Not available" />
        )
      ) : typeof value === 'string' ? (
        <span className="text-base leading-tight tracking-tight">{value}</span>
      ) : value && typeof value === 'object' ? (
        <>
          <span className="text-base leading-tight tracking-tight">{value.title}</span>
          <span className="text-xs leading-snug tracking-tight text-muted-foreground">
            {value.description}
          </span>
        </>
      ) : null}
    </div>
  );
}
