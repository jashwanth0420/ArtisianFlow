'use client';

import React from 'react';
import { useHorizontalScroll } from '@/lib/use-scroll';
import { nodes, getActiveNodeIndices, getScrollStopLabel, SCROLL_STOPS, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/nodes';
import { NodeCard } from '@/components/node-card';
import { SvgConnectors } from '@/components/svg-connectors';
import { HeaderHud } from '@/components/header-hud';
import { ScrollProgress } from '@/components/scroll-progress';
import { Vignette } from '@/components/vignette';
import { MobileSystemView } from '@/components/mobile-system-view';
import { 
  UserRound, 
  WandSparkles, 
  Languages, 
  Cpu, 
  TrendingUp, 
  Telescope, 
  Store, 
  Globe 
} from 'lucide-react';
import { PhaserBackground } from '@/components/PhaserBackground';

export function SystemCanvas() {
  const { 
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
  } = useHorizontalScroll();

  const activeIndices = getActiveNodeIndices(scrollStop);
  const activeLabel = getScrollStopLabel(scrollStop);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* Phaser 2D Story Animation Background */}
      <PhaserBackground />

      {/* Vignette overlay */}
      <Vignette />

      {/* ── MOBILE VIEW: Dedicated 100vh full-page experience ── */}
      {isMobile ? (
        <MobileSystemView
          scrollStop={scrollStop}
          stepProgress={stepProgress}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          nextStep={nextStep}
          prevStep={prevStep}
          goToStop={goToStop}
        />
      ) : (
        /* ── DESKTOP VIEW: Horizontal Panoramic System Map ── */
        <>
          <div className="sc-grid fixed inset-0 overflow-hidden z-10" style={{ pointerEvents: 'none' }}>
            <div
              className="absolute left-0 top-16 md:top-20 origin-top-left will-change-transform"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                transform: `scale(${scale}) translate3d(-${translateX}px, 0, 0)`,
                pointerEvents: 'auto'
              }}
            >
              {/* SVG connection lines */}
              <SvgConnectors scrollStop={scrollStop} />

              {/* ─── N-00: ARTISAN ─── */}
              <NodeCard
                nodeId={nodes[0].nodeId}
                label={nodes[0].label}
                isActive={activeIndices.includes(0)}
                accentColor="var(--copper)"
                icon={<UserRound size={14} />}
                x={nodes[0].x}
                y={nodes[0].y}
                width={nodes[0].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Input" value="Physical Craft Goods" />
                  <DataRow label="Input" value="Artisan Voice Story" />
                  <DataRow label="Status" value="Physical Workshop" highlight color="var(--copper)" />
                </div>
              </NodeCard>

              {/* ─── N-01: AI PRODUCT STUDIO ─── */}
              <NodeCard
                nodeId={nodes[1].nodeId}
                label={nodes[1].label}
                isActive={activeIndices.includes(1)}
                accentColor="var(--violet)"
                icon={<WandSparkles size={14} />}
                x={nodes[1].x}
                y={nodes[1].y}
                width={nodes[1].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Process" value="4K Studio Image Polish" />
                  <DataRow label="Process" value="Background Removal" />
                  <DataRow label="Result" value="E-Commerce Photography" highlight color="var(--violet)" />
                </div>
              </NodeCard>

              {/* ─── N-02: MULTILINGUAL AI ─── */}
              <NodeCard
                nodeId={nodes[2].nodeId}
                label={nodes[2].label}
                isActive={activeIndices.includes(2)}
                accentColor="var(--blue)"
                icon={<Languages size={14} />}
                x={nodes[2].x}
                y={nodes[2].y}
                width={nodes[2].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Input" value="22+ Regional Dialects" />
                  <DataRow label="Process" value="Speech → Neural Translation" highlight color="var(--blue)" />
                  <DataRow label="Output" value="Global Multilingual Copy" />
                </div>
              </NodeCard>

              {/* ─── N-03: SMART CATALOG ENGINE ─── */}
              <NodeCard
                nodeId={nodes[3].nodeId}
                label={nodes[3].label}
                isActive={activeIndices.includes(3)}
                accentColor="var(--emerald)"
                icon={<Cpu size={14} />}
                x={nodes[3].x}
                y={nodes[3].y}
                width={nodes[3].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Inputs" value="Enhanced Photo + Voice" />
                  <DataRow label="Process" value="AI Description & Metadata" highlight color="var(--emerald)" />
                  <DataRow label="Output" value="VERIFIED DIGITAL CATALOG" highlight color="var(--emerald)" />
                </div>
              </NodeCard>

              {/* ─── N-04: DYNAMIC PRICING ─── */}
              <NodeCard
                nodeId={nodes[4].nodeId}
                label={nodes[4].label}
                isActive={activeIndices.includes(4)}
                accentColor="var(--rose)"
                icon={<TrendingUp size={14} />}
                x={nodes[4].x}
                y={nodes[4].y}
                width={nodes[4].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Factor" value="Market Demand Trends" />
                  <DataRow label="Factor" value="Fair Labor & Material Cost" />
                  <DataRow label="Target" value="+28% Artisan Profit Margin" highlight color="var(--rose)" />
                </div>
              </NodeCard>

              {/* ─── N-05: PRODUCT DISCOVERY ─── */}
              <NodeCard
                nodeId={nodes[5].nodeId}
                label={nodes[5].label}
                isActive={activeIndices.includes(5)}
                accentColor="var(--violet)"
                icon={<Telescope size={14} />}
                x={nodes[5].x}
                y={nodes[5].y}
                width={nodes[5].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Feature" value="Semantic Catalog Index" />
                  <DataRow label="Feature" value="Buyer Persona Matching" />
                  <DataRow label="Match" value="94% Direct Buyer Affinity" highlight color="var(--violet)" />
                </div>
              </NodeCard>

              {/* ─── N-06: DIGITAL MARKETPLACE ─── */}
              <NodeCard
                nodeId={nodes[6].nodeId}
                label={nodes[6].label}
                isActive={activeIndices.includes(6)}
                accentColor="var(--blue)"
                icon={<Store size={14} />}
                x={nodes[6].x}
                y={nodes[6].y}
                width={nodes[6].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Channel" value="B2B Institutional Wholesalers" />
                  <DataRow label="Channel" value="Government E-Market (GeM)" />
                  <DataRow label="Channel" value="Direct Global D2C" highlight color="var(--blue)" />
                </div>
              </NodeCard>

              {/* ─── N-07: YEAR-ROUND MARKET ACCESS ─── */}
              <NodeCard
                nodeId={nodes[7].nodeId}
                label={nodes[7].label}
                isActive={activeIndices.includes(7)}
                accentColor="var(--copper)"
                icon={<Globe size={14} />}
                x={nodes[7].x}
                y={nodes[7].y}
                width={nodes[7].width}
              >
                <div className="flex flex-col">
                  <DataRow label="Reach" value="Pan-India & Global Reach" />
                  <DataRow label="Revenue" value="Steady Year-Round Cashflow" />
                  <DataRow label="Outcome" value="Sustainable Livelihood" highlight color="var(--copper)" />
                </div>
              </NodeCard>
            </div>
          </div>

          {/* Desktop Header HUD */}
          <HeaderHud
            scrollStop={scrollStop}
            totalStops={SCROLL_STOPS}
            activeLabel={activeLabel}
          />

          {/* Desktop Interactive Progress Controls */}
          <ScrollProgress 
            progress={progress} 
            stepProgress={stepProgress}
            scrollStop={scrollStop}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            nextStep={nextStep}
            prevStep={prevStep}
            goToStop={goToStop}
          />
        </>
      )}
    </div>
  );
}

/* ─── Helper Components ─── */

function DataRow({
  label,
  value,
  highlight = false,
  color = 'var(--copper)',
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="group flex items-center justify-between gap-4 border-b border-white/5 py-2.5 last:border-0 hover:bg-white/[0.02] px-2 -mx-2 rounded-md transition-colors duration-300">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300 whitespace-nowrap">
        {label}
      </span>
      <span
        className={`text-right text-[11.5px] tracking-wide font-medium truncate ${
          highlight ? '' : 'text-foreground/90 group-hover:text-foreground'
        } transition-colors duration-300`}
        style={highlight ? { color } : undefined}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
