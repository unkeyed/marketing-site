import Image from 'next/image';

import { cn } from '@/lib/utils';

import BadgeGlowDot from './badge--glow-dot';

const CONTAINER =
  'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IGatewayCard {
  title: string;
  body: string;
  graphic: string;
  graphicAlt: string;
  imageClassName?: string;
  imageWrapperClassName?: string;
  textWidthClass?: string;
  fullBleedImage?: boolean;
  useTextBackground?: boolean;
  gridClassName: string;
}

interface IGatewayProps {
  heading: string;
  cards: IGatewayCard[];
}

function GatewayCard({
  title,
  body,
  graphic,
  graphicAlt,
  imageClassName = 'object-cover',
  imageWrapperClassName,
  textWidthClass = 'max-w-[352px]',
  fullBleedImage = false,
  useTextBackground = false,
  className,
}: Omit<IGatewayCard, 'gridClassName'> & { className?: string }) {
  const textContent = useTextBackground ? (
    <span className="inline box-decoration-clone bg-background px-1.5 py-2 leading-[1.75]">
      <span className="font-medium text-white">{title}.</span> <span>{body}</span>
    </span>
  ) : (
    <>
      <span className="font-medium text-white">{title}.</span> <span>{body}</span>
    </>
  );

  const textBlock = (
    <p className="relative z-10 px-6 pt-6 pb-3 text-base leading-snug text-gray-80 md:px-8 md:pt-7 md:pb-4 xl:pt-8">
      <span className={`block max-w-full ${textWidthClass}`}>{textContent}</span>
    </p>
  );

  const imgEl = (
    <Image
      alt={graphicAlt}
      className={imageClassName}
      fill
      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
      src={graphic}
    />
  );

  if (fullBleedImage) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden border border-gray-20 bg-background',
          className,
        )}
      >
        {imageWrapperClassName ? <div className={imageWrapperClassName}>{imgEl}</div> : imgEl}
        {textBlock}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid w-full grid-rows-[auto_1fr] overflow-hidden border border-gray-20 bg-background',
        className,
      )}
    >
      {textBlock}
      <div className="relative z-0 min-h-0 overflow-hidden">
        {imageWrapperClassName ? <div className={imageWrapperClassName}>{imgEl}</div> : imgEl}
      </div>
    </div>
  );
}

export default function BentoGateway({ heading, cards }: IGatewayProps) {
  return (
    <section className="pt-20 md:pt-[140px] xl:pt-[260px]">
      <div className={cn(CONTAINER, 'flex flex-col items-center gap-8')}>
        <BadgeGlowDot labelClassName="tracking-[0.42px]">Gateway</BadgeGlowDot>
        <h2 className="max-w-[1177px] text-center font-display text-[30px] leading-[1.125] text-white sm:text-[40px] xl:text-[52px]">
          {heading}
        </h2>

        <div className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:mt-10 xl:mt-[57px] xl:grid-cols-3 xl:grid-rows-[446px_446px] xl:gap-2.5">
          {cards.map((card) => (
            <GatewayCard
              key={card.title}
              title={card.title}
              body={card.body}
              graphic={card.graphic}
              graphicAlt={card.graphicAlt}
              imageClassName={card.imageClassName}
              imageWrapperClassName={card.imageWrapperClassName}
              textWidthClass={card.textWidthClass}
              fullBleedImage={card.fullBleedImage}
              useTextBackground={card.useTextBackground}
              className={card.gridClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
