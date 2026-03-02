import Image from 'next/image';

import { Link } from '@/components/ui/link';

interface ICtaProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
}

export default function Cta({
  heading,
  subheading,
  buttonLabel,
  buttonHref,
  backgroundImage,
}: ICtaProps) {
  return (
    <section className="relative h-[clamp(26.25rem,94vw,28.75rem)] bg-panel sm:h-[31.25rem] md:h-130 lg:h-[32.5rem] xl:h-[34.125rem]">
      <Image alt="" fill sizes="100vw" className="z-0 object-cover" src={backgroundImage} />
      <div className="container relative z-10 flex h-full flex-col pt-12 pb-10 sm:pt-14 sm:pb-11 md:pt-16 md:pb-12.75 lg:pt-16 lg:pb-14 xl:pb-12.75">
        <h2 className="max-w-144 font-display text-[1.75rem] leading-[1.125] text-white sm:text-[1.875rem] md:text-[2rem] lg:text-[2rem] xl:text-[2rem]">
          {heading}
        </h2>
        <p className="max-w-144 font-display text-[1.75rem] leading-[1.125] text-gray-60 sm:text-[1.875rem] md:text-[2rem] lg:text-[2rem] xl:text-[2rem]">
          {subheading}
        </p>
        <Link href={buttonHref} className="mt-auto w-fit lg:mt-13 xl:mt-auto">
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
