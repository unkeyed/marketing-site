import type { ReactElement } from 'react';

import type { ISeoFields, ITableOfContentsItem } from '@/types/common';

export interface IGlossaryKeyValue {
  key: string;
  value: string;
}

export interface IGlossaryReadingItem {
  url: string;
  title: string;
}

export interface IGlossaryUsageInApis {
  tags: string[];
  description: string;
}

export interface IGlossaryFaqItem {
  question: string;
  answer: string;
}

export interface IGlossaryTakeaways {
  tldr?: string;
  didYouKnow?: string;
  usageInAPIs?: IGlossaryUsageInApis;
  bestPractices?: string[];
  historicalContext?: IGlossaryKeyValue[];
  recommendedReading?: IGlossaryReadingItem[];
  definitionAndStructure?: IGlossaryKeyValue[];
}

export interface INewGlossaryFrontmatter {
  title: string;
  description?: string;
  h1?: string;
  term?: string;
  slug?: string;
  takeaways?: IGlossaryTakeaways;
  faq?: IGlossaryFaqItem[];
}

export interface IGlossaryTermData {
  slug: string;
  title: string;
  h1: string;
  term: string;
  description: string;
  tldr: string;
  takeaways: IGlossaryTakeaways;
  faq: IGlossaryFaqItem[];
  anchorId: string;
  letter: string;
  content: string;
  pathname: string;
  seo: ISeoFields;
}

export interface IGlossaryTerm extends Omit<IGlossaryTermData, 'content'> {
  content: ReactElement;
  tableOfContents: ITableOfContentsItem[];
}

export interface IGlossaryDirectoryTerm {
  anchorId: string;
  term: string;
  description: string;
  pathname: string;
}

export interface IGlossaryLetterGroup {
  letter: string;
  terms: IGlossaryDirectoryTerm[];
}
