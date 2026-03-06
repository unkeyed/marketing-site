import { Fragment, memo } from 'react';

import { IPricingPlan, IPricingTableFeatures } from '@/types/pricing';
import { cn } from '@/lib/utils';

import TableCell from './table-cell';
import TableHeader from './table-header';

interface TableColumnProps {
  planId: string;
  totalRows: number;
  isAnnual: boolean;
  featureCategories: IPricingTableFeatures[];
  plans: IPricingPlan[];
  className?: string;
}

const TableColumn = memo(function TableColumn({
  planId,
  totalRows,
  isAnnual,
  featureCategories,
  plans,
  className,
}: TableColumnProps) {
  const plan = plans.find((p) => p.id === planId);
  const isFeatured = plan?.isMostPopular ?? false;

  return (
    <div
      className={cn('relative grid min-w-0 grid-rows-subgrid', className)}
      style={{
        gridRow: '1 / span ' + totalRows,
      }}
      role="row"
      aria-label={`${plan?.name || planId} plan features`}
    >
      {isFeatured && (
        <div
          className="absolute inset-y-0 right-0 left-0 z-0 hidden rounded-none border border-gray-8 bg-gray-5 lg:right-3 lg:-left-4 lg:block xl:right-6 xl:-left-4"
          aria-hidden
        />
      )}
      <TableHeader
        plan={plan}
        planId={planId}
        isFeatured={isFeatured}
        isAnnual={isAnnual}
        plansCount={plans.length}
      />

      {featureCategories.map((category, index) => (
        <Fragment key={`feature-group-${category.name ?? index}-${planId}`}>
          {category.name != null && (
            <div
              className={cn('relative z-10 min-h-12 border-b border-gray-12', index > 0 && 'pt-11')}
              key={`category-header-${category.name}-${planId}`}
              aria-hidden
            />
          )}

          {category.features.map((feature) => (
            <TableCell
              key={`feature-${feature.name}-${planId}`}
              feature={feature}
              planId={planId}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
});

export default TableColumn;
