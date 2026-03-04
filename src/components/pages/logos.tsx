import Image from 'next/image';

import { type ILogo } from '@/types/common';
import { cn } from '@/lib/utils';

type TLogoItem = ILogo & {
  wrapperClassName?: string;
  imageClassName?: string;
};

interface ILogosProps {
  logos: TLogoItem[];
  className?: string;
  animated?: boolean;
}
function Logos({ logos, className, animated = true }: ILogosProps) {
  const shouldAnimate = animated && logos.length > 0;

  return (
    <div
      className={cn(
        '-mx-5 overflow-hidden pt-8 pb-6 md:-mx-8 lg:mx-0 lg:overflow-visible lg:pt-12 lg:pb-10.5',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max lg:w-full',
          shouldAnimate &&
            'animate-[logos_30s_linear_infinite] will-change-transform motion-reduce:animate-none lg:animate-none lg:will-change-auto',
        )}
      >
        <ul className="flex shrink-0 items-center gap-6 pr-6 lg:w-full lg:justify-between lg:gap-0 lg:pr-0">
          {logos.map(({ src, alt, width, height, wrapperClassName, imageClassName }, index) => (
            <li key={`logo_${index}`} className={cn('relative shrink-0 overflow-hidden', wrapperClassName)}>
              <Image
                className={cn('h-full w-full', imageClassName)}
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority
              />
            </li>
          ))}
        </ul>

        {shouldAnimate && (
          <ul className="flex shrink-0 items-center gap-6 pr-6 lg:hidden" aria-hidden="true">
            {logos.map(({ src, alt, width, height, wrapperClassName, imageClassName }, index) => (
              <li
                key={`logo_${index}_duplicate`}
                className={cn('relative shrink-0 overflow-hidden', wrapperClassName)}
              >
                <Image
                  className={cn('h-full w-full', imageClassName)}
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Logos;
