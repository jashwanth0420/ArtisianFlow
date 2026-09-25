'use client';
import { useEffect, useRef } from 'react';

export function PhaserBackground() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Phaser Game instance once
  useEffect(() => {
    let isMounted = true;
    
    // Dynamic import to avoid SSR issues with Phaser
    import('@/game/PhaserConfig').then(({ startGame }) => {
      if (isMounted && containerRef.current && !gameRef.current) {
        gameRef.current = startGame(containerRef.current);
      }
    });
    
    return () => { 
      isMounted = false;
      if (gameRef.current) {
        gameRef.current.destroy(true); 
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 transition-opacity duration-1000 opacity-100"
      style={{ pointerEvents: 'none' }}
    />
  );
}
