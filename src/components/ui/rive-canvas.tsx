'use client';

import { useEffect, useRef, useState } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

import { cn } from '@/lib/utils';

interface IRiveFontConfig {
  urls: Record<string, string>;
  mediumPattern?: RegExp;
}

const fontCaches = new Map<string, Promise<Uint8Array>>();

function loadFontBytes(url: string): Promise<Uint8Array> {
  let cached = fontCaches.get(url);
  if (!cached) {
    cached = fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load font: ${url} (${response.status})`);
      }
      return new Uint8Array(await response.arrayBuffer());
    });
    fontCaches.set(url, cached);
  }
  return cached;
}

function prefetchFonts(urls: Record<string, string>) {
  for (const url of Object.values(urls)) {
    loadFontBytes(url);
  }
}

function createFontAssetLoader(fonts: IRiveFontConfig) {
  const mediumPattern = fonts.mediumPattern ?? /medium|500/i;
  const entries = Object.entries(fonts.urls);

  return (
    asset: { isFont: boolean; cdnUuid: string; name?: string; decode: (b: Uint8Array) => void },
    bytes: Uint8Array,
  ) => {
    if (!asset.isFont || bytes.length !== 0 || asset.cdnUuid.length !== 0) {
      return false;
    }

    const match = entries.find(([key]) =>
      key === 'medium' ? mediumPattern.test(asset.name ?? '') : false,
    );
    const url = match ? match[1] : entries[0]?.[1];
    if (!url) return false;

    void loadFontBytes(url)
      .then((b) => asset.decode(b))
      .catch((error: unknown) => console.error('Failed to load Rive font asset:', error));

    return true;
  };
}

interface IRiveCanvasProps {
  src: string;
  artboard?: string;
  stateMachines?: string;
  fit?: Fit;
  alignment?: Alignment;
  autoplay?: boolean;
  autoBind?: boolean;
  fonts?: IRiveFontConfig;
  className?: string;
  /** Lazily mount Rive only when the element enters the viewport */
  lazy?: boolean;
  /** Bottom offset in px for lazy mounting (default 100) */
  lazyOffset?: number;
  /** Bottom offset in px for font prefetching — should be larger than lazyOffset */
  fontPrefetchOffset?: number;
}

function RiveRenderer({
  src,
  artboard,
  stateMachines = 'SM',
  fit = Fit.Contain,
  alignment = Alignment.TopCenter,
  autoplay = true,
  autoBind = true,
  fonts,
  className,
}: {
  src: string;
  artboard?: string;
  stateMachines?: string;
  fit?: Fit;
  alignment?: Alignment;
  autoplay?: boolean;
  autoBind?: boolean;
  fonts?: IRiveFontConfig;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { RiveComponent } = useRive({
    src,
    stateMachines,
    artboard,
    layout: new Layout({ fit, alignment }),
    autoplay,
    autoBind,
    onLoad: () => setIsLoaded(true),
    onLoadError: () => setHasError(true),
    assetLoader: fonts ? createFontAssetLoader(fonts) : undefined,
  });

  if (hasError) return null;

  return (
    <RiveComponent
      className={cn(
        'transition-opacity duration-200',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  );
}

function toRootMargin(bottomOffset: number) {
  return `0px 0px ${bottomOffset}px`;
}

export default function RiveCanvas({
  lazy = false,
  lazyOffset = 100,
  fontPrefetchOffset,
  fonts,
  className,
  ...riveProps
}: IRiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(!lazy);

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

  if (!lazy) {
    return <RiveRenderer {...riveProps} fonts={fonts} className={className} />;
  }

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <RiveRenderer {...riveProps} fonts={fonts} className="h-full w-full" />
      ) : null}
    </div>
  );
}

interface IRiveConfig {
  src: string;
  artboard?: string;
  stateMachines?: string;
  autoBind?: boolean;
  fit?: Fit;
  alignment?: Alignment;
  fonts?: IRiveFontConfig;
}

export { type IRiveFontConfig, type IRiveCanvasProps, type IRiveConfig };
