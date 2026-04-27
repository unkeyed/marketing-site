import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface IProgramBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface IProgramSectionProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  benefits: IProgramBenefit[];
  children: ReactNode;
}

export default function ProgramSection({
  eyebrow,
  title,
  description,
  benefits,
  children,
}: IProgramSectionProps) {
  return (
    <section className="border-b border-gray-20">
      <div className="section-container py-12 md:pt-[5.75rem] md:pb-[5.5rem] lg:pb-24 xl:pt-29 xl:pb-32">
        <div className="grid gap-12 md:gap-10 xl:grid-cols-[1fr_1fr] 2xl:gap-32">
          <div className="flex flex-col">
            <span className="font-mono text-xs leading-none font-medium tracking-[0.08em] text-yellow uppercase">
              {eyebrow}
            </span>
            <h1 className="marked-title mt-6 font-display text-4xl leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-5xl lg:text-[3.25rem] xl:text-[4rem]">
              {title}
            </h1>
            <p className="mt-6 font-sans text-[1.125rem] leading-[1.375] font-normal tracking-[-0.015em] text-muted-foreground md:mt-7 md:max-w-xl lg:mt-8 xl:max-w-128">
              {description}
            </p>

            <ul className="mt-10 grid gap-8 sm:grid-cols-2 xl:gap-x-12 xl:gap-y-10">
              {benefits.map(({ icon: Icon, title: benefitTitle, description: benefitDescription }) => (
                <li key={benefitTitle} className="flex flex-col gap-y-2.5">
                  <div className="flex items-center gap-x-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-panel">
                      <Icon className="size-4 text-foreground" aria-hidden="true" />
                    </span>
                    <h2 className="font-sans text-base leading-[1.375] font-medium text-foreground">
                      {benefitTitle}
                    </h2>
                  </div>
                  <p className="max-w-80 font-sans text-base leading-[1.375] font-normal text-gray-80">
                    {benefitDescription}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="xl:pl-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
