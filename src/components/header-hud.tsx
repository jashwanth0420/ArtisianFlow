'use client';

import React from 'react';

interface HeaderHudProps {
  scrollStop: number;
  totalStops: number;
  activeLabel: string;
}

export function HeaderHud({ scrollStop, totalStops, activeLabel }: HeaderHudProps) {
  const pos = String(scrollStop + 1).padStart(2, '0');
  return (
    <header className="pointer-events-none fixed left-0 top-0 z-10 flex w-full items-start justify-between p-5">
      <div className="max-w-sm">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--violet)]">
          AI MARKET-LINKAGE SYSTEM
        </p>
        <h1 className="mt-1 text-pretty font-mono text-[13px] leading-relaxed tracking-wide text-muted-foreground">
          Empowering artisans with AI-driven cataloguing, pricing &amp; year-round market access.
        </h1>
      </div>
      <div className="text-right font-mono text-[10px] tracking-widest text-muted-foreground">
        <span className="text-foreground">POS {pos}</span>
        <span> / {String(totalStops).padStart(2, '0')}</span>
        <p className="mt-1 text-[var(--copper)]">{activeLabel}</p>
      </div>
    </header>
  );
}
