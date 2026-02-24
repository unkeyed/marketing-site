'use client';

import { usePathname } from 'next/navigation';

import { IMenuItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';

interface IFooterNavProps {
  className?: string;
  items: IMenuItem[];
}

function Nav({ className, items }: IFooterNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-wrap gap-5 text-sm', className)}>
      {items.map(({ href, label }, index) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            className={cn('leading-none', isActive && 'text-foreground')}
            size="none"
            variant="foreground"
            key={index}
            href={href}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default Nav;
