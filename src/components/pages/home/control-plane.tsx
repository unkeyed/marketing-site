import Image from 'next/image';

import { cn, splitLeadSentence } from '@/lib/utils';
import Container from '@/components/pages/home/container';

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

function Card({
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
    <li
      className={cn(
        'flex h-[429px] flex-col overflow-hidden border border-gray-20 bg-background px-6 pt-6.5 pb-6 xl:px-8',
        className,
      )}
    >
      <h3 className="font-mono text-[15px] leading-tight text-gray-40">{title}</h3>
      <div className="relative min-h-0 flex-1">
        <Image
          alt={graphicAlt}
          width={320}
          height={293}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 300px, 384px"
          className="h-auto w-full object-contain object-left"
          src={graphic}
        />
      </div>
      <p className="text-base leading-snug text-gray-80">
        <strong className="font-medium text-foreground">{lead}</strong>
        {rest ? <span> {rest}</span> : null}
      </p>
    </li>
  );
}

export default function ControlPlane({ heading, description, cards }: IControlPlaneProps) {
  return (
    <section className="pt-20 md:pt-30 xl:pt-[229px]">
      <Container className="relative flex flex-col">
        <div className="relative sm:pl-8">
          <div
            aria-hidden
            className="absolute -top-20 bottom-0 left-0 z-0 hidden h-[651px] w-px bg-gray-20 sm:block md:-top-30 xl:-top-[229px]"
          />
          <h2 className="max-w-[639px] font-display text-[28px] leading-[1.125] whitespace-pre-line text-foreground md:text-4xl lg:text-[44px] [&_mark]:-ml-1 [&_mark]:inline-flex [&_mark]:h-[27px] [&_mark]:items-center [&_mark]:bg-yellow [&_mark]:box-decoration-clone [&_mark]:pr-0 [&_mark]:pb-2 [&_mark]:pl-1 [&_mark]:text-black md:[&_mark]:h-[34px] lg:[&_mark]:h-[42px]">
            {heading}
          </h2>
          <p className="mt-6 max-w-144 text-lg leading-snug tracking-[-0.01em] text-gray-70 lg:mt-7 lg:text-xl">
            {description}
          </p>
        </div>

        <div className="relative z-10 mt-10 snap-x snap-mandatory scroll-pl-5 overflow-x-auto [scrollbar-width:none] sm:-mx-5 md:-mx-8 md:mt-16 md:scroll-pl-8 xl:mx-0 xl:mt-40 xl:snap-none xl:scroll-pl-0 xl:overflow-visible [&::-webkit-scrollbar]:hidden">
          <ul className="flex flex-col items-center gap-4 sm:w-max sm:flex-row sm:items-stretch sm:gap-0 sm:px-5 md:px-8 xl:w-auto xl:px-0">
            {cards.map((card, index) => (
              <Card
                key={card.id}
                title={card.title}
                body={card.body}
                graphic={card.graphic}
                graphicAlt={card.graphicAlt}
                className={cn(
                  'w-full max-w-96 sm:w-75 sm:max-w-none sm:shrink-0 sm:snap-start md:w-85 xl:w-auto xl:flex-1',
                  index > 0 && 'sm:-ml-px',
                )}
              />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
