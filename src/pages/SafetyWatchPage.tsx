import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  PlusCircle,
  Search,
  CheckCircle,
  Layers,
  Sparkles,
  ThumbsUp,
  ExternalLink,
  Phone,
  ShieldCheck,
  Zap,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { mockRecipients } from '../data/mockData';

export const SafetyWatchPage: React.FC = () => {
  const {
    t,
    safetyWatchList,
    reportSuspiciousAccount,
    upvoteReport,
    setCurrentRecipient,
    setCurrentAmount,
    setCurrentNote,
    setCurrentContext,
    navigateTo,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportVpa, setReportVpa] = useState('');
  const [reportPhone, setReportPhone] = useState('');
  const [reportCategory, setReportCategory] = useState('Refund QR Code Scam');
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredList = safetyWatchList.filter((item) => {
    const matchesSearch =
      item.vpaMasked.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clusterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patterns.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportVpa.trim()) return;
    reportSuspiciousAccount(reportVpa.trim(), reportReason.trim(), reportCategory, reportPhone.trim());
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setIsReportModalOpen(false);
      setReportVpa('');
      setReportPhone('');
      setReportReason('');
      setToastMessage('✅ Thank you! Suspicious account registered in Civic Fraud Registry.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  const handleTestInSimulator = (item: any) => {
    // Set simulator state to this flagged account
    setCurrentRecipient({
      id: `REC_FLAGGED_${Date.now()}`,
      name: item.category.split(' ')[0] + ' Flagged Mule Target',
      vpa: item.vpaMasked.replace('••••', 'scam'),
      bankName: 'Flagged Payment Account',
      category: 'suspicious',
      isKnown: false,
      historyCount: 0,
      totalPaidAmount: 0,
      safetyWatchStatus: 'CONFIRMED_SUSPICIOUS',
      safetyReportsCount: item.reportCount,
      verifiedMerchant: false,
      lastPaidDate: undefined,
    });
    setCurrentAmount(12000);
    setCurrentNote(`Payment requested via ${item.category}`);
    setCurrentContext({
      activeCall: true,
      screenSharing: false,
      appSwitchCount: 2,
      timeOfDayHour: 15,
      isNightTime: false,
      urgencyPrompted: true,
      emergencyType: 'none',
      isNewDevice: false,
      sourceAppFlow: 'whatsapp_call',
    });
    navigateTo('pay');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Community Defense & Scam Registry</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.safetyWatch.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Citizens collaborate to flag fraud mule VPAs, fake customer care numbers, refund QR tricksters, and extortionists. Flagged accounts immediately trigger warning pauses across the network.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-rose-600/25 cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>Report Suspicious Account</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-emerald-100 border border-emerald-500 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Governance Lifecycle Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">
              Stage 1
            </span>
            <span className="text-xs font-bold text-slate-400">Citizen Reports</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900">{t.safetyWatch.communityReported}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Citizens flag suspicious VPAs or fake buyer phone numbers. Community upvotes corroborate patterns in real-time.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-900 uppercase tracking-wider bg-sky-100 px-2.5 py-0.5 rounded-md">
              Stage 2
            </span>
            <span className="text-xs font-bold text-slate-400">Cluster Analysis</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900">{t.safetyWatch.underReview}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Graph correlation links devices, mule rings, and keywords like "refund", "electricity block", or "police".
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-900 uppercase tracking-wider bg-rose-100 px-2.5 py-0.5 rounded-md">
              Stage 3
            </span>
            <span className="text-xs font-bold text-slate-400">Live Intercept</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900">{t.safetyWatch.confirmedSuspicious}</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            High-confidence alert triggers Sochu Mascot barrier and loud voice pause during live payments in SochKe Pay.
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by masked VPA, scam category, or keywords (e.g. OLX, refund, electricity)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'CONFIRMED_SUSPICIOUS', 'UNDER_REVIEW', 'COMMUNITY_REPORTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Flagged Records' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Registry Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const isConfirmed = item.status === 'CONFIRMED_SUSPICIOUS';
            const isReview = item.status === 'UNDER_REVIEW';
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border bg-slate-50 hover:bg-white transition-all space-y-4 shadow-xs border-slate-200 hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold block">
                      {item.clusterId}
                    </span>
                    <h3 className="text-base font-black text-slate-900 tracking-tight font-mono">
                      {item.vpaMasked}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      isConfirmed
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : isReview
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-800">
                    Category: <span className="text-slate-600">{item.category}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.patterns.map((p, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-600"
                      >
                        • {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions: Upvote & Test in Simulator */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => upvoteReport(item.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                    title="Confirm you were targeted by this scammer too"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-sky-600" />
                    <span>{item.reportCount} Corroborations</span>
                  </button>

                  <button
                    onClick={() => handleTestInSimulator(item)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-rose-600" />
                    <span>Test Simulator Intercept</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center font-medium pt-2">
          {t.safetyWatch.disclaimer}
        </p>
      </div>

      {/* 4. Report New Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-black text-slate-900">
                  Report Suspicious Account / Scammer
                </h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Report Submitted to Civic Watch</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Thank you for keeping fellow citizens safe. This VPA will be flagged across SochKe Pay.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Suspicious UPI ID / VPA *
                  </label>
                  <input
                    type="text"
                    required
                    value={reportVpa}
                    onChange={(e) => setReportVpa(e.target.value)}
                    placeholder="e.g. fake.refund98@ybl or scammer.vpa@oksbi"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Scammer Phone Number / WhatsApp Caller ID (Optional)
                  </label>
                  <input
                    type="tel"
                    value={reportPhone}
                    onChange={(e) => setReportPhone(e.target.value)}
                    placeholder="e.g. +91 98765 00000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Scam Category *
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>Refund QR Code Scam</option>
                    <option>OLX / Marketplace Army Officer Fraud</option>
                    <option>Family Impersonation / Urgent Bail Transfer</option>
                    <option>SIM / Electricity Deactivation Threat</option>
                    <option>Digital Arrest & Fake Police Threat</option>
                    <option>Fake Loan Upfront Processing Fee</option>
                    <option>Lottery / Prize Advance Tax Scam</option>
                    <option>Fake E-Commerce Customer Care</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    What happened? (Describe scam speech or trick)
                  </label>
                  <textarea
                    rows={3}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="e.g. Caller told me my electricity will be cut off in 30 mins unless I scan their QR code..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer transition-all"
                  >
                    Register Suspicious Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
