import type { ReactNode } from 'react';

export type TAgentConnection = 'MCP' | 'CLI';

export interface IAgentLink {
  label: string;
  href: string;
}

export type TAgentCallKind = 'shell' | 'tool';

export interface IAgentCall {
  kind: TAgentCallKind;
  command: string;
  result: string;
}

export interface IAgentSessionStep {
  id: string;
  title: string;
  prompt: string;
  calls: IAgentCall[];
  outcome: string;
}

export interface IAgentCodeSnippet {
  code: string;
  fileName?: string;
}

export interface IAgentSetupOption {
  title: string;
  description: string;
  snippets: IAgentCodeSnippet[];
}

export interface IAgentClient {
  id: string;
  name: string;
  maker?: string;
  connects: TAgentConnection[];
  options: IAgentSetupOption[];
  tryPrompt: string;
  notes: string[];
  guideHref: string;
}

export interface IAgentStackPart {
  id: string;
  title: string;
  heading: string;
  body: string;
  code?: string;
  link: IAgentLink;
}

export interface IAgentControlItem {
  title: string;
  text: string;
}

export interface IAgentSectionHeading {
  label: string;
  heading: string;
  subheading?: string;
}

export interface IAgentInstallStep {
  caption: string;
  code: string;
  note?: string;
}

export interface IAgentsHero {
  label: string;
  title: ReactNode;
  description: string;
  install: IAgentInstallStep[];
  primaryCta: IAgentLink;
  secondaryCta: IAgentLink;
}

export interface IAgentSetupFallback {
  text: string;
  link: IAgentLink;
}
