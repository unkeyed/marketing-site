import type { Alignment, Fit } from '@rive-app/react-canvas';

export interface IRiveFontConfig {
  urls: Record<string, string>;
  /** Custom patterns per weight key. Falls back to case-insensitive match on the key name. */
  patterns?: Record<string, RegExp>;
}

export interface IRiveConfig {
  src: string;
  artboard?: string;
  stateMachines?: string;
  fit?: Fit;
  alignment?: Alignment;
  autoplay?: boolean;
  autoBind?: boolean;
  fonts?: IRiveFontConfig;
}

export interface IRiveCanvasProps extends IRiveConfig {
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

export type TRiveRendererProps = Omit<
  IRiveCanvasProps,
  'lazy' | 'lazyOffset' | 'playOnVisible' | 'playOffset' | 'fontPrefetchOffset'
>;

export interface IVisibilityControlledPlaybackProps {
  playOnVisible: boolean;
  shouldPlay: boolean;
}
