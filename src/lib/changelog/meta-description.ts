/** Target length for generated changelog meta descriptions, including the ellipsis. */
const META_DESCRIPTION_LENGTH = 155;
const ELLIPSIS = '...';

interface IChangelogMetaDescriptionInput {
  metaDescription?: unknown;
  summary?: unknown;
  description?: unknown;
  seoDescription?: unknown;
  body: string;
}

function normalizeExplicitDescription(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > 0 ? normalized : undefined;
}

/**
 * Turns changelog markdown into plain text for a search snippet.
 * Drops code, components, images, and link URLs, and keeps link labels.
 */
export function stripChangelogMarkdown(markdown: string): string {
  return markdown
    .replace(/\r\n/g, '\n')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/!\[[^\]]*]\[[^\]]*]/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)]\[[^\]]*]/g, '$1')
    .replace(/^\s*\[[^\]]+]:\s+\S+\s*$/gm, ' ')
    .replace(/<https?:\/\/[^>\s]+>/g, ' ')
    .replace(/<\/?[A-Za-z][\s\S]*?>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*_]{3,}\s*$/gm, ' ')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*import\s+.+$/gm, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|\W)\*([^*]+)\*(?=\W|$)/g, '$1$2')
    .replace(/(^|\W)_([^_]+)_(?=\W|$)/g, '$1$2')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Trims plain text to about 155 characters on a word boundary.
 * Adds an ellipsis only when text was cut. Never splits a word.
 */
export function trimChangelogMetaDescription(
  text: string,
  maxLength = META_DESCRIPTION_LENGTH,
): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;

  const budget = Math.max(1, maxLength - ELLIPSIS.length);
  let end = budget;

  if (end < normalized.length && !/\s/.test(normalized[end] ?? '')) {
    const previousSpace = normalized.lastIndexOf(' ', end - 1);
    if (previousSpace <= 0) {
      const nextSpace = normalized.indexOf(' ');
      end = nextSpace === -1 ? normalized.length : nextSpace;
    } else {
      end = previousSpace;
    }
  }

  const trimmed = normalized
    .slice(0, end)
    .replace(/[.,:;]+$/g, '')
    .trimEnd();
  if (!trimmed || trimmed.length >= normalized.length) return normalized;
  return `${trimmed}${ELLIPSIS}`;
}

/**
 * Resolves the changelog meta description.
 * Prefers `metaDescription`, then summary, description, or `seo.description`.
 * Otherwise builds one from the markdown body.
 */
export function resolveChangelogMetaDescription(input: IChangelogMetaDescriptionInput): string {
  const explicit =
    normalizeExplicitDescription(input.metaDescription) ??
    normalizeExplicitDescription(input.summary) ??
    normalizeExplicitDescription(input.description) ??
    normalizeExplicitDescription(input.seoDescription);

  if (explicit) return explicit;
  return trimChangelogMetaDescription(stripChangelogMarkdown(input.body));
}
