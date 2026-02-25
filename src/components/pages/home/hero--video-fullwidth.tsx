'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';

import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';

const CONTAINER = 'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IHeroVideoFullwidthProps {
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  background: { src: string };
  poster: { src: string; width: number; height: number };
  videos: { src: string; type: string }[];
  logos: {
    alt: string;
    src: string;
    width: number;
    height: number;
    wrapperClassName?: string;
  }[];
  customersLink: { label: string; href: string };
}

export default function HeroVideoFullwidth({
  title,
  description,
  primaryCta,
  secondaryCta,
  background,
  poster,
  videos,
  logos,
  customersLink,
}: IHeroVideoFullwidthProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-0 -mt-13.5 w-full border-b border-gray-20">
      <div
        className="relative h-150 w-full overflow-hidden bg-cover bg-top md:h-[min(800px,100svh)] xl:h-[min(1136px,100svh)]"
        style={{ backgroundImage: `url('${background.src}')` }}
      >
        <Image
          src={poster.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none origin-top scale-[1.02] object-cover object-top"
        />

        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="pointer-events-none absolute inset-0 hidden h-full w-full origin-top scale-[1.02] object-cover object-top sm:block"
        >
          {videos.map((v) => (
            <source key={v.src} src={v.src} type={v.type} />
          ))}
        </video>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-91.5"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,4,6,0) 19%, rgba(4,4,6,0.17) 45%, rgba(4,4,6,1) 89%)',
          }}
          aria-hidden="true"
        />

        <div
          className={cn(
            CONTAINER,
            'relative z-10 flex h-full flex-col justify-end pb-8 md:pb-12 xl:pb-16',
          )}
        >
          <h1 className="text-7 max-w-176 font-display leading-[1.125] font-normal whitespace-pre-wrap text-white sm:text-4xl md:text-[44px] lg:text-[52px] xl:text-[64px]">
            {title}
          </h1>

          <div className="mt-4 flex flex-col gap-5 md:mt-5 md:flex-row md:items-end md:justify-between">
            <p className="max-w-132.75 text-base leading-snug font-normal tracking-[-0.01em] whitespace-pre-wrap text-gray-60">
              {description}
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <Link href={primaryCta.href} variant="primary">
                {primaryCta.label}
              </Link>
              <Link href={secondaryCta.href} variant="secondary">
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={CONTAINER}>
        <ul className="flex items-center gap-6 overflow-x-auto pt-8 pb-6 [scrollbar-width:none] lg:justify-between lg:gap-0 lg:overflow-visible lg:pt-12 lg:pb-10.5 [&::-webkit-scrollbar]:hidden">
          {logos.map((logo) => (
            <li
              key={logo.alt}
              className={cn('relative shrink-0 overflow-hidden', logo.wrapperClassName)}
            >
              <Image
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-full w-full"
                src={logo.src}
              />
            </li>
          ))}
          <li className="shrink-0">
            <NextLink
              className="text-base leading-snug font-normal tracking-[-0.01em] text-gray-60"
              href={customersLink.href}
            >
              {customersLink.label}
            </NextLink>
          </li>
        </ul>
      </div>
    </section>
  );
}
