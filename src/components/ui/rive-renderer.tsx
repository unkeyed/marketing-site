'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

import { cn } from '@/lib/utils';
import {
  type IVisibilityControlledPlaybackProps,
  type TRiveRendererProps,
} from '@/components/ui/rive-canvas.types';
import { createFontAssetLoader } from '@/components/ui/rive-font-loader';

export function RiveRenderer({
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
}: TRiveRendererProps & IVisibilityControlledPlaybackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const layout = useMemo(() => new Layout({ fit, alignment }), [fit, alignment]);
  const onLoad = useCallback(() => setIsLoaded(true), []);
  const onLoadError = useCallback(() => setHasError(true), []);
  const assetLoader = useMemo(() => (fonts ? createFontAssetLoader(fonts) : undefined), [fonts]);

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
