import Image from 'next/image';
import NextLink from 'next/link';

import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IObserveColumn {
  lead: string;
  rest: string;
}

interface IObserveProps {
  heading: string;
  subheading: string;
  dashboardImage: string;
  buttonLabel: string;
  buttonHref: string;
  columns: IObserveColumn[];
}

export default function SectionObserve({
  heading,
  subheading,
  dashboardImage,
  buttonLabel,
  buttonHref,
  columns,
}: IObserveProps) {
  return (
    <section className="mt-20 md:mt-[140px] xl:mt-[200px]">
      <div className={CONTAINER}>
        <div className="relative h-[420px] max-[351px]:h-[500px] md:h-[520px] xl:h-[632px]">
          <div className="absolute top-0 left-0 z-[1] h-[220px] w-full bg-background max-[351px]:h-[300px] md:h-[200px] xl:h-[187px] xl:max-w-[960px]" />
          <div className="relative z-10 flex h-[220px] w-full flex-col gap-6 pb-5 max-[351px]:h-[300px] max-[351px]:pb-12 md:h-[200px] xl:h-[187px] xl:max-w-[960px] xl:gap-8">
            <Label>Observe</Label>
            <h2 className="max-w-[960px] font-display text-[30px] leading-[1.125] text-white sm:text-[36px] xl:text-[44px]">
              {heading}
              <span className="block text-[#9194a1]">{subheading}</span>
            </h2>
          </div>
          <Image
            alt="Observability dashboard"
            width={3072}
            height={1202}
            sizes="100vw"
            className="absolute top-[40px] left-0 z-0 h-[380px] w-full object-cover object-[72%_50%] max-[351px]:top-[124px] max-[351px]:h-[360px] md:top-[60px] md:h-[460px] lg:top-[52px] lg:h-[470px] lg:object-center xl:top-[1px] xl:h-[632px]"
            src={dashboardImage}
          />
        </div>

        <div className="mt-10 grid gap-8 md:mt-12 xl:mt-14 xl:grid-cols-[35fr_65fr] xl:gap-4">
          <ul className="order-1 grid max-w-[992px] grid-cols-1 gap-10 text-base leading-snug sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 md:text-lg xl:order-2 xl:grid-cols-[384px_384px] xl:gap-x-56 xl:gap-y-20">
            {columns.map((column) => (
              <li className="max-w-[384px]" key={column.lead}>
                <p>
                  <span className="font-medium text-white">{column.lead} </span>
                  <span className="text-[#9194a1]">{column.rest}</span>
                </p>
              </li>
            ))}
          </ul>
          <Link href={buttonHref} className="w-fit">
            {buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
