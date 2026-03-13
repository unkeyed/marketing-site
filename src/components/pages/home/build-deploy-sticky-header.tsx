'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { type IBuildDeployTab } from '@/components/pages/home/build-deploy.types';

interface IBuildDeployStickyHeaderProps {
  heading: string;
  description: string;
  panels: IBuildDeployTab[];
}

export default function BuildDeployStickyHeader({
  heading,
  description,
  panels,
}: IBuildDeployStickyHeaderProps) {
  const [activeTab, setActiveTab] = useState(panels[0]?.id ?? '');
  const [stickyPanelHeight, setStickyPanelHeight] = useState(200);
  const [globalHeaderPx, setGlobalHeaderPx] = useState(54);
  const [isStuck, setIsStuck] = useState(false);

  const isClickScrolling = useRef(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tabsScrollerRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const element = stickyRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const height = Math.round(entry.borderBoxSize[0].blockSize);
      setStickyPanelHeight((previous) => (previous === height ? previous : height));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const rawHeight = getComputedStyle(document.documentElement)
      .getPropertyValue('--sticky-header-height')
      .trim();
    if (!rawHeight) return;

    const rem = parseFloat(rawHeight);
    if (Number.isNaN(rem)) return;

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    setGlobalHeaderPx(Math.round(rem * rootFontSize));
  }, []);

  useEffect(() => {
    const element = stickyRef.current;
    if (!element) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const pinned = Math.abs(element.getBoundingClientRect().top - globalHeaderPx) <= 1;
      setIsStuck((previous) => (previous === pinned ? previous : pinned));
    };

    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [globalHeaderPx, stickyPanelHeight]);

  const stickyOffset = globalHeaderPx + stickyPanelHeight;

  useEffect(() => {
    document.documentElement.style.setProperty('--build-deploy-scroll-margin', `${stickyOffset}px`);

    return () => {
      document.documentElement.style.removeProperty('--build-deploy-scroll-margin');
    };
  }, [stickyOffset]);

  useEffect(() => {
    const elements = panels
      .map((panel) => document.getElementById(panel.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const intersectingIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersectingIds.add(entry.target.id);
          else intersectingIds.delete(entry.target.id);
        }

        if (isClickScrolling.current) return;

        for (const panel of panels) {
          if (intersectingIds.has(panel.id)) {
            setActiveTab(panel.id);
            break;
          }
        }
      },
      { rootMargin: `-${stickyOffset}px 0px -40% 0px`, threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [panels, stickyOffset]);

  useEffect(() => {
    const scroller = tabsScrollerRef.current;
    const activeButton = tabButtonRefs.current[activeTab];
    if (!scroller || !activeButton) return;

    if (scroller.scrollWidth <= scroller.clientWidth + 1) return;

    const containerRect = scroller.getBoundingClientRect();
    const tabRect = activeButton.getBoundingClientRect();

    const hiddenOnLeft = tabRect.left < containerRect.left;
    const hiddenOnRight = tabRect.right > containerRect.right;
    if (!hiddenOnLeft && !hiddenOnRight) return;

    const targetLeft =
      scroller.scrollLeft +
      (tabRect.left - containerRect.left) -
      (containerRect.width - tabRect.width) / 2;

    const clampedTarget = Math.max(
      0,
      Math.min(targetLeft, scroller.scrollWidth - scroller.clientWidth),
    );
    scroller.scrollTo({ left: clampedTarget, behavior: 'smooth' });
  }, [activeTab]);

  const handleTabClick = useCallback((id: string) => {
    setActiveTab(id);

    const element = document.getElementById(id);
    if (!element) return;

    isClickScrolling.current = true;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const unlock = () => {
      isClickScrolling.current = false;
    };

    window.addEventListener('scrollend', unlock, { once: true });
    const fallback = window.setTimeout(unlock, 1500);
    window.addEventListener('scrollend', () => clearTimeout(fallback), { once: true });
  }, []);

  return (
    <>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-30 hidden h-[var(--sticky-header-height)] bg-black transition-opacity duration-200 md:block',
          isStuck ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        ref={stickyRef}
        className="z-40 -mx-5 mb-8 self-start bg-background px-5 md:sticky md:top-[var(--sticky-header-height)] md:-mx-8 md:mb-0 md:px-8 xl:mx-0 xl:px-0"
      >
        <div className="grid gap-4 pt-[1.25rem] sm:gap-5 md:pt-6 lg:gap-8 xl:grid-cols-[60fr_40fr] xl:pt-[1.75rem]">
          <h2 className="font-display text-3xl leading-[1.125] text-white sm:text-[2.5rem] md:max-w-[42rem] md:text-[2.25rem] lg:max-w-[34rem] lg:text-[2.5rem] xl:max-w-none xl:text-[3.25rem]">
            {heading}
          </h2>
          <p className="relative max-w-104 text-[1rem] leading-snug tracking-[-0.01em] text-gray-70 sm:text-[1.25rem] md:max-w-126 md:text-[1.125rem] xl:mt-auto xl:ml-auto xl:text-xl 2xl:-bottom-0.5">
            {description}
          </p>
        </div>

        <div
          ref={tabsScrollerRef}
          className="-mx-5 mt-8 hidden h-[3.75rem] overflow-x-auto border-b border-gray-20 [scrollbar-width:none] md:-mx-8 md:mt-12 md:block md:h-16 xl:mx-0 xl:mt-20 [&::-webkit-scrollbar]:hidden"
        >
          <nav aria-label="Build and deploy steps" className="h-full">
            <ul className="grid h-full min-w-165 grid-cols-5 md:w-full md:min-w-0">
              {panels.map((panel, index) => (
                <li key={panel.id}>
                  <button
                    ref={(element) => {
                      tabButtonRefs.current[panel.id] = element;
                    }}
                    type="button"
                    aria-current={activeTab === panel.id ? 'step' : undefined}
                    onClick={() => handleTabClick(panel.id)}
                    className={cn(
                      'flex h-full w-full items-center justify-center border-t border-l border-gray-20 px-3 text-base leading-[1.125] font-normal transition-colors sm:px-4 sm:text-lg md:text-[1.125rem] lg:text-xl',
                      index === panels.length - 1 && 'border-r',
                      activeTab === panel.id ? 'bg-gray-8 text-white' : 'text-gray-60',
                    )}
                  >
                    {panel.tabLabel}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
