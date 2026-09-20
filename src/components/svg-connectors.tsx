'use client';

import React from 'react';
import {
  connections,
  feedbackLoop,
  getActiveConnectionIndices,
} from '@/lib/connections';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/nodes';

interface SvgConnectorsProps {
  scrollStop: number;
}

export function SvgConnectors({ scrollStop }: SvgConnectorsProps) {
  const activeIndices = getActiveConnectionIndices(scrollStop);

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      {/* Feedback loop — dashed arc from last node back to first */}
      <path
        d={feedbackLoop.d}
        fill="none"
        stroke="var(--node-idle)"
        strokeWidth="1"
        strokeDasharray="2 10"
        opacity="0.25"
      />
      <text
        x={feedbackLoop.labelX}
        y={feedbackLoop.labelY}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize="12"
        letterSpacing="3"
        style={{ fontFamily: 'var(--font-mono)' }}
        opacity="0.35"
      >
        {feedbackLoop.label}
      </text>

      {/* Main connections */}
      {connections.map((conn, i) => {
        const isActive = activeIndices.includes(i);
        return (
          <g key={`conn-${i}`}>
            {/* Base path */}
            <path
              d={conn.d}
              fill="none"
              stroke="var(--node-idle)"
              strokeWidth="1"
            />
            {/* Animated overlay when active */}
            {isActive && (
              <>
                <path
                  d={conn.d}
                  fill="none"
                  stroke="var(--violet)"
                  strokeWidth="1.25"
                  strokeDasharray="1 9"
                  opacity="0.75"
                  className="animate-sc-dash"
                />
                <circle r="2.6" fill="var(--violet)">
                  <animateMotion
                    dur={`${2.5 + (i % 3) * 0.5}s`}
                    repeatCount="indefinite"
                    path={conn.d}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
