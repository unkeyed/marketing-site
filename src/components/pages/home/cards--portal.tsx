import Image from 'next/image';

import { cn, splitLeadSentence } from '@/lib/utils';

import BadgeGlowDot from './badge--glow-dot';

const CONTAINER =
  'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IPortalCard {
  text: string;
  graphic: string;
  graphicAlt: string;
  textWidthClass?: string;
}

interface IPortalProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  cards: IPortalCard[];
}

function PortalCard({
  text,
  graphic,
  graphicAlt,
  textWidthClass = 'max-w-[374px]',
  className,
}: IPortalCard & { className?: string }) {
  const { lead, rest } = splitLeadSentence(text);

  return (
    <div
      className={cn(
        'relative flex h-[460px] w-full flex-col overflow-hidden border border-gray-20 bg-background md:h-[500px] xl:h-[528px]',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 bottom-6 overflow-hidden lg:bottom-0">
        <Image
          alt={graphicAlt}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain object-top"
          src={graphic}
        />
      </div>
      <p className="absolute bottom-8 left-8 right-8 z-10 text-base leading-snug">
        <span className={cn('block', textWidthClass)}>
          <span className="font-medium text-white">{lead}</span>
          {rest ? <span className="text-gray-80"> {rest}</span> : null}
        </span>
      </p>
    </div>
  );
}

export default function CardsPortal({ heading, subheading, buttonLabel, cards }: IPortalProps) {
  return (
    <section className="pt-20 md:pt-[140px] xl:pt-[229px]">
      <div className={cn(CONTAINER, 'flex flex-col gap-8')}>
        <BadgeGlowDot
          className="h-[35px] w-[220px]"
          labelClassName="leading-snug tracking-[0.3px]"
        >
          AIO Developer Portal
        </BadgeGlowDot>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="max-w-[960px] font-display text-[30px] leading-[1.125] text-white sm:text-[36px] xl:text-[44px]">
            {heading}
            <span className="block text-[#9194a1]">{subheading}</span>
          </h2>
          <button
            type="button"
            className="h-[44px] w-[139px] bg-white px-5 py-3.5 text-base leading-none font-medium tracking-[-0.4px] text-[#040406] lg:mt-14"
          >
            {buttonLabel}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 xl:mt-[56px] xl:grid-cols-3 xl:gap-0">
          {cards.map((item, index) => (
            <PortalCard
              key={item.graphicAlt}
              text={item.text}
              graphic={item.graphic}
              graphicAlt={item.graphicAlt}
              textWidthClass={item.textWidthClass}
              className={index > 0 ? 'xl:-ml-px' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
