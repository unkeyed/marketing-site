import type { ILogo } from '@/types/common';

export interface IPortfolioLogo extends ILogo {
  wrapperClassName: string;
}

export interface ITechnologyLogo extends ILogo {
  className: string;
}

export const portfolioLogos: IPortfolioLogo[] = [
  {
    alt: 'Fireworks AI logo',
    src: '/images/logos/portfolio/fireworks.svg',
    width: 160,
    height: 28,
    wrapperClassName: 'h-7 w-40',
  },
  {
    alt: 'Cal.com logo',
    src: '/images/logos/portfolio/cal.svg',
    width: 84,
    height: 28,
    wrapperClassName: 'h-7 w-21',
  },
  {
    alt: 'Mintlify logo',
    src: '/images/logos/portfolio/mintlify.svg',
    width: 106,
    height: 28,
    wrapperClassName: 'h-7 w-[6.625rem]',
  },
  {
    alt: 'Symbolica logo',
    src: '/images/logos/portfolio/symbolica.svg',
    width: 125,
    height: 28,
    wrapperClassName: 'h-7 w-[7.8125rem]',
  },
  {
    alt: 'BlindPay logo',
    src: '/images/logos/portfolio/blindpay.svg',
    width: 105,
    height: 28,
    wrapperClassName: 'h-7 w-[6.5625rem]',
  },
  {
    alt: 'Magic Patterns logo',
    src: '/images/logos/portfolio/magic-patterns.svg',
    width: 159,
    height: 24,
    wrapperClassName: 'h-6 w-[9.9375rem]',
  },
];

export const homePortfolioLogos: IPortfolioLogo[] = [
  ...portfolioLogos,
  {
    alt: 'Plain logo',
    src: '/images/logos/portfolio/plain.svg',
    width: 74,
    height: 22,
    wrapperClassName: 'h-[1.375rem] w-[4.625rem]',
  },
];

export const buildDeployTechnologyLogos: ITechnologyLogo[] = [
  {
    alt: 'Python',
    src: '/images/logos/technology/python.svg',
    width: 112,
    height: 28,
    className: 'h-7 w-28',
  },
  {
    alt: 'TypeScript',
    src: '/images/logos/technology/typescript.svg',
    width: 110,
    height: 28,
    className: 'h-7 w-[6.875rem]',
  },
  {
    alt: 'Go',
    src: '/images/logos/technology/go.svg',
    width: 75,
    height: 28,
    className: 'h-7 w-[4.6875rem]',
  },
  {
    alt: 'Java',
    src: '/images/logos/technology/java.svg',
    width: 97,
    height: 40,
    className: 'h-10 w-[6.0625rem]',
  },
];
