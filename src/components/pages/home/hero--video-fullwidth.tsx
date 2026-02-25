'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

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
        className="relative h-284 w-full overflow-hidden md:h-[min(800px,100svh)] xl:h-[min(1136px,100svh)]"
        style={{
          backgroundImage: `url('${background.src}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
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
          className="pointer-events-none absolute right-0 bottom-0 left-0 h-[366px]"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,4,6,0) 19%, rgba(4,4,6,0.17) 45%, rgba(4,4,6,1) 89%)',
          }}
          aria-hidden
        />

        <div className={cn(CONTAINER, 'relative z-10 flex h-full flex-col')}>
          <div className="mt-auto pb-8 md:pb-12 xl:pb-[64px]">
            <h1 className="max-w-[704px] font-display text-[28px] leading-[1.125] font-normal whitespace-pre-wrap text-white sm:text-[36px] md:text-[44px] lg:text-[52px] xl:text-[64px]">
              {title}
            </h1>

            <div className="mt-4 flex flex-col gap-5 md:mt-5 md:flex-row md:items-end md:justify-between">
              <p className="max-w-[531px] text-[16px] leading-[1.375] font-normal tracking-[-0.16px] whitespace-pre-wrap text-[#9194a1]">
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
      </div>

      <div className={CONTAINER}>
        <div className="flex items-center gap-6 overflow-x-auto pt-8 pb-6 [scrollbar-width:none] min-[1025px]:justify-between min-[1025px]:gap-0 min-[1025px]:overflow-visible lg:pt-[48px] lg:pb-[42px] [&::-webkit-scrollbar]:hidden">
          {logos.map((logo) => (
            <div
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
            </div>
          ))}
          <a
            className="shrink-0 text-base leading-[1.375] font-normal tracking-[-0.16px] text-[#9194a1]"
            href={customersLink.href}
          >
            {customersLink.label}
          </a>
        </div>
      </div>
    </section>
  );
}
