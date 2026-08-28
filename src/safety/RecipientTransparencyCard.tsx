import React from 'react';
import { Recipient, TransactionContext } from '../types';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  History,
  TrendingUp,
  PhoneCall,
  CheckCircle,
  Building2,
  AlertOctagon,
} from 'lucide-react';

interface RecipientTransparencyCardProps {
  recipient: Recipient;
  amount: number;
  context: TransactionContext;
  riskScore: number;
}

export const RecipientTransparencyCard: React.FC<RecipientTransparencyCardProps> = ({
  recipient,
  amount,
  context,
  riskScore,
}) => {
  const { t, user } = useApp();

  const isHighRisk = riskScore >= 50;
  const isCaution = riskScore >= 25 && riskScore < 50;
  const isSafe = riskScore < 25;

  const baseline = user.baseline.averagePaymentAmount || 2800;
  const ratio = (amount / baseline).toFixed(1);

  return (
    <div
      id="recipient-transparency-card"
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-300"
    >
      {/* Top Header */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
            {t.transparency.youArePaying}
          </span>
        </div>
        <div className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {recipient.bankName}
        </div>
      </div>

      {/* Primary Recipient Identity Block */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar */}
            <div
              className={`w-13 h-13 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${
                recipient.safetyWatchStatus === 'CONFIRMED_SUSPICIOUS'
                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                  : recipient.isKnown
                  ? 'bg-sky-100 text-sky-700 border border-sky-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {recipient.avatarText || recipient.name.substring(0, 2).toUpperCase()}
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
                <span>{recipient.name}</span>
                {recipient.verifiedMerchant && (
                  <span title="Verified Business Merchant" className="inline-flex">
                    <CheckCircle className="w-4 h-4 text-sky-600 fill-sky-100" />
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-500 font-medium">
                {recipient.vpa}
              </p>
            </div>
          </div>

          {/* Recipient Status Badge */}
          <div>
            {recipient.safetyWatchStatus === 'CONFIRMED_SUSPICIOUS' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>{t.transparency.flaggedRecipient}</span>
              </span>
            ) : recipient.isKnown ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.transparency.knownRecipient}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.transparency.newRecipient}</span>
              </span>
            )}
          </div>
        </div>

        {/* 3 Metric Grid: History, Amount comparison, Context */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* History Pill */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.transparency.yourHistory}</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {recipient.isKnown
                ? t.transparency.historyCount
                    .replace('{count}', recipient.historyCount.toString())
                    .replace('{total}', recipient.totalPaidAmount.toLocaleString('en-IN'))
                : t.transparency.historyNever}
            </p>
          </div>

          {/* Amount Baseline Comparison */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.transparency.amountLabel}</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              <span className="text-sm font-extrabold text-slate-900">₹{amount.toLocaleString('en-IN')}</span>{' '}
              {Number(ratio) > 1.8 ? (
                <span className="text-rose-600 font-bold text-[11px]">({ratio}x your average)</span>
              ) : (
                <span className="text-emerald-700 font-medium text-[11px]">(Matches average)</span>
              )}
            </p>
          </div>

          {/* Active Context */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.transparency.contextLabel}</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {context.activeCall ? (
                <span className="text-amber-800 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  {t.transparency.onCallNotice}
                </span>
              ) : (
                <span className="text-slate-600">No active phone call</span>
              )}
            </p>
          </div>
        </div>

        {/* SochKe Assessment Bottom Bar */}
        <div
          className={`rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold border ${
            isHighRisk
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : isCaution
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">{t.transparency.sochkeSays}</span>
            <span>
              {isHighRisk
                ? t.transparency.pauseAndVerify
                : isCaution
                ? t.transparency.cautionAdvised
                : t.transparency.looksGood}
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
              isHighRisk
                ? 'bg-rose-600 text-white'
                : isCaution
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isHighRisk ? 'HIGH RISK' : isCaution ? 'CAUTION' : 'SAFE'}
          </div>
        </div>
      </div>
    </div>
  );
};
