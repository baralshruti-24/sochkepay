import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SochuMascot } from '../mascot/SochuMascot';
import { TaalaLockModal } from '../safety/TaalaLockModal';
import {
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Lock,
  Eye,
  Users,
  BookOpen,
  Zap,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle2,
  Clock,
  ChevronDown,
  Filter,
  Layers,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t, user, language, transactions, navigateTo, isTaalaLocked, lockTaala, unlockTaala } = useApp();
  const [isTaalaModalOpen, setIsTaalaModalOpen] = useState(false);
  const [selectedDashboardView, setSelectedDashboardView] = useState<'all' | 'profile' | 'stats' | 'actions' | 'history'>('all');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  const protectedPaymentsCount = transactions.length;
  const suspiciousCount = transactions.filter(
    (tx) => tx.riskAssessment && (tx.riskAssessment.riskLevel === 'HIGH' || tx.riskAssessment.riskLevel === 'CRITICAL')
  ).length;

  const viewOptions = [
    { id: 'all', label: 'Full Dashboard (All Modules)', icon: LayoutGrid, desc: 'Show all safety metrics, profile, and recent history' },
    { id: 'profile', label: 'Safety Readiness & Baseline', icon: ShieldCheck, desc: 'Behavioral parameters, biometric binding & score' },
    { id: 'stats', label: "Today's Protection & Family", icon: TrendingUp, desc: 'Scam interception counts & guardian approval status' },
    { id: 'actions', label: 'Quick Safety Shortcuts', icon: Zap, desc: 'Jump to simulator, mule database, & family controls' },
    { id: 'history', label: 'Recent Payment Log', icon: History, desc: 'Transaction timestamps, recipients & risk status' },
  ];

  const currentViewObj = viewOptions.find((v) => v.id === selectedDashboardView) || viewOptions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP GREETING & SAFETY STATUS BANNER WITH VIEW DROPDOWN */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.dashboard.protectedBadge}</span>
            </div>

            {/* Laptop / Desktop Dropdown View Filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Filter or switch dashboard layout view"
              >
                <Layers className="w-3 h-3 text-sky-400" />
                <span>View: {currentViewObj.label.split(' ')[0]}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isViewDropdownOpen ? 'rotate-180 text-sky-400' : ''}`} />
              </button>

              {isViewDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 px-2 py-1 tracking-wider">
                    Select Dashboard Focus:
                  </div>
                  <div className="space-y-1">
                    {viewOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedDashboardView === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSelectedDashboardView(opt.id as any);
                            setIsViewDropdownOpen(false);
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-sky-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-white' : 'text-sky-400'}`} />
                          <div>
                            <div className="text-xs font-black">{opt.label}</div>
                            <div className="text-[10px] text-slate-300/80 font-medium">{opt.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.dashboard.greeting}, {user.name.split(' ')[0]} 🙏
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl leading-relaxed">
            SochKe Pay is actively safeguarding your digital payments with contextual intelligence and local biometric verification.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('pay')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>{t.dashboard.actionPay}</span>
            </button>

            <button
              onClick={() => setIsTaalaModalOpen(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all border ${
                isTaalaLocked
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-800 text-rose-300 border-rose-500/40 hover:bg-rose-950/40'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isTaalaLocked ? t.nav.taalaLocked : '🔒 Emergency Lock TAALA'}</span>
            </button>
          </div>
        </div>

        {/* Mascot Widget */}
        <div className="z-10 self-center md:self-auto flex-shrink-0">
          <SochuMascot
            mood="LOW"
            size="sm"
            showDialogue={true}
            customMessage={`All systems safe, ${user.name.split(' ')[0]}!`}
          />
        </div>
      </div>

      {/* 2. PAYMENT SAFETY PROFILE & METRICS */}
      {(selectedDashboardView === 'all' || selectedDashboardView === 'profile' || selectedDashboardView === 'stats' || selectedDashboardView === 'actions') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (Not a credit score) */}
          {(selectedDashboardView === 'all' || selectedDashboardView === 'profile') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {t.dashboard.safetyProfileTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-800">
                  Optimal (94%)
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {t.dashboard.safetyProfileDesc}
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Safety Readiness Score</span>
                  <span className="text-emerald-600 font-black">94 / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full w-[94%]" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium pt-1">
                  💡 {t.dashboard.scoreExplanation}
                </p>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Normal Baseline</span>
                  <span>₹2,800 avg / transfer</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Active Safe Hours</span>
                  <span>8:00 AM – 10:00 PM</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Familiar Contacts</span>
                  <span>14 Verified Accounts</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Biometrics & SIM</span>
                  <span className="text-emerald-600 font-bold">Face + Voice + Touch Bound</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500">Voice Alerts</span>
                  <span className="text-sky-700 font-bold">{t.dashboard.voiceAlerts}</span>
                </div>
              </div>

              <button
                onClick={() => navigateTo('register')}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>{t.nav.register}</span>
              </button>
            </div>
          )}

          {/* Today's Activity Stats */}
          {(selectedDashboardView === 'all' || selectedDashboardView === 'stats') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {t.dashboard.todayStats}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                  <span className="text-xs font-bold text-sky-800">{t.dashboard.protectedCount}</span>
                  <p className="text-2xl font-black text-sky-950">{protectedPaymentsCount}</p>
                  <span className="text-[10px] text-sky-700 font-medium">Real-time checked</span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                  <span className="text-xs font-bold text-rose-800">{t.dashboard.suspiciousPrevented}</span>
                  <p className="text-2xl font-black text-rose-950">{suspiciousCount}</p>
                  <span className="text-[10px] text-rose-700 font-medium">Scams paused</span>
                </div>
              </div>

              {/* Family Guardian status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Family Guardian</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    user.guardian?.enabled
                      ? 'text-emerald-700 bg-emerald-100'
                      : 'text-slate-600 bg-slate-200'
                  }`}>
                    {user.guardian?.enabled ? 'On' : 'Off'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {user.guardian?.enabled ? (
                    <>Guardian: <strong>{user.guardian.name} ({user.guardian.relationship})</strong> assists with payments above ₹{user.guardian.approvalThreshold.toLocaleString('en-IN')}.</>
                  ) : (
                    'Family Mode is disabled. Guardian approval is not active.'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Quick Safety Actions */}
          {(selectedDashboardView === 'all' || selectedDashboardView === 'actions') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                {t.dashboard.quickActions}
              </h3>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => navigateTo('pay')}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-left transition-colors cursor-pointer group"
                >
                  <Zap className="w-5 h-5 text-sky-600 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-900">{t.dashboard.actionPay}</p>
                  <span className="text-[10px] text-slate-500">Simulate transfer</span>
                </button>

                <button
                  onClick={() => navigateTo('safety-watch')}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-left transition-colors cursor-pointer group"
                >
                  <Eye className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-900">{t.dashboard.actionSafetyWatch}</p>
                  <span className="text-[10px] text-slate-500">Mule registry</span>
                </button>

                <button
                  onClick={() => navigateTo('guardian')}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 text-left transition-colors cursor-pointer group"
                >
                  <Users className="w-5 h-5 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-900">{t.dashboard.actionGuardian}</p>
                  <span className="text-[10px] text-slate-500">Family settings</span>
                </button>

                <button
                  onClick={() => navigateTo('learn')}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition-colors cursor-pointer group"
                >
                  <BookOpen className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-900">{t.dashboard.actionLearn}</p>
                  <span className="text-[10px] text-slate-500">Scam habits</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RECENT ACTIVITY TABLE */}
      {(selectedDashboardView === 'all' || selectedDashboardView === 'history') && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-slate-500" />
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {t.dashboard.recentActivity}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">
                {transactions.length} Total Records
              </span>
              {selectedDashboardView !== 'all' && (
                <button
                  onClick={() => setSelectedDashboardView('all')}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  Show All Modules
                </button>
              )}
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-semibold text-slate-600">{t.dashboard.emptyHistory}</p>
              <button
                onClick={() => navigateTo('pay')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Simulate First Payment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const isFlagged =
                  tx.riskAssessment &&
                  (tx.riskAssessment.riskLevel === 'HIGH' || tx.riskAssessment.riskLevel === 'CRITICAL');
                return (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                          isFlagged
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {tx.recipient.name.substring(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{tx.recipient.name}</span>
                          <span className="text-xs font-mono text-slate-400 font-normal">
                            ({tx.recipient.vpa})
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {tx.timestamp} • {tx.note || 'No note'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900">
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </p>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            tx.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'PENDING_GUARDIAN'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAALA Modal Component */}
      <TaalaLockModal isOpen={isTaalaModalOpen} onClose={() => setIsTaalaModalOpen(false)} />
    </div>
  );
};

