import type { ReactNode } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface IBlogCard {
  href: string;
  imageSrc: string;
  imageAlt: string;
  category: string;
  date: string;
  title: string;
  authorAvatars?: string[];
}

export interface IBlogProps {
  label: string;
  heading: ReactNode;
  ctaLabel: string;
  ctaHref: string;
  cards: IBlogCard[];
}

function BlogCard({ card }: { card: IBlogCard }) {
  return (
    <NextLink href={card.href} className="group flex min-w-0 flex-1 flex-col gap-3">
      <div
        className={cn(
          'relative aspect-[448/252] w-full overflow-hidden border border-gray-20 bg-gray-8',
        )}
      >
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
          <span className="font-sans text-[14px] font-medium tracking-[-0.35px]">
            {card.category}
          </span>
          <span className="flex items-center gap-2 font-sans text-[13px] font-medium tracking-[-0.325px] uppercase">
            <span className="size-1 rounded-full bg-muted-foreground" />
            {card.date}
          </span>
        </div>
        <p className="font-sans text-lg leading-[1.375] font-medium text-foreground">
          {card.title}
        </p>
      </div>
    </NextLink>
  );
}

export default function Blog({ label, heading, ctaLabel, ctaHref, cards }: IBlogProps) {
  return (
    <section className="border-t border-gray-20">
      <div className="container py-12 md:py-20 xl:pt-50 xl:pb-0">
        <div className="flex flex-col gap-8 md:gap-10 xl:flex-row xl:items-end xl:justify-between xl:gap-16">
          <div className="flex flex-col gap-6 md:gap-8">
            <Label>{label}</Label>
            <h2 className="max-w-[767px] font-display text-3xl leading-[1.125] text-foreground sm:text-4xl xl:text-[44px]">
              {heading}
            </h2>
          </div>
          <Button
            asChild
            className="w-full shrink-0 rounded-none px-5 py-2.5 text-base sm:w-fit xl:w-auto"
          >
            <NextLink href={ctaHref}>{ctaLabel}</NextLink>
          </Button>
        </div>

        <ul
          className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-2 xl:mt-16 xl:grid-cols-3 xl:gap-8"
          role="list"
        >
          {cards.map((card) => (
            <li key={card.title}>
              <BlogCard card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
