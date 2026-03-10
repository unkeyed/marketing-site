'use client';

import { useEffect, useRef } from 'react';
import type { MouseEvent } from 'react';

import { cn } from '@/lib/utils';

interface IGlossaryLetterNavProps {
  availableLetters: Set<string>;
  activeLetter?: string;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function getCssSizeInPx(value: string, rootFontSize: number) {
  const trimmedValue = value.trim();
  if (trimmedValue.endsWith('rem')) {
    return Number.parseFloat(trimmedValue) * rootFontSize;
  }

  return Number.parseFloat(trimmedValue);
}

function handleLetterClick(event: MouseEvent<HTMLAnchorElement>, letter: string) {
  event.preventDefault();

  const target = document.getElementById(`letter-${letter}`);
  if (!target) {
    return;
  }

  const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rootStyles = getComputedStyle(document.documentElement);
  const rootFontSize = Number.parseFloat(rootStyles.fontSize);
  const stickyHeaderOffset = getCssSizeInPx(
    rootStyles.getPropertyValue('--sticky-header-height'),
    rootFontSize,
  );
  const stickyControls = document.getElementById('glossary-sticky-controls');
  const stickyControlsHeight = stickyControls?.getBoundingClientRect().height ?? 0;
  const safeGap = 12;
  const topOffset = stickyHeaderOffset + stickyControlsHeight + safeGap;
  const targetTop = window.scrollY + target.getBoundingClientRect().top - topOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: shouldReduceMotion ? 'auto' : 'smooth',
  });
  window.history.replaceState(null, '', `#letter-${letter}`);
}

function GlossaryLetterNav({ availableLetters, activeLetter }: IGlossaryLetterNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const letterRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    if (!activeLetter) {
      return;
    }

    const navElement = navRef.current;
    const activeLetterElement = letterRefs.current[activeLetter];
    if (!navElement || !activeLetterElement) {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (!isMobile) {
      return;
    }

    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navRect = navElement.getBoundingClientRect();
    const activeRect = activeLetterElement.getBoundingClientRect();

    const nextScrollLeft =
      navElement.scrollLeft +
      (activeRect.left - navRect.left) -
      (navElement.clientWidth - activeRect.width) / 2;

    navElement.scrollTo({
      left: Math.max(nextScrollLeft, 0),
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }, [activeLetter]);

  return (
    <nav
      ref={navRef}
      aria-label="Glossary letters"
      className="scrollbar-none -mx-5 w-auto overflow-x-auto px-5 py-1 md:-mx-8 md:px-8 lg:mx-0 lg:min-w-0 lg:flex-1 lg:overflow-visible lg:px-0"
    >
      <ul className="flex min-w-max items-center lg:w-full lg:min-w-0 lg:justify-between xl:justify-start">
        {alphabet.map((letter) => {
          const isAvailable = availableLetters.has(letter);
          const isActive = activeLetter === letter;
          return (
            <li
              key={letter}
              className="flex h-9 w-9 items-center justify-center lg:h-9 lg:min-w-0 2xl:shrink-0"
            >
              {isAvailable ? (
                <a
                  ref={(element) => {
                    letterRefs.current[letter] = element;
                  }}
                  href={`#letter-${letter}`}
                  onClick={(event) => handleLetterClick(event, letter)}
                  className={cn(
                    'flex h-full w-full items-center justify-center text-base leading-normal font-medium tracking-tight transition-colors',
                    isActive ? 'bg-gray-12 text-foreground' : 'text-foreground hover:bg-gray-12/60',
                  )}
                >
                  {letter}
                </a>
              ) : (
                <span className="text-base leading-normal font-medium tracking-tight text-gray-40">
                  {letter}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default GlossaryLetterNav;
