'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CANVAS_WIDTH, SCROLL_STOPS } from './nodes';

const NODE_X_POSITIONS = [400, 1200, 2000, 2900, 3800, 4700, 5600];
const NODE_WIDTHS = [340, 340, 340, 400, 340, 400, 460];

function getTargetTx(stop: number, w: number, s: number) {
  const nodeCenter = NODE_X_POSITIONS[stop] + NODE_WIDTHS[stop] / 2;
  const viewportWidth = w / s;
  let tx = nodeCenter - viewportWidth / 2;
  return Math.max(0, Math.min(tx, CANVAS_WIDTH - viewportWidth));
}

const STEP_DURATION = 5500; // 5.5 seconds per node reading time
const PAN_DURATION = 1400;  // 1.4 seconds pan transition

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

  const phaseStartRef = useRef<number | null>(null);
  const isPanningRef = useRef(false);
  const panFromTxRef = useRef(0);
  const panToTxRef = useRef(0);
  const panStartRef = useRef(0);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);

      // On desktop, scale gently; on mobile, scale is 1 since we render custom mobile layout
      const currentScale = mobile ? 1 : Math.max(0.75, Math.min(1, w / 1400));
      setScale(currentScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Jump to specific stop
  const goToStop = useCallback((targetStop: number) => {
    const clamped = Math.max(0, Math.min(SCROLL_STOPS - 1, targetStop));
    const w = window.innerWidth;
    const currentTx = getTargetTx(scrollStopRef.current, w, scaleRef.current);
    const targetTx = getTargetTx(clamped, w, scaleRef.current);

    panFromTxRef.current = currentTx;
    panToTxRef.current = targetTx;
    panStartRef.current = performance.now();
    isPanningRef.current = true;

    setScrollStop(clamped);
    setProgress(clamped / (SCROLL_STOPS - 1));
    setStepProgress(0);
    phaseStartRef.current = performance.now();
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
    setIsPlaying(prev => !prev);
  }, []);

  // Main animation ticker
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (!phaseStartRef.current) phaseStartRef.current = now;

      const w = window.innerWidth;

      // 1. Handling Pan Animation
      if (isPanningRef.current) {
        const panElapsed = now - panStartRef.current;
        const panT = Math.min(1, panElapsed / PAN_DURATION);
        // Smooth sine ease in-out
        const ease = -(Math.cos(Math.PI * panT) - 1) / 2;
        const currentTx = panFromTxRef.current + (panToTxRef.current - panFromTxRef.current) * ease;
        setTranslateX(currentTx);

        if (panT >= 1) {
          isPanningRef.current = false;
          phaseStartRef.current = now; // Reset step timer after pan finishes
        }
      } else {
        // Steady on current node
        const currentTx = getTargetTx(scrollStopRef.current, w, scaleRef.current);
        setTranslateX(currentTx);

        if (isPlayingRef.current) {
          const stepElapsed = now - (phaseStartRef.current || now);
          const ratio = Math.min(1, stepElapsed / STEP_DURATION);
          setStepProgress(ratio);

          // Once duration completes, advance to next
          if (stepElapsed >= STEP_DURATION) {
            const nextStop = (scrollStopRef.current + 1) % SCROLL_STOPS;
            const nextTx = getTargetTx(nextStop, w, scaleRef.current);

            panFromTxRef.current = currentTx;
            panToTxRef.current = nextTx;
            panStartRef.current = now;
            isPanningRef.current = true;

            setScrollStop(nextStop);
            setProgress(nextStop / (SCROLL_STOPS - 1));
            setStepProgress(0);
          }
        }
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
    goToStop,
  };
}
