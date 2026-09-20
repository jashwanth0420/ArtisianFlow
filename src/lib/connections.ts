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

// Main connections — follows the new 8-node flow
// Nodes 3→4 and 3→5 are the branch, 4→6 and 5→6 are the merge
export const connections: Connection[] = [
  // N-00 ARTISAN → N-01 AI PRODUCT STUDIO
  { from: 'N-00', to: 'N-01', d: 'M 740 310 C 970 310, 970 150, 1200 150' },
  // N-01 AI PRODUCT STUDIO → N-02 MULTILINGUAL AI
  { from: 'N-01', to: 'N-02', d: 'M 1540 150 C 1770 150, 1770 430, 2000 430' },
  // N-02 MULTILINGUAL AI → N-03 SMART CATALOG ENGINE
  { from: 'N-02', to: 'N-03', d: 'M 2340 430 C 2620 430, 2620 160, 2900 160' },
  // N-03 SMART CATALOG ENGINE → N-04 DYNAMIC PRICING (branch up)
  { from: 'N-03', to: 'N-04', d: 'M 3300 160 C 3550 160, 3550 100, 3800 100' },
  // N-03 SMART CATALOG ENGINE → N-05 PRODUCT DISCOVERY (branch down)
  { from: 'N-03', to: 'N-05', d: 'M 3300 160 C 3550 160, 3550 520, 3800 520' },
  // N-04 DYNAMIC PRICING → N-06 DIGITAL MARKETPLACE (merge from top)
  { from: 'N-04', to: 'N-06', d: 'M 4140 100 C 4420 100, 4420 280, 4700 280' },
  // N-05 PRODUCT DISCOVERY → N-06 DIGITAL MARKETPLACE (merge from bottom)
  { from: 'N-05', to: 'N-06', d: 'M 4140 520 C 4420 520, 4420 280, 4700 280' },
  // N-06 DIGITAL MARKETPLACE → N-07 YEAR-ROUND MARKET ACCESS
  { from: 'N-06', to: 'N-07', d: 'M 5100 280 C 5350 280, 5350 290, 5600 290' },
];

// Connection index to scroll-stop mapping
// scrollStop 0 → conn 0 (N-00→N-01)
// scrollStop 1 → conn 1 (N-01→N-02)
// scrollStop 2 → conn 2 (N-02→N-03)
// scrollStop 3 → conn 3,4 (branch: N-03→N-04, N-03→N-05)
// scrollStop 4 → conn 5,6 (merge: N-04→N-06, N-05→N-06)
// scrollStop 5 → conn 7 (N-06→N-07)

export function getActiveConnectionIndices(scrollStop: number): number[] {
  switch (scrollStop) {
    case 0: return [0];
    case 1: return [1];
    case 2: return [2];
    case 3: return [3, 4]; // branch
    case 4: return [3, 4]; // both branches still visible
    case 5: return [5, 6]; // merge
    case 6: return [7];
    default: return [];
  }
}

// No satellites or data feeders in this flow
export const satelliteConnections: Connection[] = [];
export const dataFeederConnections: { d: string }[] = [];

// Feedback loop — from Year-Round Market Access back to Artisan
export const feedbackLoop: FeedbackLoop = {
  d: 'M 5830 560 C 5830 800, 5830 800, 3100 800 C 370 800, 370 800, 370 560',
  label: 'CONTINUOUS FEEDBACK — MARKET DATA INFORMS ARTISAN DECISIONS',
  labelX: 3100,
  labelY: 786,
};
