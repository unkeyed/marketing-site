import { type ReactElement } from 'react';
import { type Route } from 'next';

import {
  type IAuthorData,
  type ISeoFields,
  type ISlug,
  type ITableOfContentsItem,
} from '@/types/common';

export interface ICategoryData {
  title: string;
  slug: ISlug;
}

export interface ICategory extends ICategoryData {
  url: Route<string>;
}

export interface IPostMeta {
  title: string;
  caption: string;
  slug: ISlug;
  authors?: (string | { id: string })[];
  category: string | string[];
  cover?: string;
  isFeatured?: boolean;
  isDraft?: boolean;
  content: string;
  publishedAt: string;
  seo: ISeoFields;
}

/** Frontmatter shape for blog posts (e.g. src/content/blog/*.mdx). */
export interface INewPostFrontmatter {
  date: string;
  title: string;
  image?: string;
  description?: string;
  author: string;
  tags?: string[];
  isFeatured?: boolean;
  isDraft?: boolean;
}

export interface IPostData extends Omit<IPostMeta, 'authors' | 'category'> {
  pathname: string;
  authors: IAuthorData[];
  category: ICategory;
  categories: ICategory[];
  readingTime: string;
}

export interface IPost extends Omit<IPostData, 'content'> {
  content: ReactElement;
  tableOfContents: ITableOfContentsItem[];
}

/** Lightweight item for blog search (title, caption, pathname, optional searchable body). */
export interface IBlogSearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'blog' | 'glossary';
  searchableText?: string;
}
