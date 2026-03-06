'use client';

import { useEffect, useRef, useState } from 'react';

import { useIntersectionVideo } from '@/hooks/use-intersection-video';

interface IVideoSource {
  src: string;
  type: string;
}

interface IBackgroundVideoProps {
  poster?: string;
  videos: IVideoSource[];
  className?: string;
  rootMargin?: string;
  sourceMedia?: string;
  deferLoad?: boolean;
}

export function BackgroundVideo({
  poster,
  videos,
  className,
  rootMargin = '400px',
  sourceMedia,
  deferLoad = false,
}: IBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(!deferLoad);
  useIntersectionVideo(videoRef, { rootMargin, disabled: !shouldLoad });

  useEffect(() => {
    if (!deferLoad || shouldLoad) return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [deferLoad, rootMargin, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;
    videoRef.current?.load();
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload={shouldLoad ? 'metadata' : 'none'}
      {...(poster ? { poster } : {})}
      aria-hidden="true"
      className={className}
    >
      {shouldLoad
        ? videos.map((video) => (
            <source key={video.src} src={video.src} type={video.type} media={sourceMedia} />
          ))
        : null}
    </video>
  );
}
