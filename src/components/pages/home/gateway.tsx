'use client';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import RiveCanvas, { type IRiveConfig } from '@/components/ui/rive-canvas';
import AsciiCanvas, { type IAsciiConfig } from '@/components/pages/home/ascii-canvas';

interface IGatewayCard {
  title: string;
  body: string;
  rive?: IRiveConfig;
  webgl?: IAsciiConfig;
  textWidthClass?: string;
  textStyle?: 'plain' | 'marked';
  useTextBackground?: boolean;
  gridClassName: string;
}

interface IGatewayProps {
  heading: string;
  riveDefaults?: Pick<IRiveConfig, 'autoBind' | 'alignment'>;
  cards: IGatewayCard[];
}

function Card({
  title,
  body,
  rive,
  webgl,
  textWidthClass = 'max-w-88',
  textStyle: textStyleProp,
  useTextBackground = false,
  className,
}: Omit<IGatewayCard, 'gridClassName'> & { className?: string }) {
  const textStyle = textStyleProp ?? (useTextBackground ? 'marked' : 'plain');

  const textContent =
    textStyle === 'marked' ? (
      <mark className="inline bg-background box-decoration-clone pt-1 pr-8.75 pb-4 pl-0 text-inherit md:pb-5.5">
        <span className="font-medium text-white">{title}.</span> <span>{body}</span>
      </mark>
    ) : (
      <>
        <span className="font-medium text-white">{title}.</span> <span>{body}</span>
      </>
    );

  const textBlock = (
    <p className="relative z-10 px-5 pt-5 pb-3 text-base leading-snug text-gray-80 sm:px-6 sm:pt-6 md:p-8 xl:p-8">
      <span className={cn('block', textWidthClass)}>{textContent}</span>
    </p>
  );

  const graphicEl = rive ? (
    <RiveCanvas
      className="absolute inset-0"
      src={rive.src}
      artboard={rive.artboard}
      stateMachines={rive.stateMachines}
      alignment={rive.alignment}
      autoBind={rive.autoBind}
      fonts={rive.fonts}
      fit={rive.fit}
      fontPrefetchOffset={400}
      lazyOffset={200}
      lazy
    />
  ) : webgl ? (
    <AsciiCanvas
      className="absolute inset-5 sm:inset-6 md:inset-8"
      config={webgl}
      lazy
      lazyOffset={200}
    />
  ) : null;

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden border border-gray-20 bg-background',
        className,
      )}
    >
      {textBlock}
      {graphicEl}
    </div>
  );
}

export default function Gateway({ heading, riveDefaults, cards }: IGatewayProps) {
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
                rive={card.rive ? { ...riveDefaults, ...card.rive } : undefined}
                webgl={card.webgl}
                textWidthClass={card.textWidthClass}
                textStyle={card.textStyle}
                useTextBackground={card.useTextBackground}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
