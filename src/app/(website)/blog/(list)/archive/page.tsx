import { Metadata } from 'next';

import { getHiddenPosts } from '@/lib/blog/posts';
import { getMetadata } from '@/lib/get-metadata';
import PostsList from '@/components/pages/blog/posts-lists--grid';

export default function BlogArchivePage() {
  const posts = getHiddenPosts();

  if (posts.length === 0) {
    return (
      <div className="flex min-w-0 flex-col">
        <h2 className="sr-only">Blog archive</h2>
        <p className="text-lg tracking-tight text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col">
      <h2 className="sr-only">Blog archive</h2>
      <PostsList posts={posts} />
    </div>
  );
}

export const metadata: Metadata = getMetadata({
  title: 'Archive',
  description: 'More articles from the Unkey team.',
  pathname: '/blog/archive',
});
