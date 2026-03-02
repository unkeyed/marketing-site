'use client';

import type { ReactNode } from 'react';

import { cn, splitLeadSentence } from '@/lib/utils';
import RiveCanvas, { type IRiveConfig } from '@/components/ui/rive-canvas';

interface IControlPlaneCard {
  id: string;
  title: string;
  body: string;
  rive: Pick<IRiveConfig, 'artboard' | 'autoBind'>;
}

interface IControlPlaneProps {
  heading: ReactNode;
  description: string;
  riveDefaults: Pick<IRiveConfig, 'src' | 'fonts'>;
  cards: IControlPlaneCard[];
}

function Card({ body, rive, className }: { body: string; rive: IRiveConfig; className?: string }) {
  const { lead, rest } = splitLeadSentence(body);

  return (
    <li
      className={cn(
        'relative flex min-h-95 flex-col justify-end overflow-hidden border border-gray-20 bg-background px-5 pt-5.5 pb-5 sm:px-6 sm:pt-6.5 sm:pb-6 lg:min-h-100 xl:h-98 xl:px-8 2xl:h-107.25',
        className,
      )}
    >
      <RiveCanvas
        className="absolute top-0 left-0 h-full w-full"
        src={rive.src}
        artboard={rive.artboard}
        autoBind={rive.autoBind}
        fonts={rive.fonts}
        lazyOffset={200}
        fontPrefetchOffset={400}
        lazy
      />
      <p className="text-[15px] leading-snug text-gray-80 sm:text-base">
        <strong className="font-medium text-foreground">{lead}</strong>
        {rest ? <span> {rest}</span> : null}
      </p>
    </li>
  );
}

export default function ControlPlane({
  heading,
  description,
  riveDefaults,
  cards,
}: IControlPlaneProps) {
  return (
    <section className="pt-20 md:pt-30 xl:pt-57.25">
      <div className="relative container flex flex-col">
        <div className="relative sm:pl-8">
          <div
            aria-hidden
            className="absolute -top-20 bottom-0 left-0 z-0 hidden h-162.75 w-px bg-gray-20 sm:block md:-top-30 xl:-top-[14.3125rem]"
          />
          <h2 className="max-w-[26.5rem] font-display text-[1.75rem] leading-[1.125] whitespace-pre-line text-foreground md:max-w-[34.375rem] md:text-4xl lg:max-w-[33.25rem] lg:text-[2.5rem] xl:max-w-[39.9375rem] xl:text-[2.75rem] [&_mark]:-ml-1 [&_mark]:inline-flex [&_mark]:h-6.75 [&_mark]:items-center [&_mark]:bg-yellow [&_mark]:box-decoration-clone [&_mark]:pr-0 [&_mark]:pb-2 [&_mark]:pl-1 [&_mark]:text-black md:[&_mark]:h-8.5 lg:[&_mark]:h-10.5">
            {heading}
          </h2>
          <p className="mt-6 max-w-144 text-lg leading-snug tracking-[-0.01em] text-gray-70 lg:mt-7 lg:text-xl">
            {description}
          </p>
        </div>

        <div className="relative z-10 mt-10 snap-x snap-mandatory scroll-pl-5 overflow-x-auto [scrollbar-width:none] sm:-mx-5 md:-mx-8 md:mt-16 md:scroll-pl-8 xl:mx-0 xl:mt-40 xl:snap-none xl:scroll-pl-0 xl:overflow-visible [&::-webkit-scrollbar]:hidden">
          <ul className="flex flex-col items-stretch gap-0 sm:w-max sm:flex-row sm:px-5 md:px-8 xl:w-auto xl:px-0">
            {cards.map((card, index) => (
              <Card
                key={card.id}
                body={card.body}
                rive={{ ...riveDefaults, ...card.rive }}
                className={cn(
                  'w-full sm:w-75 sm:shrink-0 sm:snap-start md:w-85 lg:w-90 xl:w-auto xl:flex-1',
                  index > 0 && '-mt-px sm:mt-0 sm:-ml-px',
                )}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
