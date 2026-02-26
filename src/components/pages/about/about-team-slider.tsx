'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const TEAM_SLIDER_ITEMS = [
  {
    id: '1',
    width: 460,
    caption: 'Cooking breakfast',
    imageSrc: '/images/about/team/breakfast.jpg',
    imageClassName: '',
  },
  {
    id: '2',
    width: 384,
    caption: 'Art intensifies',
    imageSrc: '/images/about/team/art_intensifies.jpg',
    imageClassName: '',
  },
  {
    id: '3',
    width: 340,
    caption: 'Hard at work',
    imageSrc: '/images/about/team/dom_thinking.jpg',
    imageClassName: '',
  },
  {
    id: '4',
    width: 460,
    caption: 'Lunch refuel',
    imageSrc: '/images/about/team/cooking_crew.jpg',
    imageClassName: '',
  },
  {
    id: '5',
    width: 460,
    caption: 'Golden hour',
    imageSrc: '/images/about/team/cto_prayers_answered.jpg',
    imageClassName: '',
  },
  {
    id: '6',
    width: 460,
    caption: 'Escape room W',
    imageSrc: '/images/about/team/doomsday.jpg',
    imageClassName: '',
  },
  {
    id: '7',
    width: 384,
    caption: 'James recruiting',
    imageSrc: '/images/about/team/james_fence.jpg',
    imageClassName: 'object-top sm:object-center',
  },
  {
    id: '8',
    width: 384,
    caption: 'Deep in thought',
    imageSrc: '/images/about/team/james_thinking.jpg',
    imageClassName: '',
  },
  {
    id: '9',
    width: 300,
    caption: 'CEO + CTO',
    imageSrc: '/images/about/team/mike_morning_neck_exercise.jpg',
    imageClassName: 'object-left',
  },
  {
    id: '10',
    width: 340,
    caption: 'Caffeinated',
    imageSrc: '/images/about/team/yardwork.jpg',
    imageClassName: '',
  },
] as const;

export default function AboutTeamSlider() {
  return (
    <Carousel
      className="relative mt-10 w-full md:mt-16"
      opts={{ loop: true, align: 'center' }}
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
                  'relative h-64 w-full shrink-0 overflow-hidden rounded-lg bg-muted md:h-80 xl:h-96',
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
              <figcaption className="font-mono text-[15px] leading-[1.375] font-medium text-muted-foreground">
                {item.caption}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
