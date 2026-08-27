import { useState, useEffect } from 'react';

export interface ScrollInfo {
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
  isScrolled: boolean;
  scrollProgress: number; // 0 to 1
}

export function useScrollDirection(threshold: number = 10): ScrollInfo {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollY: 0,
    scrollDirection: 'none',
    isScrolled: false,
    scrollProgress: 0,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(currentScrollY / docHeight, 0), 1) : 0;

      let direction: 'up' | 'down' | 'none' = 'none';

      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        direction = currentScrollY > lastScrollY ? 'down' : 'up';
      }

      setScrollInfo({
        scrollY: currentScrollY,
        scrollDirection: direction,
        isScrolled: currentScrollY > 20,
        scrollProgress: progress,
      });

      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrollInfo;
}
