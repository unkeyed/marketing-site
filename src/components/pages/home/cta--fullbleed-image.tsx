import Image from 'next/image';
import NextLink from 'next/link';

const CONTAINER =
  'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface ICtaFullbleedProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
}

export default function CtaFullbleedImage({
  heading,
  subheading,
  buttonLabel,
  buttonHref,
  backgroundImage,
}: ICtaFullbleedProps) {
  return (
    <section className="relative mt-20 h-[460px] bg-panel md:mt-[140px] md:h-[520px] xl:mt-[200px] xl:h-[546px]">
      <Image alt="" fill sizes="100vw" className="z-0 object-cover" src={backgroundImage} />
      <div
        className={`${CONTAINER} relative z-10 flex h-full flex-col pt-12 pb-10 md:pt-[64px] md:pb-[51px]`}
      >
        <h2 className="max-w-[576px] font-display text-[28px] leading-[1.125] text-white md:text-[32px]">
          {heading}
        </h2>
        <p className="max-w-[576px] font-display text-[28px] leading-[1.125] text-[#9194a1] md:text-[32px]">
          {subheading}
        </p>
        <NextLink
          href={buttonHref}
          className="mt-auto inline-flex h-[44px] w-[134px] items-center justify-center bg-white px-5 py-3.5 text-base leading-none font-medium tracking-[-0.4px] text-[#040406]"
        >
          {buttonLabel}
        </NextLink>
      </div>
    </section>
  );
}
