import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getMetadata } from '@/lib/get-metadata';
import { Link } from '@/components/ui/link';
import Content from '@/components/pages/content';
import Date from '@/components/pages/date';

import { getAllChangelogEntries, getChangelogEntryBySlug } from '../data';

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

interface ChangelogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ChangelogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getChangelogEntryBySlug(slug);

  if (!post || (isProduction && post.isDraft)) {
    return {};
  }
  const { seo } = post;

  return getMetadata({
    title: seo.title,
    description: seo.description,
    pathname: `/changelog/${post.slug}`,
    imagePath: seo.socialImage,
    noIndex: seo.noIndex,
  });
}

export async function generateStaticParams() {
  const posts = await getAllChangelogEntries();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ChangelogPostPage({ params }: ChangelogPostPageProps) {
  const { slug } = await params;
  const post = await getChangelogEntryBySlug(slug);

  if (!post || (isProduction && post.isDraft)) {
    notFound();
  }
  const { title, publishedAt, readingTime, content } = post;

  return (
    <main className="pb-12 md:pb-14 lg:pb-16 xl:pb-24">
      <section className="pt-8 pb-12 md:pt-11 md:pb-14 lg:py-16 xl:pb-24">
        <div className="mx-auto w-full max-w-3xl px-5 md:px-8">
          <article>
            <div className="flex items-center">
              <Link className="group gap-x-1 leading-none" href="/changelog">
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                <span className="sr-only">Back to</span> Changelog
              </Link>
              <span className="mx-2.5 text-sm leading-none font-medium tracking-tight text-muted-foreground">
                /
              </span>
              <p className="flex items-center gap-x-2">
                <Date publishedAt={publishedAt} />
                <span className="size-1 shrink-0 rounded-full bg-muted-foreground" />
                <time
                  className="text-[0.8125rem] leading-none font-semibold tracking-tight text-muted-foreground"
                  aria-label={`Read time: ${readingTime}`}
                >
                  {readingTime}
                </time>
              </p>
            </div>
            <h1 className="md:leading-tighter lg:leading-tighter mt-5 text-3xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {title}
            </h1>

            <Content
              className="prose-clear-first-child prose-lg mt-6 md:mt-7 lg:mt-8"
              content={content}
            />
          </article>
        </div>
      </section>
    </main>
  );
}
