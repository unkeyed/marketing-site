'use client';

import { useEffect, useState } from 'react';

import { homeHeaderLinks } from '@/constants/home';
import { Link } from '@/components/ui/link';
import { Icons } from '@/components/icons';

export default function HeaderActions() {
  const [onLightSection, setOnLightSection] = useState(false);
  const [discordLink, githubLink] = homeHeaderLinks.social;
  const [loginLink, signUpLink] = homeHeaderLinks.auth;

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
        <Link href={discordLink.href} size="small">
          {discordLink.label}
        </Link>
        <Link
          href={githubLink.href}
          size="small"
          className="gap-1"
          aria-label={`${githubLink.label} repository (${githubLink.metric} stars)`}
        >
          <Icons.github className="text-background" size={18} aria-hidden="true" />
          <span className="sr-only">{githubLink.label}</span>
          <span>{githubLink.metric}</span>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <Link
          href={loginLink.href}
          variant={onLightSection ? 'primaryBlack' : 'secondary'}
          size="small"
          className="transition-colors duration-300"
        >
          {loginLink.label}
        </Link>
        <Link href={signUpLink.href} size="small">
          {signUpLink.label}
        </Link>
      </div>
    </nav>
  );
}
