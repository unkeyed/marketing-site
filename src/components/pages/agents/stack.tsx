import { ArrowRight } from 'lucide-react';

import type { IAgentSectionHeading, IAgentStackPart } from '@/types/agents';
import { isExternalLink } from '@/lib/utils';
import { Link } from '@/components/ui/link';
import CodeSnippet from '@/components/pages/agents/code-snippet';
import SectionHeading from '@/components/pages/agents/section-heading';

interface IStackProps extends IAgentSectionHeading {
  parts: IAgentStackPart[];
}

export default function Stack({ label, heading, subheading, parts }: IStackProps) {
  return (
    <section className="pt-20 md:pt-30 xl:pt-45">
      <div className="container">
        <SectionHeading label={label} heading={heading} subheading={subheading} />

        <ol className="mt-10 grid gap-px border border-gray-20 bg-gray-20 sm:grid-cols-2 md:mt-14 lg:mt-18">
          {parts.map((part, index) => {
            const isExternal = isExternalLink(part.link.href);

            return (
              <li
                key={part.id}
                className="flex min-w-0 flex-col bg-background px-5 pt-5.5 pb-5 sm:px-6 sm:pt-6.5 sm:pb-6 xl:px-8"
              >
                <p className="font-mono text-[0.9375rem] leading-tight text-gray-40">
                  {String(index + 1).padStart(2, '0')} {part.title}
                </p>
                <h3 className="mt-10 text-lg leading-snug font-medium text-white xl:mt-12">
                  {part.heading}
                </h3>
                <p className="mt-3 text-[15px] leading-snug text-gray-80 sm:text-base">
                  {part.body}
                </p>
                {part.code ? <CodeSnippet code={part.code} className="mt-6" /> : null}
                <Link
                  href={part.link.href}
                  variant="foreground"
                  size="none"
                  className="mt-auto h-auto self-start pt-8 text-[0.9375rem]"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                >
                  {part.link.label}
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
