import Image from 'next/image';
import NextLink from 'next/link';
import config from '@/configs/website-config';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';
import { Icons } from '@/components/icons';

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
    <header className={cn('relative z-10 flex items-center pt-2.5', className)}>
      <div className="mx-auto flex w-full max-w-content items-center gap-1">
        <div className="flex h-11 flex-1 items-center justify-between bg-foreground px-6">
          <NextLink className="inline-flex shrink-0" href={logoHref}>
            <Image
              className="block h-7 w-auto shrink-0"
              src={logoSrc}
              alt={logoAlt}
              width={82}
              height={28}
              unoptimized
            />
          </NextLink>
          <Nav className="hidden lg:flex" items={menuItems} />
        </div>

        <nav aria-label="Actions" className="hidden items-center gap-16 lg:flex">
          <div className="flex items-center gap-1">
            <Link href="https://unkey.dev/discord">Discord</Link>
            <Link href="https://github.com/unkeyed/unkey" className="gap-1">
              <Icons.github className="text-background" size={18} />
              <span>5.1k</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <Link href="/app/login" variant="secondary">
              Login
            </Link>
            <Link href="/app/sign-up">Sign Up</Link>
          </div>
        </nav>

        <MobileMenu items={menuItems} />
      </div>
    </header>
  );
}

export default Header;
