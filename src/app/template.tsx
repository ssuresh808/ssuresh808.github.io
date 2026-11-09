'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Wraps each page. Remounts on navigation, so it runs the entrance animation and
 * wires the reveal-on-scroll observer for the elements of the new page.
 */
export default function Template({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('js');
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
    );
    targets.forEach((el) => observer.observe(el));
    // Safety net: whatever has not scrolled into view yet becomes visible anyway after a few seconds.
    const fallback = window.setTimeout(() => targets.forEach((el) => el.classList.add('is-visible')), 2500);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
