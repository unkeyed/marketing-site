import { type ReactNode } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

interface ICaseStudyCompanyOverviewItem {
  label: string;
  content: ReactNode;
}

interface ICaseStudyCompanyOverviewProps {
  className?: string;
  logoSrc: string;
  logoAlt: string;
  logoWidth?: number;
  logoHeight?: number;
  items: readonly ICaseStudyCompanyOverviewItem[];
}

function CaseStudyCompanyOverview({
  className,
  logoSrc,
  logoAlt,
  logoWidth = 143,
  logoHeight = 32,
  items,
}: ICaseStudyCompanyOverviewProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={cn('flex w-full flex-col gap-5', className)} aria-label="Company overview">
      <div className="pb-3">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
          className="h-auto w-auto max-w-full object-contain"
        />
      </div>

      <dl className="flex w-full flex-col gap-5">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <dt className="text-sm leading-snug font-medium tracking-tight text-foreground">
              {item.label}
            </dt>
            <dd className="text-sm leading-snug font-normal tracking-tight text-muted-foreground">
              {item.content}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default CaseStudyCompanyOverview;
