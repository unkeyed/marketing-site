import type { ReactNode } from 'react';

import Image from 'next/image';

import { cn, splitLeadSentence } from '@/lib/utils';

interface IControlPlaneCard {
  id: string;
  title: string;
  body: string;
  graphic: string;
}

interface IControlPlaneProps {
  heading: ReactNode;
  description: string;
  cards: IControlPlaneCard[];
}

function Card({
  title,
  body,
  graphic,
  className,
}: {
  title: string;
  body: string;
  graphic: string;
  className?: string;
}) {
  const { lead, rest } = splitLeadSentence(body);

  return (
    <li
      className={cn(
        'flex min-h-95 flex-col overflow-hidden border border-gray-20 bg-background px-5 pt-5.5 pb-5 sm:px-6 sm:pt-6.5 sm:pb-6 xl:h-107.25 xl:px-8',
        className,
      )}
    >
      <h3 className="font-mono text-[15px] leading-tight text-gray-40">{title}</h3>
      <div className="relative min-h-42.5 flex-1 sm:min-h-52.5">
        <Image
          alt=""
          width={320}
          height={293}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 300px, 384px"
          className="h-auto max-h-full w-full object-contain object-left-top"
          src={graphic}
        />
      </div>
      <p className="text-[15px] leading-snug text-gray-80 sm:text-base">
        <strong className="font-medium text-foreground">{lead}</strong>
        {rest ? <span> {rest}</span> : null}
      </p>
    </li>
  );
}

export default function ControlPlane({ heading, description, cards }: IControlPlaneProps) {
  return (
    <section className="pt-20 md:pt-30 xl:pt-57.25">
      <div className="container relative flex flex-col">
        <div className="relative sm:pl-8">
          <div
            aria-hidden
            className="absolute -top-20 bottom-0 left-0 z-0 hidden h-162.75 w-px bg-gray-20 sm:block md:-top-30 xl:-top-[229px]"
          />
          <h2 className="max-w-100 font-display text-[28px] leading-[1.125] whitespace-pre-line text-foreground md:max-w-[550px] md:text-4xl lg:max-w-125 lg:text-[44px] xl:max-w-[639px] [&_mark]:-ml-1 [&_mark]:inline-flex [&_mark]:h-6.75 [&_mark]:items-center [&_mark]:bg-yellow [&_mark]:box-decoration-clone [&_mark]:pr-0 [&_mark]:pb-2 [&_mark]:pl-1 [&_mark]:text-black md:[&_mark]:h-8.5 lg:[&_mark]:h-10.5">
            {heading}
          </h2>
          <p className="mt-6 max-w-144 text-lg leading-snug tracking-[-0.01em] text-gray-70 lg:mt-7 lg:text-xl">
            {description}
          </p>
        </div>

        <div className="relative z-10 mt-10 snap-x snap-mandatory scroll-pl-5 overflow-x-auto [scrollbar-width:none] sm:-mx-5 md:-mx-8 md:mt-16 md:scroll-pl-8 xl:mx-0 xl:mt-40 xl:snap-none xl:scroll-pl-0 xl:overflow-visible [&::-webkit-scrollbar]:hidden">
          <ul className="flex flex-col items-stretch gap-3 sm:w-max sm:flex-row sm:gap-0 sm:px-5 md:px-8 xl:w-auto xl:px-0">
            {cards.map((card, index) => (
              <Card
                key={card.id}
                title={card.title}
                body={card.body}
                graphic={card.graphic}
                className={cn(
                  'w-full sm:w-75 sm:shrink-0 sm:snap-start md:w-85 xl:w-auto xl:flex-1',
                  index > 0 && 'sm:-ml-px',
                )}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
