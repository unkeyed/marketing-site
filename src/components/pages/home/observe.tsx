'use client';

import Image from 'next/image';

import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import RiveCanvas, { type IRiveConfig } from '@/components/ui/rive-canvas';

interface IObserveColumn {
  lead: string;
  rest: string;
}

interface IObserveProps {
  heading: string;
  subheading: string;
  riveDefaults: IRiveConfig;
  mobileImage: string;
  buttonLabel: string;
  buttonHref: string;
  columns: IObserveColumn[];
}

export default function Observe({
  heading,
  subheading,
  riveDefaults,
  mobileImage,
  buttonLabel,
  buttonHref,
  columns,
}: IObserveProps) {
  return (
    <section className="pt-20 md:pt-35 xl:pt-50">
      <div className="container">
        <div className="relative h-140 sm:h-160 md:h-130 lg:h-140 xl:h-158">
          <div
            aria-hidden
            className="absolute top-0 left-0 z-[1] h-42.5 w-full bg-background sm:h-47 md:h-50 xl:h-46.75 xl:max-w-240"
          />
          <div className="relative z-10 flex h-42.5 w-full flex-col gap-5 pb-4 sm:h-47 sm:pb-5 md:h-50 md:gap-6 lg:gap-[1.75rem] xl:h-46.75 xl:max-w-240 xl:gap-8">
            <Label>Observe</Label>
            <h2 className="max-w-240 font-display text-[1.875rem] leading-[1.125] text-white sm:text-[2.25rem] xl:text-[2.75rem]">
              {heading}
              <span className="block text-gray-60">{subheading}</span>
            </h2>
          </div>
          <RiveCanvas
            className="absolute top-0 left-0 z-0 hidden h-full w-full lg:block"
            src={riveDefaults.src}
            fit={riveDefaults.fit}
            alignment={riveDefaults.alignment}
            lazyOffset={400}
            playOffset={-200}
            lazy
          />
          <Image
            className="block object-cover object-[75%_100%] sm:object-[90%_100%] md:object-bottom-right lg:hidden"
            src={mobileImage}
            sizes="
            (max-width: 640px) 1360px,
            (max-width: 768px) 1555px,
            (max-width: 1024px) 1263px,
            0px
            "
            aria-hidden="true"
            alt=""
            fill
          />
        </div>

        <div className="mt-10 grid gap-8 sm:mt-11 md:mt-12 md:gap-12 lg:gap-[2.75rem] xl:mt-14 xl:grid-cols-[35fr_65fr] xl:gap-4">
          <ul className="order-1 grid max-w-248 grid-cols-1 gap-8 text-base leading-snug sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 md:gap-y-14 md:text-lg xl:order-2 xl:grid-cols-[384px_384px] xl:gap-x-56 xl:gap-y-20">
            {columns.map((column) => (
              <li className="max-w-96" key={column.lead}>
                <p>
                  <span className="font-medium text-white">{column.lead} </span>
                  <span className="text-gray-60">{column.rest}</span>
                </p>
              </li>
            ))}
          </ul>
          <Link href={buttonHref} className="w-fit">
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
