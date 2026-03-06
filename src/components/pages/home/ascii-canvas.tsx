'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

export interface IAsciiConfig {
  imageSrc: string;
  matrixCharSize?: number;
  backgroundCharSize?: number;
  backgroundColor?: string;
  backgroundCharColor?: string;
  backgroundEnabled?: boolean;
  objectColor1?: string;
  objectColor2?: string;
  objectColor3?: string;
  depthIntensity?: number;
  threshold?: number;
  symbolBalance?: number;
  blackPoint?: number;
  brightness?: number;
  contrast?: number;
  appearanceEffect?: 'natural' | 'decryption' | 'symbolShift';
  fontUrl?: string;
}

export type TAsciiResolvedConfig = Required<Omit<IAsciiConfig, 'imageSrc' | 'fontUrl'>>;

export interface IAsciiRendererProps {
  imageSrc: string;
  config: TAsciiResolvedConfig;
  fontUrl: string;
  className?: string;
  shouldAnimate: boolean;
}

const LazyAsciiRenderer = dynamic<IAsciiRendererProps>(
  () => import('@/components/pages/home/ascii-renderer').then((mod) => mod.AsciiRenderer),
  { ssr: false },
);

const DEFAULT_CONFIG: TAsciiResolvedConfig = {
  matrixCharSize: 34,
  backgroundCharSize: 85,
  backgroundColor: '#040406',
  backgroundCharColor: '#878787',
  backgroundEnabled: true,
  objectColor1: '#bababa',
  objectColor2: '#bababa',
  objectColor3: '#bababa',
  depthIntensity: 4,
  threshold: 0,
  symbolBalance: 21,
  blackPoint: 8,
  brightness: 1,
  contrast: 1,
  appearanceEffect: 'natural',
};

const DEFAULT_FONT_URL = '/rive/home/JetBrainsMono-Regular.ttf';

interface IAsciiCanvasProps {
  className?: string;
  lazy?: boolean;
  lazyOffset?: number;
  playOnVisible?: boolean;
  playOffset?: number;
  config: IAsciiConfig;
}

export default function AsciiCanvas({
  className,
  lazy = false,
  lazyOffset = 200,
  playOnVisible = lazy,
  playOffset = 0,
  config,
}: IAsciiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(!lazy);
  const shouldControlPlayback = playOnVisible;
  const [shouldPlay, setShouldPlay] = useState(!shouldControlPlayback);
  const mergedConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  const fontUrl = config.fontUrl ?? DEFAULT_FONT_URL;

  useEffect(() => {
    if (!lazy || shouldRender) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: `0px 0px ${lazyOffset}px`, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, shouldRender, lazyOffset]);

  useEffect(() => {
    if (!shouldControlPlayback || !shouldRender || shouldPlay) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldPlay(true);
        observer.disconnect();
      },
      { rootMargin: `0px 0px ${playOffset}px`, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldControlPlayback, shouldRender, shouldPlay, playOffset]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <LazyAsciiRenderer
          imageSrc={config.imageSrc}
          config={mergedConfig}
          fontUrl={fontUrl}
          className="h-full w-full"
          shouldAnimate={shouldPlay}
        />
      ) : null}
    </div>
  );
}
