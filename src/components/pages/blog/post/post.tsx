import { IPost } from '@/types/blog';
import ArticleWithSidebar from '@/components/pages/article-with-sidebar';
import BackToTop from '@/components/pages/back-to-top';
import PostHeader from '@/components/pages/blog/post/post-header';
import TableOfContents from '@/components/pages/table-of-contents';

interface IPostProps {
  className?: string;
  post: IPost;
}

function Post({ className, post }: IPostProps) {
  return (
    <ArticleWithSidebar
      className={className}
      header={<PostHeader post={post} />}
      content={post.content}
      contentClassName="prose-clear-first-child prose-lg"
      sidebar={
        <>
          <TableOfContents className="mt-2" title="On this page" items={post.tableOfContents} />
          <BackToTop withSeparator />
        </>
      }
    />
  );
}

export default Post;
