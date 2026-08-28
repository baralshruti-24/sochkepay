import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Unlock, ShieldAlert, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface TaalaLockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaalaLockModal: React.FC<TaalaLockModalProps> = ({ isOpen, onClose }) => {
  const { t, isTaalaLocked, lockTaala, unlockTaala } = useApp();

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<any>(null);

  if (!isOpen) return null;

  const startHold = () => {
    setIsHolding(true);
    let progress = 0;
    holdIntervalRef.current = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        setHoldProgress(0);
        lockTaala();
      }
    }, 100);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleUnlock = () => {
    unlockTaala();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        id="taala-lock-modal"
        className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-center"
      >
        {/* Header Icon */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
              isTaalaLocked
                ? 'bg-rose-100 text-rose-600 border-2 border-rose-300 animate-pulse'
                : 'bg-amber-100 text-amber-700 border-2 border-amber-300'
            }`}
          >
            {isTaalaLocked ? <Lock className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
          </div>
        </div>

        {/* Titles */}
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {isTaalaLocked ? t.taala.lockedStatus : t.taala.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
            {isTaalaLocked ? t.taala.lockedDesc : t.taala.subtitle}
          </p>
        </div>

        {/* Lock / Unlock State Control */}
        {!isTaalaLocked ? (
          <div className="space-y-4 py-3">
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-left text-xs text-amber-900 font-medium leading-relaxed">
              ⚠️ <strong>When to use TAALA:</strong> If you received a suspicious call, were asked to install an app, or suspect someone is attempting to scam you, lock TAALA immediately.
            </div>

            {/* Hold to Lock Interactive Button */}
            <div className="relative max-w-xs mx-auto">
              <button
                onMouseDown={startHold}
                onMouseUp={cancelHold}
                onMouseLeave={cancelHold}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
                className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-sm flex items-center justify-center gap-2 select-none shadow-lg shadow-rose-600/25 cursor-pointer transition-all relative overflow-hidden"
              >
                {/* Hold progress bar fill */}
                {isHolding && (
                  <div
                    className="absolute inset-0 bg-rose-900/50 transition-all duration-75"
                    style={{ width: `${holdProgress}%` }}
                  />
                )}
                <Lock className="w-4 h-4 relative z-10" />
                <span className="relative z-10">
                  {isHolding ? `Locking (${holdProgress}%)...` : t.taala.holdToLock}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left text-xs text-emerald-900 font-medium leading-relaxed flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{t.taala.safeNote}</span>
            </div>

            <button
              onClick={handleUnlock}
              className="w-full max-w-xs mx-auto py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Unlock className="w-4 h-4 text-amber-400" />
              <span>{t.taala.unlockBtn}</span>
            </button>
          </div>
        )}

        <div className="border-t border-slate-100 pt-4 flex justify-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
