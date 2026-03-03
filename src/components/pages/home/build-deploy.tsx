'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface IBuildDeployPanel {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  hasLogos?: boolean;
  logos?: { alt: string; src: string; width: number; height: number; className: string }[];
  textTopClass?: string;
}

interface IBuildDeployProps {
  heading: string;
  description: string;
  panels: IBuildDeployPanel[];
}

function Panel({
  row,
  isLast,
  stickyHeight,
}: {
  row: IBuildDeployPanel;
  isLast: boolean;
  stickyHeight: number;
}) {
  return (
    <li>
      <div
        id={row.id}
        style={{ scrollMarginTop: stickyHeight }}
        className="grid min-h-140 grid-cols-1 sm:min-h-157 lg:min-h-[clamp(33.75rem,41vw,39.25rem)] lg:grid-cols-2"
      >
        <div
          className={cn(
            'flex flex-col border border-gray-20 px-5 py-8 sm:py-10 md:px-10 md:py-12 lg:border-r-0 lg:px-16 lg:py-0 xl:px-24',
            row.textTopClass ?? 'lg:pt-34.25',
          )}
        >
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="text-[1.375rem] leading-[1.125] tracking-[-0.02em] sm:text-[1.625rem] md:text-[1.75rem]">
              <h3 className="text-white">{row.title}</h3>
              <p className="text-gray-60">{row.subtitle}</p>
            </div>
            <p className="max-w-md text-[0.9375rem] leading-snug text-gray-90 sm:text-base">
              {row.body}
            </p>
          </div>

          {row.hasLogos && row.logos && (
            <div className="mt-8 flex flex-wrap items-end gap-4 sm:mt-10 sm:gap-6 md:mt-12 lg:mt-24 xl:mt-45.75">
              {row.logos.map((logo) => (
                <Image
                  key={logo.alt}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={logo.className}
                  src={logo.src}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-gray-20 lg:border">
          <Image
            alt=""
            width={1536}
            height={1256}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-full w-full object-cover"
            src={row.image}
          />
        </div>
      </div>

      {!isLast && (
        <div
          className="h-16 border-r border-l border-gray-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)',
          }}
        />
      )}
    </li>
  );
}

export default function BuildDeploy({ heading, description, panels }: IBuildDeployProps) {
  const [activeTab, setActiveTab] = useState(panels[0]?.id ?? '');
  const [stickyPanelHeight, setStickyPanelHeight] = useState(200);
  const [globalHeaderPx, setGlobalHeaderPx] = useState(54);
  const [isStuck, setIsStuck] = useState(false);

  const isClickScrolling = useRef(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tabsScrollerRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const h = Math.round(entry.borderBoxSize[0].blockSize);
      setStickyPanelHeight((prev) => (prev === h ? prev : h));
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--sticky-header-height')
      .trim();
    if (!raw) return;

    const rem = parseFloat(raw);
    if (Number.isNaN(rem)) return;

    const base = parseFloat(getComputedStyle(document.documentElement).fontSize);
    setGlobalHeaderPx(Math.round(rem * base));
  }, []);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();

      const pinned = Math.abs(rect.top - globalHeaderPx) <= 1;

      setIsStuck((prev) => (prev === pinned ? prev : pinned));
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
    const elements = panels
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);

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

    for (const el of elements) observer.observe(el);
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

    const el = document.getElementById(id);
    if (!el) return;

    isClickScrolling.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const unlock = () => {
      isClickScrolling.current = false;
    };

    window.addEventListener('scrollend', unlock, { once: true });
    const fallback = window.setTimeout(unlock, 1500);
    window.addEventListener('scrollend', () => clearTimeout(fallback), { once: true });
  }, []);

  return (
    <section className="pt-20 md:pt-30 xl:pt-45">
      <div
        aria-hidden
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-30 h-[var(--sticky-header-height)] bg-black transition-opacity duration-200',
          isStuck ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div className="container">
        <div className="pt-8 md:pt-12 xl:pt-20">
          <Label>Build & Deploy</Label>
        </div>

        <div>
          <div
            ref={stickyRef}
            className="sticky top-[var(--sticky-header-height)] z-40 -mx-5 self-start bg-background px-5 md:-mx-8 md:px-8 xl:mx-0 xl:px-0"
          >
            <div className="grid gap-4 pt-[1.25rem] sm:gap-5 md:pt-6 lg:grid-cols-[60fr_40fr] lg:gap-8 lg:pt-[1.75rem]">
              <h2 className="font-display text-3xl leading-[1.125] text-white sm:text-[2.5rem] md:max-w-[42rem] md:text-[2.25rem] lg:max-w-none lg:text-[2.5rem] xl:text-[3.25rem]">
                {heading}
              </h2>
              {/* 2xl:-bottom-0.5 to fix the line-height difference between Figma and the implemented layout */}
              <p className="relative max-w-104 text-[1rem] leading-snug tracking-[-0.01em] text-gray-70 sm:text-[1.25rem] md:text-[1.125rem] lg:mt-7.75 lg:ml-auto lg:text-xl 2xl:-bottom-0.5">
                {description}
              </p>
            </div>

            <div
              ref={tabsScrollerRef}
              className="-mx-5 mt-8 h-[3.75rem] overflow-x-auto border-b border-gray-20 [scrollbar-width:none] md:-mx-8 md:mt-12 md:h-16 xl:mx-0 xl:mt-20 [&::-webkit-scrollbar]:hidden"
            >
              <ul
                role="tablist"
                aria-label="Build and deploy steps"
                className="grid h-full min-w-165 grid-cols-5 md:w-full md:min-w-0"
              >
                {panels.map((row, index) => (
                  <li key={row.id} role="presentation">
                    <button
                      ref={(el) => {
                        tabButtonRefs.current[row.id] = el;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === row.id}
                      aria-controls={row.id}
                      onClick={() => handleTabClick(row.id)}
                      className={cn(
                        'flex h-full w-full items-center justify-center border-t border-l border-gray-20 px-3 text-base leading-[1.125] font-normal transition-colors sm:px-4 sm:text-lg md:text-[1.125rem] lg:text-xl',
                        index === panels.length - 1 && 'border-r',
                        activeTab === row.id ? 'bg-gray-8 text-white' : 'text-gray-60',
                      )}
                    >
                      {row.tabLabel}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {panels.length > 1 && (
            <ul className="-mx-5 -mt-px list-none md:-mx-8 xl:mx-0">
              {panels.slice(0, -1).map((row) => (
                <Panel key={row.id} row={row} isLast={false} stickyHeight={stickyOffset} />
              ))}
            </ul>
          )}
        </div>

        {panels.length > 0 && (
          <ul className="-mx-5 -mt-px list-none md:-mx-8 xl:mx-0">
            <Panel row={panels[panels.length - 1]} isLast stickyHeight={stickyOffset} />
          </ul>
        )}
      </div>
    </section>
  );
}
