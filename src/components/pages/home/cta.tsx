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
    <section className="relative mt-20 h-[460px] bg-panel md:mt-[140px] md:h-[520px] xl:mt-[200px] xl:h-[546px]">
      <Image alt="" fill sizes="100vw" className="z-0 object-cover" src={backgroundImage} />
      <Container className="relative z-10 flex h-full flex-col pt-12 pb-10 md:pt-[64px] md:pb-[51px]">
        <h2 className="max-w-[576px] font-display text-[28px] leading-[1.125] text-white md:text-[32px]">
          {heading}
        </h2>
        <p className="max-w-[576px] font-display text-[28px] leading-[1.125] text-gray-60 md:text-[32px]">
          {subheading}
        </p>
        <Link href={buttonHref} className="mt-auto w-fit">
          {buttonLabel}
        </Link>
      </Container>
    </section>
  );
}
