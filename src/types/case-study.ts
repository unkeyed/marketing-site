import { type ReactElement } from 'react';

import { type IAuthorData, type ISeoFields, type ISlug, type ITableOfContentsItem } from '@/types/common';

export interface INewCaseStudyFrontmatter {
  date: string;
  title: string;
  image?: string;
  description?: string;
  author: string;
  companyOverview?: {
    logo: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
    };
    items: Array<{
      label: string;
      content: string;
    }>;
  };
}

export interface ICaseStudyCompanyOverviewData {
  logoSrc: string;
  logoAlt: string;
  logoWidth?: number;
  logoHeight?: number;
  items: Array<{
    label: string;
    content: string;
  }>;
}

export interface ICaseStudyData {
  slug: ISlug;
  pathname: string;
  title: string;
  authors: IAuthorData[];
  cover?: string;
  publishedAt: string;
  caption: string;
  content: string;
  readingTime: string;
  companyOverview?: ICaseStudyCompanyOverviewData;
  seo: ISeoFields;
}

export interface ICaseStudy extends Omit<ICaseStudyData, 'content'> {
  content: ReactElement;
  tableOfContents: ITableOfContentsItem[];
}
