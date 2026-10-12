const PAGE_SCROLL_ID = 'page-scroll';

export function pageScrollTarget(): HTMLElement | Window {
  return document.getElementById(PAGE_SCROLL_ID) ?? window;
}

export function pageScrollTop(): number {
  const target = pageScrollTarget();
  return target instanceof Window ? target.scrollY : target.scrollTop;
}

export function pageScrollTo(options: ScrollToOptions) {
  pageScrollTarget().scrollTo(options);
}

/** Distance from the top of the scrolling content to the element's top edge. */
export function contentTop(element: HTMLElement): number {
  const target = pageScrollTarget();
  if (target instanceof Window) {
    return target.scrollY + element.getBoundingClientRect().top;
  }

  return (
    target.scrollTop + element.getBoundingClientRect().top - target.getBoundingClientRect().top
  );
}

export function subscribePageScroll(listener: () => void) {
  const target = pageScrollTarget();
  target.addEventListener('scroll', listener, { passive: true });
  return () => target.removeEventListener('scroll', listener);
}
