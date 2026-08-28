import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  ShieldCheck,
  CreditCard,
  QrCode,
  PhoneCall,
  Video,
  AlertOctagon,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'BASICS' | 'SCAMS' | 'CHECKLIST'>('BASICS');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Payment Immunity Academy</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          {t.learn.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
          {t.learn.subtitle}
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('BASICS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'BASICS'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.learn.tabBasics}
          </button>
          <button
            onClick={() => setActiveTab('SCAMS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'SCAMS'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.learn.tabScams}
          </button>
          <button
            onClick={() => setActiveTab('CHECKLIST')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'CHECKLIST'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.learn.tabChecklist}
          </button>
        </div>
      </div>

      {/* Tab 1: UPI Basics */}
      {activeTab === 'BASICS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl">
              🔑
            </div>
            <h3 className="text-lg font-black text-slate-900">{t.learn.pinRuleTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t.learn.pinRuleDesc}
            </p>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold">
              ✅ Golden Mantra: "Receiving Money = Zero PIN Needed"
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-black text-xl">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{t.learn.qrRuleTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {t.learn.qrRuleDesc}
            </p>
            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-sky-900 text-xs font-bold">
              ✅ Golden Mantra: "Scanning a QR Code always sends money out"
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scam Patterns Exposed */}
      {activeTab === 'SCAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">{t.learn.refundScamTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.learn.refundScamDesc}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">{t.learn.digitalArrestTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.learn.digitalArrestDesc}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">{t.learn.customerCareTitle}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.learn.customerCareDesc}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Checklist */}
      {activeTab === 'CHECKLIST' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 max-w-2xl mx-auto">
          <h3 className="text-lg font-black text-slate-900">
            {t.checklist.title}
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700">
            <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{t.checklist.q1}</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{t.checklist.q2}</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{t.checklist.q3}</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{t.checklist.q4}</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{t.checklist.q5}</span>
            </li>
            <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{t.checklist.q6}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
