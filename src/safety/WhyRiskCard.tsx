import React from 'react';
import { RiskAssessment } from '../types';
import { useApp } from '../context/AppContext';
import {
  AlertOctagon,
  UserX,
  PhoneCall,
  TrendingUp,
  Moon,
  Layers,
  MonitorUp,
  ShieldAlert,
  Info,
  HelpCircle,
  CheckCircle2,
  PhoneOff,
} from 'lucide-react';

interface WhyRiskCardProps {
  assessment: RiskAssessment;
}

export const WhyRiskCard: React.FC<WhyRiskCardProps> = ({ assessment }) => {
  const { t } = useApp();

  const getSignalIcon = (code: string) => {
    switch (code) {
      case 'NEW_RECIPIENT':
        return <UserX className="w-4 h-4 text-amber-600" />;
      case 'ACTIVE_CALL_STRANGER':
        return <PhoneCall className="w-4 h-4 text-rose-600" />;
      case 'UNUSUAL_AMOUNT':
      case 'MASSIVE_AMOUNT_DEVIATION':
        return <TrendingUp className="w-4 h-4 text-amber-600" />;
      case 'LATE_NIGHT_HIGH_VALUE':
        return <Moon className="w-4 h-4 text-indigo-600" />;
      case 'SCREEN_SHARING_ACTIVE':
        return <MonitorUp className="w-4 h-4 text-rose-600" />;
      case 'HIGH_APP_SWITCHING':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'RECIPIENT_FLAGGED_CONFIRMED':
      case 'RECIPIENT_UNDER_REVIEW':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'CONTEXT_MISMATCH':
        return <AlertOctagon className="w-4 h-4 text-rose-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSignalTitle = (titleKey: string) => {
    return (t.whyRisk as any)[titleKey] || titleKey;
  };

  const getSignalExplanation = (explanationKey: string) => {
    return (t.whyRisk as any)[explanationKey] || explanationKey;
  };

  return (
    <div
      id="why-risk-card"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6 animate-in fade-in duration-300"
    >
      {/* Title */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {t.whyRisk.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Transparent contextual signals evaluated in real-time
          </p>
        </div>
      </div>

      {/* Signal Breakdown List */}
      <div className="space-y-3">
        {assessment.signals.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>No high-risk signals detected. This transaction matches your familiar pattern.</span>
          </div>
        ) : (
          assessment.signals.map((signal, idx) => (
            <div
              key={signal.code + idx}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                signal.severity === 'critical'
                  ? 'bg-rose-50/80 border-rose-200'
                  : signal.severity === 'high'
                  ? 'bg-rose-50/50 border-rose-200/80'
                  : 'bg-amber-50/60 border-amber-200'
              }`}
            >
              <div className="mt-0.5 p-1.5 rounded-xl bg-white shadow-xs">
                {getSignalIcon(signal.code)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {getSignalTitle(signal.titleKey)}
                  </h4>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      signal.severity === 'critical'
                        ? 'bg-rose-600 text-white'
                        : signal.severity === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    +{signal.points} pts
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  {getSignalExplanation(signal.explanationKey)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Note if friend on call exemption was applied */}
        {assessment.isFriendExemption && (
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
            <span>{t.whyRisk.friendExemptionNote}</span>
          </div>
        )}

        {/* Note if emergency fast-track was applied */}
        {assessment.isEmergencyFastTrack && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{t.whyRisk.emergencyFastTrackNote}</span>
          </div>
        )}
      </div>

      {/* Two Essential Answer Cards: What this means & What should you do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Card 1: What this means */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 border border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>{t.whyRisk.whatMeansTitle}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {t.whyRisk.whatMeansText}
          </p>
        </div>

        {/* Card 2: What you should do */}
        <div className="bg-amber-50 rounded-2xl p-4 space-y-2 border border-amber-200 text-amber-950 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 text-xs font-black uppercase tracking-wider">
            <PhoneOff className="w-4 h-4 text-amber-700" />
            <span>{t.whyRisk.whatToDoTitle}</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-semibold">
            {t.whyRisk.whatToDoText}
          </p>
        </div>
      </div>
    </div>
  );
};
