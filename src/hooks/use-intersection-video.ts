'use client';

import { useEffect, type RefObject } from 'react';

interface IUseIntersectionVideoOptions {
  rootMargin?: string;
  disabled?: boolean;
}

export function useIntersectionVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  options: IUseIntersectionVideoOptions = {},
) {
  const { rootMargin = '400px', disabled = false } = options;

  useEffect(() => {
    if (disabled) return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          return;
        }

        video.pause();
      },
      { rootMargin },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [disabled, videoRef, rootMargin]);
}
