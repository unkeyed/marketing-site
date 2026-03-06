import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import BuildDeployStickyHeader from '@/components/pages/home/build-deploy-sticky-header';
import {
  type IBuildDeployPanel,
  type IBuildDeployProps,
} from '@/components/pages/home/build-deploy.types';

function Panel({ row, isLast }: { row: IBuildDeployPanel; isLast: boolean }) {
  return (
    <li>
      <section
        id={row.id}
        style={{ scrollMarginTop: 'var(--build-deploy-scroll-margin, 200px)' }}
        className="grid min-h-140 grid-cols-1 sm:min-h-157 lg:min-h-[clamp(33.75rem,41vw,39.25rem)] lg:grid-cols-2"
      >
        <div
          className={cn(
            'flex flex-col border border-gray-20 px-5 py-8 sm:py-10 md:px-10 md:py-12 lg:border-r-0 lg:px-16 lg:py-0 xl:px-24',
            row.textTopClass ?? 'lg:pt-34.25',
          )}
        >
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="text-[1.375rem] leading-[1.125] tracking-[-0.02em] sm:text-[1.625rem] md:text-[1.75rem]">
              <h3 className="text-white">{row.title}</h3>
              <p className="text-gray-60">{row.subtitle}</p>
            </div>
            <p className="max-w-md text-[0.9375rem] leading-snug text-gray-90 sm:text-base">
              {row.body}
            </p>
          </div>

          {row.hasLogos && row.logos && (
            <div className="mt-8 flex flex-wrap items-end gap-4 sm:mt-10 sm:gap-6 md:mt-12 lg:mt-24 xl:mt-45.75">
              {row.logos.map((logo) => (
                <Image
                  key={logo.alt}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={logo.className}
                  src={logo.src}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-gray-20 lg:border">
          <Image
            alt=""
            width={1536}
            height={1256}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover"
            src={row.image}
          />
        </div>
      </section>

      {!isLast && (
        <div
          className="h-16 border-r border-l border-gray-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)',
          }}
        />
      )}
    </li>
  );
}

export default function BuildDeploy({ heading, description, panels }: IBuildDeployProps) {
  return (
    <section className="pt-20 md:pt-30 xl:pt-45">
      <div className="container">
        <div className="pt-8 md:pt-12 xl:pt-20">
          <Label>Build & Deploy</Label>
        </div>

        <div>
          <BuildDeployStickyHeader
            heading={heading}
            description={description}
            panels={panels.map(({ id, tabLabel }) => ({ id, tabLabel }))}
          />

          {panels.length > 1 && (
            <ul className="-mx-5 -mt-px list-none md:-mx-8 xl:mx-0">
              {panels.slice(0, -1).map((row) => (
                <Panel key={row.id} row={row} isLast={false} />
              ))}
            </ul>
          )}
        </div>

        {panels.length > 0 && (
          <ul className="-mx-5 -mt-px list-none md:-mx-8 xl:mx-0">
            <Panel row={panels[panels.length - 1]} isLast />
          </ul>
        )}
      </div>
    </section>
  );
}
