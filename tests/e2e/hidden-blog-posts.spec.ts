import { expect, test } from '@playwright/test';

const hiddenPosts = [
  {
    slug: 'git-push',
    title: 'How to Ship a Node.js API or Backend Without Managing Infrastructure',
    category: 'tutorials',
  },
  {
    slug: 'api-key-management-vs-gateway',
    title: 'A gateway is a weak default for API keys',
    category: 'tutorials',
  },
  {
    slug: 'unkey-vs-kong-zuplo-aws-api-gateway',
    title:
      'Unkey vs Kong, Zuplo, and AWS API Gateway: when you need a gateway (and when you don’t)',
    category: 'marketing',
  },
  {
    slug: 'best-serverless-api-hosting-2026',
    title: 'Best Serverless API Hosting in 2026: 5 Platforms Compared',
    category: 'marketing',
  },
] as const;

function selfCanonical(html: string, pathname: string) {
  const match = html.match(/<link rel="canonical" href="([^"]+)"/i);
  expect(match?.[1]?.replace(/\/$/, '')).toMatch(new RegExp(`${pathname}$`));
}

test('TC-E2E-010: hidden blog posts remain crawlable but absent from the blog feed', async ({
  page,
  request,
}) => {
  const [blogPage, blogIndex, llmsIndex] = await Promise.all([
    page.goto('/blog'),
    request.get('/blog.md'),
    request.get('/llms.txt'),
  ]);

  expect(blogPage?.ok()).toBeTruthy();
  expect(blogIndex.ok()).toBeTruthy();
  expect(llmsIndex.ok()).toBeTruthy();

  const [blogIndexBody, llmsIndexBody] = await Promise.all([blogIndex.text(), llmsIndex.text()]);

  await expect(page.locator('footer a[href="/blog/archive"]')).toHaveCount(1);
  await expect(page.locator('.categories-list a[href="/blog/archive"]')).toHaveCount(0);

  for (const post of hiddenPosts) {
    await expect(page.locator(`.posts-list--grid a[href="/blog/${post.slug}"]`)).toHaveCount(0);
    expect(blogIndexBody).toContain(post.title);
    expect(llmsIndexBody).toContain(post.title);
    expect(llmsIndexBody).toContain(`/blog/${post.slug}.md`);

    const [postResponse, markdownResponse, categoryResponse] = await Promise.all([
      request.get(`/blog/${post.slug}`),
      request.get(`/blog/${post.slug}.md`),
      request.get(`/blog/category/${post.category}`),
    ]);
    expect(postResponse.ok()).toBeTruthy();
    expect(markdownResponse.ok()).toBeTruthy();
    expect(categoryResponse.ok()).toBeTruthy();

    const postHtml = await postResponse.text();
    expect(postHtml).not.toContain('noindex');
    selfCanonical(postHtml, `/blog/${post.slug}`);
    expect(await markdownResponse.text()).toContain(post.title);
    expect(await categoryResponse.text()).not.toContain(`href="/blog/${post.slug}"`);
  }

  const archiveResponse = await request.get('/blog/archive');
  expect(archiveResponse.ok()).toBeTruthy();
  const archiveHtml = await archiveResponse.text();
  expect(archiveHtml).not.toContain('noindex');
  selfCanonical(archiveHtml, '/blog/archive');
  for (const post of hiddenPosts) {
    expect(archiveHtml).toContain(`href="/blog/${post.slug}"`);
  }
});
