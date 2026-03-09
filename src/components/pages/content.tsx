import type { ReactElement } from 'react';

import { cn } from '@/lib/utils';

interface IContentProps {
  className?: string;
  content: ReactElement;
}

function Content({ className, content }: IContentProps) {
  return <div className={cn('content prose max-w-none', className)}>{content}</div>;
}

export default Content;
