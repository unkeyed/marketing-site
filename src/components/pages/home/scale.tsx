import Image from 'next/image';

import Container from '@/components/pages/home/container';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';

interface IScaleFeature {
  title: string;
  text: string;
  icon: string;
}

interface IScaleProps {
  heading: React.ReactNode;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  features: IScaleFeature[];
}

export default function Scale({
  heading,
  description,
  buttonLabel,
  buttonHref,
  features,
}: IScaleProps) {
  return (
    <section className="relative py-16 md:py-24 xl:pt-48 xl:pb-51">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#b6cdfb_0%,#ecf2fe_80.629%)]" />
      <Container className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="flex max-w-[704px] flex-col gap-8">
            <Label variant="light">Scale</Label>
            <h2 className="font-display text-[30px] leading-[1.2] text-balance text-background sm:text-[36px] lg:text-[44px] lg:leading-[1.25] [&_mark]:-ml-1 [&_mark]:inline-flex [&_mark]:h-[27px] [&_mark]:items-center [&_mark]:bg-yellow [&_mark]:box-decoration-clone [&_mark]:pr-1 [&_mark]:pb-2 [&_mark]:pl-1 [&_mark]:text-black md:[&_mark]:h-[34px] lg:[&_mark]:h-[42px]">
              {heading}
            </h2>
          </div>
          <div className="flex max-w-[416px] flex-col gap-4.5 lg:pt-[75px]">
            <p className="text-lg leading-snug tracking-[-0.01em] text-gray-20 md:text-xl">
              {description}
            </p>
            <Link href={buttonHref} variant="primaryBlack" className="w-fit">
              {buttonLabel}
            </Link>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:mt-40 xl:grid-cols-[repeat(4,minmax(0,321px))] xl:justify-between">
          {features.map((item) => (
            <li className="flex max-w-[321px] flex-col gap-8 xl:gap-[44px]" key={item.title}>
              <Image
                alt={item.title}
                width={148}
                height={148}
                className="h-[120px] w-[120px] md:h-[148px] md:w-[148px]"
                src={item.icon}
              />
              <div className="flex flex-col gap-5">
                <h3 className="font-display text-2xl leading-[1.125] text-background md:text-[28px]">
                  {item.title}
                </h3>
                <p className="text-base leading-snug tracking-[-0.01em] text-gray-30">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
