import { changelogDescription } from '@/constants/changelog';
import { homeContentData } from '@/constants/home';

import { getMetadata } from '@/lib/get-metadata';
import ChangelogHero from '@/components/pages/changelog/hero--changelog';
import PostsList from '@/components/pages/changelog/posts-list';
import Cta from '@/components/pages/home/cta';

import { getPaginatedChangelogEntries } from './data';

export const metadata = getMetadata({
  title: 'Changelog',
  description: 'Read the latest changelog',
  pathname: '/changelog',
});

export default async function ChangelogPage() {
  const currentPage = 1;
  const paginationData = await getPaginatedChangelogEntries(currentPage);

  if (!paginationData || paginationData.posts.length === 0) {
    return (
      <main className="pb-12 md:pb-14 lg:pb-16 xl:pb-24">
        <ChangelogHero title="Changelog" description={changelogDescription} />
        <section className="mx-auto w-full max-w-3xl px-5 py-12 md:px-8 md:py-16">
          <p className="text-center text-muted-foreground">No changelog entries found yet.</p>
        </section>
      </main>
    );
  }

  const { posts, hasOlder } = paginationData;

  return (
    <main className="pb-12 md:pb-14 lg:pb-16 xl:pb-24">
      <ChangelogHero title="Changelog" description={changelogDescription} />

      <PostsList posts={posts} currentPage={currentPage} hasNewer={false} hasOlder={hasOlder} />
      <Cta {...homeContentData.cta} />
    </main>
  );
}
