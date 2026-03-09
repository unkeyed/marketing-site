import path from 'path';

import { Route } from 'next';
import config from '@/configs/website-config';
import { authors as authorsList } from '@/content/blog/taxonomy/authors';
import { categories } from '@/content/blog/taxonomy/categories';
import { globSync } from 'glob';

import { IBlogSearchItem, ICategory, INewPostFrontmatter, IPost, IPostData } from '@/types/blog';
import { compileMdx, readAndParseMarkdown, removeMarkdownSymbols } from '@/lib/markdown';
import { toAbsoluteSiteUrl } from '@/lib/site-url';
import { getExcerpt, getTimeToRead } from '@/lib/utils';

const POSTS_PER_PAGE = config.blog.postsPerPage;
const BLOG_DIR_PATH = path.join(process.cwd(), config.blog.contentDir);

function toCategorySlug(tag: string): string {
  return tag.toLowerCase().trim();
}

function toCategory(cat: (typeof categories)[0]): ICategory {
  return {
    ...cat,
    url: `/blog/category/${cat.slug.current}` as Route<string>,
  };
}

/**
 * Resolves an array of tag slugs (from frontmatter) into category objects.
 * Uses first category as primary for backward compatibility.
 */
function transformCategories(tagSlugs: string[]): ICategory[] {
  const result: ICategory[] = [];

  for (const raw of tagSlugs) {
    const slug = toCategorySlug(raw);
    const matched = categories.find((c) => c.slug.current === slug);
    if (!matched) {
      throw new Error(`Unknown category "${raw}" (slug: ${slug}).`);
    }
    result.push(toCategory(matched));
  }

  return result;
}

/**
 * Retrieves post slugs from blog MDX files in the content directory root.
 *
 * @returns {string[]} Array of post slugs (filename without .mdx).
 */
function getPostSlugsByPath(globPattern: string, ignore: string[] = []): string[] {
  const files = globSync(globPattern, {
    cwd: BLOG_DIR_PATH,
    ignore: ['**/CONTRIBUTING.md', ...ignore],
    absolute: true,
  });

  return files.map((filePath: string) => {
    const relativePath = path.relative(BLOG_DIR_PATH, filePath);
    return relativePath.replace(/\.mdx?$/, '');
  });
}

/**
 * Retrieves a single blog post meta by its slug.
 *
 * @param {string} slug               The post slug (MDX filename without the `.mdx` extension).
 * @returns {IPostData | null} Meta data of the post or `null` if the file does not exist.
 */
function getPostDataBySlug(slug: string): IPostData | null {
  try {
    const filePath = path.join(BLOG_DIR_PATH, `${slug}.mdx`);
    const { data, content } = readAndParseMarkdown<INewPostFrontmatter>(filePath);

    if (!data) {
      console.error(`Post not found: ${slug}`);
      return null;
    }

    const {
      title,
      date,
      image,
      description,
      author,
      tags,
      isFeatured = false,
      isDraft = false,
    } = data;
    const normalizedImage = image?.trim();
    const publishedAt = date ? new Date(date).toISOString() : new Date().toISOString();
    const categorySlugs = tags && tags.length > 0 ? tags : ['uncategorized'];
    const categoriesResolved = transformCategories(categorySlugs);
    const category = categoriesResolved[0]!;

    const matchedAuthor = authorsList.find((a) => a.id === author);
    if (!matchedAuthor) {
      throw new Error(`Unknown author "${author}".`);
    }
    const resolvedAuthors = [matchedAuthor];

    const plainContent = removeMarkdownSymbols(content);
    const readingTime = getTimeToRead(plainContent);

    const post: IPostData = {
      slug: { current: slug },
      pathname: `/blog/${slug}`,
      title,
      authors: resolvedAuthors,
      cover: normalizedImage,
      isFeatured: Boolean(isFeatured),
      isDraft: Boolean(isDraft),
      publishedAt,
      caption: description ?? '',
      content,
      category,
      categories: categoriesResolved,
      readingTime,
      seo: {
        title,
        description: description ?? getExcerpt({ content: plainContent, length: 160 }),
        socialImage:
          normalizedImage && normalizedImage.startsWith('http')
            ? normalizedImage
            : normalizedImage
              ? toAbsoluteSiteUrl(normalizedImage)
              : toAbsoluteSiteUrl(
                  `/api/og?template=blog&title=${encodeURIComponent(title)}`,
                ),
        noIndex: Boolean(isDraft),
      },
    };

    return post;
  } catch (error) {
    console.error(`Error fetching the post by slug: ${slug}`, error);
    return null;
  }
}

/**
 * Retrieves a single blog post from the local markdown directory by its slug.
 * The markdown file is parsed together with its front-matter and converted
 * to the internal `IPost` representation that the rest of
 * the application expects.
 *
 * @param {string} slug               The post slug (markdown filename without the `.md` extension).
 * @returns {Promise<IPost | null>} The parsed post or `null` if the file does not exist.
 */
async function getPostBySlug(slug: string): Promise<IPost | null> {
  try {
    const postData = getPostDataBySlug(slug);

    if (!postData) {
      return null;
    }

    const relatedPosts = getAllPosts();

    const { content: compiledMdx, toc: tableOfContents } = await compileMdx(postData.content, {
      relatedPosts,
    });

    const post = {
      ...postData,
      content: compiledMdx,
      tableOfContents,
    };

    return post;
  } catch (error) {
    console.error(`Error fetching the post by slug: ${slug}`, error);
    return null;
  }
}

/**
 * Returns **all** blog posts from the blog content directory.
 * The result is ordered from newest to oldest by the `publishedAt` date.
 *
 * @returns {IPostData[]} Sorted array of all posts.
 */
function getAllPosts(): IPostData[] {
  const slugs = getPostSlugsByPath('*.mdx');
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  const posts = slugs.map((s) => getPostDataBySlug(s));

  const filtered = posts
    .filter((p): p is IPostData => Boolean(p))
    .filter((p) => !(isProduction && p.isDraft));

  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return filtered;
}

/**
 * Collects a unique list of categories that are referenced by the available posts.
 *
 * @returns {ICategory[]} Array of category objects with url.
 */
function getCategories(): ICategory[] {
  const posts = getAllPosts();
  const usedCategorySlugs = new Set<string>();
  for (const post of posts) {
    for (const c of post.categories) {
      usedCategorySlugs.add(c.slug.current);
    }
  }

  return categories
    .filter((cat) => usedCategorySlugs.has(cat.slug.current))
    .map((cat) => toCategory(cat));
}

/**
 * Returns a single category by slug.
 * If no such category is found, the function returns `null`.
 *
 * @param {string} slug               The category slug to search for.
 * @returns {ICategory | null} Category object or `null` if not found.
 */
function getCategoryBySlug(slug: string): ICategory | null {
  const cats = getCategories();
  return cats.find((cat) => cat.slug.current === slug) || null;
}

/**
 * Returns all posts that belong to the specified category.
 *
 * @param {string} slug               The category slug.
 * @returns {IPostData[]} Array of posts that belong to the specified category.
 */
function getPostsByCategory(slug: string): IPostData[] {
  return getAllPosts().filter((post) => post.categories.some((c) => c.slug.current === slug));
}

/**
 * Retrieves all featured blog posts.
 *
 * @returns {IPostData[] | null} Array of featured posts or `null` if no featured posts exist.
 */
function getFeaturedPost(): IPostData[] | null {
  const posts = getAllPosts().filter((post) => post.isFeatured);
  return posts.length > 0 ? posts : null;
}

/**
 * Returns counts of total and non-featured posts.
 *
 * @returns {{total: number, nonFeatured: number}} Object containing total and non-featured post counts.
 */
function getPostCounts(): {
  total: number;
  nonFeatured: number;
} {
  const allPosts = getAllPosts();
  return {
    total: allPosts.length,
    nonFeatured: allPosts.filter((post) => !post.isFeatured).length,
  };
}

/**
 * Returns counts of total and non-featured posts for a specific category.
 *
 * @param {string} slug              The category slug.
 * @returns {{total: number, nonFeatured: number}} Object containing total and non-featured post counts for the category.
 */
function getPostCountsByCategory(slug: string): {
  total: number;
  nonFeatured: number;
} {
  const posts = getPostsByCategory(slug);
  return {
    total: posts.length,
    nonFeatured: posts.filter((post) => !post.isFeatured).length,
  };
}

/**
 * Calculates the total number of pages needed for blog pagination.
 *
 * @returns {number} Total number of pages required for pagination.
 */
function getTotalPages(): number {
  const { nonFeatured } = getPostCounts();
  if (nonFeatured <= 1) return nonFeatured;
  return Math.ceil(nonFeatured / POSTS_PER_PAGE);
}

/**
 * Calculates the total number of pages needed for category pagination.
 *
 * @param {string} slug              The category slug.
 * @returns {number} Total number of pages required for category pagination.
 */
function getTotalPagesByCategory(slug: string): number {
  const { nonFeatured } = getPostCountsByCategory(slug);
  if (nonFeatured <= 1) return nonFeatured;
  return Math.ceil(nonFeatured / POSTS_PER_PAGE);
}

/**
 * Retrieves a paginated slice of blog posts.
 *
 * @param {number} [page=1]                        The page number (1-indexed).
 * @param {object} [options]                       Additional options for filtering.
 * @param {boolean} [options.nonFeaturedOnly]      If true, excludes featured posts from results.
 * @returns {IPostData[]} Array of posts for the specified page.
 */
function getPaginatedPosts(page = 1, options?: { nonFeaturedOnly?: boolean }): IPostData[] {
  const posts = options?.nonFeaturedOnly
    ? getAllPosts().filter((p) => !p.isFeatured)
    : getAllPosts();

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  return posts.slice(start, end);
}

/**
 * Retrieves a paginated slice of blog posts from a specific category.
 *
 * @param {string} slug                            The category slug.
 * @param {number} [page=1]                        The page number (1-indexed).
 * @param {object} [options]                       Additional options for filtering.
 * @param {boolean} [options.nonFeaturedOnly]      If true, excludes featured posts from results.
 * @returns {IPostData[]} Array of posts from the category for the specified page.
 */
function getPaginatedPostsByCategory(
  slug: string,
  page = 1,
  options?: { nonFeaturedOnly?: boolean },
): IPostData[] {
  const postsInCategory = getPostsByCategory(slug);
  const filtered = options?.nonFeaturedOnly
    ? postsInCategory.filter((p) => !p.isFeatured)
    : postsInCategory;

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  return filtered.slice(start, end);
}

const BLOG_SEARCH_CONTENT_MAX_LENGTH = 3000;

/**
 * Returns a lightweight search index of all blog posts for the search dialog.
 * Includes title, caption, pathname, and optional plain-text content for full-text search.
 */
function getBlogSearchItems(): IBlogSearchItem[] {
  const posts = getAllPosts();
  return posts.map((post) => {
    const plainContent = removeMarkdownSymbols(post.content);
    const searchableText =
      plainContent.length > BLOG_SEARCH_CONTENT_MAX_LENGTH
        ? plainContent.slice(0, BLOG_SEARCH_CONTENT_MAX_LENGTH)
        : plainContent;
    return {
      id: post.slug.current,
      title: post.title,
      description: post.caption,
      url: post.pathname,
      category: 'blog' as const,
      searchableText,
    };
  });
}

const BLOG_SEARCH_SUGGESTIONS_LIMIT = 8;

/**
 * Returns the latest N posts as suggestions for the search dialog (when query is empty).
 */
function getBlogSearchSuggestions(limit = BLOG_SEARCH_SUGGESTIONS_LIMIT): IBlogSearchItem[] {
  const posts = getAllPosts();
  return posts.slice(0, limit).map((post) => ({
    id: post.slug.current,
    title: post.title,
    description: post.caption,
    url: post.pathname,
    category: 'blog' as const,
  }));
}

export {
  getPostDataBySlug,
  getPostBySlug,
  getAllPosts,
  getCategories,
  getCategoryBySlug,
  getFeaturedPost,
  getPostsByCategory,
  getPostCounts,
  getPostCountsByCategory,
  getTotalPages,
  getTotalPagesByCategory,
  getPaginatedPosts,
  getPaginatedPostsByCategory,
  getBlogSearchItems,
  getBlogSearchSuggestions,
};
