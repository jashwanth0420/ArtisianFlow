// Data types for the system map

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
  x: number;
  y: number;
  parentId: string;
}

// Canvas constants
export const CANVAS_WIDTH = 6400;
export const CANVAS_HEIGHT = 800;
export const SCROLL_HEIGHT = 2400;

// 8 nodes — the flow from the diagram
// Configured with balanced vertical positioning (y: 110 - 330)
// so the entire flow fits completely inside the webpage viewport without clipping
export const nodes: NodeData[] = [
  {
    id: 'artisan',
    nodeId: 'N-00',
    label: 'ARTISAN',
    x: 400,
    y: 220,
    width: 340,
    type: 'input',
  },
  {
    id: 'ai-product-studio',
    nodeId: 'N-01',
    label: 'AI PRODUCT STUDIO',
    x: 1200,
    y: 160,
    width: 340,
    type: 'process',
  },
  {
    id: 'multilingual-ai',
    nodeId: 'N-02',
    label: 'MULTILINGUAL AI',
    x: 2000,
    y: 260,
    width: 340,
    type: 'process',
  },
  {
    id: 'smart-catalog-engine',
    nodeId: 'N-03',
    label: 'SMART CATALOG ENGINE',
    x: 2900,
    y: 160,
    width: 400,
    type: 'process',
  },
  {
    id: 'dynamic-pricing',
    nodeId: 'N-04',
    label: 'DYNAMIC PRICING',
    x: 3800,
    y: 105,
    width: 340,
    type: 'branch',
  },
  {
    id: 'product-discovery',
    nodeId: 'N-05',
    label: 'PRODUCT DISCOVERY',
    x: 3800,
    y: 330,
    width: 340,
    type: 'branch',
  },
  {
    id: 'digital-marketplace',
    nodeId: 'N-06',
    label: 'DIGITAL MARKETPLACE',
    x: 4700,
    y: 210,
    width: 400,
    type: 'hub',
  },
  {
    id: 'year-round-market-access',
    nodeId: 'N-07',
    label: 'YEAR-ROUND MARKET ACCESS',
    x: 5600,
    y: 220,
    width: 460,
    type: 'outcome',
  },
];

// No satellite nodes in this flow
export const satellites: SatelliteData[] = [];

// 7 scroll stops for 8 nodes
export const SCROLL_STOPS = 7;

// Mapping scrollStop (0-6) to active node indices
export function getActiveNodeIndices(scrollStop: number): number[] {
  switch (scrollStop) {
    case 0: return [0];       // N-00: Artisan
    case 1: return [1];       // N-01: AI Product Studio
    case 2: return [2];       // N-02: Multilingual AI
    case 3: return [3];       // N-03: Smart Catalog Engine
    case 4: return [4, 5];    // N-04 + N-05: Dynamic Pricing & Product Discovery (branch)
    case 5: return [6];       // N-06: Digital Marketplace
    case 6: return [7];       // N-07: Year-Round Market Access
    default: return [0];
  }
}

// Labels for HUD display at each scroll stop
export function getScrollStopLabel(scrollStop: number): string {
  switch (scrollStop) {
    case 0: return 'ARTISAN';
    case 1: return 'AI PRODUCT STUDIO';
    case 2: return 'MULTILINGUAL AI';
    case 3: return 'SMART CATALOG ENGINE';
    case 4: return 'DYNAMIC PRICING · PRODUCT DISCOVERY';
    case 5: return 'DIGITAL MARKETPLACE';
    case 6: return 'YEAR-ROUND MARKET ACCESS';
    default: return 'SYSTEM MAP';
  }
}
