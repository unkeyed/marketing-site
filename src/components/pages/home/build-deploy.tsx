'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import Container from '@/components/pages/home/container';
import { Label } from '@/components/ui/label';

interface IBuildDeployPanel {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  imageAlt: string;
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
        className="grid min-h-[628px] grid-cols-1 lg:min-h-[clamp(540px,41vw,628px)] lg:grid-cols-2"
      >
        <div
          className={cn(
            'flex flex-col border border-gray-20 px-5 py-10 md:px-10 lg:border-r-0 lg:px-16 lg:py-0 xl:px-24',
            row.textTopClass ?? 'lg:pt-[137px]',
          )}
        >
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="text-[24px] leading-[1.125] tracking-[-0.02em] sm:text-[28px]">
              <h3 className="text-white">{row.title}</h3>
              <p className="text-gray-60">{row.subtitle}</p>
            </div>
            <p className="max-w-md text-base leading-snug text-gray-90">{row.body}</p>
          </div>
          {row.hasLogos && row.logos && (
            <div className="mt-8 flex flex-wrap items-end gap-4 sm:gap-6 lg:mt-[183px]">
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
        <div className="border-x border-b border-gray-20 lg:border">
          <Image
            alt={row.imageAlt}
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
  const [headerHeight, setHeaderHeight] = useState(200);
  const isClickScrolling = useRef(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = Math.round(entry.borderBoxSize[0].blockSize);
      setHeaderHeight((prev) => (prev === h ? prev : h));
    });
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const elements = panels
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const intersectingIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectingIds.add(entry.target.id);
          } else {
            intersectingIds.delete(entry.target.id);
          }
        }

        for (const panel of panels) {
          if (intersectingIds.has(panel.id)) {
            setActiveTab(panel.id);
            break;
          }
        }
      },
      { rootMargin: `-${headerHeight}px 0px -40% 0px`, threshold: 0 },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [panels, headerHeight]);

  const handleTabClick = useCallback((id: string) => {
    setActiveTab(id);
    isClickScrolling.current = true;

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 800);
    }
  }, []);

  return (
    <section className="pt-20 md:pt-30 xl:pt-45">
      <Container>
        <div className="pt-8 md:pt-12 xl:pt-20">
          <Label>Build & Deploy</Label>
        </div>

        <div>
          <div ref={headerRef} className="sticky top-0 z-10 bg-background">
            <div className="grid gap-5 pt-6 lg:grid-cols-[60fr_40fr] lg:gap-8 lg:pt-8">
              <h2 className="font-display text-3xl leading-[1.125] text-white sm:text-[40px] xl:text-[52px]">
                {heading}
              </h2>
              <p className="max-w-[416px] text-[20px] leading-snug tracking-[-0.01em] text-gray-70 md:text-xl lg:mt-[31px] lg:ml-auto">
                {description}
              </p>
            </div>

            <div className="mt-8 h-16 overflow-x-auto border-b border-gray-20 [scrollbar-width:none] md:mt-12 xl:mt-20 [&::-webkit-scrollbar]:hidden">
              <ul
                role="tablist"
                aria-label="Build and deploy steps"
                className="grid h-full min-w-[660px] grid-cols-5 md:w-full md:min-w-0"
              >
                {panels.map((row, index) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === row.id}
                      aria-controls={row.id}
                      onClick={() => handleTabClick(row.id)}
                      className={cn(
                        'flex h-full w-full items-center justify-center border-t border-l border-gray-20 px-4 text-base leading-[1.125] font-normal transition-colors sm:text-lg md:text-xl',
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
            <ul className="-mt-px list-none">
              {panels.slice(0, -1).map((row) => (
                <Panel
                  key={row.id}
                  row={row}
                  isLast={false}
                  stickyHeight={headerHeight}
                />
              ))}
            </ul>
          )}
        </div>

        {panels.length > 0 && (
          <ul className="-mt-px list-none">
            <Panel
              row={panels[panels.length - 1]}
              isLast
              stickyHeight={headerHeight}
            />
          </ul>
        )}
      </Container>
    </section>
  );
}
