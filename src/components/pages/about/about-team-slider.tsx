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
    width: 518,
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
    imageClassName: '',
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
      className="relative mt-16 w-full"
      opts={{ loop: true, align: 'center' }}
      aria-label="Team photos"
    >
      <CarouselContent className="-ml-0 gap-5 pr-5 pl-5">
        {TEAM_SLIDER_ITEMS.map((item) => (
          <CarouselItem
            key={item.id}
            className={cn('flex basis-auto flex-col gap-[12px] pl-0')}
            style={{ minWidth: item.width }}
          >
            <figure className="flex flex-col gap-[12px]">
              <div
                className={cn('relative h-96 shrink-0 overflow-hidden rounded-lg bg-muted')}
                style={{ width: item.width }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.caption}
                  fill
                  className={cn('object-cover', item.imageClassName)}
                  sizes={`${item.width}px`}
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
