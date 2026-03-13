import Image from 'next/image';

import { isExternalLink } from '@/lib/utils';
import { BackgroundVideo } from '@/components/ui/background-video';
import { Link } from '@/components/ui/link';
import Logos from '@/components/pages/logos';

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
  return (
    <section className="relative z-0 -mt-13.5 w-full border-b border-gray-20">
      <div className="relative h-136 w-full overflow-hidden sm:h-150 md:h-[min(47rem,100svh)] lg:h-[min(51rem,100svh)] xl:h-[min(71rem,100svh)]">
        <Image
          src={poster.src}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 640px) 960px"
          className="pointer-events-none origin-top scale-[1.02] object-cover object-top sm:hidden"
        />

        {/*  
          Video optimization parameters:
            mp4: ffmpeg -i input.mov -c:v libx265 -preset veryslow -crf 34 -tune animation -vf "scale=2560:-2:flags=lanczos,format=yuv420p10le" -x265-params "aq-mode=3:aq-strength=0.8:psy-rd=2.0:psy-rdoq=1.0:deblock=-1,-1:no-sao=1" -tag:v hvc1 -movflags +faststart -an hero.mp4
            webm: ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 1620k -vf scale=2560:-2 -svtav1-params preset=1:lookahead=120:keyint=80 -pass 1 -an -f null /dev/null && ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 1620k -vf scale=2560:-2 -svtav1-params preset=1:lookahead=120:keyint=80 -pass 2 -an -y hero.webm
        */}
        <BackgroundVideo
          poster={poster.src}
          preload="auto"
          videos={videos}
          sourceMedia="(min-width: 640px)"
          className="pointer-events-none absolute inset-0 hidden h-full w-full origin-top scale-[1.02] object-cover object-top sm:block"
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-91.5 bg-[linear-gradient(180deg,rgba(4,4,6,0)_19%,rgba(4,4,6,0.17)_45%,rgba(4,4,6,1)_89%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 -left-[16vw] hidden h-[26rem] w-[170vw] opacity-95 blur-2xl sm:-left-[10vw] sm:block sm:h-[27rem] sm:w-[140vw] md:-left-[8vw] md:h-[29rem] md:w-[124vw] lg:-left-[10vw] lg:h-[32rem] lg:w-[130vw]"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 132% 112% at 24% 100%, rgba(4, 4, 6, 0.9) 0%, rgba(4, 4, 6, 0.72) 46%, rgba(4, 4, 6, 0.32) 78%, rgba(4, 4, 6, 0.1) 90%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 container flex h-full flex-col justify-end pb-8 md:pb-12 lg:pb-14 xl:pb-16">
          <h1 className="max-w-70 font-display text-4xl leading-[1.125] font-normal whitespace-pre-wrap text-white sm:max-w-126 sm:text-5xl md:max-w-120 md:text-[2.625rem] lg:max-w-140 lg:text-[3.25rem] xl:max-w-176 xl:text-[4rem]">
            {title}
          </h1>

          <div className="mt-4 flex flex-col gap-7 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-5">
            <p className="max-w-80 text-sm leading-snug font-normal tracking-[-0.01em] whitespace-pre-wrap text-gray-60 sm:text-base md:max-w-93.75 lg:max-w-132.75">
              {description}
            </p>
            <div className="mt-1 flex w-full shrink-0 flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap md:mt-0">
              <Link href={primaryCta.href} variant="primary">
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                variant="secondary"
                target={isExternalLink(secondaryCta.href) ? '_blank' : undefined}
                rel={isExternalLink(secondaryCta.href) ? 'noopener noreferrer' : undefined}
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <Logos logos={logos} />
      </div>
    </section>
  );
}
