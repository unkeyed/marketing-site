import Image from 'next/image';

import Container from '@/components/pages/home/container';
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
    <section className="relative mt-20 h-[clamp(420px,94vw,460px)] bg-panel sm:h-[500px] md:mt-35 md:h-130 lg:h-[520px] xl:mt-50 xl:h-[546px]">
      <Image alt="" fill sizes="100vw" className="z-0 object-cover" src={backgroundImage} />
      <Container className="relative z-10 flex h-full flex-col pt-12 pb-10 sm:pt-14 sm:pb-11 md:pt-16 md:pb-[51px] lg:pt-[70px] lg:pb-14 xl:pb-[51px]">
        <h2 className="max-w-144 font-display text-[28px] leading-[1.125] text-white sm:text-[30px] md:text-[32px] lg:text-[36px] xl:text-[32px]">
          {heading}
        </h2>
        <p className="max-w-144 font-display text-[28px] leading-[1.125] text-gray-60 sm:text-[30px] md:text-[32px] lg:text-[36px] xl:text-[32px]">
          {subheading}
        </p>
        <Link href={buttonHref} className="mt-auto w-fit lg:mt-[52px] xl:mt-auto">
          {buttonLabel}
        </Link>
      </Container>
    </section>
  );
}
