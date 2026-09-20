'use client';

import React from 'react';

interface ScrollProgressProps {
  progress: number; // 0 to 1
}

export function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 z-10 w-full px-5 pb-5">
      <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
        <span>ARTISAN</span>
        <span className="animate-sc-blink">SCROLL TO TRAVEL →</span>
        <span>YEAR-ROUND MARKET ACCESS</span>
      </div>
      <div className="h-px w-full bg-border">
        <div
          className="h-px bg-[var(--violet)] transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
