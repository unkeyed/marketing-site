import { cn } from '@/lib/utils';
import CopyButton from '@/components/pages/agents/copy-button';

interface ICodeSnippetProps {
  code: string;
  fileName?: string;
  wrap?: boolean;
  className?: string;
}

export default function CodeSnippet({
  code,
  fileName,
  wrap = false,
  className,
}: ICodeSnippetProps) {
  return (
    <figure className={cn('min-w-0 border border-gray-20 bg-gray-5', className)}>
      {fileName ? (
        <figcaption className="border-b border-gray-20 px-4 py-2.5 font-mono text-[0.8125rem] leading-snug text-gray-60">
          {fileName}
        </figcaption>
      ) : null}
      <div className="flex items-start">
        <pre
          className={cn(
            'min-w-0 flex-1 overflow-x-auto py-3.5 pr-3 pl-4 font-mono text-sm leading-6 text-gray-80',
            wrap ? 'break-words whitespace-pre-wrap' : 'whitespace-pre',
          )}
        >
          <code>{code}</code>
        </pre>
        <CopyButton text={code} className="m-2.5 ml-0 shrink-0" />
      </div>
    </figure>
  );
}
