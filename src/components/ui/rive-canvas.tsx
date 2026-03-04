'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

import { cn } from '@/lib/utils';

interface IRiveFontConfig {
  urls: Record<string, string>;
  /** Custom patterns per weight key. Falls back to case-insensitive match on the key name. */
  patterns?: Record<string, RegExp>;
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

function matchFontUrl(fonts: IRiveFontConfig, assetName: string): string | undefined {
  const entries = Object.entries(fonts.urls);
  const patterns = fonts.patterns;

  // Try to match a specific weight by key pattern against the asset name
  for (const [key, url] of entries) {
    const pattern = patterns?.[key] ?? new RegExp(key, 'i');
    if (pattern.test(assetName)) return url;
  }

  // Fallback to regular, then first available
  return fonts.urls.regular ?? entries[0]?.[1];
}

function createFontAssetLoader(fonts: IRiveFontConfig) {
  return (
    asset: { isFont: boolean; cdnUuid: string; name?: string; decode: (b: Uint8Array) => void },
    bytes: Uint8Array,
  ) => {
    if (!asset.isFont || bytes.length !== 0 || asset.cdnUuid.length !== 0) {
      return false;
    }

    const url = matchFontUrl(fonts, asset.name ?? '');
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
  /** Start playback when the element intersects the viewport (defaults to `lazy`) */
  playOnVisible?: boolean;
  /** Bottom offset in px for playback start observer (default 0) */
  playOffset?: number;
  /** Bottom offset in px for font prefetching — should be larger than lazyOffset */
  fontPrefetchOffset?: number;
}

type TRiveRendererProps = Omit<
  IRiveCanvasProps,
  'lazy' | 'lazyOffset' | 'playOnVisible' | 'playOffset' | 'fontPrefetchOffset'
>;
type TVisibilityControlledPlaybackProps = {
  playOnVisible: boolean;
  shouldPlay: boolean;
};

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
  playOnVisible = false,
  shouldPlay = false,
}: TRiveRendererProps & TVisibilityControlledPlaybackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const layout = useMemo(() => new Layout({ fit, alignment }), [fit, alignment]);
  const onLoad = useCallback(() => setIsLoaded(true), []);
  const onLoadError = useCallback(() => setHasError(true), []);
  const assetLoader = useMemo(
    () => (fonts ? createFontAssetLoader(fonts) : undefined),
    [fonts],
  );

  const hasStartedRef = useRef(false);
  const { RiveComponent, rive } = useRive({
    src,
    stateMachines,
    artboard,
    layout,
    autoplay,
    autoBind,
    onLoad,
    onLoadError,
    assetLoader,
  });

  useEffect(() => {
    if (!playOnVisible || !shouldPlay || !rive || hasStartedRef.current) return;
    rive.play();
    hasStartedRef.current = true;
  }, [playOnVisible, shouldPlay, rive]);

  if (hasError) return null;

  return (
    <RiveComponent
      className={cn(
        'rive-touch-scroll-fix transition-opacity duration-200',
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

  if (!lazy && !shouldControlPlayback) {
    return (
      <RiveRenderer
        {...riveProps}
        autoplay={autoplay}
        fonts={fonts}
        className={className}
        playOnVisible={false}
        shouldPlay={true}
      />
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <RiveRenderer
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
