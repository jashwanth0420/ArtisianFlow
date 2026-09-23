'use client';

import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { SCROLL_STOPS } from '@/lib/nodes';

interface ScrollProgressProps {
  progress: number; // 0 to 1
  stepProgress?: number;
  scrollStop: number;
  isPlaying?: boolean;
  togglePlay?: () => void;
  nextStep?: () => void;
  prevStep?: () => void;
  goToStop?: (index: number) => void;
}

export function ScrollProgress({ 
  progress, 
  stepProgress = 0,
  scrollStop,
  isPlaying = true, 
  togglePlay, 
  nextStep, 
  prevStep, 
  goToStop 
}: ScrollProgressProps) {
  return (
    <div className="fixed bottom-0 left-0 z-10 w-full px-6 pb-5 pointer-events-auto">
      <div className="mb-2.5 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="text-foreground/90 font-bold">ARTISAN WORKSHOP</span>
          {togglePlay && (
            <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
              <button 
                onClick={prevStep}
                className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                title="Previous phase"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={togglePlay}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-foreground flex items-center gap-1.5 transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                <span className="text-[9px] uppercase">{isPlaying ? "PAUSE" : "PLAY"}</span>
              </button>
              <button 
                onClick={nextStep}
                className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                title="Next phase"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Step dots */}
        {goToStop && (
          <div className="flex items-center gap-2">
            {Array.from({ length: SCROLL_STOPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToStop(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === scrollStop 
                    ? 'w-6 bg-[var(--violet)] shadow-sm shadow-[var(--violet)]' 
                    : i < scrollStop 
                      ? 'w-2 bg-white/40' 
                      : 'w-2 bg-white/15 hover:bg-white/30'
                }`}
                title={`Jump to step ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="animate-pulse text-emerald-400">●</span>
          <span>YEAR-ROUND MARKET ACCESS</span>
        </div>
      </div>

      {/* Progress track */}
      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--violet)] transition-all duration-150 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
