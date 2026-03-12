import Image from 'next/image';
import NextLink from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface ICaseStudyCardBaseProps {
  category: string;
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
  className?: string;
}

export interface IFeaturedCaseStudyCardProps extends ICaseStudyCardBaseProps {
  variant?: 'default';
  imageSrc: string;
  imageAlt: string;
}

export interface ICompactCaseStudyCardProps extends ICaseStudyCardBaseProps {
  variant: 'compact';
  logoSrc: string;
  logoAlt: string;
  logoWidth?: number;
  logoHeight?: number;
}

export type TCaseStudyCardProps = IFeaturedCaseStudyCardProps | ICompactCaseStudyCardProps;

interface ICaseStudyCardContentProps extends ICaseStudyCardBaseProps {
  mutedTextClassName?: string;
  titleTag?: 'h2' | 'h3';
}

function CaseStudyCardContent({
  category,
  title,
  description,
  href,
  ctaLabel = 'Read case study',
  mutedTextClassName = 'text-muted-foreground',
  titleTag = 'h3',
}: ICaseStudyCardContentProps) {
  const TitleTag = titleTag;

  return (
    <div className="flex flex-col gap-5 lg:gap-6 xl:gap-8">
      <div className="flex flex-col gap-3 lg:gap-4">
        <Badge
          variant="uppercase"
          size="sm"
          className="text-xs font-medium tracking-tight lg:text-sm"
        >
          {category}
        </Badge>
        <TitleTag className="text-xl leading-snug font-normal tracking-tight text-pretty lg:text-2xl xl:text-3xl">
          <span className="font-normal text-foreground">{title}</span>
          <span className={cn('font-normal', mutedTextClassName)}> {description}</span>
        </TitleTag>
      </div>

      <NextLink
        href={href}
        className="group inline-flex items-center gap-1 text-base leading-none font-medium tracking-tight text-primary"
      >
        {ctaLabel}
        <ArrowRight
          className="transition-transform duration-200 group-hover:translate-x-0.5"
          size={16}
          aria-hidden
          focusable="false"
        />
      </NextLink>
    </div>
  );
}

export function CompactCaseStudyCard({
  category,
  title,
  description,
  href,
  ctaLabel,
  className,
  logoSrc,
  logoAlt,
  logoWidth = 80,
  logoHeight = 32,
}: ICompactCaseStudyCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-1 flex-col items-start justify-between gap-18 border border-border p-6 lg:justify-between lg:gap-0 lg:p-12 xl:p-12',
        className,
      )}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={logoWidth}
        height={logoHeight}
        className="h-8 w-auto"
      />

      <CaseStudyCardContent
        category={category}
        title={title}
        description={description}
        href={href}
        ctaLabel={ctaLabel}
        mutedTextClassName="text-gray-60"
      />
    </article>
  );
}

export function FeaturedCaseStudyCard({
  category,
  title,
  description,
  href,
  ctaLabel,
  className,
  imageSrc,
  imageAlt,
}: IFeaturedCaseStudyCardProps) {
  return (
    <article
      className={cn(
        'grid border-x border-y border-border lg:min-h-108 lg:grid-cols-2 xl:min-h-106.75',
        className,
      )}
    >
      <div className="relative h-72 w-full overflow-hidden border-b border-border md:h-96 lg:h-full lg:border-r lg:border-b-0">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-end px-6 py-6 lg:py-12 lg:pr-12 lg:pl-12 xl:pr-12">
        <CaseStudyCardContent
          category={category}
          title={title}
          description={description}
          href={href}
          ctaLabel={ctaLabel}
          mutedTextClassName="text-gray-50"
          titleTag="h2"
        />
      </div>
    </article>
  );
}

export default CompactCaseStudyCard;
