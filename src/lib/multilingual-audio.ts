'use client';

/**
 * Multilingual Audio & Speech Synthesis Engine
 * Provides authentic regional voice synthesis (Tamil, Hindi, Telugu, English)
 * and resonant acoustic soundwave chimes for the Multilingual AI feature.
 */

// Regional phrases representing the artisan market linkage story
export const MULTILINGUAL_PHRASES = [
  {
    lang: 'ta-IN',
    label: 'Tamil',
    nativeText: 'பாரம்பரிய கைவினைப் பொருட்கள் இப்போது உலக சந்தைக்கு.',
    phonetic: 'Paarampariya kaivinai porutkal ulaga sandhaikku.',
    translation: 'Traditional handcrafted goods are now reaching the global marketplace.'
  },
  {
    lang: 'hi-IN',
    label: 'Hindi',
    nativeText: 'नमस्ते! भारतीय कारीगरों की कला अब डिजिटल बाज़ार में उपलब्ध है।',
    phonetic: 'Namaste! Bharatiya karigaron ki kala ab digital bazaar mein uplabdh hai.',
    translation: 'Hello! The craft of Indian artisans is now available on the global digital market.'
  },
  {
    lang: 'te-IN',
    label: 'Telugu',
    nativeText: 'నమస్కారం! చేతివృత్తుల కళాకారులకు అంతర్జాతీయ మార్కెట్ అనుసంధానం.',
    phonetic: 'Namaskaram! Chethivruthula kalakarulaku antharjaatheeya market anusandhanam.',
    translation: 'Greetings! Direct international market linkage for traditional craftsmen.'
  },
  {
    lang: 'en-IN',
    label: 'Global English',
    nativeText: 'Empowering marginalized artisans with voice-driven multilingual AI cataloguing.',
    phonetic: 'AI Multilingual Bridge',
    translation: 'Direct voice description translated into global e-commerce listings.'
  }
];

let audioCtx: AudioContext | null = null;
let isAudioEnabled: boolean = true;
let isSpeaking: boolean = false;

// Audio unlock helper for browser autoplay policies
export function enableAudio() {
  isAudioEnabled = true;
  if (typeof window !== 'undefined') {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }
}

export function disableAudio() {
  isAudioEnabled = false;
  stopMultilingualSpeech();
}

export function isAudioActive() {
  return isAudioEnabled;
}

/**
 * Synthesizes a melodic acoustic chime (warm frequency chord)
 * inspired by traditional acoustic resonant frequencies
 */
export function playAcousticChime() {
  if (!isAudioEnabled || typeof window === 'undefined') return;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const now = audioCtx.currentTime;
    // Harmonic frequencies: D4 (293.66Hz), A4 (440Hz), D5 (587.33Hz), F#5 (739.99Hz)
    const freqs = [293.66, 440.0, 587.33, 739.99];

    freqs.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.25);
    });
  } catch {
    // Graceful fallback if Web Audio is blocked
  }
}

/**
 * Speaks an authentic regional phrase using Web Speech Synthesis
 */
export function speakPhrase(index: number = 0, onComplete?: () => void) {
  if (!isAudioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const phrase = MULTILINGUAL_PHRASES[index % MULTILINGUAL_PHRASES.length];
    const utterance = new SpeechSynthesisUtterance(phrase.nativeText);
    utterance.lang = phrase.lang;
    utterance.rate = 0.95; // Natural spoken pace
    utterance.pitch = 1.0;

    // Try finding a matching native voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(phrase.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    isSpeaking = true;

    utterance.onend = () => {
      isSpeaking = false;
      if (onComplete) onComplete();
    };

    utterance.onerror = () => {
      isSpeaking = false;
      if (onComplete) onComplete();
    };

    // Play subtle acoustic chime before speech
    playAcousticChime();

    window.speechSynthesis.speak(utterance);
  } catch {
    isSpeaking = false;
    if (onComplete) onComplete();
  }
}

/**
 * Plays a sequential multilingual audio showcase:
 * Speaks Tamil, then Hindi, then English with pleasant acoustic intervals
 */
export function playMultilingualShowcase(onPhaseChange?: (phraseIndex: number) => void) {
  if (!isAudioEnabled || typeof window === 'undefined') return;

  enableAudio();
  playAcousticChime();

  // Speak Tamil first
  if (onPhaseChange) onPhaseChange(0);
  speakPhrase(0, () => {
    // Speak Hindi second after 600ms pause
    setTimeout(() => {
      if (!isAudioEnabled) return;
      if (onPhaseChange) onPhaseChange(1);
      speakPhrase(1, () => {
        // Speak English third after 600ms pause
        setTimeout(() => {
          if (!isAudioEnabled) return;
          if (onPhaseChange) onPhaseChange(3);
          speakPhrase(3);
        }, 600);
      });
    }, 600);
  });
}

export function stopMultilingualSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      isSpeaking = false;
    } catch {}
  }
}

export function getIsSpeaking() {
  return isSpeaking;
}
