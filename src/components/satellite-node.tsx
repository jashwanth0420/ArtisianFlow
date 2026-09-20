'use client';

import React from 'react';

interface SatelliteNodeProps {
  label: string;
  sublabel: string;
  x: number;
  y: number;
  width: number;
  isActive: boolean;
}

export function SatelliteNode({ label, sublabel, x, y, width, isActive }: SatelliteNodeProps) {
  return (
    <div
      className="absolute transition-all duration-500"
      style={{ left: x, top: y, width, opacity: isActive ? 0.7 : 0.3 }}
    >
      <div
        className="rounded-sm border bg-card/70 px-3 py-2 backdrop-blur-sm"
        style={{ borderColor: 'var(--border)', boxShadow: 'none' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--node-idle)' }} />
          <span className="font-mono text-[11px] tracking-[0.18em] text-foreground">{label}</span>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  );
}
