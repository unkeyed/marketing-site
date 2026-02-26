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
        'relative flex h-[clamp(380px,92vw,460px)] w-full flex-col overflow-hidden border border-gray-20 bg-background sm:h-115 md:h-125 xl:h-132',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 bottom-14 overflow-hidden sm:bottom-10 md:bottom-6 lg:bottom-0">
        <Image
          alt=""
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain object-top"
          src={graphic}
        />
      </div>
      <p className="relative z-10 mt-auto px-5 pb-5 text-[15px] leading-snug sm:px-6 sm:pb-6 sm:text-base md:px-8 md:pb-8">
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

        <div className="mt-8 flex flex-col gap-5 sm:mt-9 md:mt-10 md:gap-6 lg:flex-row lg:items-end lg:justify-between xl:mt-8 xl:gap-5">
          <h2 className="max-w-240 font-display text-[30px] leading-[1.125] text-white sm:text-[36px] md:text-[40px] lg:text-[42px] xl:text-[44px]">
            {heading}
            <span className="block text-gray-60">{subheading}</span>
          </h2>
          <Link href={buttonHref}>{buttonLabel}</Link>
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-0 xl:mt-16 xl:grid-cols-3 xl:gap-0">
          {cards.map((item, index) => (
            <li key={item.graphic}>
              <PortalCard
                text={item.text}
                graphic={item.graphic}
                textWidthClass={item.textWidthClass}
                className={index > 0 ? 'lg:-ml-px xl:-ml-px' : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
