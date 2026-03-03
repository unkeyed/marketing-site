'use client';

import { type RefObject, useEffect } from 'react';

interface IUseIntersectionVideoOptions {
  rootMargin?: string;
}

export function useIntersectionVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  options: IUseIntersectionVideoOptions = {},
) {
  const { rootMargin = '400px' } = options;

  useEffect(() => {
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
  }, [videoRef, rootMargin]);
}
