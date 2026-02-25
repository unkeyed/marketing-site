import Image from 'next/image';

import { cn } from '@/lib/utils';

import BadgeGlowDot from './badge--glow-dot';

const CONTAINER =
  'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IBuildDeployPanel {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  imageAlt: string;
  hasLogos?: boolean;
  logos?: { alt: string; src: string; className: string }[];
  textTopClass?: string;
}

interface IBuildDeployProps {
  heading: string;
  description: string;
  panels: IBuildDeployPanel[];
}

function ContentPanel({ row, isLast }: { row: IBuildDeployPanel; isLast: boolean }) {
  return (
    <>
      <div
        id={row.id}
        className="grid min-h-[628px] grid-cols-1 lg:min-h-[clamp(540px,41vw,628px)] lg:grid-cols-2"
      >
        <div
          className={cn(
            'flex flex-col border border-gray-20 px-5 py-10 md:px-10 lg:border-r-0 lg:px-16 lg:py-0 xl:px-24',
            row.textTopClass ?? 'lg:pt-[137px]',
          )}
        >
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex flex-col text-[24px] leading-[1.125] tracking-[-0.56px] sm:text-[28px]">
              <p className="text-white">{row.title}</p>
              <p className="text-[#9194a1]">{row.subtitle}</p>
            </div>
            <p className="max-w-[448px] text-base leading-snug text-gray-90">{row.body}</p>
          </div>
          {row.hasLogos && row.logos && (
            <div className="mt-8 lg:mb-[140px]">
              <div className="flex flex-wrap items-end gap-4 sm:gap-6">
                {row.logos.map((logo) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={logo.alt} alt={logo.alt} className={logo.className} src={logo.src} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-x border-b border-gray-20 lg:border">
          <Image
            alt={row.imageAlt}
            width={1536}
            height={1256}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover"
            src={row.image}
          />
        </div>
      </div>
      {!isLast && (
        <div
          className="h-16 border-l border-r border-gray-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)',
          }}
        />
      )}
    </>
  );
}

export default function FeaturesBuildDeploy({ heading, description, panels }: IBuildDeployProps) {
  return (
    <section className="pt-20 md:pt-[120px] xl:pt-[180px]">
      <div className={cn(CONTAINER, 'flex flex-col')}>
        <div className="pt-8 md:pt-12 xl:pt-[80px]">
          <BadgeGlowDot className="w-fit" labelClassName="tracking-[0.42px]">
            Build & Deploy
          </BadgeGlowDot>

          <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[60fr_40fr] lg:gap-8">
            <h2 className="font-display text-[30px] leading-[1.125] text-white sm:text-[40px] xl:text-[52px]">
              {heading}
            </h2>
            <p className="max-w-[416px] text-lg leading-snug tracking-[-0.2px] text-gray-70 md:text-xl lg:mt-[31px] lg:ml-auto">
              {description}
            </p>
          </div>

          <div className="mt-8 h-16 overflow-x-auto border-b border-gray-20 md:mt-12 xl:mt-[80px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid h-full min-w-[660px] grid-cols-5 md:min-w-0 md:w-full">
              {panels.map((row, index) => (
                <div
                  key={row.id}
                  className={cn(
                    'flex h-full w-full items-center justify-center border-l border-t border-gray-20 px-4 text-base leading-[1.125] font-normal sm:text-lg md:text-xl',
                    index === panels.length - 1 && 'border-r',
                    index === 0 ? 'bg-panel text-white' : 'text-[#9194a1]',
                  )}
                >
                  <span>{row.tabLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="-mt-px">
          {panels.map((row, index) => (
            <ContentPanel key={row.id} row={row} isLast={index === panels.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
