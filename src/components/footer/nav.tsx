import NextLink from 'next/link';

import { IFooterMenuSection } from '@/types/common';
import { cn } from '@/lib/utils';

interface IFooterNavProps {
  className?: string;
  sections: IFooterMenuSection[];
  ariaLabel?: string;
}

function Nav({ className, sections, ariaLabel = 'Footer navigation' }: IFooterNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'grid w-full grid-cols-2 gap-x-8 gap-y-10 md:gap-y-12 lg:grid-cols-[repeat(4,minmax(10rem,10rem))] lg:gap-12 2xl:gap-16',
        className,
      )}
    >
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-y-5">
          <h3 className="text-[0.9375rem] leading-snug font-medium tracking-tight text-white">
            {section.title}
          </h3>
          <ul className="flex flex-col gap-y-3 text-[0.9375rem] leading-snug font-medium tracking-tight text-gray-60">
            {section.items.map((item) => {
              const isExternal = /^https?:\/\//.test(item.href);

              return (
                <li key={item.label}>
                  <NextLink
                    className="transition-colors duration-200 hover:text-white"
                    href={item.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {item.label}
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default Nav;
