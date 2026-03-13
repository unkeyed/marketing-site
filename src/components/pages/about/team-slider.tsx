'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import artIntensifiesImage from '@/assets/images/about/team/art-intensifies.jpg';
import breakfastImage from '@/assets/images/about/team/breakfast.jpg';
import cookingCrewImage from '@/assets/images/about/team/cooking-crew.jpg';
import ctoPrayersAnsweredImage from '@/assets/images/about/team/cto-prayers-answered.jpg';
import domThinkingImage from '@/assets/images/about/team/dom-thinking.jpg';
import doomsdayImage from '@/assets/images/about/team/doomsday.jpg';
import jamesFenceImage from '@/assets/images/about/team/james-fence.jpg';
import jamesThinkingImage from '@/assets/images/about/team/james-thinking.jpg';
import mikeMorningNeckExerciseImage from '@/assets/images/about/team/mike-morning-neck-exercise.jpg';
import yardworkImage from '@/assets/images/about/team/yardwork.jpg';
import AutoScroll from 'embla-carousel-auto-scroll';

import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const TEAM_SLIDER_ITEMS = [
  {
    id: '7',
    width: 340,
    caption: 'James recruiting',
    imageSrc: jamesFenceImage.src,
    imageClassName: 'object-top sm:object-center',
  },
  {
    id: '4',
    width: 518,
    caption: 'Lunch refuel',
    imageSrc: cookingCrewImage.src,
    imageClassName: '',
  },
  {
    id: '9',
    width: 300,
    caption: 'CEO + CTO',
    imageSrc: mikeMorningNeckExerciseImage.src,
    imageClassName: 'object-left',
  },
  {
    id: '3',
    width: 340,
    caption: 'Hard at work',
    imageSrc: domThinkingImage.src,
    imageClassName: '',
  },

  {
    id: '5',
    width: 460,
    caption: 'Golden hour',
    imageSrc: ctoPrayersAnsweredImage.src,
    imageClassName: '',
  },
  {
    id: '6',
    width: 460,
    caption: 'Escape room W',
    imageSrc: doomsdayImage.src,
    imageClassName: '',
  },
  {
    id: '8',
    width: 384,
    caption: 'Deep in thought',
    imageSrc: jamesThinkingImage.src,
    imageClassName: '',
  },
  {
    id: '10',
    width: 340,
    caption: 'Caffeinated',
    imageSrc: yardworkImage.src,
    imageClassName: '',
  },
  {
    id: '2',
    width: 460,
    caption: 'Art intensifies',
    imageSrc: artIntensifiesImage.src,
    imageClassName: '',
  },
  {
    id: '1',
    width: 384,
    caption: 'Cooking breakfast',
    imageSrc: breakfastImage.src,
    imageClassName: '',
  },
] as const;

export default function TeamSlider() {
  const plugins = useMemo(
    () => [
      AutoScroll({
        playOnInit: true,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
        speed: 1.2,
        startDelay: 0,
      }),
    ],
    [],
  );

  return (
    <Carousel
      className="relative mt-10 w-full md:mt-16"
      tabIndex={0}
      opts={{ loop: true, align: 'center' }}
      plugins={plugins}
      aria-label="Team photos"
    >
      <CarouselContent className="-ml-0 gap-4 pr-5 pl-5 md:gap-5">
        {TEAM_SLIDER_ITEMS.map((item) => (
          <CarouselItem
            key={item.id}
            className={cn(
              'flex basis-auto flex-col gap-3 pl-0',
              'w-[calc(100vw-2.5rem)] min-w-0 sm:w-[var(--item-width)] md:min-w-[var(--item-width)]',
            )}
            style={{ ['--item-width' as string]: `${item.width}px` }}
          >
            <figure className="flex w-full flex-col gap-3">
              <div
                className={cn(
                  'relative h-64 w-full shrink-0 overflow-hidden bg-muted md:h-80 xl:h-96',
                )}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.caption}
                  fill
                  className={cn('object-cover', item.imageClassName)}
                  sizes="(max-width: 768px) calc(100vw - 2.5rem), 460px"
                />
              </div>
              <figcaption className="font-mono text-[0.9375rem] leading-[1.375] font-medium text-muted-foreground">
                {item.caption}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
