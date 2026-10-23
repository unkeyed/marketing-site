export interface ICareerFrontmatter {
  title: string;
  description: string;
  department: string;
  visible: boolean;
  stats: Array<{ label: string; content: string }>;
}

export interface ICareerData extends ICareerFrontmatter {
  slug: string;
  pathname: string;
  applicationUrl: string;
  content: string;
}
