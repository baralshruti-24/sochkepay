import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Layers,
  Sparkles,
  Milestone,
  CheckCircle2,
  Lock,
  Cpu,
  Globe,
  Users,
} from 'lucide-react';

export const AboutFuturePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Architecture & Future Roadmap</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Engineering Trust for 350M+ UPI Citizens
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-3xl">
          SochKe Pay is architected as an explainable, on-device contextual intelligence layer that bridges the psychological gap between human cognitive vulnerability and lightning-fast digital payment rails.
        </p>
      </div>

      {/* 2. Core Philosophy: Why Social Engineering Requires On-Device Context */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          The Fundamental Architectural Paradigm
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <h3 className="font-bold text-base text-rose-950">
              Why Backend Bank ML Alone Fails
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Bank servers only see a valid PIN submitted from a genuine device with genuine credentials. They cannot see that the user is trembling on a coercive phone call with an imposter, nor that their screen is being mirrored via AnyDesk.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <h3 className="font-bold text-base text-emerald-950">
              The SochKe Pay Edge Solution
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              SochKe lives on the user's phone. By coupling device telemetry (call status, screen-sharing daemon, velocity) with rule-based explainability and spoken voice interventions, it breaks the fraudster's psychological grip before the PIN screen is ever rendered.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Phased Roadmap */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5">
          <Milestone className="w-6 h-6 text-sky-600" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            5-Phase Implementation Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-400 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              Phase 1 (Current)
            </span>
            <h4 className="font-bold text-sm text-slate-900">Explainable Prototype</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rule engine, multi-lingual audio synthesis, familiar image auth, and TAALA lock.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
              Phase 2
            </span>
            <h4 className="font-bold text-sm text-slate-900">Android Accessibility SDK</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time foreground service detecting active calls, remote screen mirror tools (AnyDesk, TeamViewer).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
              Phase 3
            </span>
            <h4 className="font-bold text-sm text-slate-900">On-Device Voice AI</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sub-100ms conversational safety assistant using compact quantized Small Language Models.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
              Phase 4
            </span>
            <h4 className="font-bold text-sm text-slate-900">NPCI / Bank Integration</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Federated risk scoring APIs integrated directly with UPI PSP applications (BHIM, Google Pay, PhonePe).
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              Phase 5
            </span>
            <h4 className="font-bold text-sm text-slate-900">Pan-India Civic Shield</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Collaborative scam registry synced with National Cyber Crime Reporting Portal (1930 Helpline).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
