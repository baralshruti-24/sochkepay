import React from 'react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import { Users, Clock, CheckCircle, XCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface GuardianApprovalModalProps {
  transaction: Transaction;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export const GuardianApprovalModal: React.FC<GuardianApprovalModalProps> = ({
  transaction,
  onApprove,
  onReject,
  onClose,
}) => {
  const { t, user } = useApp();
  const guardian = user.guardian;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        id="guardian-approval-modal"
        className="bg-white rounded-3xl border border-amber-300 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-6"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Family Guardian Mode
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {t.guardian.pendingApprovalTitle}
            </h3>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Transaction Review</span>
            <span className="text-rose-600 flex items-center gap-1 font-extrabold">
              <ShieldAlert className="w-3.5 h-3.5" /> High Risk Alert
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xl font-black text-slate-900">
                ₹{transaction.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-xs font-semibold text-slate-600">
                To: {transaction.recipient.name} ({transaction.recipient.vpa})
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              Awaiting Approval
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {t.guardian.pendingApprovalDesc}
          </p>
        </div>

        {/* Simulated Guardian Persona Notification Box */}
        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Guardian: {guardian?.name || 'Ananya (Daughter)'}
            </span>
            <span className="text-sky-700 font-mono text-[11px]">{guardian?.phoneMasked}</span>
          </div>
          <p className="text-xs text-sky-800 leading-relaxed">
            "A high-risk payment of ₹{transaction.amount.toLocaleString('en-IN')} to an unverified recipient was initiated from Shruti's phone. Please confirm if this is authorized."
          </p>
        </div>

        {/* Simulator Actions for Judges & Demo */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Demo Actions (Simulate Guardian Decision):
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReject}
              className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>{t.guardian.simulatedReject}</span>
            </button>

            <button
              onClick={onApprove}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-600/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.guardian.simulatedApprove}</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-1">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
          >
            Close & Review Details
          </button>
        </div>
      </div>
    </div>
  );
};
