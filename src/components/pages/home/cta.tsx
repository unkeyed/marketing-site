import Image from 'next/image';

import { cn } from '@/lib/utils';
import { BackgroundVideo } from '@/components/ui/background-video';
import { TrackingLink } from '@/components/ui/tracking-link';

interface ICtaProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
  poster: string;
  videos: { src: string; type: string }[];
  className?: string;
}

export default function Cta({
  heading,
  subheading,
  buttonLabel,
  buttonHref,
  poster,
  videos,
  className,
}: ICtaProps) {
  return (
    <section
      className={cn(
        'relative h-[clamp(26.25rem,94vw,28.75rem)] overflow-hidden bg-panel sm:h-[31.25rem] md:h-130 lg:h-[32.5rem] xl:h-[34.125rem]',
        className,
      )}
    >
      {/*
          ffmpeg parameters (native 1920×546, 8-bit yuv420p to avoid green tint):
          mp4: ffmpeg -y -i input.mov -c:v libx265 -crf 22 -pix_fmt yuv420p -preset veryslow -tag:v hvc1 -movflags faststart -an cta.mp4
          webm: ffmpeg -y -i input.mov -c:v libsvtav1 -crf 32 -pix_fmt yuv420p -svtav1-params preset=3:lookahead=80:keyint=80 -an cta.webm
      */}

      <Image
        src={poster}
        alt=""
        fill
        quality={95}
        sizes="(max-width: 640px) 960px"
        className="pointer-events-none absolute inset-0 z-0 object-cover sm:hidden"
      />

      <BackgroundVideo
        poster={poster}
        videos={videos}
        deferLoad
        rootMargin="200px"
        sourceMedia="(min-width: 640px)"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full object-cover sm:block"
      />
      <div className="relative z-10 container flex h-full flex-col pt-12 pb-10 sm:pt-14 sm:pb-11 md:pt-16 md:pb-12.75 lg:pb-14 xl:pb-12.75">
        <h2 className="max-w-144 font-display text-2xl leading-[1.125] text-white sm:text-[1.875rem] md:text-[2rem]">
          {heading} <span className="text-gray-60 min-[480px]:block">{subheading}</span>
        </h2>
        <TrackingLink
          href={buttonHref}
          className="mt-auto w-fit lg:mt-13 xl:mt-auto"
          trackEvent="sign up"
          trackProperties={{ location: 'CTA' }}
        >
          {buttonLabel}
        </TrackingLink>
      </div>
    </section>
  );
}
