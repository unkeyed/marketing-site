import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface IGatewayCard {
  title: string;
  body: string;
  graphic: string;
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

function Card({
  title,
  body,
  graphic,
  imageClassName = 'object-cover',
  imageWrapperClassName,
  textWidthClass = 'max-w-88',
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
    <p className="relative z-10 px-5 pt-5 pb-3 text-base leading-snug text-gray-80 sm:px-6 sm:pt-6 md:p-6 xl:pt-8">
      <span className={cn('block', textWidthClass)}>{textContent}</span>
    </p>
  );

  const imgEl = (
    <Image
      alt=""
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
      {textBlock}
      {imageBlock}
    </div>
  );
}

export default function Gateway({ heading, cards }: IGatewayProps) {
  return (
    <section className="pt-20 md:pt-35 xl:pt-65">
      <div className="container flex flex-col items-center">
        <Label>Gateway</Label>
        <h2 className="mt-[1.25rem] max-w-[73.5625rem] text-center font-display text-[1.875rem] leading-[1.125] text-white sm:text-[2.5rem] md:mt-[1.5rem] md:text-[2.25rem] lg:mt-[1.75rem] lg:max-w-[60rem] lg:text-[2.5rem] xl:mt-8 xl:max-w-[73.5625rem] xl:text-[3.25rem]">
          {heading}
        </h2>

        <ul className="mt-6 grid w-full grid-cols-1 gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-2.5 md:mt-10 lg:mt-14 xl:mt-20 xl:grid-cols-3 xl:grid-rows-[446px_446px] xl:gap-2.5">
          {cards.map((card) => (
            <li key={card.title} className={card.gridClassName}>
              <Card
                title={card.title}
                body={card.body}
                graphic={card.graphic}
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
