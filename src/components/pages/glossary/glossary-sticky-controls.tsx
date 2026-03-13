'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { IBlogSearchItem } from '@/types/blog';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/ui/search-bar';
import GlossaryLetterNav from '@/components/pages/glossary/glossary-letter-nav';

interface IGlossaryStickyControlsProps {
  searchItems: IBlogSearchItem[];
  suggestions: IBlogSearchItem[];
  availableLetters: string[];
  initialActiveLetter?: string;
}

function GlossaryStickyControls({
  searchItems,
  suggestions,
  availableLetters,
  initialActiveLetter,
}: IGlossaryStickyControlsProps) {
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [activeLetter, setActiveLetter] = useState(initialActiveLetter);
  const lettersSet = useMemo(() => new Set(availableLetters), [availableLetters]);

  useEffect(() => {
    setActiveLetter(initialActiveLetter);
  }, [initialActiveLetter]);

  useEffect(() => {
    function getStickyHeaderOffsetInPx() {
      const rootStyles = getComputedStyle(document.documentElement);
      const rawStickyHeight = rootStyles.getPropertyValue('--sticky-header-height').trim();
      const rootFontSize = Number.parseFloat(rootStyles.fontSize);

      if (rawStickyHeight.endsWith('rem')) {
        return Number.parseFloat(rawStickyHeight) * rootFontSize;
      }

      return Number.parseFloat(rawStickyHeight);
    }

    function updateStickyState() {
      if (!stickyRef.current) {
        return;
      }

      const stickyTop = getStickyHeaderOffsetInPx();
      const top = stickyRef.current.getBoundingClientRect().top;
      setIsStuck((prevIsStuck) => {
        const stickThreshold = stickyTop + 0.5;
        const releaseThreshold = stickyTop + 6;
        return prevIsStuck ? top <= releaseThreshold : top <= stickThreshold;
      });
    }

    updateStickyState();
    window.addEventListener('scroll', updateStickyState, { passive: true });
    window.addEventListener('resize', updateStickyState);

    return () => {
      window.removeEventListener('scroll', updateStickyState);
      window.removeEventListener('resize', updateStickyState);
    };
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    function getStickyHeaderOffsetInPx() {
      const rootStyles = getComputedStyle(document.documentElement);
      const rawStickyHeight = rootStyles.getPropertyValue('--sticky-header-height').trim();
      const rootFontSize = Number.parseFloat(rootStyles.fontSize);

      if (rawStickyHeight.endsWith('rem')) {
        return Number.parseFloat(rawStickyHeight) * rootFontSize;
      }

      return Number.parseFloat(rawStickyHeight);
    }

    function updateActiveLetterByPosition() {
      const sections = availableLetters
        .map((letter) => ({
          letter,
          element: document.getElementById(`letter-${letter}`),
        }))
        .filter((entry): entry is { letter: string; element: HTMLElement } =>
          Boolean(entry.element),
        );

      if (!sections.length) {
        return;
      }

      const stickyHeaderOffset = getStickyHeaderOffsetInPx();
      const stickyControlsHeight = stickyRef.current?.getBoundingClientRect().height ?? 0;
      const safeGap = 12;
      const offsetLineY = window.scrollY + stickyHeaderOffset + stickyControlsHeight + safeGap;

      let nextActiveLetter = sections[0].letter;

      for (const section of sections) {
        const sectionTop = window.scrollY + section.element.getBoundingClientRect().top;
        if (sectionTop <= offsetLineY + 1) {
          nextActiveLetter = section.letter;
          continue;
        }
        break;
      }

      setActiveLetter(nextActiveLetter.toUpperCase());
    }

    function scheduleUpdateActiveLetterByPosition() {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateActiveLetterByPosition();
      });
    }

    updateActiveLetterByPosition();
    window.addEventListener('scroll', scheduleUpdateActiveLetterByPosition, { passive: true });
    window.addEventListener('resize', scheduleUpdateActiveLetterByPosition);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', scheduleUpdateActiveLetterByPosition);
      window.removeEventListener('resize', scheduleUpdateActiveLetterByPosition);
    };
  }, [availableLetters]);

  return (
    <div
      id="glossary-sticky-controls"
      ref={stickyRef}
      className={cn(
        "relative sticky top-[var(--sticky-header-height)] z-30 -mx-5 bg-background px-5 py-4 after:pointer-events-none after:absolute after:top-full after:left-1/2 after:w-screen after:-translate-x-1/2 after:border-b after:content-[''] md:-mx-8 md:px-8 md:py-4 xl:-mx-40 xl:px-40",
        isStuck ? 'after:border-gray-20' : 'after:border-transparent',
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 2xl:gap-13">
        <SearchBar
          className="!h-8 w-full justify-between rounded-sm border-gray-20 bg-gray-8 pr-[0.1875rem] pl-2 hover:bg-gray-8 md:max-w-[15rem] lg:pr-[0.3125rem] xl:w-54 xl:w-57 xl:shrink-0 [&_kbd]:h-6 [&_kbd]:rounded-sm [&_kbd]:border-gray-20 [&_kbd]:bg-gray-8 [&_kbd]:text-gray-70 [&_span]:text-gray-70"
          placeholder="Search..."
          searchItems={searchItems}
          suggestions={suggestions}
        />
        <GlossaryLetterNav availableLetters={lettersSet} activeLetter={activeLetter} />
      </div>
    </div>
  );
}

export default GlossaryStickyControls;
