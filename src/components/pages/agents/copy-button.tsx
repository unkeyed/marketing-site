'use client';

import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard';

export default function CopyButton({ text, className }: { text: string; className?: string }) {
  const { isCopied, handleCopy } = useCopyToClipboard(3000);

  return (
    <button
      type="button"
      className={cn(
        'flex size-7 items-center justify-center border border-gray-30 bg-background text-gray-60 transition-colors duration-200 hover:text-white',
        isCopied && 'text-white',
        className,
      )}
      aria-label={isCopied ? 'Copied' : 'Copy'}
      onClick={() => handleCopy(text)}
    >
      {isCopied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
