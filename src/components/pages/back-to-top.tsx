'use client';

import { useEffect, useState } from 'react';
import { CircleArrowUp } from 'lucide-react';
import { AnimatePresence, domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import { pageScrollTo, pageScrollTop, subscribePageScroll } from '@/lib/page-scroll';
import { cn } from '@/lib/utils';

interface IScrollToTopProps {
  className?: string;
  withSeparator?: boolean;
  label?: string;
}

function BackToTop({ className, withSeparator = false, label = 'Back to top' }: IScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(pageScrollTop() > window.innerHeight);
    };

    const unsubscribe = subscribePageScroll(handleScroll);
    handleScroll();

    return unsubscribe;
  }, []);

  const handleClick = () => {
    pageScrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {visible ? (
          <>
            {withSeparator && (
              <m.span
                className="my-3.5 h-px w-full bg-border"
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="none"
              />
            )}
            <m.button
              className={cn(
                'flex w-fit items-center gap-2 rounded text-sm leading-snug tracking-tight text-muted-foreground transition-colors duration-300 hover:text-secondary-foreground/80',
                className,
              )}
              onClick={handleClick}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CircleArrowUp size={20} />
              {label}
            </m.button>
          </>
        ) : (
          <span className={cn('invisible h-5', className)} aria-hidden />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

export default BackToTop;
