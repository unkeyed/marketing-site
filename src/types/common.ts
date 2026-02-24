import type { ReactElement, ReactNode } from 'react';
import { type Route } from 'next';
import { type LucideProps } from 'lucide-react';
import { type BundledLanguage } from 'shiki/langs';

import { type TSocialIcons } from '@/components/icons';

export interface IMenuItem {
  label: string;
  href: Route<string> | URL;
  children?: IMenuItem[];
}

export interface IMenuSocialItem extends IMenuItem {
  icon: TSocialIcons;
}

export interface ISlug {
  current: string;
}

export interface IBreadcrumbItem {
  label: string;
  href?: string;
}

export type TTableTheme = 'outline' | 'filled';

export interface ITableOfContentsItem {
  title: string;
  anchor: string;
  depth: number;
}

export interface ICodeBlock {
  code: string;
  language: BundledLanguage;
  fileName?: string;
  highlightedLines?: string;
  label?: string;
  meta?: string | null;
}

export interface IAuthor {
  photo?: string;
  name?: string;
}

export interface IAuthorData extends Omit<IAuthor, 'photo' | 'name'> {
  photo: string;
  name: string;
  description?: string;
  position?: string;
}

export interface IBlockquote {
  quote: string;
  authors?: IAuthor | IAuthor[];
  role?: string;
}

export interface IVideo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export interface IAdmonition {
  title?: string;
  children: ReactNode;
}

export interface IDetailsToggle {
  title: string;
  children: ReactNode;
}

export interface IYouTubeEmbed {
  youtubeId: string;
  cover?: string;
}

export interface ISeoFields {
  title: string;
  description: string;
  socialImage: string;
  noIndex: boolean;
}

export interface IFaqItem {
  question: string;
  answer: string | ReactNode;
}

export enum PricingPeriod {
  Monthly = 'Monthly',
  Annually = 'Annually',
}

export interface ILogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface IStackedListItem {
  icon?: string;
  title: string;
  description: string;
}

export interface ICookieSettingsItem {
  value: string;
  title: string;
  description: ReactNode | string;
  isChecked: boolean;
  isRequired: boolean;
}

export interface ICookieBanner {
  isCookieBannerVisible: boolean;
  checkboxValues: ICookieSettingsItem[];
  handleCheckboxChange: (index: number) => void;
  handleAcceptClick: () => void;
  handleDeclineClick: () => void;
  handleSaveClick: () => void;
  isCookieSettingsOpen: boolean;
  handleOpenCookieSettings: () => void;
  handleCloseCookieSettings: () => void;
}

export type ILucideIcon = {
  lucideIcon: ReactElement<LucideProps>;
};
