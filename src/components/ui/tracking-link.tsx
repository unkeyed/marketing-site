'use client';

import { useTrack } from '@/hooks/use-tracking';
import { Link, type LinkProps } from '@/components/ui/link';

interface ITrackingLinkProps extends LinkProps {
  trackEvent: string;
  trackProperties?: Record<string, string>;
}

export function TrackingLink({
  trackEvent,
  trackProperties,
  onClick,
  ...rest
}: ITrackingLinkProps) {
  const track = useTrack();

  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(trackEvent, trackProperties);
        onClick?.(e);
      }}
    />
  );
}
