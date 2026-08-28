import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RiskLevel } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';

interface SochuMascotProps {
  mood?: RiskLevel | 'SUCCESS' | 'POKE';
  riskScore?: number;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showDialogue?: boolean;
  customMessage?: string;
  className?: string;
  onMascotClick?: () => void;
}

export const SochuMascot: React.FC<SochuMascotProps> = ({
  mood = 'LOW',
  riskScore,
  size = 'md',
  showDialogue = true,
  customMessage,
  className = '',
  onMascotClick,
}) => {
  const { t, isAudioSpeaking, playVoiceWarning } = useApp();
  const [isPoked, setIsPoked] = useState(false);

  const effectiveMood = isPoked ? 'POKE' : mood;

  const getDialogueText = () => {
    if (customMessage) return customMessage;
    if (isPoked) return t.mascot.poke;
    if (effectiveMood === 'SUCCESS') return t.mascot.success;
    if (effectiveMood === 'CRITICAL') return '🚨 Stop! High-risk fraud pattern detected. Do NOT enter your UPI PIN!';
    if (effectiveMood === 'HIGH') return '⚠️ Hold on! Let us review this high-value payment carefully together.';
    if (effectiveMood === 'CAUTION') return t.mascot.caution;
    return t.mascot.ready;
  };

  const handleMascotClick = () => {
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 2400);
    if (onMascotClick) onMascotClick();
  };

  // Color schemes based on mood
  const getMoodColors = () => {
    switch (effectiveMood) {
      case 'CRITICAL':
        return {
          cardBg: 'from-rose-600 via-red-700 to-slate-950',
          borderColor: 'border-rose-500',
          glow: 'rgba(225, 29, 72, 0.55)',
          eyeColor: '#FFF',
          accent: '#E11D48',
          statusPill: 'bg-rose-950 text-rose-100 border-rose-400 shadow-rose-500/50 ring-2 ring-rose-500/40 animate-pulse',
          label: 'CRITICAL · BLOCK (80-100)',
        };
      case 'HIGH':
        return {
          cardBg: 'from-amber-500 via-orange-600 to-amber-950',
          borderColor: 'border-orange-400',
          glow: 'rgba(249, 115, 22, 0.45)',
          eyeColor: '#FFF',
          accent: '#F97316',
          statusPill: 'bg-orange-950/95 text-orange-200 border-orange-500 shadow-orange-500/20',
          label: 'HIGH · VERIFY (55-79)',
        };
      case 'CAUTION':
        return {
          cardBg: 'from-amber-600 via-amber-700 to-slate-900',
          borderColor: 'border-amber-400',
          glow: 'rgba(245, 158, 11, 0.35)',
          eyeColor: '#FFF',
          accent: '#F59E0B',
          statusPill: 'bg-amber-900/90 text-amber-200 border-amber-700',
          label: 'Caution Review (25-54)',
        };
      case 'SUCCESS':
        return {
          cardBg: 'from-emerald-600 via-teal-700 to-slate-900',
          borderColor: 'border-emerald-400',
          glow: 'rgba(16, 185, 129, 0.35)',
          eyeColor: '#FFF',
          accent: '#10B981',
          statusPill: 'bg-emerald-900/90 text-emerald-200 border-emerald-700',
          label: 'Verified Safe',
        };
      case 'POKE':
        return {
          cardBg: 'from-indigo-600 via-purple-700 to-slate-900',
          borderColor: 'border-purple-300',
          glow: 'rgba(168, 85, 247, 0.4)',
          eyeColor: '#FFF',
          accent: '#A855F7',
          statusPill: 'bg-purple-900/90 text-purple-200 border-purple-700',
          label: 'Sochu Alert',
        };
      case 'LOW':
      default:
        return {
          cardBg: 'from-slate-800 via-slate-900 to-sky-950',
          borderColor: 'border-sky-400/70',
          glow: 'rgba(56, 189, 248, 0.25)',
          eyeColor: '#FFF',
          accent: '#38BDF8',
          statusPill: 'bg-slate-900/90 text-sky-200 border-sky-800',
          label: 'Normal Flow (0-24)',
        };
    }
  };

  const colors = getMoodColors();

  // Dimensions
  const dimensions = {
    sm: { width: 90, height: 115, cardW: 76, cardH: 98, scale: 0.8 },
    md: { width: 140, height: 175, cardW: 118, cardH: 148, scale: 1 },
    lg: { width: 190, height: 235, cardW: 160, cardH: 200, scale: 1.25 },
    hero: { width: 240, height: 290, cardW: 200, cardH: 250, scale: 1.5 },
  }[size];

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Dialogue Speech Bubble */}
      {showDialogue && (
        <motion.div
          key={effectiveMood + getDialogueText()}
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mb-3 max-w-[280px] sm:max-w-xs relative bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 text-slate-800 text-sm font-medium leading-snug flex items-center gap-2 text-center"
        >
          <span className="flex-1 font-semibold">{getDialogueText()}</span>
          {isAudioSpeaking && (
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-amber-600 flex-shrink-0"
              title="Voice Warning Active"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
            </motion.span>
          )}
          {/* Speech bubble pointer notch */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-200"></div>
        </motion.div>
      )}

      {/* Interactive Mascot Body Container */}
      <motion.div
        onClick={handleMascotClick}
        whileHover={{ scale: 1.04, rotate: [-0.5, 0.5] }}
        whileTap={{ scale: 0.96 }}
        animate={
          effectiveMood === 'CRITICAL' || effectiveMood === 'HIGH'
            ? { y: [0, -4, 0], rotate: [-1, 1, -1] }
            : effectiveMood === 'SUCCESS'
            ? { y: [0, -6, 0] }
            : { y: [0, -3, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: effectiveMood === 'CRITICAL' ? 1.1 : effectiveMood === 'HIGH' ? 2.4 : 3.2,
          ease: 'easeInOut',
        }}
        className="cursor-pointer relative group focus:outline-none"
        title="I am Sochu, your SochKe safety companion! Click me."
      >
        {/* Soft atmospheric ambient glow */}
        <div
          className="absolute -inset-2 rounded-3xl opacity-60 blur-xl transition-all duration-500 pointer-events-none"
          style={{ background: colors.glow }}
        />

        {/* SVG Mascot Figure */}
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 140 175"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl relative z-10"
        >
          <defs>
            <linearGradient id={`sochuGrad-${effectiveMood}`} x1="0" y1="0" x2="140" y2="175" gradientUnits="userSpaceOnUse">
              {effectiveMood === 'CRITICAL' ? (
                <>
                  <stop offset="0%" stopColor="#E11D48" />
                  <stop offset="50%" stopColor="#9F1239" />
                  <stop offset="100%" stopColor="#4C0519" />
                </>
              ) : effectiveMood === 'HIGH' ? (
                <>
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="55%" stopColor="#C2410C" />
                  <stop offset="100%" stopColor="#7C2D12" />
                </>
              ) : effectiveMood === 'CAUTION' ? (
                <>
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="55%" stopColor="#92400E" />
                  <stop offset="100%" stopColor="#451A03" />
                </>
              ) : effectiveMood === 'SUCCESS' ? (
                <>
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#047857" />
                  <stop offset="100%" stopColor="#064E3B" />
                </>
              ) : effectiveMood === 'POKE' ? (
                <>
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#6D28D9" />
                  <stop offset="100%" stopColor="#4C1D95" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#082F49" />
                </>
              )}
            </linearGradient>

            {/* Hologram / Chip Gold gradient */}
            <linearGradient id="goldChip" x1="0" y1="0" x2="24" y2="18">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Left Arm */}
          <motion.path
            d="M 18 88 C 6 88 4 104 14 108"
            stroke="#94A3B8"
            strokeWidth="5"
            strokeLinecap="round"
            animate={
              effectiveMood === 'CRITICAL'
                ? { d: 'M 18 80 C 2 64 2 86 16 92' }
                : effectiveMood === 'HIGH'
                ? { d: 'M 18 84 C 4 72 6 96 16 100' }
                : effectiveMood === 'SUCCESS'
                ? { d: 'M 18 78 C 4 60 4 80 18 88' }
                : { d: 'M 18 88 C 6 88 4 104 14 108' }
            }
            transition={{ duration: 0.4 }}
          />

          {/* Right Arm (Alert Wave for High vs Raised Shield Barrier for Critical) */}
          <motion.path
            d="M 122 88 C 134 88 136 104 126 108"
            stroke="#94A3B8"
            strokeWidth="5"
            strokeLinecap="round"
            animate={
              effectiveMood === 'CRITICAL'
                ? { d: 'M 122 76 C 140 58 142 86 124 92' }
                : effectiveMood === 'HIGH'
                ? { d: 'M 122 80 C 138 68 138 90 124 94' }
                : effectiveMood === 'SUCCESS'
                ? { d: 'M 122 75 C 138 52 142 74 124 85' }
                : isPoked
                ? { d: 'M 122 70 C 140 45 142 65 126 80' }
                : { d: 'M 122 88 C 134 88 136 104 126 108' }
            }
            transition={{ duration: 0.4 }}
          />

          {/* Main Rounded Smart Card Body */}
          <rect
            x="18"
            y="20"
            width="104"
            height="132"
            rx="18"
            fill={`url(#sochuGrad-${effectiveMood})`}
            stroke={colors.accent}
            strokeWidth="2.5"
            className="filter drop-shadow-md"
          />

          {/* Card Magnetic / Contactless Safety Curve Lines */}
          <path
            d="M 28 36 Q 44 26 62 36"
            stroke={colors.accent}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 32 43 Q 44 35 58 43"
            stroke={colors.accent}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Mini Fintech Chip on Card Left */}
          <rect x="26" y="58" width="18" height="14" rx="3" fill="url(#goldChip)" stroke="#78350F" strokeWidth="0.8" />
          <line x1="35" y1="58" x2="35" y2="72" stroke="#78350F" strokeWidth="0.6" />
          <line x1="26" y1="65" x2="44" y2="65" stroke="#78350F" strokeWidth="0.6" />

          {/* Mini SochKe Shield Emblem Top Right */}
          <circle cx="106" cy="36" r="8" fill={colors.accent} fillOpacity="0.2" />
          <path
            d="M 106 31 L 110 33 V 37 C 110 40 106 42 106 42 C 106 42 102 40 102 37 V 33 Z"
            fill={colors.accent}
          />

          {/* EXPRESSIVE EYES */}
          {/* Left Eye */}
          <g transform="translate(48, 86)">
            {effectiveMood === 'CRITICAL' ? (
              // Serious/Vigilant Sharp Intercept Eye with Slanted Red Barrier Brow
              <>
                <circle cx="0" cy="0" r="7.8" fill="#FFF" />
                <circle cx="1" cy="0" r="4.5" fill="#0F172A" />
                <circle cx="2.5" cy="-1.5" r="1.5" fill="#FFF" />
                {/* Slanted Sharp Warning Brow */}
                <line x1="-9" y1="-10" x2="7" y2="-6" stroke="#FFF" strokeWidth="2.6" strokeLinecap="round" />
              </>
            ) : effectiveMood === 'HIGH' ? (
              // High Alert Wide-Awake Watchful Eye with Concentrated Raised Brow
              <>
                <circle cx="0" cy="0" r="7.8" fill="#FFF" />
                <circle cx="0" cy="-0.5" r="4.2" fill="#0F172A" />
                <circle cx="2" cy="-2" r="1.6" fill="#FFF" />
                {/* Raised Concentrated Alert Brow */}
                <path d="M -8 -8 Q 0 -13 6 -9" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              </>
            ) : effectiveMood === 'CAUTION' ? (
              // Inquisitive Eye
              <>
                <circle cx="0" cy="0" r="7.5" fill="#FFF" />
                <circle cx="1" cy="-1" r="4" fill="#0F172A" />
                <circle cx="2" cy="-2.5" r="1.5" fill="#FFF" />
                {/* Raised Inquisitive Brow */}
                <path d="M -7 -8 Q 0 -13 7 -8" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : effectiveMood === 'SUCCESS' ? (
              // Happy Arc Wink
              <path d="M -7 1 Q 0 -6 7 1" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : (
              // Friendly Normal Eyes
              <>
                <circle cx="0" cy="0" r="7.5" fill="#FFF" />
                <circle cx="1" cy="1" r="4.2" fill="#0F172A" />
                <circle cx="2.5" cy="-0.5" r="1.6" fill="#FFF" />
                <circle cx="-1" cy="2" r="0.8" fill="#FFF" />
              </>
            )}
          </g>

          {/* Right Eye */}
          <g transform="translate(86, 86)">
            {effectiveMood === 'CRITICAL' ? (
              <>
                <circle cx="0" cy="0" r="7.8" fill="#FFF" />
                <circle cx="-1" cy="0" r="4.5" fill="#0F172A" />
                <circle cx="0.5" cy="-1.5" r="1.5" fill="#FFF" />
                {/* Slanted Sharp Warning Brow */}
                <line x1="-7" y1="-6" x2="9" y2="-10" stroke="#FFF" strokeWidth="2.6" strokeLinecap="round" />
              </>
            ) : effectiveMood === 'HIGH' ? (
              <>
                <circle cx="0" cy="0" r="7.8" fill="#FFF" />
                <circle cx="0" cy="-0.5" r="4.2" fill="#0F172A" />
                <circle cx="1.5" cy="-2" r="1.6" fill="#FFF" />
                {/* Raised Concentrated Alert Brow */}
                <path d="M -6 -9 Q 0 -13 8 -8" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              </>
            ) : effectiveMood === 'CAUTION' ? (
              <>
                <circle cx="0" cy="0" r="7.5" fill="#FFF" />
                <circle cx="1" cy="-1" r="4" fill="#0F172A" />
                <circle cx="2" cy="-2.5" r="1.5" fill="#FFF" />
                <line x1="-6" y1="-8" x2="7" y2="-7" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : effectiveMood === 'SUCCESS' ? (
              // Happy Arc
              <path d="M -7 1 Q 0 -6 7 1" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <circle cx="0" cy="0" r="7.5" fill="#FFF" />
                <circle cx="1" cy="1" r="4.2" fill="#0F172A" />
                <circle cx="2.5" cy="-0.5" r="1.6" fill="#FFF" />
                <circle cx="-1" cy="2" r="0.8" fill="#FFF" />
              </>
            )}
          </g>

          {/* MOUTH / SMILE */}
          <g transform="translate(67, 108)">
            {effectiveMood === 'CRITICAL' ? (
              // Firm Intercept Flat Barricade Line
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#FFF" strokeWidth="3" strokeLinecap="round" />
            ) : effectiveMood === 'HIGH' ? (
              // Attentive small cautious mouth
              <path d="M -6 1 Q 0 -3 6 1" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            ) : effectiveMood === 'CAUTION' ? (
              // Thoughtful Small "O"
              <circle cx="0" cy="0" r="3.2" fill="#FFF" />
            ) : effectiveMood === 'SUCCESS' || isPoked ? (
              // Big Cheerful Smile
              <path d="M -9 -2 Q 0 8 9 -2" stroke="#FFF" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : (
              // Gentle Trusting Smile
              <path d="M -7 -1 Q 0 5 7 -1" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            )}
          </g>

          {/* Rosy Cheeks (Subtle warmth) */}
          <circle cx="40" cy="100" r="4.5" fill="#F43F5E" fillOpacity="0.25" />
          <circle cx="94" cy="100" r="4.5" fill="#F43F5E" fillOpacity="0.25" />

          {/* Mini Card Feet / Base */}
          <rect x="42" y="150" width="16" height="7" rx="3.5" fill="#64748B" />
          <rect x="76" y="150" width="16" height="7" rx="3.5" fill="#64748B" />
        </svg>

        {/* Small "Sochu" Branding Chip Pill */}
        <div
          className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase border ${colors.statusPill} flex items-center gap-1 shadow-sm whitespace-nowrap`}
        >
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>Sochu{riskScore !== undefined ? ` · ${riskScore}/100` : ''}</span>
        </div>
      </motion.div>
    </div>
  );
};