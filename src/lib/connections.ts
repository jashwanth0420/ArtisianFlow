// ── SVG connection paths between nodes ──

export interface Connection {
  from: string;
  to: string;
  d: string;
}

export interface FeedbackLoop {
  d: string;
  label: string;
  labelX: number;
  labelY: number;
}

// Main connections — follows the 8-node flow with perfectly calibrated endpoints
export const connections: Connection[] = [
  // N-00 ARTISAN (740, 250) → N-01 AI PRODUCT STUDIO (1200, 190)
  { from: 'N-00', to: 'N-01', d: 'M 740 250 C 970 250, 970 190, 1200 190' },
  // N-01 AI PRODUCT STUDIO (1540, 190) → N-02 MULTILINGUAL AI (2000, 290)
  { from: 'N-01', to: 'N-02', d: 'M 1540 190 C 1770 190, 1770 290, 2000 290' },
  // N-02 MULTILINGUAL AI (2340, 290) → N-03 SMART CATALOG ENGINE (2900, 190)
  { from: 'N-02', to: 'N-03', d: 'M 2340 290 C 2620 290, 2620 190, 2900 190' },
  // N-03 SMART CATALOG ENGINE (3300, 190) → N-04 DYNAMIC PRICING (3800, 135) [branch up]
  { from: 'N-03', to: 'N-04', d: 'M 3300 190 C 3550 190, 3550 135, 3800 135' },
  // N-03 SMART CATALOG ENGINE (3300, 190) → N-05 PRODUCT DISCOVERY (3800, 360) [branch down]
  { from: 'N-03', to: 'N-05', d: 'M 3300 190 C 3550 190, 3550 360, 3800 360' },
  // N-04 DYNAMIC PRICING (4140, 135) → N-06 DIGITAL MARKETPLACE (4700, 240) [merge from top]
  { from: 'N-04', to: 'N-06', d: 'M 4140 135 C 4420 135, 4420 240, 4700 240' },
  // N-05 PRODUCT DISCOVERY (4140, 360) → N-06 DIGITAL MARKETPLACE (4700, 240) [merge from bottom]
  { from: 'N-05', to: 'N-06', d: 'M 4140 360 C 4420 360, 4420 240, 4700 240' },
  // N-06 DIGITAL MARKETPLACE (5100, 240) → N-07 YEAR-ROUND MARKET ACCESS (5600, 250)
  { from: 'N-06', to: 'N-07', d: 'M 5100 240 C 5350 240, 5350 250, 5600 250' },
];

export function getActiveConnectionIndices(scrollStop: number): number[] {
  switch (scrollStop) {
    case 0: return [0];
    case 1: return [1];
    case 2: return [2];
    case 3: return [3, 4]; // branch
    case 4: return [3, 4]; // both branches active
    case 5: return [5, 6]; // merge
    case 6: return [7];
    default: return [];
  }
}

export const satelliteConnections: Connection[] = [];
export const dataFeederConnections: { d: string }[] = [];

// Feedback loop — calibrated to stay gracefully within the viewport
export const feedbackLoop: FeedbackLoop = {
  d: 'M 5830 430 C 5830 550, 5830 550, 3100 550 C 370 550, 370 550, 370 430',
  label: 'CONTINUOUS FEEDBACK — MARKET DATA INFORMS ARTISAN DECISIONS',
  labelX: 3100,
  labelY: 536,
};
