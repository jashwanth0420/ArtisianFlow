'use client';

import React from 'react';
import { 
  UserRound, 
  WandSparkles, 
  Languages, 
  Cpu, 
  TrendingUp, 
  Telescope, 
  Store, 
  Globe,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SCROLL_STOPS } from '@/lib/nodes';

interface MobileSystemViewProps {
  scrollStop: number;
  stepProgress: number; // 0 to 1 countdown for current step
  isPlaying: boolean;
  togglePlay: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStop: (index: number) => void;
}

interface StepDetails {
  id: string;
  name: string;
  category: string;
  accent: string;
  icon: React.ReactNode;
  statusBadge: string;
  rows: { label: string; value: string; highlight?: boolean }[];
  branchRows?: { label: string; value: string; highlight?: boolean }[];
}

const STEP_DATA: StepDetails[] = [
  {
    id: 'N-00',
    name: 'ARTISAN',
    category: 'PHYSICAL WORKSHOP',
    accent: 'var(--copper)',
    icon: <UserRound size={16} />,
    statusBadge: 'Traditional Craftsmanship',
    rows: [
      { label: 'Input', value: 'Handmade Physical Product' },
      { label: 'Input', value: 'Artisan Voice Description' },
      { label: 'Struggle', value: 'Limited Local Reach & Middlemen', highlight: true },
    ]
  },
  {
    id: 'N-01',
    name: 'AI PRODUCT STUDIO',
    category: 'VISION INTELLIGENCE',
    accent: 'var(--violet)',
    icon: <WandSparkles size={16} />,
    statusBadge: 'Automated Enhancement',
    rows: [
      { label: 'Process', value: '4K Studio Image Enhancement' },
      { label: 'Process', value: 'Intelligent Background Removal' },
      { label: 'Result', value: 'E-Commerce Ready Photography', highlight: true },
    ]
  },
  {
    id: 'N-02',
    name: 'MULTILINGUAL AI',
    category: 'SPEECH & TRANSLATION',
    accent: 'var(--blue)',
    icon: <Languages size={16} />,
    statusBadge: '22+ Indian Languages',
    rows: [
      { label: 'Input', value: 'Dialect / Regional Voice Audio' },
      { label: 'Process', value: 'Speech → Text → Neural Translation', highlight: true },
      { label: 'Output', value: 'Multi-Language Global Scripts' },
    ]
  },
  {
    id: 'N-03',
    name: 'SMART CATALOG ENGINE',
    category: 'DIGITAL CATALOGUER',
    accent: 'var(--emerald)',
    icon: <Cpu size={16} />,
    statusBadge: 'Automated Metadata Generation',
    rows: [
      { label: 'Inputs', value: 'Enhanced Photo + Voice Story' },
      { label: 'Process', value: 'AI Generated Story & SEO Keywords' },
      { label: 'Output', value: 'VERIFIED DIGITAL CATALOG LISTING', highlight: true },
    ]
  },
  {
    id: 'N-04 & N-05',
    name: 'PRICING & DISCOVERY',
    category: 'DUAL-BRANCH INTELLIGENCE',
    accent: 'var(--rose)',
    icon: <TrendingUp size={16} />,
    statusBadge: 'Parallel Optimization',
    rows: [
      { label: 'Dynamic Pricing', value: 'Fair-Wage + Market Cost Algorithm' },
      { label: 'Profit Margin', value: 'Target: +28% Artisan Take-Home', highlight: true },
    ],
    branchRows: [
      { label: 'Discovery Match', value: 'Semantic Buyer Recommendation' },
      { label: 'Buyer Affinity', value: '94% Direct Buyer Match', highlight: true },
    ]
  },
  {
    id: 'N-06',
    name: 'DIGITAL MARKETPLACE',
    category: 'MULTI-CHANNEL DISTRIBUTION',
    accent: 'var(--blue)',
    icon: <Store size={16} />,
    statusBadge: 'Direct Market Linkage',
    rows: [
      { label: 'Channel 1', value: 'B2B Bulk Institutional Orders' },
      { label: 'Channel 2', value: 'Government E-Marketplace (GeM)' },
      { label: 'Channel 3', value: 'Direct Global Consumers (D2C)', highlight: true },
    ]
  },
  {
    id: 'N-07',
    name: 'YEAR-ROUND ACCESS',
    category: 'EMPOWERED ENTERPRISE',
    accent: 'var(--copper)',
    icon: <Globe size={16} />,
    statusBadge: 'Sustainable Livelihood',
    rows: [
      { label: 'Reach', value: 'Pan-India & Global Buyers' },
      { label: 'Revenue', value: 'Continuous Year-Round Income' },
      { label: 'Impact', value: 'Sustained Cultural Heritage', highlight: true },
    ]
  },
];

export function MobileSystemView({
  scrollStop,
  stepProgress,
  isPlaying,
  togglePlay,
  nextStep,
  prevStep,
  goToStop
}: MobileSystemViewProps) {
  const currentStep = STEP_DATA[scrollStop] || STEP_DATA[0];

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between px-4 pt-3 pb-5 pointer-events-none select-none">
      {/* ── Top Header Bar ── */}
      <header className="pointer-events-auto w-full bg-[#0a0713]/85 backdrop-blur-md rounded-xl p-3 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] tracking-wider text-[var(--violet)] font-semibold">
              AI MARKET-LINKAGE
            </span>
          </div>
          <div 
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono tracking-widest"
            style={{ 
              borderColor: currentStep.accent,
              color: currentStep.accent,
              backgroundColor: `${currentStep.accent}15`
            }}
          >
            <span>PHASE</span>
            <span className="font-bold">{String(scrollStop + 1).padStart(2, '0')}</span>
            <span>/ 07</span>
          </div>
        </div>
        <p className="mt-1 text-[11px] font-sans text-muted-foreground truncate">
          Smart India Hackathon • Direct Artisan Market Architecture
        </p>
      </header>

      {/* ── Center Stage: Active Stage Card ── */}
      <div className="pointer-events-auto my-auto w-full max-w-[360px] mx-auto transition-all duration-500">
        <div 
          className="relative overflow-hidden rounded-2xl border bg-[#0d091a]/90 backdrop-blur-2xl shadow-2xl transition-all duration-500"
          style={{ 
            borderColor: `${currentStep.accent}55`,
            boxShadow: `0 0 35px -10px ${currentStep.accent}40, 0 10px 25px -5px rgba(0,0,0,0.8)`
          }}
        >
          {/* Ambient Corner Glow */}
          <div 
            className="absolute -top-16 -right-16 h-36 w-36 rounded-full opacity-25 blur-2xl pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: currentStep.accent }}
          />

          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2.5">
              <span 
                className="p-1.5 rounded-lg flex items-center justify-center transition-colors duration-500"
                style={{ 
                  backgroundColor: `${currentStep.accent}20`,
                  color: currentStep.accent 
                }}
              >
                {currentStep.icon}
              </span>
              <div>
                <div className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                  {currentStep.id} • {currentStep.category}
                </div>
                <div className="font-sans text-[13px] font-bold text-foreground tracking-wide">
                  {currentStep.name}
                </div>
              </div>
            </div>

            <span 
              className="text-[9px] font-mono px-2 py-0.5 rounded-md border font-medium"
              style={{
                borderColor: `${currentStep.accent}40`,
                color: currentStep.accent,
                backgroundColor: `${currentStep.accent}10`
              }}
            >
              {currentStep.statusBadge}
            </span>
          </div>

          {/* Card Rows */}
          <div className="p-4 space-y-2">
            {currentStep.rows.map((row, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5 last:border-0"
              >
                <span className="font-mono text-[10px] text-muted-foreground/80 tracking-wider uppercase">
                  {row.label}
                </span>
                <span 
                  className="text-right text-[11px] font-medium tracking-wide"
                  style={{ color: row.highlight ? currentStep.accent : 'rgba(232, 228, 239, 0.95)' }}
                >
                  {row.value}
                </span>
              </div>
            ))}

            {/* If Phase 4 branch rows exist */}
            {currentStep.branchRows && (
              <div className="pt-2 mt-2 border-t border-white/10">
                <div className="font-mono text-[9px] tracking-widest text-[var(--violet)] uppercase mb-1.5 flex items-center gap-1">
                  <Telescope size={12} />
                  <span>PARALLEL BRANCH: PRODUCT DISCOVERY</span>
                </div>
                {currentStep.branchRows.map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 py-1 text-[11px]">
                    <span className="font-mono text-[10px] text-muted-foreground/80 tracking-wider uppercase">
                      {row.label}
                    </span>
                    <span 
                      className="text-right font-medium"
                      style={{ color: row.highlight ? 'var(--violet)' : 'rgba(232, 228, 239, 0.95)' }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Footer Live Badge */}
          <div className="px-4 py-2 bg-black/50 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles size={11} style={{ color: currentStep.accent }} />
              <span>Living Artisan Flow</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase">
              Phase {scrollStop + 1} Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Controls & Timeline Bar ── */}
      <footer className="pointer-events-auto w-full bg-[#0a0713]/90 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-2xl">
        {/* Step Indicator Pills */}
        <div className="flex items-center justify-between gap-1.5 mb-3">
          {Array.from({ length: SCROLL_STOPS }).map((_, idx) => {
            const isActive = idx === scrollStop;
            const isPast = idx < scrollStop;
            const stepAccent = STEP_DATA[idx]?.accent || 'var(--violet)';

            return (
              <button
                key={idx}
                onClick={() => goToStop(idx)}
                className={`flex-1 py-1 rounded-md text-[10px] font-mono font-bold transition-all duration-300 border ${
                  isActive 
                    ? 'border-transparent text-black shadow-md scale-105' 
                    : isPast 
                      ? 'border-white/10 text-muted-foreground/80 bg-white/5' 
                      : 'border-white/5 text-muted-foreground/40 bg-transparent'
                }`}
                style={isActive ? { backgroundColor: stepAccent } : undefined}
                title={`Jump to Phase ${idx + 1}`}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>

        {/* Play/Pause & Status Line */}
        <div className="flex items-center justify-between text-[11px] font-mono mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              title="Previous Phase"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
              title={isPlaying ? "Pause Flow" : "Resume Auto-Play"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
            </button>
            <button
              onClick={nextStep}
              className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              title="Next Phase"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] tracking-wider text-muted-foreground">
              {isPlaying ? (
                <span className="flex items-center gap-1.5">
                  <span className="animate-pulse text-emerald-400">●</span>
                  AUTO-ADVANCING
                </span>
              ) : (
                <span className="text-amber-400">⏸ PAUSED</span>
              )}
            </span>
          </div>
        </div>

        {/* Continuous Step Countdown Progress Bar */}
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{ 
              width: `${stepProgress * 100}%`,
              backgroundColor: currentStep.accent,
              boxShadow: `0 0 8px ${currentStep.accent}`
            }}
          />
        </div>
      </footer>
    </div>
  );
}
