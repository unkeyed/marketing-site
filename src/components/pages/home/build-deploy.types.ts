export interface IBuildDeployPanel {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  hasLogos?: boolean;
  logos?: { alt: string; src: string; width: number; height: number; className: string }[];
  textTopClass?: string;
}

export interface IBuildDeployProps {
  heading: string;
  description: string;
  panels: IBuildDeployPanel[];
}

export interface IBuildDeployTab {
  id: string;
  tabLabel: string;
}
