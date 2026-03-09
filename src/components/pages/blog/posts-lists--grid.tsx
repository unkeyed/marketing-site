import { type IPostData } from '@/types/blog';
import { cn } from '@/lib/utils';

import PostCard from './post-card';

interface IPostsListProps {
  className?: string;
  posts: IPostData[];
}

function PostsList({ className, posts }: IPostsListProps) {
  return (
    <section
      className={cn('posts-list--grid grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2', className)}
    >
      {posts.map((post) => (
        <PostCard key={post.slug.current} post={post} />
      ))}
    </section>
  );
}

export default PostsList;
