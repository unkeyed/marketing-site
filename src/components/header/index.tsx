import Image from 'next/image';
import NextLink from 'next/link';
import config from '@/configs/website-config';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';

import HeaderActions from './header-actions';
import MobileMenu from './mobile-menu';
import Nav from './nav';

interface IHeaderProps {
  className?: string;
  menuItems: IMenuItem[];
  logoUrl?: string | null;
}

function Header({ className, menuItems, logoUrl }: IHeaderProps) {
  const logoSrc = logoUrl ?? config.logo.dark;
  const logoHref = config.logoLink ?? '/';
  const logoAlt =
    typeof config.logoAlt === 'string' && config.logoAlt.trim().length > 0
      ? config.logoAlt
      : config.projectName;

  return (
    <header className={cn('sticky top-0 z-50 flex items-center pt-2.5', className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 h-full backdrop-blur-md" />
      <div className="container flex items-center gap-1">
        <div className="relative z-60 flex h-11 flex-1 items-center justify-between bg-foreground pr-0 pl-6">
          <NextLink className="inline-flex shrink-0" href={logoHref}>
            <Image
              className="block h-7 w-auto shrink-0"
              src={logoSrc}
              alt={logoAlt}
              width={83}
              height={28}
            />
          </NextLink>
          <Nav className="hidden h-full lg:flex" items={menuItems} />
        </div>

        <HeaderActions />
        <MobileMenu items={menuItems} />
      </div>
    </header>
  );
}

export default Header;
