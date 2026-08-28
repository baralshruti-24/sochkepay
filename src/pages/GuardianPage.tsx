import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  Sliders,
  CheckCircle2,
  Clock,
  PhoneCall,
  Lock,
  Sparkles,
} from 'lucide-react';

export const GuardianPage: React.FC = () => {
  const { t, user, updateGuardian, navigateTo } = useApp();
  const guardian = user.guardian;

  const [isEnabled, setIsEnabled] = useState(guardian?.enabled ?? true);
  const [threshold, setThreshold] = useState(guardian?.approvalThreshold ?? 15000);
  const [name, setName] = useState(guardian?.name ?? 'Ananya');
  const [relationType, setRelationType] = useState<string>(guardian?.relationship ?? 'Daughter');
  const [customRelation, setCustomRelation] = useState<string>('');
  const [saved, setSaved] = useState(false);

  const STANDARD_RELATIONS = [
    { value: 'Daughter', label: 'Daughter (बेटी / ଝିଅ)' },
    { value: 'Son', label: 'Son (बेटा / ପୁଅ)' },
    { value: 'Spouse', label: 'Spouse / Partner (पति-पत्नी / ଜୀବନସାଥୀ)' },
    { value: 'Mother', label: 'Mother (माता / ମାଆ)' },
    { value: 'Father', label: 'Father (पिता / ବାପା)' },
    { value: 'Brother', label: 'Brother (भाई / ଭାଇ)' },
    { value: 'Sister', label: 'Sister (बहन / ଭଉଣୀ)' },
    { value: 'Grandchild', label: 'Grandchild (पोता-पोती / ନାତି-ନାତୁଣୀ)' },
    { value: 'Trusted Friend', label: 'Trusted Friend (विश्वसनीय मित्र / ବିଶ୍ୱସ୍ତ ବନ୍ଧୁ)' },
    { value: 'Other', label: 'Others / Unconventional Relationship (अन्य संबंध)' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRelation = relationType === 'Other' ? (customRelation.trim() || 'Other Nominee') : relationType;
    updateGuardian({
      enabled: isEnabled,
      approvalThreshold: threshold,
      name,
      relationship: finalRelation,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Multi-Generational Protection</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.guardian.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {t.guardian.subtitle}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-900/40 border border-purple-700/50 text-xs text-purple-200 font-medium max-w-xs">
          🛡️ <strong>Opt-in & Dignified:</strong> {t.guardian.guardianNote}
        </div>
      </div>

      {/* 2. Main Config Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Guardian Configuration
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Verified
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Toggle Enabled */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Enable Family Mode</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Trigger review request when unusually high-risk transfers are detected.
                </p>
              </div>

              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  setIsEnabled(enabled);
                  updateGuardian({ enabled });
                }}
                className="w-5 h-5 accent-purple-600 rounded-md cursor-pointer"
              />
            </div>

            {/* Guardian Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {t.guardian.currentGuardian}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Guardian Relationship Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Guardian Relationship (संबंध / ସମ୍ପର୍କ)
              </label>
              <select
                value={relationType}
                onChange={(e) => setRelationType(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
              >
                {STANDARD_RELATIONS.map((rel) => (
                  <option key={rel.value} value={rel.value}>
                    {rel.label}
                  </option>
                ))}
              </select>

              {relationType === 'Other' && (
                <div className="pt-2 animate-fadeIn">
                  <label className="block text-[11px] font-bold text-purple-700 uppercase mb-1">
                    Specify Custom / Unconventional Relationship
                  </label>
                  <input
                    type="text"
                    value={customRelation}
                    onChange={(e) => setCustomRelation(e.target.value)}
                    placeholder="e.g. Neighborhood Elder, Mentor, Legal Caretaker, Niece, NGO Advocate"
                    className="w-full px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-300 text-xs font-bold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Threshold Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  {t.guardian.threshold}
                </label>
                <span className="text-sm font-black text-purple-700">
                  ₹{threshold.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={50000}
                step={2500}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 font-medium">
                High-risk transfers above this amount or suspicious impersonation attempts will prompt guardian authorization.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all"
            >
              {saved ? 'Settings Saved Successfully!' : 'Save Guardian Preferences'}
            </button>
          </form>
        </div>

        {/* Live Simulation Preview */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>How Guardian Notification Appears</span>
          </div>

          {/* Smartphone mockup */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border-4 border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>SochKe Family Alert</span>
              <span>Just now</span>
            </div>

            <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Request from Shruti</span>
              </div>

              <div className="space-y-1 text-xs text-slate-300 leading-relaxed font-medium">
                <p><strong className="text-white">Payment:</strong> ₹25,000 to Rakesh Kumar</p>
                <p className="text-[11px] text-slate-400 font-mono">rakesh897@okaxis</p>
              </div>

              <div className="rounded-xl bg-slate-900/70 border border-slate-700 p-3 space-y-2">
                <p className="text-[11px] font-black uppercase tracking-wide text-amber-300">
                  Why verification is needed
                </p>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li className="flex gap-2"><span className="text-rose-400">•</span><span>Recipient is new and not in Shruti&apos;s trusted history.</span></li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span><span>Amount is unusually high compared with the normal payment pattern.</span></li>
                  <li className="flex gap-2"><span className="text-rose-400">•</span><span>Payment was initiated while the recipient context is still unverified.</span></li>
                </ul>
              </div>

              <p className="text-[11px] text-amber-200 font-bold">
                Payment paused until a guardian reviews these signals.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => alert('Simulated Guardian Reject action.')}
                  className="py-2 rounded-xl bg-rose-600 text-white text-[11px] font-bold cursor-pointer hover:bg-rose-700"
                >
                  Block
                </button>
                <button
                  onClick={() => alert('Simulated Guardian Approve action.')}
                  className="py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-bold cursor-pointer hover:bg-emerald-700"
                >
                  Authorize
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center font-medium">
              Guardian sees recipient status and risk signals in clear terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
