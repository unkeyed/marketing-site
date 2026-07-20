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

function isExternalUrl(value: ReactNode): value is string {
  return typeof value === 'string' && /^https?:\/\//.test(value.trim());
}

function formatUrlLabel(url: string): string {
  const trimmed = url.trim();

  try {
    const { host, pathname } = new URL(trimmed);
    const path = pathname === '/' ? '' : pathname.replace(/\/$/, '');
    return `${host}${path}`;
  } catch {
    return trimmed
      .replace(/^https?:\/\//, '')
      .replace(/[?#].*$/, '')
      .replace(/\/$/, '');
  }
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
              {isExternalUrl(item.content) ? (
                <a
                  href={item.content.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-normal break-words text-foreground underline decoration-gray-40 decoration-dashed decoration-[1px] underline-offset-[0.26em] transition-colors duration-300 hover:text-foreground/85 hover:decoration-gray-70"
                >
                  {formatUrlLabel(item.content)}
                </a>
              ) : (
                item.content
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default CaseStudyCompanyOverview;
