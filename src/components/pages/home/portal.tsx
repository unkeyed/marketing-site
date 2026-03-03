import Image from 'next/image';

import { cn, splitLeadSentence } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';

interface IPortalCard {
  text: string;
  graphic: string;
  textWidthClass?: string;
}

interface IPortalProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
  cards: IPortalCard[];
}

function PortalCard({
  text,
  graphic,
  textWidthClass = 'max-w-93.5',
  className,
}: IPortalCard & { className?: string }) {
  const { lead, rest } = splitLeadSentence(text);

  return (
    <div
      className={cn(
        'relative flex h-[clamp(23.75rem,92vw,28.75rem)] w-full flex-col overflow-hidden border border-gray-20 bg-background sm:h-100 md:h-[23.75rem] lg:h-[26.25rem] xl:h-132',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 bottom-14 overflow-hidden sm:bottom-10 md:bottom-12 lg:bottom-0">
        <Image
          alt=""
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain object-top"
          src={graphic}
        />
      </div>
      <p className="relative z-10 mt-auto px-5 pb-5 text-[0.9375rem] leading-snug sm:px-6 sm:pb-6 sm:text-base md:px-8 md:pb-8">
        <span className={cn('block', textWidthClass)}>
          <span className="font-medium text-white">{lead}</span>
          {rest ? <span className="text-gray-80"> {rest}</span> : null}
        </span>
      </p>
    </div>
  );
}

export default function Portal({
  heading,
  subheading,
  buttonLabel,
  buttonHref,
  cards,
}: IPortalProps) {
  return (
    <section className="pt-20 pb-20 md:pt-35 md:pb-35 xl:pt-57.25 xl:pb-50">
      <div className="container flex flex-col">
        <Label>AIO Developer Portal</Label>

        <div className="mt-[1.25rem] flex flex-col gap-5 md:mt-[1.5rem] md:gap-6 lg:mt-[1.75rem] lg:flex-row lg:items-end lg:justify-between xl:mt-8 xl:gap-5">
          <h2 className="max-w-240 font-display text-[1.875rem] leading-[1.125] text-white sm:text-[2.25rem] md:text-[2.25rem] lg:text-[2.25rem] xl:text-[2.75rem]">
            {heading}
            <span className="block text-gray-60">{subheading}</span>
          </h2>
          <Link href={buttonHref} className="w-fit">
            {buttonLabel}
          </Link>
        </div>

        <ul className="mt-[3rem] grid grid-cols-1 gap-0 sm:grid-cols-2 md:mt-8 lg:mt-[4.5rem] lg:grid-cols-3 xl:grid-cols-3">
          {cards.map((item, index) => (
            <li key={item.graphic}>
              <PortalCard
                text={item.text}
                graphic={item.graphic}
                textWidthClass={item.textWidthClass}
                className={
                  index === 1
                    ? 'border-t-0 sm:border-t sm:border-l-0'
                    : index === 2
                      ? 'border-t-0 lg:border-t lg:border-l-0'
                      : undefined
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
