import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Transaction } from '../types';
import { useApp } from '../context/AppContext';
import { SochuMascot } from '../mascot/SochuMascot';
import { CheckCircle2, ArrowRight, BookOpen, ShieldCheck, ShieldAlert, ExternalLink, Phone } from 'lucide-react';

interface PaymentSuccessModalProps {
  transaction: Transaction;
  onDone: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ transaction, onDone }) => {
  const { t, navigateTo } = useApp();

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#38BDF8', '#F59E0B', '#6366F1'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const getEducationalText = () => {
    switch (transaction.educationalLesson) {
      case 'refundScamRule':
        return t.learn.refundScamDesc;
      case 'digitalArrestRule':
        return t.learn.digitalArrestDesc;
      case 'qrRule':
        return t.learn.qrRuleDesc;
      case 'pinRule':
      default:
        return t.learn.pinRuleDesc;
    }
  };

  const wasRiskyPaymentCompleted =
    transaction.status === 'SUCCESS' &&
    (transaction.riskAssessment?.riskLevel === 'HIGH' || transaction.riskAssessment?.riskLevel === 'CRITICAL');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        id="payment-success-modal"
        className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-6 text-center"
      >
        {/* Sochu Mascot in Success Mood */}
        <div className="flex justify-center -mt-2">
          <SochuMascot mood="SUCCESS" size="md" showDialogue={true} />
        </div>

        {/* Success Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Payment Successfully Protected & Authorized</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-2">
            ₹{transaction.amount.toLocaleString('en-IN')}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Sent to {transaction.recipient.name} ({transaction.recipient.vpa})
          </p>
        </div>

        {/* Auth method pill */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Verified via {
              transaction.authUsed === 'pin'
                ? 'Standard UPI PIN (Low-Risk Seamless Flow)'
                : transaction.authUsed === 'multi_factor_tiered'
                ? 'Adaptive Multi-Factor Tiered Shield (PIN + Multi-Auth)'
                : transaction.authUsed === 'biometric'
                ? 'Device Biometrics'
                : transaction.authUsed === 'familiar_image'
                ? 'Familiar Safety Picture'
                : 'Voice Intent Authentication'
            }
          </span>
        </div>

        {/* What You Learned Today Micro-Card */}
        <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200 text-left space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>What you learned today</span>
          </div>
          <p className="text-xs text-amber-950 font-medium leading-relaxed">
            {getEducationalText()}
          </p>
        </div>

        {wasRiskyPaymentCompleted && (
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 text-left space-y-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-black text-rose-950">Concerned about this payment?</h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  This {transaction.riskAssessment?.riskLevel.toLowerCase()}-risk payment was completed. Report it immediately if you believe it was fraudulent.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href="https://cybercrime.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 text-[11px] font-black"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Cyber Crime Portal
              </a>
              <a
                href="tel:1930"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 text-[11px] font-black"
              >
                <Phone className="w-3.5 h-3.5" />
                Call 1930
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              onDone();
              navigateTo('dashboard');
            }}
            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
          >
            Go to Safety Dashboard
          </button>

          <button
            onClick={onDone}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 cursor-pointer transition-all"
          >
            <span>Done</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};