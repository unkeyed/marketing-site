'use client';

/**
 * TODO: this list should be updated on project export step to include the full list of actually used icons
 */
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  AlertCircle,
  Database,
  FolderOpen,
  Loader,
  MessageCircleMore,
  Monitor,
  Moon,
  Rocket,
  Shield,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Star,
  Sun,
  ThumbsUp,
  Zap,
  type LucideProps,
} from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const staticIcons = {
  'alert-circle': AlertCircle,
  rocket: Rocket,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
  'folder-open': FolderOpen,
  sun: Sun,
  database: Database,
  moon: Moon,
  monitor: Monitor,
  'thumbs-up': ThumbsUp,
  'shield-check': ShieldCheck,
  'message-circle-more': MessageCircleMore,
  shuffle: Shuffle,
  shield: Shield,
  loader: Loader,
};

type StaticIconName = keyof typeof staticIcons;

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  icon: string;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

const DynamicIcon = ({ icon: iconProp, ...props }: DynamicIconProps) => {
  const icon = toKebabCase(iconProp);

  const isStatic = icon in staticIcons;
  const isDynamic = !isStatic && icon in dynamicIconImports;

  if (isStatic) {
    const Icon = staticIcons[icon as StaticIconName];
    return <Icon {...props} />;
  }

  const LazyIcon = useMemo(() => {
    if (!isDynamic) return null;
    return dynamic(dynamicIconImports[icon as keyof typeof dynamicIconImports], {
      ssr: false,
      loading: () => <Loader {...props} />,
    });
  }, [icon, isDynamic, props]);

  if (LazyIcon) {
    return <LazyIcon {...props} />;
  }

  return <AlertCircle {...props} />;
};

export default DynamicIcon;
