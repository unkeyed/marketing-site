import Image from 'next/image';

import BadgeGlowDot from './badge--glow-dot';

const CONTAINER =
  'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IScaleFeature {
  title: string;
  text: string;
  icon: string;
}

interface IScaleProps {
  heading: React.ReactNode;
  description: string;
  buttonLabel: string;
  features: IScaleFeature[];
}

export default function SectionScale({ heading, description, buttonLabel, features }: IScaleProps) {
  return (
    <section className="relative mt-20 md:mt-[140px] xl:mt-[200px]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b6cdfb_0%,#ecf2fe_80.629%)]" />
      <div className={`${CONTAINER} relative py-16 md:py-24 xl:py-[192px]`}>
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="flex max-w-[704px] flex-col gap-8">
            <BadgeGlowDot
              variant="light"
              className="w-[88px]"
              labelClassName="leading-snug tracking-[0.42px]"
            >
              Scale
            </BadgeGlowDot>
            <h2 className="text-balance font-display text-[30px] leading-[1.2] text-background sm:text-[36px] lg:text-[44px] lg:leading-[1.25]">
              {heading}
            </h2>
          </div>
          <div className="flex max-w-[416px] flex-col gap-6 lg:pt-[75px]">
            <p className="text-lg leading-snug tracking-[-0.2px] text-gray-20 md:text-xl">
              {description}
            </p>
            <button
              type="button"
              className="h-[44px] w-fit bg-background px-5 py-3.5 text-base leading-none font-medium tracking-[-0.4px] text-white"
            >
              {buttonLabel}
            </button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:mt-[200px] xl:grid-cols-4 xl:gap-6">
          {features.map((item) => (
            <div className="flex max-w-[320px] flex-col gap-8 xl:gap-[44px]" key={item.title}>
              <Image
                alt={item.title}
                width={148}
                height={148}
                className="h-[120px] w-[120px] md:h-[148px] md:w-[148px]"
                src={item.icon}
              />
              <div className="flex flex-col gap-5">
                <p className="font-display text-[24px] leading-[1.125] text-background md:text-[28px]">
                  {item.title}
                </p>
                <p className="text-base leading-snug tracking-[-0.16px] text-gray-30">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
