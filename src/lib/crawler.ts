import { userAgentFromString } from 'next/server';

// Next.js `userAgent().isBot` matches Googlebot, Bingbot, and GPTBot, and misses
// several AI crawlers. These tokens close that gap. Matched as lowercase
// substrings of the User-Agent.
const CRAWLER_TOKENS = [
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'claudebot',
  'claude-searchbot',
  'claude-user',
  'claude-web',
  'anthropic-ai',
  'perplexitybot',
  'perplexity-user',
  'google-extended',
  'googleother',
  'google-agent',
  'googlebot',
  'adsbot-google',
  'mediapartners-google',
  'bingbot',
  'bingpreview',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'applebot',
  'bytespider',
  'ccbot',
  'amazonbot',
  'meta-externalagent',
  'meta-externalfetcher',
  'facebookbot',
  'facebookexternalhit',
  'cohere-ai',
  'cohere-training-data-crawler',
  'diffbot',
  'youbot',
  'ai2bot',
  'duckassistbot',
  'mistralai',
  'grokbot',
] as const;

export function isCrawlerUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  if (userAgentFromString(userAgent).isBot) return true;

  const ua = userAgent.toLowerCase();
  return CRAWLER_TOKENS.some((token) => ua.includes(token));
}
