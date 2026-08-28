import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceWarningBannerProps {
  autoPlay?: boolean;
}

export const VoiceWarningBanner: React.FC<VoiceWarningBannerProps> = ({ autoPlay = false }) => {
  const {
    t,
    language,
    activeRiskAssessment,
    isAudioSpeaking,
    playVoiceWarning,
    stopVoiceWarning,
  } = useApp();

  const isEmergency = activeRiskAssessment.isEmergencyFastTrack;
  const isCritical = activeRiskAssessment.riskLevel === 'CRITICAL';
  const isHigh = activeRiskAssessment.riskLevel === 'HIGH';

  const script =
    activeRiskAssessment.voiceScript[language] || activeRiskAssessment.voiceScript.en;

  useEffect(() => {
    if (autoPlay && (isCritical || isHigh) && !isEmergency) {
      // Gentle delayed speech to let user see the screen first
      const timer = setTimeout(() => {
        playVoiceWarning();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeRiskAssessment.transactionId]);

  return (
    <div
      id="voice-warning-banner"
      className={`${
        isEmergency
          ? 'bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-700 text-white border-teal-400 shadow-teal-500/15'
          : isCritical
          ? 'bg-gradient-to-r from-rose-600 via-red-700 to-slate-950 text-white border-rose-500 shadow-rose-500/20'
          : 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-900 text-white border-amber-400 shadow-amber-500/15'
      } rounded-3xl p-5 sm:p-6 shadow-lg border relative overflow-hidden`}
    >
      {/* Background soft pulse pattern */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Animated Speaker Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white/95 shadow-md flex items-center justify-center flex-shrink-0 text-slate-900">
            {isAudioSpeaking ? (
              <Volume2 className={`w-6 h-6 animate-pulse ${isEmergency ? 'text-teal-600' : isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
            ) : (
              <Volume2 className="w-6 h-6 text-slate-800" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isEmergency
                    ? 'bg-teal-950 text-teal-300'
                    : isCritical
                    ? 'bg-slate-950 text-rose-300'
                    : 'bg-slate-950 text-amber-300'
                }`}
              >
                {isEmergency ? '🔵 Emergency Fast-Track Audio' : isCritical ? '🚨 Critical Intercept Alert' : '⚠️ High-Risk Verification Audio'}
              </span>
              {isAudioSpeaking && (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            <p className="text-sm sm:text-base font-bold text-white drop-shadow-xs leading-relaxed max-w-2xl">
              "{script}"
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          {isAudioSpeaking ? (
            <button
              onClick={stopVoiceWarning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950/90 text-white hover:bg-slate-900 text-xs font-bold transition-all shadow-md cursor-pointer border border-white/20"
            >
              <VolumeX className="w-4 h-4" />
              <span>{t.voiceWarning.stopAudio}</span>
            </button>
          ) : (
            <button
              onClick={() => playVoiceWarning()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-black transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${isEmergency ? 'text-teal-600' : isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
              <span>{isEmergency ? 'Listen Priority Guidance' : t.voiceWarning.playAgain}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
