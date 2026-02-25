import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IGatewayCard {
  title: string;
  body: string;
  graphic: string;
  graphicAlt: string;
  imageClassName?: string;
  imageWrapperClassName?: string;
  textWidthClass?: string;
  layout?: 'split' | 'overlay';
  textStyle?: 'plain' | 'marked';
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
  layout: layoutProp,
  textStyle: textStyleProp,
  fullBleedImage = false,
  useTextBackground = false,
  className,
}: Omit<IGatewayCard, 'gridClassName'> & { className?: string }) {
  const layout = layoutProp ?? (fullBleedImage ? 'overlay' : 'split');
  const textStyle = textStyleProp ?? (useTextBackground ? 'marked' : 'plain');

  const textContent =
    textStyle === 'marked' ? (
      <mark className="inline bg-background box-decoration-clone pt-0 pr-8 pb-5.5 pl-0 text-inherit">
        <span className="font-medium text-white">{title}.</span> <span>{body}</span>
      </mark>
    ) : (
      <>
        <span className="font-medium text-white">{title}.</span> <span>{body}</span>
      </>
    );

  const textBlock = (
    <p className="relative z-10 px-6 pt-6 pb-3 text-base leading-snug text-gray-80 md:px-8 md:pt-7 md:pb-4 xl:pt-8">
      <span className={`block ${textWidthClass}`}>{textContent}</span>
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

  const imageBlock = (
    <div
      className={cn(
        layout === 'overlay'
          ? 'absolute inset-0 overflow-hidden'
          : 'relative z-0 min-h-0 overflow-hidden',
      )}
    >
      {imageWrapperClassName ? <div className={imageWrapperClassName}>{imgEl}</div> : imgEl}
    </div>
  );

  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden border border-gray-20 bg-background',
        layout === 'overlay' ? 'relative' : 'grid grid-rows-[auto_1fr]',
        className,
      )}
    >
      <>
        {textBlock}
        {imageBlock}
      </>
    </div>
  );
}

export default function BentoGateway({ heading, cards }: IGatewayProps) {
  return (
    <section className="pt-20 md:pt-[140px] xl:pt-[260px]">
      <div className={cn(CONTAINER, 'flex flex-col items-center')}>
        <Label>Gateway</Label>
        <h2 className="max-w-[1177px] text-center font-display text-[30px] leading-[1.125] text-white sm:text-[40px] xl:mt-8 xl:text-[52px]">
          {heading}
        </h2>

        <ul className="mt-6 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:mt-10 xl:mt-20 xl:grid-cols-3 xl:grid-rows-[446px_446px] xl:gap-2.5">
          {cards.map((card) => (
            <li key={card.title} className={card.gridClassName}>
              <GatewayCard
                title={card.title}
                body={card.body}
                graphic={card.graphic}
                graphicAlt={card.graphicAlt}
                imageClassName={card.imageClassName}
                imageWrapperClassName={card.imageWrapperClassName}
                textWidthClass={card.textWidthClass}
                fullBleedImage={card.fullBleedImage}
                useTextBackground={card.useTextBackground}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
