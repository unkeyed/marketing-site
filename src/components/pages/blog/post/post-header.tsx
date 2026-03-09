import Image from 'next/image';

import { IPost } from '@/types/blog';
import { cn } from '@/lib/utils';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import Authors from '@/components/pages/authors';
import Date from '@/components/pages/date';

interface IPostHeaderProps {
  className?: string;
  post: IPost;
}

function PostHeader({ className, post }: IPostHeaderProps) {
  const { title, authors, publishedAt, caption, readingTime, cover } = post;

  const breadcrumbItems = [{ label: 'Blog', href: '/blog' }, { label: title }];

  return (
    <header className={cn('post-header', className)}>
      <Breadcrumbs items={breadcrumbItems} showBackIconOnFirst />
      <h1 className="mt-2 font-display text-4xl leading-[1.125] font-normal whitespace-pre-line text-foreground md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
        {title}
      </h1>
      <p className="mt-5 text-lg leading-snug tracking-tight text-balance text-foreground/80 md:text-xl md:leading-snug lg:text-2xl lg:leading-snug">
        {caption}
      </p>
      {cover && (
        <div className="relative mt-10 mb-7 overflow-hidden bg-gray-8 after:pointer-events-none after:absolute after:inset-0 after:border after:border-border after:content-['']">
          <Image
            className="aspect-video w-full object-cover"
            src={cover}
            width={768}
            height={432}
            alt={title}
            quality={95}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1280px) 768px, 100vw"
          />
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <Authors authors={authors} size="xs" hideNamesOn={['sm']} />
        <div className="flex items-center">
          <Date className="font-normal" publishedAt={publishedAt} />
          <div className="mx-2 size-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
          <time
            className="text-[0.8125rem] leading-none font-normal tracking-tight text-muted-foreground"
            aria-label={`Read time: ${readingTime}`}
          >
            {readingTime}
          </time>
        </div>
      </div>
    </header>
  );
}

export default PostHeader;
