'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CANVAS_WIDTH, SCROLL_STOPS } from './nodes';
import { EventBus } from '@/game/EventBus';

const NODE_X_POSITIONS = [400, 1200, 2000, 2900, 3800, 4700, 5600];
const NODE_WIDTHS = [340, 340, 340, 400, 340, 400, 460];

function getTargetTx(stop: number, w: number, s: number) {
  const nodeCenter = NODE_X_POSITIONS[stop] + NODE_WIDTHS[stop] / 2;
  const viewportWidth = w / s;
  let tx = nodeCenter - viewportWidth / 2;
  return Math.max(0, Math.min(tx, CANVAS_WIDTH - viewportWidth));
}

// 28 seconds for a continuous, uninterrupted sequential flow across all 7 phases
const TOTAL_JOURNEY_MS = 28000;

export function useHorizontalScroll() {
  const [translateX, setTranslateX] = useState(0);
  const [scrollStop, setScrollStop] = useState(0);
  const [progress, setProgress] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const scrollStopRef = useRef(0);
  scrollStopRef.current = scrollStop;

  const isPlayingRef = useRef(true);
  isPlayingRef.current = isPlaying;

  const scaleRef = useRef(1);
  scaleRef.current = scale;

  const isMobileRef = useRef(false);
  isMobileRef.current = isMobile;

  // Timeline reference clock
  const journeyStartRef = useRef<number | null>(null);
  const pausedOffsetRef = useRef<number>(0);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      isMobileRef.current = mobile;

      const currentScale = mobile ? 1 : Math.max(0.75, Math.min(1, w / 1400));
      setScale(currentScale);
      scaleRef.current = currentScale;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Jump to specific stop along the continuous timeline
  const goToStop = useCallback((targetStop: number) => {
    const clamped = Math.max(0, Math.min(SCROLL_STOPS - 1, targetStop));
    const targetOffset = (clamped / (SCROLL_STOPS - 1)) * TOTAL_JOURNEY_MS;
    const now = performance.now();

    if (isPlayingRef.current) {
      journeyStartRef.current = now - targetOffset;
    } else {
      pausedOffsetRef.current = targetOffset;
    }

    setScrollStop(clamped);
    setProgress(clamped / (SCROLL_STOPS - 1));
    setStepProgress(0);
  }, []);

  const nextStep = useCallback(() => {
    const next = (scrollStopRef.current + 1) % SCROLL_STOPS;
    goToStop(next);
  }, [goToStop]);

  const prevStep = useCallback(() => {
    const prev = (scrollStopRef.current - 1 + SCROLL_STOPS) % SCROLL_STOPS;
    goToStop(prev);
  }, [goToStop]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      const now = performance.now();
      if (next) {
        // Resuming: sync journey start with the paused offset
        journeyStartRef.current = now - pausedOffsetRef.current;
      } else {
        // Pausing: record current offset
        if (journeyStartRef.current !== null) {
          pausedOffsetRef.current = (now - journeyStartRef.current) % TOTAL_JOURNEY_MS;
        }
      }
      return next;
    });
  }, []);

  // Continuous, uninterrupted 60fps sequential motion ticker
  useEffect(() => {
    let animId: number;
    let lastProgressTime = 0;
    let lastRenderedTx = -9999;
    let lastStop = -1;

    const tick = (now: number) => {
      if (journeyStartRef.current === null) {
        journeyStartRef.current = now;
      }

      const w = window.innerWidth;
      const s = scaleRef.current;
      const mobile = isMobileRef.current;

      let currentElapsed: number;
      if (isPlayingRef.current) {
        currentElapsed = (now - journeyStartRef.current) % TOTAL_JOURNEY_MS;
        pausedOffsetRef.current = currentElapsed;
      } else {
        currentElapsed = pausedOffsetRef.current;
      }

      // Continuous float progression (0.0 to 6.0 across all nodes)
      const overallProgress = currentElapsed / TOTAL_JOURNEY_MS;
      const floatStop = overallProgress * (SCROLL_STOPS - 1);
      const activeStop = Math.min(SCROLL_STOPS - 1, Math.round(floatStop));

      // Calculate continuous, smooth subpixel horizontal position
      const intStop = Math.floor(floatStop);
      const frac = floatStop - intStop;
      const txA = getTargetTx(intStop, w, s);
      const txB = getTargetTx(Math.min(SCROLL_STOPS - 1, intStop + 1), w, s);
      const smoothTx = txA + (txB - txA) * frac;

      // ─── Direct 60 FPS sync to Phaser (eliminates all jitter/flicker) ───
      EventBus.emit('sync-scroll', {
        stop: activeStop,
        tx: smoothTx,
        progress: overallProgress,
        scale: s,
        isMobile: mobile
      });

      // Update translateX in React for DOM nodes
      if (Math.abs(smoothTx - lastRenderedTx) > 0.4) {
        lastRenderedTx = smoothTx;
        setTranslateX(smoothTx);
      }

      // Update active stop indicator when crossing boundaries
      if (activeStop !== lastStop) {
        lastStop = activeStop;
        setScrollStop(activeStop);
      }

      // Throttle UI progress bar states to ~20fps to keep main thread light
      if (now - lastProgressTime > 50) {
        lastProgressTime = now;
        setProgress(overallProgress);
        setStepProgress(frac);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return {
    translateX,
    scrollStop,
    progress,
    stepProgress,
    scale,
    isMobile,
    isPlaying,
    togglePlay,
    nextStep,
    prevStep,
    goToStop
  };
}
