import { Metadata } from 'next';
import config from '@/configs/website-config';

import { getPaginatedPosts, getTotalPages } from '@/lib/blog/posts';
import { getMetadata } from '@/lib/get-metadata';
import Pagination from '@/components/pages/blog/pagination';
import PostsList from '@/components/pages/blog/posts-lists--grid';

export default async function BlogPage() {
  const currentPage = 1;
  const posts = getPaginatedPosts(currentPage, {
    nonFeaturedOnly: true,
  });
  const totalPages = getTotalPages();

  if (totalPages === 0) {
    return (
      <div className="flex min-w-0 flex-col">
        <p className="text-lg tracking-tight text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col">
      <PostsList posts={posts} />
      {totalPages > 1 && (
        <div className="mt-14 flex justify-center md:mt-20">
          <Pagination className="w-fit" currentPage={currentPage} pageCount={totalPages} />
        </div>
      )}
    </div>
  );
}

export const metadata: Metadata = getMetadata({
  title: `Blog | ${config.projectName}`,
  description: 'Read the latest articles, news, and reviews on our blog',
  pathname: '/blog',
});
