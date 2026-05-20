import { cn } from '@/lib/utils';
import { toAbsoluteSiteUrl } from '@/lib/site-url';
import { TrackingLink } from '@/components/ui/tracking-link';

interface IExploreWithAIProps {
  className?: string;
  slug: string;
  title: string;
}

interface IServiceIconProps {
  className?: string;
}

function ChatGPTIcon({ className }: IServiceIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      role="img"
    >
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function ClaudeIcon({ className }: IServiceIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      role="img"
    >
      <path d="M4.709 15.955l4.72-2.647.079-.23-.079-.128h-.23l-.79-.048-2.695-.073-2.337-.097-2.265-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.388-1.618-2.586-1.71-1.354-.984-.733-.499-.37-.468-.16-1.025.667-.733.898.061.228.062.91.7 1.945 1.505 2.538 1.869.371.31.149-.105.018-.075-.166-.276-1.377-2.49-1.47-2.534-.654-1.047-.171-.626a3 3 0 01-.105-.74L7.918.094 8.34 0l1.013.135.426.371.628 1.434 1.018 2.264 1.58 3.08.462.913.246.846.093.256h.16V9.18l.129-1.731.244-2.119.236-2.728.082-.768.387-.93.771-.51.6.288.493.703-.069.45-.293 1.907-.574 2.974-.375 1.99h.219l.25-.249 1.013-1.345 1.7-2.123.75-.84.872-.93.563-.444h1.064l.782 1.166-.35 1.205-1.1 1.392-.908 1.179-1.301 1.749-.812 1.4.075.111.194-.02 2.946-.625 1.591-.286 1.896-.326.857.4.094.407-.337.833-2.025.499-2.375.475-3.537.836-.043.031.05.063 1.595.149.683.037h1.673l3.115.235.811.534.486.66-.08.5-1.241.633-1.676-.398-3.911-.93-1.342-.334h-.187v.11l1.117 1.092 2.061 1.853 2.574 2.396.131.589-.328.464-.345-.05-2.236-1.682-.864-.756-1.954-1.643h-.131v.175l.448.659 2.385 3.582.123 1.099-.176.358-.629.221-.689-.126-1.418-1.984-1.464-2.239-1.181-2.008-.144.083-.7 7.532-.328.385-.754.287-.629-.476-.332-.772.332-1.52.4-1.984.328-1.575.295-1.957.176-.65-.014-.045-.144.018-1.482 2.034-2.252 3.044-1.785 1.91-.428.169-.74-.385.067-.685.415-.61 2.475-3.143 1.495-1.953.961-1.122-.011-.169h-.06L4.456 19.13l-1.288.165-.555-.524.067-.853.263-.275 2.183-1.5z" />
    </svg>
  );
}

function PerplexityIcon({ className }: IServiceIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      role="img"
    >
      <path d="M19.785 0v7.272H22.5V17.62h-2.935V24l-7.037-6.194v6.145h-1.091v-6.152L4.392 24v-6.465H1.5V7.188h2.884V0l7.053 6.494V.19h1.09v6.49L19.786 0zm-7.257 9.044v7.319l5.946 5.234V14.44l-5.946-5.397zm-1.099-.08l-5.946 5.398v7.235l5.946-5.234V8.965zm8.136 7.58h1.844V8.349H13.46l6.105 5.54v2.655zm-8.982-8.28H2.59v8.195h1.8v-2.576l6.192-5.62zM5.475 2.476v4.71h5.115l-5.115-4.71zm13.219 0l-5.115 4.71h5.115v-4.71z" />
    </svg>
  );
}

function ExploreWithAI({ className, slug, title }: IExploreWithAIProps) {
  const markdownUrl = toAbsoluteSiteUrl(`/blog/${slug}.md`);
  const prompt = `Read this blog post by Unkey and help me explore it: "${title}" — ${markdownUrl}`;
  const encoded = encodeURIComponent(prompt);

  const services = [
    {
      name: 'ChatGPT',
      href: `https://chatgpt.com/?hints=search&q=${encoded}`,
      Icon: ChatGPTIcon,
    },
    {
      name: 'Claude',
      href: `https://claude.ai/new?q=${encoded}`,
      Icon: ClaudeIcon,
    },
    {
      name: 'Perplexity',
      href: `https://www.perplexity.ai/?q=${encoded}`,
      Icon: PerplexityIcon,
    },
  ] as const;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-y border-border py-4 md:flex-row md:items-center md:justify-between md:gap-6',
        className,
      )}
    >
      <span className="text-[0.8125rem] leading-none font-semibold tracking-tight whitespace-nowrap text-muted-foreground uppercase">
        Explore with AI
      </span>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {services.map(({ name, href, Icon }) => (
          <TrackingLink
            key={name}
            variant="muted"
            size="none"
            className="h-auto gap-2 text-[0.8125rem] font-medium tracking-tight"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            trackEvent="blog open in llm"
            trackProperties={{ service: name, slug }}
          >
            <Icon className="size-4 shrink-0" />
            Open in {name}
          </TrackingLink>
        ))}
      </div>
    </div>
  );
}

export default ExploreWithAI;
