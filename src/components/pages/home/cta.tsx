import { BackgroundVideo } from '@/components/ui/background-video';
import { Link } from '@/components/ui/link';

interface ICtaProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
  poster: string;
  videos: { src: string; type: string }[];
}

export default function Cta({
  heading,
  subheading,
  buttonLabel,
  buttonHref,
  poster,
  videos,
}: ICtaProps) {
  return (
    <section className="relative h-[clamp(26.25rem,94vw,28.75rem)] overflow-hidden bg-panel sm:h-[31.25rem] md:h-130 lg:h-[32.5rem] xl:h-[34.125rem]">
      {/* 
          ffmpeg parameters: 
          mp4: ffmpeg -i input.mov -c:v libx265 -crf 20 -pix_fmt yuv420p10le -vf scale=2560:-2 -preset veryslow -x265-params tune=animation -tag:v hvc1 -movflags faststart -an hero.mp4
          webm: ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 620k -vf scale=2560:-2 -svtav1-params preset=1:lookahead=120:keyint=80 -pass 1 -an -f null /dev/null && ffmpeg -i input.mov -c:v libsvtav1 -pix_fmt yuv420p10le -b:v 620k -vf scale=2560:-2 -svtav1-params preset=1:lookahead=120:keyint=80 -pass 2 -an -y hero.webm
      */}

      <BackgroundVideo
        poster={poster}
        videos={videos}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="relative z-10 container flex h-full flex-col pt-12 pb-10 sm:pt-14 sm:pb-11 md:pt-16 md:pb-12.75 lg:pb-14 xl:pb-12.75">
        <h2 className="max-w-144 font-display text-[1.75rem] leading-[1.125] text-white sm:text-[1.875rem] md:text-[2rem]">
          {heading}
        </h2>
        <p className="max-w-144 font-display text-[1.75rem] leading-[1.125] text-gray-60 sm:text-[1.875rem] md:text-[2rem]">
          {subheading}
        </p>
        <Link href={buttonHref} className="mt-auto w-fit lg:mt-13 xl:mt-auto">
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
