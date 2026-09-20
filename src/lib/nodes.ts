// ── Node data for the horizontal system map ──

export interface NodeData {
  id: string;
  nodeId: string;
  label: string;
  x: number;
  y: number;
  width: number;
  type: 'input' | 'process' | 'branch' | 'hub' | 'outcome';
}

export interface SatelliteData {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  width: number;
}

// Canvas constants
export const CANVAS_WIDTH = 6400;
export const CANVAS_HEIGHT = 900;
export const SCROLL_HEIGHT = 2400;

// 8 nodes — the flow from the diagram
// Nodes 4 & 5 (DYNAMIC PRICING + PRODUCT DISCOVERY) branch from node 3 and merge into node 6
export const nodes: NodeData[] = [
  {
    id: 'artisan',
    nodeId: 'N-00',
    label: 'ARTISAN',
    x: 400,
    y: 280,
    width: 340,
    type: 'input',
  },
  {
    id: 'ai-product-studio',
    nodeId: 'N-01',
    label: 'AI PRODUCT STUDIO',
    x: 1200,
    y: 120,
    width: 340,
    type: 'process',
  },
  {
    id: 'multilingual-ai',
    nodeId: 'N-02',
    label: 'MULTILINGUAL AI',
    x: 2000,
    y: 400,
    width: 340,
    type: 'process',
  },
  {
    id: 'smart-catalog-engine',
    nodeId: 'N-03',
    label: 'SMART CATALOG ENGINE',
    x: 2900,
    y: 130,
    width: 400,
    type: 'process',
  },
  {
    id: 'dynamic-pricing',
    nodeId: 'N-04',
    label: 'DYNAMIC PRICING',
    x: 3800,
    y: 70,
    width: 340,
    type: 'branch',
  },
  {
    id: 'product-discovery',
    nodeId: 'N-05',
    label: 'PRODUCT DISCOVERY',
    x: 3800,
    y: 490,
    width: 340,
    type: 'branch',
  },
  {
    id: 'digital-marketplace',
    nodeId: 'N-06',
    label: 'DIGITAL MARKETPLACE',
    x: 4700,
    y: 250,
    width: 400,
    type: 'hub',
  },
  {
    id: 'year-round-market-access',
    nodeId: 'N-07',
    label: 'YEAR-ROUND MARKET ACCESS',
    x: 5600,
    y: 260,
    width: 460,
    type: 'outcome',
  },
];

// No satellite nodes in this flow
export const satellites: SatelliteData[] = [];

// Scroll-stop mapping: nodes 4 & 5 are both active at scroll stop 4
// 7 scroll stops for 8 nodes
export const SCROLL_STOPS = 7;

// Maps a scroll-stop index to which node indices are active
export function getActiveNodeIndices(scrollStop: number): number[] {
  if (scrollStop <= 3) return [scrollStop];
  if (scrollStop === 4) return [4, 5]; // branch — both active
  if (scrollStop === 5) return [6];
  if (scrollStop === 6) return [7];
  return [0];
}

// Get display label for a scroll stop
export function getScrollStopLabel(scrollStop: number): string {
  if (scrollStop <= 3) return nodes[scrollStop].label;
  if (scrollStop === 4) return 'DYNAMIC PRICING · PRODUCT DISCOVERY';
  if (scrollStop === 5) return nodes[6].label;
  if (scrollStop === 6) return nodes[7].label;
  return nodes[0].label;
}
