'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Link } from '@/components/ui/link';

interface IHeroProps {
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  poster: { src: string; width: number; height: number };
  videos: { src: string; type: string }[];
  logos: {
    alt: string;
    src: string;
    width: number;
    height: number;
    wrapperClassName?: string;
  }[];
}

export default function Hero({
  title,
  description,
  primaryCta,
  secondaryCta,
  poster,
  videos,
  logos,
}: IHeroProps) {
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
      <div className="relative h-136 w-full overflow-hidden sm:h-150 md:h-[min(47rem,100svh)] lg:h-[min(51rem,100svh)] xl:h-[min(71rem,100svh)]">
        <Image
          src={poster.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none origin-top scale-[1.02] object-cover object-top sm:hidden"
        />

        {/*  
          ffmpeg parameters: 

          mp4: ffmpeg -i input.mov -c:v libx265 -crf 35 -pix_fmt yuv420p10le -vf scale=2560:-2 -preset veryslow -x265-params tune=animation -tag:v hvc1 -movflags faststart -an hero.mp4
          webm: ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 1420k -vf scale=2560:-2 -svtav1-params preset=1:lookahead=120:keyint=80 -pass 1 -an -f null /dev/null && ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 1420k -vf scale=2560:-2 -svtav1-params preset=1:lookahead=120:keyint=80 -pass 2 -an -y hero.webm
        */}

        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster.src}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full origin-top scale-[1.02] object-cover object-top sm:block"
        >
          {videos.map((v) => (
            <source key={v.src} src={v.src} type={v.type} />
          ))}
        </video>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-91.5 bg-[linear-gradient(180deg,rgba(4,4,6,0)_19%,rgba(4,4,6,0.17)_45%,rgba(4,4,6,1)_89%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 container flex h-full flex-col justify-end pb-8 md:pb-12 lg:pb-14 xl:pb-16">
          <h1 className="max-w-70 font-display text-4xl leading-[1.125] font-normal whitespace-pre-wrap text-white sm:max-w-126 sm:text-5xl md:max-w-120 md:text-[2.625rem] lg:max-w-140 lg:text-[3.25rem] xl:max-w-176 xl:text-[4rem]">
            {title}
          </h1>

          <div className="mt-4 flex flex-col gap-7 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-5">
            <p className="max-w-80 text-sm leading-snug font-normal tracking-[-0.01em] whitespace-pre-wrap text-gray-60 sm:text-base md:max-w-132.75">
              {description}
            </p>
            <div className="mt-1 flex w-full shrink-0 flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap md:mt-0">
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

      <div className="container">
        <div className="overflow-hidden pt-8 pb-6 lg:overflow-visible lg:pt-12 lg:pb-10.5">
          <div className="flex w-max gap-6 animate-[logos_30s_linear_infinite] will-change-transform motion-reduce:animate-none lg:w-full lg:animate-none lg:will-change-auto lg:gap-0">
            <ul className="flex shrink-0 items-center gap-6 lg:w-full lg:gap-0 lg:justify-between">
              {logos.map((logo) => (
                <li
                  key={logo.alt}
                  className={cn('relative shrink-0 overflow-hidden', logo.wrapperClassName)}
                >
                  <Image
                    className="h-full w-full"
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    src={logo.src}
                    priority
                  />
                </li>
              ))}
            </ul>
            <ul className="flex shrink-0 items-center gap-6 lg:hidden" aria-hidden="true">
              {logos.map((logo) => (
                <li
                  key={`${logo.alt}-dup`}
                  className={cn('relative shrink-0 overflow-hidden', logo.wrapperClassName)}
                >
                  <Image
                    className="h-full w-full"
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    src={logo.src}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
