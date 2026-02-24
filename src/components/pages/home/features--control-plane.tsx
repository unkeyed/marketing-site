import Image from 'next/image';

import { cn, splitLeadSentence } from '@/lib/utils';

const CONTAINER =
  'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IControlPlaneCard {
  id: string;
  title: string;
  body: string;
  graphic: string;
  graphicAlt: string;
}

interface IControlPlaneProps {
  heading: React.ReactNode;
  description: string;
  cards: IControlPlaneCard[];
}

function FeatureCard({
  title,
  body,
  graphic,
  graphicAlt,
  className,
}: {
  title: string;
  body: string;
  graphic: string;
  graphicAlt: string;
  className?: string;
}) {
  const { lead, rest } = splitLeadSentence(body);

  return (
    <div
      className={cn(
        'flex h-[429px] flex-col overflow-hidden border border-uw-border bg-ink px-6 pb-6 pt-[26px] xl:px-8 xl:pb-8',
        className,
      )}
    >
      <span className="font-mono text-[15px] leading-tight text-muted-5">{title}</span>
      <div className="relative min-h-0 flex-1">
        <Image
          alt={graphicAlt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 300px, 384px"
          className="object-contain object-left"
          src={graphic}
        />
      </div>
      <p className="text-base leading-snug text-muted-3">
        <span className="font-medium text-white">{lead}</span>
        {rest ? <span> {rest}</span> : null}
      </p>
    </div>
  );
}

export default function FeaturesControlPlane({ heading, description, cards }: IControlPlaneProps) {
  return (
    <section className="pt-20 md:pt-[120px] xl:pt-[213px]">
      <div className={cn(CONTAINER, 'relative flex flex-col')}>
        <div className="relative sm:pl-8">
          <div
            aria-hidden
            className="absolute -top-20 bottom-0 left-0 hidden w-px bg-uw-border sm:block md:-top-[120px] xl:-top-[213px]"
          />
          <h2 className="max-w-[639px] whitespace-pre-line font-display text-[28px] leading-[1.125] text-white md:text-[36px] lg:text-[44px]">
            {heading}
          </h2>
          <p className="mt-6 max-w-[576px] text-lg leading-snug tracking-[-0.2px] text-muted-2 lg:mt-[44px] lg:text-xl">
            {description}
          </p>
          <div className="mt-10 md:mt-16 xl:mt-[142px]" />
        </div>

        <div className="sm:-mx-5 md:-mx-8 xl:mx-0">
          <div className="snap-x snap-mandatory overflow-x-auto scroll-pl-5 md:scroll-pl-8 xl:snap-none xl:overflow-visible xl:scroll-pl-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col items-center gap-4 sm:w-max sm:flex-row sm:items-stretch sm:gap-0 sm:px-5 md:px-8 xl:w-auto xl:px-0">
              {cards.map((card, index) => (
                <FeatureCard
                  key={card.id}
                  title={card.title}
                  body={card.body}
                  graphic={card.graphic}
                  graphicAlt={card.graphicAlt}
                  className={cn(
                    'w-full max-w-[384px] sm:w-[300px] sm:max-w-none sm:shrink-0 sm:snap-start md:w-[340px] xl:w-auto xl:flex-1',
                    index > 0 && 'sm:-ml-px',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
