import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import RiveCanvas, { type IRiveConfig } from '@/components/ui/rive-canvas';

interface IScaleFeature {
  title: string;
  text: string;
  rive: Pick<IRiveConfig, 'artboard'> & Partial<Pick<IRiveConfig, 'src'>>;
}

interface IScaleProps {
  heading: ReactNode;
  riveDefaults: IRiveConfig;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  features: IScaleFeature[];
}

export default function Scale({
  heading,
  riveDefaults,
  description,
  buttonLabel,
  buttonHref,
  features,
}: IScaleProps) {
  return (
    <section
      data-header-theme="light"
      className="relative py-14 sm:py-18 md:py-22 lg:pt-30 lg:pb-34 xl:pt-48 xl:pb-51"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b6cdfb_0%,#ecf2fe_80.629%)]" />
      <div className="relative container">
        <div className="flex flex-col gap-[1rem] md:gap-[1.25rem] lg:flex-row lg:justify-between lg:gap-9">
          <div className="flex max-w-176 flex-col gap-[1.25rem] md:gap-[1.5rem] lg:gap-[1.75rem] xl:gap-8">
            <Label variant="light">Scale</Label>
            <h2 className="font-display text-[1.875rem] leading-[1.2] text-balance text-background sm:text-[2.25rem] md:text-[2.25rem] lg:text-[2.5rem] lg:leading-[1.25] xl:text-[2.75rem] [&_mark]:-ml-1 [&_mark]:inline-flex [&_mark]:h-6.75 [&_mark]:items-center [&_mark]:bg-yellow [&_mark]:box-decoration-clone [&_mark]:pr-1 [&_mark]:pb-2 [&_mark]:pl-1 [&_mark]:text-black md:[&_mark]:h-9.5 lg:[&_mark]:h-10.5">
              {heading}
            </h2>
          </div>
          <div className="flex max-w-[30rem] flex-col gap-[1.25rem] sm:max-w-[34rem] md:max-w-[37rem] md:gap-[1.5rem] lg:max-w-104 lg:gap-4.5 lg:pt-18.75">
            <p className="text-base leading-snug tracking-[-0.01em] text-gray-20 sm:text-lg md:text-[1.125rem] lg:text-xl">
              {description}
            </p>
            <Link href={buttonHref} variant="primaryBlack" className="w-fit">
              {buttonLabel}
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-9 sm:mt-14 sm:grid-cols-2 sm:gap-10 md:mt-18 md:gap-12 lg:mt-22 xl:mt-40 xl:grid-cols-[repeat(4,minmax(0,20.0625rem))] xl:justify-between">
          {features.map((item) => (
            <li
              className="flex max-w-[20.0625rem] flex-col gap-7 sm:gap-8 md:gap-10 xl:gap-11"
              key={item.title}
            >
              <RiveCanvas
                className="h-26 w-26 sm:h-30 sm:w-30 md:h-37 md:w-37"
                src={item.rive.src ?? riveDefaults.src}
                artboard={item.rive.artboard}
                fit={riveDefaults.fit}
                alignment={riveDefaults.alignment}
                lazyOffset={400}
                playOffset={-100}
                lazy
              />
              <div className="flex flex-col gap-5">
                <h3 className="font-display text-[1.375rem] leading-[1.125] text-background sm:text-2xl md:text-[1.5rem] lg:text-[1.75rem]">
                  {item.title}
                </h3>
                <p className="text-base leading-snug tracking-[-0.01em] text-gray-30">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
