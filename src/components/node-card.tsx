'use client';

import React from 'react';

interface NodeCardProps {
  nodeId: string;      
  label: string;       
  isActive: boolean;
  accentColor?: string; 
  x: number;
  y: number;
  width: number;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function NodeCard({ nodeId, label, isActive, accentColor = 'var(--node-idle)', x, y, width, children, icon }: NodeCardProps) {
  const dotColor = isActive ? accentColor : 'var(--node-idle)';
  const borderColor = isActive ? accentColor : 'var(--border)';
  const shadowStyle = isActive
    ? `0 0 0 1px ${accentColor}33, 0 0 44px -14px ${accentColor}`
    : 'none';

  return (
    <div
      className="absolute transition-all duration-700 ease-out group z-10"
      style={{ 
        left: x, 
        top: y, 
        width, 
        opacity: isActive ? 1 : 0.4, 
        transform: isActive ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)' 
      }}
    >
      <div
        className="relative overflow-hidden rounded-xl border bg-card/80 backdrop-blur-md transition-all duration-500 hover:bg-card hover:-translate-y-1 hover:shadow-2xl"
        style={{ borderColor, boxShadow: shadowStyle }}
      >
        {/* Subtle background glow based on accent color */}
        {isActive && (
           <div 
             className="absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-10 blur-3xl pointer-events-none transition-opacity duration-1000 group-hover:opacity-30"
             style={{ background: accentColor }}
           />
        )}
        
        <header className="flex items-center gap-3 border-b border-border/60 px-4 py-3 bg-black/30">
          <span
            className={`h-2.5 w-2.5 rounded-full ${isActive ? 'animate-sc-blink shadow-sm' : ''}`}
            style={{ 
              background: dotColor, 
              boxShadow: isActive ? `0 0 8px ${dotColor}` : 'none' 
            }}
          />
          <div className="flex items-center gap-2">
            {icon && (
              <span 
                style={{ color: isActive ? accentColor : 'var(--muted-foreground)' }} 
                className="transition-colors duration-500 flex items-center justify-center"
              >
                {icon}
              </span>
            )}
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{nodeId}</span>
          </div>
          <span className="ml-auto font-sans text-[11px] font-bold tracking-wider text-foreground uppercase">{label}</span>
        </header>
        <div className="px-4 py-4 space-y-1.5 relative z-10">{children}</div>
      </div>
    </div>
  );
}
