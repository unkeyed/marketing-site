import type { ReactNode } from 'react';

import type { IAgentSectionHeading, IAgentSessionStep, TAgentCallKind } from '@/types/agents';
import SectionHeading from '@/components/pages/agents/section-heading';

const CALL_MARKERS: Record<TAgentCallKind, ReactNode> = {
  shell: <span className="text-gray-60">$</span>,
  tool: (
    <span className="border border-gray-30 px-1 text-[0.6875rem] leading-4 tracking-[0.03em] text-gray-60 uppercase">
      tool
    </span>
  ),
};

interface ISessionProps extends IAgentSectionHeading {
  steps: IAgentSessionStep[];
}

export default function Session({ label, heading, subheading, steps }: ISessionProps) {
  return (
    <section className="pt-20 md:pt-30 xl:pt-45">
      <div className="container">
        <SectionHeading label={label} heading={heading} subheading={subheading} />

        <ol className="mt-10 divide-y divide-gray-20 border border-gray-20 bg-gray-5 md:mt-14 lg:mt-18">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="grid gap-4 px-5 py-6 sm:px-6 lg:grid-cols-[1fr_3fr] lg:gap-8 lg:py-8 xl:px-8"
            >
              <h3 className="flex items-baseline gap-3">
                <span className="font-mono text-[0.9375rem] text-gray-40">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-medium text-white">{step.title}</span>
              </h3>

              <div className="flex min-w-0 flex-col gap-4">
                <p className="bg-panel px-4 py-3 font-mono text-sm leading-6 break-words text-white">
                  <span className="text-gray-60">&gt; </span>
                  {step.prompt}
                </p>
                <div className="overflow-x-auto font-mono text-sm leading-6">
                  {step.calls.map((call) => (
                    <div key={call.command} className="whitespace-pre">
                      <p className="flex items-center gap-2 text-gray-80">
                        {CALL_MARKERS[call.kind]} <span>{call.command}</span>
                      </p>
                      <p className="text-gray-60">→ {call.result}</p>
                    </div>
                  ))}
                </div>
                <p className="text-base leading-snug text-white">{step.outcome}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
