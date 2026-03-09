import Image from 'next/image';
import NextLink from 'next/link';

import { type IPostData } from '@/types/blog';
import { cn, getFormattedDate } from '@/lib/utils';
import Authors from '@/components/pages/authors';

interface IPostCardProps {
  className?: string;
  post: IPostData;
}

function PostCard({ className, post }: IPostCardProps) {
  const { cover, authors, category, publishedAt, title, pathname, caption } = post;

  return (
    <article className={cn('flex flex-col gap-y-5', className)}>
      {cover && (
        <NextLink
          className="group relative block overflow-hidden bg-background after:pointer-events-none after:absolute after:inset-0 after:border after:border-border after:content-['']"
          href={pathname}
        >
          <Image
            className="aspect-video w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            src={cover}
            width={448}
            height={252}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt={title}
            quality={95}
          />
        </NextLink>
      )}
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-2">
          <NextLink
            className="text-[0.8125rem] leading-none font-medium tracking-tight text-gray-70 uppercase transition-colors hover:text-foreground"
            href={category ? `/blog/category/${category.slug.current}` : '/blog'}
          >
            {category ? category.title : 'General'}
          </NextLink>
          <div className="size-1 shrink-0 rounded-full bg-gray-40" aria-hidden />
          <time
            className="text-[0.8125rem] leading-none font-medium tracking-tight whitespace-nowrap text-gray-70 uppercase"
            dateTime={publishedAt}
          >
            {getFormattedDate(publishedAt)}
          </time>
        </div>
        <div className="flex flex-col gap-y-3">
          <h2>
            <NextLink
              className="line-clamp-2 text-2xl leading-snug font-medium tracking-tight text-foreground transition-colors hover:text-foreground/80"
              href={pathname}
            >
              {title}
            </NextLink>
          </h2>
          {caption && (
            <p className="line-clamp-2 text-lg leading-snug tracking-tight text-muted-foreground">
              {caption}
            </p>
          )}
          <Authors className="mt-1" authors={authors} size="xs" />
        </div>
      </div>
    </article>
  );
}

export default PostCard;
