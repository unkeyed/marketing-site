'use client';

import { ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';

interface ICodeBlockWrapperProps {
  as?: 'figure' | 'div';
  className?: string;
  children?: ReactNode;
  fileName?: string;
  code: string;
}

function CodeBlockWrapper({
  as = 'figure',
  className = '',
  children,
  fileName,
  code,
}: ICodeBlockWrapperProps) {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  const isSingleLineCode = code.trim().split('\n').length <= 1;
  const Tag = as;

  return (
    <Tag
      className={cn(
        'code-block group h-fit w-full rounded-lg border border-border bg-background',
        className,
      )}
    >
      {fileName && (
        <div className="border-b border-border px-4 py-3.5 text-[0.8125rem] leading-snug font-medium tracking-tight break-words text-muted-foreground">
          {fileName}
        </div>
      )}
      <div className="relative">
        {children}
        <button
          className={cn(
            'code-block-copy-button absolute right-4 flex size-7 items-center justify-center rounded border border-border bg-popover text-muted-foreground',
            isSingleLineCode ? 'top-1/2 -translate-y-1/2' : 'top-4',
            'opacity-100 transition-[color,opacity] duration-300 hover:text-foreground/80 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100',
            isCopied && 'text-foreground/80',
          )}
          disabled={isCopied}
          aria-label={cn(isCopied ? 'Copied' : 'Copy')}
          onClick={() => handleCopy(code)}
        >
          {isCopied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </Tag>
  );
}

export default CodeBlockWrapper;
