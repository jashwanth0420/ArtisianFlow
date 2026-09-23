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
  Sparkles,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { SCROLL_STOPS } from '@/lib/nodes';
import { 
  speakPhrase, 
  playMultilingualShowcase, 
  enableAudio, 
  disableAudio, 
  MULTILINGUAL_PHRASES 
} from '@/lib/multilingual-audio';

interface MobileSystemViewProps {
  scrollStop: number;
  stepProgress: number;
  isPlaying: boolean;
  togglePlay: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStop: (stop: number) => void;
}

interface StepDetail {
  id: string;
  name: string;
  category: string;
  accent: string;
  icon: React.ReactNode;
  statusBadge: string;
  rows: { label: string; value: string; highlight?: boolean }[];
  branchRows?: { label: string; value: string; highlight?: boolean }[];
}

const STEP_DATA: StepDetail[] = [
  {
    id: 'N-00',
    name: 'TRADITIONAL ARTISAN',
    category: 'CRAFT ORIGIN',
    accent: 'var(--copper)',
    icon: <UserRound size={16} />,
    statusBadge: 'Traditional Craftsman',
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
    category: 'PRODUCT STRUCTURING',
    accent: 'var(--emerald)',
    icon: <Cpu size={16} />,
    statusBadge: 'Automated Indexing',
    rows: [
      { label: 'Inputs', value: 'Enhanced Photo + Voice Translation' },
      { label: 'Process', value: 'Rich Metadata & Category Extraction' },
      { label: 'Output', value: 'Verified Digital Catalog Asset', highlight: true },
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
    category: 'COMMERCE CHANNELS',
    accent: 'var(--blue)',
    icon: <Store size={16} />,
    statusBadge: 'Omnichannel Pipeline',
    rows: [
      { label: 'Wholesale', value: 'B2B Institutional Wholesalers' },
      { label: 'Government', value: 'Direct GeM Integration' },
      { label: 'Direct', value: 'Global D2C Marketplace Access', highlight: true },
    ]
  },
  {
    id: 'N-07',
    name: 'YEAR-ROUND ACCESS',
    category: 'SUSTAINABLE OUTCOME',
    accent: 'var(--copper)',
    icon: <Globe size={16} />,
    statusBadge: 'Continuous Growth',
    rows: [
      { label: 'Market Reach', value: 'Pan-India & International Reach' },
      { label: 'Cash Flow', value: 'Consistent Year-Round Revenue' },
      { label: 'Impact', value: 'Sustainable Artisan Livelihood', highlight: true },
    ]
  }
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
  const [soundOn, setSoundOn] = React.useState(true);
  const [activeSpeechIdx, setActiveSpeechIdx] = React.useState<number | null>(null);

  const toggleSound = () => {
    if (soundOn) {
      disableAudio();
      setSoundOn(false);
    } else {
      enableAudio();
      setSoundOn(true);
      if (scrollStop === 2) {
        playMultilingualShowcase((idx) => setActiveSpeechIdx(idx));
      }
    }
  };

  const handlePlayLanguage = (idx: number) => {
    enableAudio();
    setSoundOn(true);
    setActiveSpeechIdx(idx);
    speakPhrase(idx, () => setActiveSpeechIdx(null));
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between pointer-events-none select-none">
      {/* ── Top Header Bar (Compact & Sleek) ── */}
      <header className="pointer-events-auto w-full px-3 pt-3">
        <div className="bg-[#0a0713]/85 backdrop-blur-md rounded-xl p-2.5 border border-white/10 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] tracking-wider text-[var(--violet)] font-bold">
              AI MARKET-LINKAGE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white/80 transition-colors flex items-center gap-1 text-[10px] font-mono"
              title={soundOn ? "Mute audio" : "Enable voice audio"}
            >
              {soundOn ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} className="text-muted-foreground" />}
            </button>
            <div 
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono tracking-widest font-semibold"
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
        </div>
      </header>

      {/* ── Upper Visual Viewport Spacer (100% unobstructed window for Phaser 2D world & artisan) ── */}
      <div className="flex-1 min-h-[140px]" />

      {/* ── Bottom Half: Unified Glassmorphic Phase Dashboard & Controls ── */}
      <div 
        className="pointer-events-auto w-full bg-[#0a0713]/94 backdrop-blur-2xl rounded-t-3xl border-t border-white/15 px-4 pt-3.5 pb-4 shadow-2xl transition-all duration-500 flex flex-col gap-2.5 max-h-[58vh] overflow-y-auto"
        style={{
          boxShadow: `0 -10px 35px -5px ${currentStep.accent}30, 0 10px 25px -5px rgba(0,0,0,0.9)`
        }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
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
        <div className="space-y-1.5">
          {currentStep.rows.map((row, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between gap-3 py-1 border-b border-white/5 last:border-0"
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

          {/* Interactive Multilingual Voice Feature (Phase 2) */}
          {scrollStop === 2 && (
            <div className="pt-2 mt-1 border-t border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-mono text-[9px] tracking-wider text-[var(--blue)] uppercase flex items-center gap-1.5 font-bold">
                  <Radio size={12} className="animate-pulse text-blue-400" />
                  <span>VOICE SYNTHESIS</span>
                </div>
                <button
                  onClick={() => {
                    enableAudio();
                    setSoundOn(true);
                    playMultilingualShowcase((i) => setActiveSpeechIdx(i));
                  }}
                  className="px-2 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[9px] font-mono flex items-center gap-1 transition-colors"
                >
                  <span>▶ Play Voices</span>
                </button>
              </div>

              {/* Regional Language Interactive Speech Chips */}
              <div className="grid grid-cols-2 gap-1.5">
                {MULTILINGUAL_PHRASES.map((phrase, i) => {
                  const isSelected = activeSpeechIdx === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePlayLanguage(i)}
                      className={`p-1.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-500/25 border-blue-400 text-white shadow-sm ring-1 ring-blue-400/40'
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                      }`}
                    >
                      <div className="text-[10px] font-bold tracking-wide flex items-center justify-between">
                        <span>{phrase.label}</span>
                        <span className="text-[9px] opacity-75">🔊</span>
                      </div>
                      <div className="text-[9px] truncate opacity-85 mt-0.5 font-sans">
                        {phrase.nativeText}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* If Phase 4 branch rows exist */}
          {currentStep.branchRows && (
            <div className="pt-1.5 mt-1 border-t border-white/10">
              <div className="font-mono text-[9px] tracking-widest text-[var(--violet)] uppercase mb-1 flex items-center gap-1 font-bold">
                <Telescope size={12} />
                <span>PARALLEL BRANCH: PRODUCT DISCOVERY</span>
              </div>
              {currentStep.branchRows.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 py-0.5 text-[11px]">
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

        {/* ── Timeline Navigation: Step Indicator Pills (01 - 07) ── */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/10">
          {Array.from({ length: SCROLL_STOPS }).map((_, idx) => {
            const isActive = idx === scrollStop;
            const isPast = idx < scrollStop;
            const stepAccent = STEP_DATA[idx]?.accent || 'var(--violet)';

            return (
              <button
                key={idx}
                onClick={() => goToStop(idx)}
                className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all duration-300 border ${
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

        {/* ── Playback Controls & Status Line ── */}
        <div className="flex items-center justify-between text-[11px] font-mono pt-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevStep}
              className="p-1 rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              title="Previous Phase"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
              title={isPlaying ? "Pause Flow" : "Resume Auto-Play"}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
              <span className="text-[9px] uppercase font-bold">{isPlaying ? "PAUSE" : "PLAY"}</span>
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
            <span className="text-[10px] tracking-wider text-muted-foreground font-mono">
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
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-0.5">
          <div 
            className="h-full rounded-full transition-all duration-100 ease-linear"
            style={{ 
              width: `${stepProgress * 100}%`,
              backgroundColor: currentStep.accent,
              boxShadow: `0 0 8px ${currentStep.accent}`
            }}
          />
        </div>
      </div>
    </div>
  );
}
