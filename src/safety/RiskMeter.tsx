import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskMeterProps {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  showLabels?: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, riskLevel, showLabels = true }) => {
  const getLevelDetails = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL RISK',
          action: 'PAYMENT BLOCKED',
          color: 'text-rose-600',
          bgPill: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: AlertOctagon,
          barColor: 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-700',
        };
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          action: 'VERIFY BEFORE PAYING',
          color: 'text-orange-600',
          bgPill:'bg-orange-100 text-orange-800 border-orange-300',
          icon: ShieldAlert,
          barColor:'bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500',
        };
      case 'CAUTION':
        return {
          label: 'CAUTION',
          action: 'REVIEW DETAILS',
          color: 'text-amber-600',
          bgPill: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: AlertTriangle,
          barColor: 'bg-gradient-to-r from-emerald-400 via-amber-400 to-amber-500',
        };
      case 'LOW':
      default:
        return {
          label: 'SAFE TO PAY',
          action: 'NORMAL FLOW',
          color: 'text-emerald-600',
          bgPill: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        };
    }
  };

  const details = getLevelDetails();
  const Icon = details.icon;

  return (
    <div id="risk-meter-container" className="space-y-3">
      {/* Top Value and Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Context Risk Score
          </span>
          <span className={`text-xl font-black font-mono ${details.color}`}>
            {score}<span className="text-xs text-slate-400 font-sans">/100</span>
          </span>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold border ${details.bgPill}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{details.label}</span>
        </div>
      </div>

      <div className={`text-[11px] font-black uppercase tracking-wide ${details.color}`}>
        {details.action}
      </div>

      {/* Visual Progress Bar Gauge */}
      <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
        {/* Background Zone Tints */}
        <div className="absolute inset-0 grid grid-cols-4 opacity-25">
          <div className="bg-emerald-400 border-r border-slate-300" />
          <div className="bg-amber-300 border-r border-slate-300" />
          <div className="bg-amber-500 border-r border-slate-300" />
          <div className="bg-rose-600" />
        </div>

        {/* Dynamic Animated Meter Fill */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-xs ${details.barColor}`}
          style={{ width: `${Math.max(5, score)}%` }}
        />
        <div className="absolute inset-y-0 left-[25%] w-px bg-white/80" />
        <div className="absolute inset-y-0 left-[55%] w-px bg-white/80" />
        <div className="absolute inset-y-0 left-[80%] w-px bg-white/80" />
      </div>

      {/* Axis Labels */}
      {showLabels && (
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 px-0.5">
          <span>0 (Normal)</span>
          <span className="text-amber-700">25 (Caution)</span>
          <span className="text-orange-700">55 (High)</span>
          <span className="text-rose-700 font-extrabold">80+ (Critical)</span>
        </div>
      )}
    </div>
  );
};
