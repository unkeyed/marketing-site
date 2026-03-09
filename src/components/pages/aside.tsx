'use client';

import { cn } from '@/lib/utils';

interface IAsideProps {
  className?: string;
  children: React.ReactNode;
  sticky?: boolean;
}

// TODO: hide scrollbar or add scrollAria
function Aside({ className, sticky = false, children }: IAsideProps) {
  return (
    <aside
      className={cn(
        'aside -my-10 h-fit max-h-svh overflow-auto py-10',
        !!sticky && 'sticky top-[var(--sticky-header-height)]',
        className,
      )}
    >
      {children}
    </aside>
  );
}

export default Aside;
