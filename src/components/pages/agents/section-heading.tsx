import type { IAgentSectionHeading } from '@/types/agents';
import { Label } from '@/components/ui/label';

export default function SectionHeading({ label, heading, subheading }: IAgentSectionHeading) {
  return (
    <div className="flex flex-col">
      <Label>{label}</Label>
      <h2 className="mt-5 max-w-240 font-display text-[1.875rem] leading-[1.125] text-white sm:text-[2.25rem] md:mt-6 lg:mt-7 xl:mt-8 xl:text-[2.75rem]">
        {heading}
        {subheading ? (
          <>
            {' '}
            <span className="text-gray-60 min-[860px]:block">{subheading}</span>
          </>
        ) : null}
      </h2>
    </div>
  );
}
