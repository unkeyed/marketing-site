'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import {
  type IRiveCanvasProps,
  type IVisibilityControlledPlaybackProps,
  type TRiveRendererProps,
} from '@/components/ui/rive-canvas.types';
import { prefetchFonts } from '@/components/ui/rive-font-loader';

const LazyRiveRenderer = dynamic<TRiveRendererProps & IVisibilityControlledPlaybackProps>(
  () => import('@/components/ui/rive-renderer').then((mod) => mod.RiveRenderer),
  { ssr: false },
);

function toRootMargin(bottomOffset: number) {
  return `0px 0px ${bottomOffset}px`;
}

export type {
  IRiveCanvasProps,
  IRiveConfig,
  IRiveFontConfig,
} from '@/components/ui/rive-canvas.types';

export default function RiveCanvas({
  lazy = false,
  lazyOffset = 100,
  playOnVisible = lazy,
  playOffset = 0,
  fontPrefetchOffset,
  fonts,
  className,
  autoplay = true,
  ...riveProps
}: IRiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(!lazy);
  const shouldControlPlayback = autoplay && playOnVisible;
  const [shouldPlay, setShouldPlay] = useState(!shouldControlPlayback);

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
      { rootMargin: toRootMargin(lazyOffset), threshold: 0 },
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
      { rootMargin: toRootMargin(playOffset), threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldControlPlayback, shouldRender, shouldPlay, playOffset]);

  useEffect(() => {
    if (!fonts || fontPrefetchOffset == null) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        prefetchFonts(fonts.urls);
        observer.disconnect();
      },
      { rootMargin: toRootMargin(fontPrefetchOffset), threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fonts, fontPrefetchOffset]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <LazyRiveRenderer
          {...riveProps}
          autoplay={shouldControlPlayback ? false : autoplay}
          fonts={fonts}
          className="h-full w-full"
          playOnVisible={shouldControlPlayback}
          shouldPlay={shouldPlay}
        />
      ) : null}
    </div>
  );
}
