import React from 'react';
import { useApp } from '../context/AppContext';
import { demoScenarios } from '../data/mockData';
import { Sliders, Code2, Sparkles, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export const DemoControlPanel: React.FC = () => {
  const {
    t,
    currentRecipient,
    currentAmount,
    setCurrentAmount,
    currentContext,
    setCurrentContext,
    activeRiskAssessment,
    loadScenario,
    activeScenarioId,
    language,
    setLanguage,
    user,
    navigateTo,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Hackathon Judge & Reviewer Test Bench</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Demo Control & Telemetry Inspector
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-2xl">
          Instantly evaluate how the rule-based explainability engine calculates risk scores, triggers voice scripts, and injects adaptive friction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              1. Preset Scenarios
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {demoScenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => loadScenario(sc.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    activeScenarioId === sc.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-extrabold truncate">{sc.titleKey}</p>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {sc.expectedRisk} Risk
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Context Toggles */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              2. Live Signal Modulation
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount: ₹{currentAmount.toLocaleString('en-IN')}
                </label>
                <input
                  type="range"
                  min={50}
                  max={50000}
                  step={250}
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentContext.activeCall}
                    onChange={(e) =>
                      setCurrentContext(p => ({ ...p, activeCall: e.target.checked }))
                    }
                    className="accent-slate-900"
                  />
                  <span>Active Phone Call</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentContext.screenSharing}
                    onChange={(e) =>
                      setCurrentContext(p => ({ ...p, screenSharing: e.target.checked }))
                    }
                    className="accent-slate-900"
                  />
                  <span>Screen Sharing</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentContext.isNightTime}
                    onChange={(e) =>
                      setCurrentContext(p => ({ ...p, isNightTime: e.target.checked }))
                    }
                    className="accent-slate-900"
                  />
                  <span>2:00 AM Night Time</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentContext.appSwitchCount >= 5}
                    onChange={(e) =>
                      setCurrentContext(p => ({
                        ...p,
                        appSwitchCount: e.target.checked ? 6 : 0,
                      }))
                    }
                    className="accent-slate-900"
                  />
                  <span>Frequent App Switches</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Engine Output Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black tracking-wide text-white">
                  Live RiskEngine Output JSON
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-md">
                Score: {activeRiskAssessment.riskScore} • Level: {activeRiskAssessment.riskLevel}
              </span>
            </div>

            <pre className="text-[11px] font-mono bg-slate-900 p-4 rounded-2xl overflow-x-auto text-emerald-400 max-h-96 leading-relaxed">
              {JSON.stringify(activeRiskAssessment, null, 2)}
            </pre>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => navigateTo('pay')}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Test in Pay Flow</span>
              </button>

              <button
                onClick={() => navigateTo('voice-studio')}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Creator Voice Studio 🎙️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
