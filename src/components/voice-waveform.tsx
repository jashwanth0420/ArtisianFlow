'use client';

import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  barCount?: number;
}

export function VoiceWaveform({ isActive, barCount = 34 }: VoiceWaveformProps) {
  return (
    <div className="flex h-10 items-center gap-[3px]" aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => (
        <span
          key={i}
          className="w-[2px] flex-1 rounded-full bg-[var(--violet)]"
          style={{
            height: '100%',
            transformOrigin: 'center',
            opacity: isActive ? 0.8 : 0.3,
            animation: isActive ? `sc-waveform ${0.4 + (i % 5) * 0.15}s ease-in-out ${(i % 3) * 0.2}s infinite` : 'none',
            transform: isActive ? undefined : 'scaleY(0.25)',
          }}
        />
      ))}
    </div>
  );
}
