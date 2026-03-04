'use client';

import { useRef } from 'react';

import { useIntersectionVideo } from '@/hooks/use-intersection-video';

interface IVideoSource {
  src: string;
  type: string;
}

interface IBackgroundVideoProps {
  poster: string;
  videos: IVideoSource[];
  className?: string;
  rootMargin?: string;
  sourceMedia?: string;
}

export function BackgroundVideo({
  poster,
  videos,
  className,
  rootMargin = '400px',
  sourceMedia,
}: IBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useIntersectionVideo(videoRef, { rootMargin });

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      {...(poster ? { poster } : {})}
      aria-hidden="true"
      className={className}
    >
      {videos.map((video) => (
        <source key={video.src} src={video.src} type={video.type} media={sourceMedia} />
      ))}
    </video>
  );
}
