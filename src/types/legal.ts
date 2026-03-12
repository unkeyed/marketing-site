import { ReactElement } from 'react';

import { type ISeoFields, type ISlug, type ITableOfContentsItem } from '@/types/common';

export interface ILegalPageData {
  title: string;
  slug: ISlug;
  isDraft: boolean;
  updatedAt: string;
  seo: ISeoFields;
}

export interface ILegalPage extends ILegalPageData {
  tableOfContents: ITableOfContentsItem[];
  content: ReactElement;
}
