import { expect, test } from '@playwright/test';

const hiddenPosts = [
  {
    slug: 'git-push',
    title: 'How to Ship a Node.js API or Backend Without Managing Infrastructure',
  },
  {
    slug: 'api-key-management-vs-gateway',
    title: 'A gateway is a weak default for API keys',
  },
] as const;

test('TC-E2E-010: hidden blog posts remain crawlable but absent from the blog feed', async ({
  request,
}) => {
  const [blogPage, blogIndex, llmsIndex] = await Promise.all([
    request.get('/blog'),
    request.get('/blog.md'),
    request.get('/llms.txt'),
  ]);

  expect(blogPage.ok()).toBeTruthy();
  expect(blogIndex.ok()).toBeTruthy();
  expect(llmsIndex.ok()).toBeTruthy();

  const [blogPageBody, blogIndexBody, llmsIndexBody] = await Promise.all([
    blogPage.text(),
    blogIndex.text(),
    llmsIndex.text(),
  ]);

  for (const post of hiddenPosts) {
    expect(blogPageBody).not.toContain(post.title);
    expect(blogIndexBody).toContain(post.title);
    expect(llmsIndexBody).toContain(post.title);
    expect(llmsIndexBody).toContain(`/blog/${post.slug}.md`);

    const [postResponse, markdownResponse] = await Promise.all([
      request.get(`/blog/${post.slug}`),
      request.get(`/blog/${post.slug}.md`),
    ]);
    expect(postResponse.ok()).toBeTruthy();
    expect(markdownResponse.ok()).toBeTruthy();
    expect(await postResponse.text()).not.toContain('noindex');
    expect(await markdownResponse.text()).toContain(post.title);
  }
});
