import Image from 'next/image';
import NextLink from 'next/link';
import config from '@/configs/website-config';
import { MENUS } from '@/constants/menus';

import Nav from './nav';

function Footer() {
  const logoSrc = config.logo.light;
  const logoHref = config.logoLink ?? '/';
  const logoAlt =
    typeof config.logoAlt === 'string' && config.logoAlt.trim().length > 0
      ? config.logoAlt
      : config.projectName;

  return (
    <footer className="relative w-full pt-8 pb-10 md:pt-10 lg:pt-11 lg:pb-18">
      <div className="container flex flex-col gap-y-10 sm:flex-row sm:items-start sm:gap-x-27.5 lg:gap-x-20 xl:justify-start xl:gap-x-40 2xl:gap-x-91">
        <div className="flex max-w-72 flex-col gap-y-10 lg:shrink-0">
          <NextLink className="inline-flex" href={logoHref}>
            <Image
              className="block h-auto w-20.75"
              src={logoSrc}
              alt={logoAlt}
              width={83}
              height={28}
              priority
            />
          </NextLink>
          <div className="flex flex-col gap-y-4">
            <p className="text-sm leading-tight font-medium -tracking-wide text-gray-80">
              {MENUS.footer.description}
            </p>
            <p className="text-sm leading-tight font-medium -tracking-wide text-gray-40">
              {MENUS.footer.copyright}
            </p>
          </div>
        </div>
        <Nav className="w-full flex-1" sections={MENUS.footer.main} />
      </div>
    </footer>
  );
}

export default Footer;
