'use client';

import { useEffect, useState } from 'react';

import { Link } from '@/components/ui/link';
import { Icons } from '@/components/icons';

export default function HeaderActions() {
  const [onLightSection, setOnLightSection] = useState(false);

  useEffect(() => {
    const lightSections = document.querySelectorAll<HTMLElement>('[data-header-theme="light"]');
    if (lightSections.length === 0) return;

    const headerHeight = 56; // ~h-11 (44px) + pt-2.5 (10px)

    const observer = new IntersectionObserver(
      (entries) => {
        const anyIntersecting = entries.some((entry) => entry.isIntersecting);
        setOnLightSection(anyIntersecting);
      },
      {
        rootMargin: `-${headerHeight}px 0px -${window.innerHeight - headerHeight - 1}px 0px`,
        threshold: 0,
      },
    );

    lightSections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Actions" className="hidden items-center gap-16 lg:flex">
      <div className="flex items-center gap-1">
        <Link href="https://unkey.dev/discord" size="small">
          Discord
        </Link>
        <Link href="https://github.com/unkeyed/unkey" size="small" className="gap-1">
          <Icons.github className="text-background" size={18} />
          <span>5.1k</span>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href="/app/login"
          variant={onLightSection ? 'primaryBlack' : 'secondary'}
          size="small"
          className="transition-colors duration-300"
        >
          Login
        </Link>
        <Link href="/app/sign-up" size="small">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
