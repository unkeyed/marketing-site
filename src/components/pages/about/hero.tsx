import { ReactNode } from 'react';

export interface IHeroValue {
  title: string;
  description: string;
}

interface IHeroProps {
  title: ReactNode;
  description: ReactNode;
  values: IHeroValue[];
}

export default function Hero({ title, description, values }: IHeroProps) {
  return (
    <section className="border-b border-gray-20">
      <div className="section-container py-12 md:pt-[5.75rem] md:pb-[5.5rem] lg:pb-24 xl:pt-29 xl:pb-32">
        <div className="grid gap-8 md:gap-10 xl:grid-cols-[1fr_1fr] 2xl:gap-48">
          <div className="flex flex-col">
            <h1 className="font-display text-4xl leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-5xl lg:text-[3.25rem] xl:text-[4rem] [&_mark]:relative [&_mark]:-left-[0.15em] [&_mark]:-mr-[0.15em] [&_mark]:bg-transparent [&_mark]:bg-[linear-gradient(var(--color-yellow),var(--color-yellow))] [&_mark]:box-decoration-clone [&_mark]:[background-size:100%_0.96em] [&_mark]:[background-position:center_calc(50%_+_0.055em)] [&_mark]:bg-no-repeat [&_mark]:px-[0.1em] [&_mark]:text-black">
              {title}
            </h1>
            <p className="mt-6 font-sans text-[1.125rem] leading-[1.375] font-normal tracking-[-0.015em] text-muted-foreground md:mt-7 md:max-w-xl lg:mt-8 xl:max-w-128 2xl:mt-12">
              {description}
            </p>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-16 sm:gap-x-15 sm:gap-y-11 md:mt-6 lg:grid-cols-3 xl:grid-cols-2 2xl:mt-11">
            {values.map((value) => (
              <li key={value.title} className="flex flex-col gap-1.5">
                <h2 className="font-sans text-base leading-[1.375] font-medium text-foreground">
                  {value.title}
                </h2>
                <p className="max-w-78 font-sans text-base leading-[1.375] font-normal text-gray-80">
                  {value.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
