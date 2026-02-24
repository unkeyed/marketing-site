import Image from 'next/image';
import { cva } from 'class-variance-authority';

import { type ILogo } from '@/types/common';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface ILogosProps {
  className?: string;
  title?: string;
  logos: ILogo[];
  variant?: 'row' | 'column';
  gap?: 'default' | 'wide';
  showSeparator?: boolean;
  useMask?: boolean;
  animated?: boolean;
}

const logosVariants = cva('flex flex-col', {
  variants: {
    variant: {
      row: 'justify-between gap-x-8 gap-y-6 md:flex-row md:items-center lg:gap-x-12',
      column: 'gap-y-9',
    },
  },
  defaultVariants: {
    variant: 'column',
  },
});

const ulVariants = cva('flex items-center', {
  variants: {
    gap: {
      default: 'gap-x-9',
      wide: 'gap-x-9 md:gap-x-14 lg:gap-x-16 xl:gap-x-24',
    },
  },
  defaultVariants: {
    gap: 'default',
  },
});

/**
 * Logos component displays a row or column of logos with optional animation.
 *
 * - In 'row' variant, if there are more than 4 logos, animation is always enabled to prevent overflow.
 * - In 'column' variant, logos are stacked vertically and animation is optional.
 *
 * @component
 * @param {string} [className] - Additional CSS classes for the container.
 * @param {"default"|"wide"} [gap="default"] - Gap between logos.
 * @param {string} [title] - Title displayed above the logos.
 * @param {ILogo[]} logos - Array of logo objects to display.
 * @param {"row"|"column"} [variant="row"] - Layout variant: 'row' for horizontal, 'column' for vertical.
 * @param {boolean} [showSeparator=false] - Whether to show a separator after the title.
 * @param {boolean} [animated=true] - Enable animation. In 'row' variant with more than 4 logos, animation is always enabled.
 * @param {boolean} [useMask=true] - Whether to use a mask to hide edges of the logos.
 *
 * @example
 * // Horizontal row with animation (default)
 * <Logos logos={logos} />
 *
 * @example
 * // Vertical column without animation
 * <Logos logos={logos} variant="column" animated={false} />
 *
 * @example
 * // Horizontal row with custom title and separator
 * <Logos logos={logos} title="Our Partners" showSeparator />
 */
function Logos({
  className,
  title,
  logos,
  variant = 'row',
  gap = 'default',
  showSeparator = false,
  useMask = true,
  animated = true,
}: ILogosProps) {
  const canAnimate = (variant === 'row' && logos.length > 4) || (animated && logos.length > 4);

  return (
    <div className={cn(logosVariants({ variant }), className)}>
      {title && (
        <div className="flex items-center gap-x-2">
          <span
            className={cn(
              'flex text-base leading-snug font-medium tracking-tight text-pretty text-muted-foreground',
              variant === 'column' && 'shrink-0 whitespace-nowrap',
              variant === 'column' && !showSeparator && 'md:mx-auto',
            )}
          >
            {title}
          </span>
          {showSeparator && <Separator className="w-auto grow bg-muted" />}
        </div>
      )}

      <div
        className={cn(
          'logos grid grow',
          canAnimate && '-mx-4 w-[calc(100%+32px)] overflow-x-hidden md:mx-0 md:w-full',
          canAnimate &&
            useMask &&
            'mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]',
        )}
      >
        <div className={cn('flex w-full', canAnimate && 'h-6 animate-logos')}>
          <ul
            className={cn(
              'flex items-center',
              ulVariants({ gap }),
              {
                'flex-wrap justify-center gap-y-8': variant === 'column' && !canAnimate,
              },
              {
                'px-4': canAnimate && gap === 'default',
                'px-4 md:px-7 lg:px-8 xl:px-12': canAnimate && gap === 'wide',
              },
            )}
          >
            {logos.map(({ src, alt, width, height }, index) => (
              <li key={`logo_${index}`}>
                <Image
                  className="h-6 w-auto max-w-none shrink-0"
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  priority
                />
              </li>
            ))}
          </ul>
          {canAnimate && (
            <ul
              className={cn('flex items-center', ulVariants({ gap }), {
                'px-4': gap === 'default',
                'px-4 md:px-7 lg:px-8 xl:px-12': gap === 'wide',
              })}
              aria-hidden
            >
              {logos.map(({ src, alt, width, height }, index) => (
                <li key={`logo_${index}_duplicate`}>
                  <Image
                    className="h-6 w-auto max-w-none shrink-0"
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    priority
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logos;
