import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { changelogDescription } from '@/constants/changelog';

import {
  getAllChangelogPosts,
  getPaginatedChangelogPosts,
  POSTS_PER_PAGE,
} from '@/lib/changelog/posts';
import { getMetadata } from '@/lib/get-metadata';
import ChangelogHero from '@/components/pages/changelog/hero--changelog';
import PostsList from '@/components/pages/changelog/posts-list';

interface ChangelogPaginatedPageProps {
  params: Promise<{
    page: string;
  }>;
}

export async function generateStaticParams() {
  const allPosts = await getAllChangelogPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const paths = [];
  for (let i = 2; i <= totalPages; i++) {
    paths.push({ page: i.toString() });
  }
  return paths;
}

export default async function ChangelogPaginatedPage({ params }: ChangelogPaginatedPageProps) {
  const pageNumber = parseInt((await params).page, 10);

  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const paginationData = await getPaginatedChangelogPosts(pageNumber);

  if (!paginationData) {
    notFound();
  }

  const { posts: postsToShow, currentPage, hasNewer, hasOlder } = paginationData;

  return (
    <main className="pb-12 md:pb-14 lg:pb-16 xl:pb-24">
      <ChangelogHero
        title="Changelog"
        description={changelogDescription}
        pageNumber={currentPage}
      />

      <PostsList
        posts={postsToShow}
        currentPage={currentPage}
        hasNewer={hasNewer}
        hasOlder={hasOlder}
      />
    </main>
  );
}

export async function generateMetadata({ params }: ChangelogPaginatedPageProps): Promise<Metadata> {
  const pageParam = (await params).page;
  const page = parseInt(pageParam, 10);

  return getMetadata({
    title: `Changelog - Page ${page}`,
    description: 'Read the latest changelog',
    pathname: `/changelog/page/${pageParam}`,
  });
}
