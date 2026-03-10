import Image from 'next/image';
import pricingLinesImage from '@/assets/images/pricing/lines.png';

import { cn } from '@/lib/utils';
import {
  CompactCaseStudyCard,
  FeaturedCaseStudyCard,
  type ICompactCaseStudyCardProps,
  type IFeaturedCaseStudyCardProps,
  type TCaseStudyCardProps,
} from '@/components/pages/case-studies/case-study-card';

interface ICaseStudiesGridProps {
  items: readonly TCaseStudyCardProps[];
  className?: string;
}

interface ICaseStudyGroup {
  compact: ICompactCaseStudyCardProps[];
  featured?: IFeaturedCaseStudyCardProps;
}

function isCompactCaseStudy(item: TCaseStudyCardProps): item is ICompactCaseStudyCardProps {
  return item.variant === 'compact';
}

function getCaseStudyGroups(items: readonly TCaseStudyCardProps[]): ICaseStudyGroup[] {
  const groups: ICaseStudyGroup[] = [];

  for (let index = 0; index < items.length; index += 3) {
    const compact = items.slice(index, index + 2).filter(isCompactCaseStudy);
    const featured = items[index + 2];

    groups.push({
      compact,
      featured: featured && !isCompactCaseStudy(featured) ? featured : undefined,
    });
  }

  return groups;
}

function LinesDivider() {
  return (
    <div className="relative h-12 border-x border-border bg-repeat md:h-16">
      <Image alt="" fill sizes="100vw" className="z-0 object-cover" src={pricingLinesImage} />
    </div>
  );
}

export default function CaseStudiesGrid({ items, className }: ICaseStudiesGridProps) {
  if (items.length === 0) {
    return null;
  }

  const shouldUseMixedGrid = items.length > 2;
  const caseStudyGroups = shouldUseMixedGrid ? getCaseStudyGroups(items) : [];

  return (
    <section
      className={cn(
        'section-container mb-24 pt-12 md:mb-32 lg:mb-40 xl:mb-50 xl:pt-21.5',
        className,
      )}
    >
      {shouldUseMixedGrid
        ? caseStudyGroups.map((group, groupIndex) => (
            <div key={`case-study-group-${groupIndex}`}>
              <div className="flex flex-col lg:h-108 lg:flex-row xl:h-131 [&>*+*]:-mt-px lg:[&>*+*]:mt-0 [&>*+*]:lg:-ml-px">
                {group.compact.map((caseStudy, compactIndex) => (
                  <CompactCaseStudyCard key={`${caseStudy.href}-${compactIndex}`} {...caseStudy} />
                ))}
              </div>

              {group.featured ? (
                <>
                  <LinesDivider />
                  <FeaturedCaseStudyCard {...group.featured} />
                </>
              ) : null}

              {groupIndex < caseStudyGroups.length - 1 ? <LinesDivider /> : null}
            </div>
          ))
        : items.map((caseStudy, index) => (
            <div key={`${caseStudy.href}-${index}`}>
              {isCompactCaseStudy(caseStudy) ? (
                <CompactCaseStudyCard {...caseStudy} />
              ) : (
                <FeaturedCaseStudyCard {...caseStudy} />
              )}
              {index < items.length - 1 ? <LinesDivider /> : null}
            </div>
          ))}
    </section>
  );
}
