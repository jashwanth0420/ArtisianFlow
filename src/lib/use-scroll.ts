'use client';

import { useState, useEffect } from 'react';
import { CANVAS_WIDTH, SCROLL_HEIGHT, SCROLL_STOPS } from './nodes';

export function useHorizontalScroll() {
  const [translateX, setTranslateX] = useState(0);
  const [scrollStop, setScrollStop] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScrollAndResize = () => {
      // 1. Calculate responsive scale
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Base design is ~1400px wide. Scale down for smaller screens.
      const currentScale = Math.max(0.3, Math.min(1, w / 1400));
      setScale(currentScale);

      // 2. Calculate translation
      const scrollY = window.scrollY;
      const maxScrollY = SCROLL_HEIGHT - h;
      
      const scrollFraction = maxScrollY > 0 ? Math.max(0, Math.min(1, scrollY / maxScrollY)) : 0;
      setProgress(scrollFraction);

      // The visible window width in local (unscaled) coordinates
      const localWindowWidth = w / currentScale;
      const maxTranslateX = Math.max(0, CANVAS_WIDTH - localWindowWidth);
      
      const currentTranslateX = scrollFraction * maxTranslateX;
      setTranslateX(currentTranslateX);

      // 3. Determine scroll stop (0 to SCROLL_STOPS - 1)
      const stopFraction = 1 / (SCROLL_STOPS - 1);
      let currentStop = Math.round(scrollFraction / stopFraction);
      currentStop = Math.max(0, Math.min(SCROLL_STOPS - 1, currentStop));
      setScrollStop(currentStop);
    };

    window.addEventListener('scroll', handleScrollAndResize, { passive: true });
    window.addEventListener('resize', handleScrollAndResize);
    
    // Initial call
    handleScrollAndResize();

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
    };
  }, []);

  return { translateX, scrollStop, progress, scale };
}
