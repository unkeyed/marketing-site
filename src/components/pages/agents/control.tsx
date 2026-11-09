import type { IAgentControlItem, IAgentSectionHeading } from '@/types/agents';
import SectionHeading from '@/components/pages/agents/section-heading';

interface IControlProps extends IAgentSectionHeading {
  items: IAgentControlItem[];
}

export default function Control({ label, heading, subheading, items }: IControlProps) {
  return (
    <section className="pb-20 md:pb-35 xl:pb-50">
      <div className="container">
        <SectionHeading label={label} heading={heading} subheading={subheading} />

        <ul className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-x-15 sm:gap-y-11 md:mt-14 lg:mt-18 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="flex flex-col gap-1.5">
              <h3 className="font-sans text-base leading-[1.375] font-medium text-foreground">
                {item.title}
              </h3>
              <p className="max-w-96 font-sans text-base leading-[1.375] font-normal text-gray-80">
                {item.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
