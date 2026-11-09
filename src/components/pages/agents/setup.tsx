'use client';

import { useState } from 'react';

import type { IAgentClient, IAgentSectionHeading, IAgentSetupFallback } from '@/types/agents';
import { isExternalLink } from '@/lib/utils';
import { Link } from '@/components/ui/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeSnippet from '@/components/pages/agents/code-snippet';
import SectionHeading from '@/components/pages/agents/section-heading';

interface ISetupProps extends IAgentSectionHeading {
  clients: IAgentClient[];
  fallback: IAgentSetupFallback;
}

function ClientPanel({ client }: { client: IAgentClient }) {
  const guideIsExternal = isExternalLink(client.guideHref);

  return (
    <div className="grid border border-gray-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="min-w-0 p-5 sm:p-6 xl:p-8">
        <h3 className="font-display text-2xl leading-tight text-white md:text-[1.75rem]">
          {client.name}
        </h3>
        {client.maker ? (
          <p className="mt-1 font-mono text-[0.8125rem] text-gray-40">{client.maker}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-gray-60">Connects with</span>
          {client.connects.map((connection) => (
            <span
              key={connection}
              className="border border-gray-30 px-2 py-0.5 font-mono text-xs tracking-[0.03em] text-gray-80"
            >
              {connection}
            </span>
          ))}
        </div>

        <ul className="mt-8 flex flex-col gap-8">
          {client.options.map((option) => (
            <li key={option.title} className="flex min-w-0 flex-col">
              <h4 className="font-medium text-white">{option.title}</h4>
              <p className="mt-1 text-[0.9375rem] leading-snug text-gray-70">
                {option.description}
              </p>
              <div className="mt-3 flex flex-col gap-3">
                {option.snippets.map((snippet) => (
                  <CodeSnippet key={snippet.code} code={snippet.code} fileName={snippet.fileName} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-w-0 flex-col gap-8 border-t border-gray-20 p-5 sm:p-6 lg:border-t-0 lg:border-l xl:p-8">
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-[0.9375rem] text-gray-40">Try this</h4>
          <CodeSnippet code={client.tryPrompt} wrap />
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-[0.9375rem] text-gray-40">Good to know</h4>
          <ul className="flex flex-col gap-3">
            {client.notes.map((note) => (
              <li
                key={note}
                className="flex gap-3 text-[0.9375rem] leading-snug break-words text-gray-80"
              >
                <span aria-hidden className="mt-2 size-1 shrink-0 bg-gray-40" />
                <span className="min-w-0">{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={client.guideHref}
          variant="secondary"
          className="w-fit lg:mt-auto"
          target={guideIsExternal ? '_blank' : undefined}
          rel={guideIsExternal ? 'noopener noreferrer' : undefined}
        >
          Full guide
        </Link>
      </div>
    </div>
  );
}

export default function Setup({ label, heading, subheading, clients, fallback }: ISetupProps) {
  const [value, setValue] = useState(clients[0]?.id ?? '');

  return (
    <section className="pt-20 md:pt-30 xl:pt-45">
      <div className="container">
        <SectionHeading label={label} heading={heading} subheading={subheading} />

        <Tabs value={value} onValueChange={setValue} className="mt-10 md:mt-14 lg:mt-18">
          <TabsList className="h-auto w-fit max-w-full flex-wrap justify-start rounded-none border border-gray-30 bg-background p-1 text-gray-70">
            {clients.map((client) => (
              <TabsTrigger
                key={client.id}
                value={client.id}
                className="h-9.75 rounded-none px-2.5 font-mono text-[0.875rem] tracking-[0.03em] uppercase data-[state=active]:bg-white data-[state=active]:text-gray-8 sm:px-4 lg:text-[0.9375rem]"
              >
                {client.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {clients.map((client) => (
            <TabsContent
              key={client.id}
              value={client.id}
              forceMount
              hidden={value !== client.id}
              className="mt-6 data-[state=inactive]:hidden"
            >
              <ClientPanel client={client} />
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-6 text-[0.9375rem] leading-snug text-gray-60">
          {fallback.text}{' '}
          <Link
            href={fallback.link.href}
            variant="foreground"
            size="none"
            className="inline h-auto underline underline-offset-4"
            target={isExternalLink(fallback.link.href) ? '_blank' : undefined}
            rel={isExternalLink(fallback.link.href) ? 'noopener noreferrer' : undefined}
          >
            {fallback.link.label}
          </Link>
        </p>
      </div>
    </section>
  );
}
