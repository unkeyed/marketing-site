import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPaginatedPosts, getTotalPages } from '@/lib/blog/posts';
import { getMetadata } from '@/lib/get-metadata';
import Pagination from '@/components/pages/blog/pagination';
import PostsList from '@/components/pages/blog/posts-lists--grid';

interface BlogPageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  if (currentPage === 1) {
    notFound();
  }

  const posts = getPaginatedPosts(currentPage, {
    nonFeaturedOnly: true,
  });
  const totalPages = getTotalPages();

  if (totalPages === 0 || totalPages < currentPage) {
    notFound();
  }

  return (
    <div className="flex min-w-0 flex-col">
      <h1 className="sr-only">Blog - page {currentPage}</h1>
      <PostsList posts={posts} />
      {totalPages > 1 && (
        <div className="mt-14 flex justify-center md:mt-20">
          <Pagination className="w-fit" currentPage={currentPage} pageCount={totalPages} />
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const totalPages = getTotalPages();
  const params = [];

  for (let page = 2; page <= totalPages; page++) {
    params.push({
      page: page.toString(),
    });
  }

  return params;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { page: pageNumber } = await params;
  const page = parseInt(pageNumber, 10);

  return getMetadata({
    title: 'Blog',
    description: 'Read the latest articles, news, and reviews on our blog',
    pathname: `/blog/page/${page}`,
  });
}
