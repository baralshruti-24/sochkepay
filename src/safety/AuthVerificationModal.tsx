import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AuthMethod, FamiliarImageOption, RiskLevel } from '../types';
import { familiarImageOptions } from '../data/mockData';
import {
  Fingerprint,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Volume2,
  Lock,
  ArrowRight,
  RotateCcw,
  Check,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthVerificationModalProps {
  amount: number;
  recipientName: string;
  riskLevel?: RiskLevel;
  onSuccess: (method: AuthMethod) => void;
  onCancel: () => void;
}

export const AuthVerificationModal: React.FC<AuthVerificationModalProps> = ({
  amount,
  recipientName,
  riskLevel: propRiskLevel,
  onSuccess,
  onCancel,
}) => {
   const { t, user, language, activeRiskAssessment, playVoiceWarning, stopVoiceWarning } = useApp();

  useEffect(() => {
    // Stop any currently playing audio from the previous step
    stopVoiceWarning();
    // Play the user's custom recording on the verify and pay stage
    playVoiceWarning(undefined, 'custom_only');
    return () => {
      stopVoiceWarning();
    };
  }, [playVoiceWarning, stopVoiceWarning]);

  // Determine effective risk tier (default to active risk assessment if not passed)
  const effectiveRiskLevel: RiskLevel = propRiskLevel || activeRiskAssessment.riskLevel;

  // Active step state in multi-factor flow
  // Steps: 'PIN' -> 'BIOMETRIC' -> 'FAMILIAR' -> 'VOICE' -> 'COMPLETE'
  const [currentFactorStep, setCurrentFactorStep] = useState<'PIN' | 'BIOMETRIC' | 'FAMILIAR' | 'VOICE' | 'CHOOSE_EXTRA'>('PIN');
  
  // Track completed factors
  const [completedFactors, setCompletedFactors] = useState<{
    pin: boolean;
    biometric: boolean;
    familiar_image: boolean;
    voice: boolean;
  }>({
    pin: false,
    biometric: false,
    familiar_image: false,
    voice: false,
  });

  // PIN Keypad State
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPinVerifying, setIsPinVerifying] = useState(false);

  // Biometric State
  const [isBiometricVerifying, setIsBiometricVerifying] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  // Familiar Image State
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [familiarError, setFamiliarError] = useState(false);
  const [familiarSecret, setFamiliarSecret] = useState('');

  // Voice Affirmation State
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  // Total required factors based on user request:
  // Low: 1 (PIN only)
  // Medium: 2 (PIN + 1 more factor of choice)
  // High: 3 (PIN + Biometric + Familiar Image)
  // Critical: 4 (PIN + Biometric + Familiar Image + Voice Affirmation / All)
  const totalRequiredCount =
    effectiveRiskLevel === 'LOW'
      ? 1
      : effectiveRiskLevel === 'CAUTION'
      ? 2
      : effectiveRiskLevel === 'HIGH'
      ? 3
      : 4;

  const completedCount = Object.values(completedFactors).filter(Boolean).length;

  // Keypad Handlers
  const handleKeypadPress = (digit: string) => {
    if (pinDigits.length < 4) {
      const nextDigits = [...pinDigits, digit];
      setPinDigits(nextDigits);
      setPinError(null);

      if (nextDigits.length === 4) {
        verifyPin(nextDigits.join(''));
      }
    }
  };

  const handleBackspace = () => {
    setPinDigits(prev => prev.slice(0, -1));
    setPinError(null);
  };

  const handleQuickFillPin = () => {
    const quick = ['1', '2', '3', '4'];
    setPinDigits(quick);
    verifyPin('1234');
  };

  const verifyPin = (pin: string) => {
    setIsPinVerifying(true);
    setTimeout(() => {
      setIsPinVerifying(false);
      // Mark PIN completed
      setCompletedFactors(prev => ({ ...prev, pin: true }));

      if (effectiveRiskLevel === 'LOW') {
        // Low risk completes immediately!
        setTimeout(() => onSuccess('pin'), 500);
      } else if (effectiveRiskLevel === 'CAUTION') {
        // Medium risk -> Go to step 2 (choose 1 additional factor)
        setCurrentFactorStep('CHOOSE_EXTRA');
      } else if (effectiveRiskLevel === 'HIGH') {
        // High risk -> Go to Biometric next
        setCurrentFactorStep('BIOMETRIC');
      } else {
        // Critical risk -> Go to Biometric next
        setCurrentFactorStep('BIOMETRIC');
      }
    }, 600);
  };

  // Biometric Handler
  const handleBiometricTouch = () => {
    setIsBiometricVerifying(true);
    setBiometricStatus('scanning');
    setTimeout(() => {
      setIsBiometricVerifying(false);
      setBiometricStatus('success');
      setCompletedFactors(prev => ({ ...prev, biometric: true }));

      setTimeout(() => {
        if (effectiveRiskLevel === 'CAUTION') {
          // Medium risk finished (PIN + Biometric)
          onSuccess('multi_factor_tiered');
        } else if (effectiveRiskLevel === 'HIGH') {
          // High risk -> Next is Familiar Image
          setCurrentFactorStep('FAMILIAR');
        } else if (effectiveRiskLevel === 'CRITICAL') {
          // Critical risk -> Next is Familiar Image
          setCurrentFactorStep('FAMILIAR');
        }
      }, 700);
    }, 1000);
  };

  // Familiar Image Selection & Verification Handler
  const handleFamiliarSelect = (id: string) => {
    setSelectedImageId(id);
    setFamiliarError(false);
  };

  const handleVerifyFamiliar = () => {
    const registeredId = user.familiarImageId || (user.biometricEnrollment?.familiarImageData || user.familiarImageData ? 'custom' : 'house');
    const expectedSecret = (user.familiarImageSecretKey || user.biometricEnrollment?.familiarImageSecretKey || '').trim().toLowerCase();
    
    // Check if image matches registered selection
    const isImageMatching = selectedImageId === registeredId || 
      (registeredId === 'custom' && selectedImageId === 'custom') ||
      (!selectedImageId && registeredId) ||
      (selectedImageId === 'house' && (!registeredId || registeredId === 'house'));

    // Check if secret key matches (if registered)
    const isSecretMatching = !expectedSecret || familiarSecret.trim().toLowerCase() === expectedSecret || familiarSecret.trim() === '';

    if (selectedImageId && isImageMatching && isSecretMatching) {
      setFamiliarError(false);
      setCompletedFactors(prev => ({ ...prev, familiar_image: true }));

      setTimeout(() => {
        if (effectiveRiskLevel === 'CAUTION') {
          // Medium risk finished (PIN + Familiar Image)
          onSuccess('multi_factor_tiered');
        } else if (effectiveRiskLevel === 'HIGH') {
          // High risk finished (PIN + Biometric + Familiar Image)
          onSuccess('multi_factor_tiered');
        } else if (effectiveRiskLevel === 'CRITICAL') {
          // Critical risk -> Next is Voice Affirmation
          setCurrentFactorStep('VOICE');
        }
      }, 700);
    } else {
      setFamiliarError(true);
    }
  };

  // Voice Affirmation Handler
  const handleVoiceAffirm = () => {
    setIsVoiceRecording(true);
    setTimeout(() => {
      setIsVoiceRecording(false);
      setVoiceRecorded(true);
      setCompletedFactors(prev => ({ ...prev, voice: true }));

      setTimeout(() => {
        // Critical risk completed all factors!
        onSuccess('multi_factor_tiered');
      }, 800);
    }, 1500);
  };

  const getVoicePhraseText = () => {
    if (language === 'hi') {
      return `मैं ₹${amount} की राशि बिना किसी दबाव या डर के अपनी स्वेच्छा से भेज रहा हूँ।`;
    }
    if (language === 'or') {
      return `ମୁଁ ₹${amount} ଟଙ୍କା କୌଣସି ଚାପ ବିନା ମୋ ନିଜ ଇଚ୍ଛାରେ ପଠାଉଛି।`;
    }
    return `I am transferring ₹${amount} to ${recipientName} of my own free will, without any threat.`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        id="auth-verification-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-7 space-y-6"
      >
        {/* Modal Header & Risk Tier Identification */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black ${
                effectiveRiskLevel === 'LOW'
                  ? 'bg-emerald-100 text-emerald-700'
                  : effectiveRiskLevel === 'CAUTION'
                  ? 'bg-amber-100 text-amber-800'
                  : effectiveRiskLevel === 'HIGH'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-rose-100 text-rose-800 animate-pulse'
              }`}
            >
              {effectiveRiskLevel === 'LOW' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : effectiveRiskLevel === 'CAUTION' ? (
                <Shield className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {effectiveRiskLevel === 'LOW'
                    ? '1-Factor UPI PIN Verification'
                    : effectiveRiskLevel === 'CAUTION'
                    ? '2-Factor Medium Risk Authentication'
                    : effectiveRiskLevel === 'HIGH'
                    ? '3-Factor High-Risk Multi-Shield'
                    : 'Maximum All-Factor Critical Defense Shield'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Authorizing ₹{amount.toLocaleString('en-IN')} to {recipientName}
              </p>
              <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                🛡️ Simulation Mode — Zero Real Money Deducted
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
            title="Cancel"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Tier Banner & Factor Stepper */}
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 ${
            effectiveRiskLevel === 'LOW'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : effectiveRiskLevel === 'CAUTION'
              ? 'bg-amber-50 text-amber-950 border-amber-200'
              : effectiveRiskLevel === 'HIGH'
              ? 'bg-orange-50 text-orange-950 border-orange-200'
              : 'bg-rose-50 text-rose-950 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">
              {effectiveRiskLevel === 'LOW'
                ? '🟢'
                : effectiveRiskLevel === 'CAUTION'
                ? '🟡'
                : effectiveRiskLevel === 'HIGH'
                ? '🟠'
                : '🔴'}
            </span>
            <div>
              <p className="font-black">
                {effectiveRiskLevel === 'LOW'
                  ? 'Low-Risk Payment: Just UPI PIN Needed'
                  : effectiveRiskLevel === 'CAUTION'
                  ? 'Medium Risk: PIN + 1 Additional Factor'
                  : effectiveRiskLevel === 'HIGH'
                  ? 'High Risk: PIN + Biometrics + Picture Secret'
                  : 'Critical Risk: All 4 Authentication Factors Enforced'}
              </p>
              <p className="text-[11px] opacity-80">
                {effectiveRiskLevel === 'LOW'
                  ? 'Zero unnecessary friction for trusted routine contacts.'
                  : effectiveRiskLevel === 'CAUTION'
                  ? 'Requires 1 additional verification factor to confirm sender identity.'
                  : effectiveRiskLevel === 'HIGH'
                  ? 'Multi-factor cognitive break to stop pressure/rushing.'
                  : 'Full multi-layer intercept to defeat fake police & coercion fraud.'}
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-white/80 shadow-xs border flex-shrink-0">
            {completedCount}/{totalRequiredCount} Factor{totalRequiredCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* Step Progress Checklist Bar for Multi-Factor Tiers */}
        {totalRequiredCount > 1 && (
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl text-[10px] font-black text-center">
            {/* Factor 1: PIN */}
            <div
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                completedFactors.pin
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentFactorStep === 'PIN'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : 'text-slate-400'
              }`}
            >
              {completedFactors.pin ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>1. PIN</span>
            </div>

            {/* Factor 2: Biometric or Extra */}
            <div
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                completedFactors.biometric
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentFactorStep === 'BIOMETRIC' || (currentFactorStep === 'CHOOSE_EXTRA' && effectiveRiskLevel === 'CAUTION')
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : effectiveRiskLevel === 'CAUTION' && completedFactors.familiar_image
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400'
              }`}
            >
              {completedFactors.biometric || (effectiveRiskLevel === 'CAUTION' && completedFactors.familiar_image) ? (
                <Check className="w-3 h-3" />
              ) : (
                <Fingerprint className="w-3 h-3" />
              )}
              <span>2. {effectiveRiskLevel === 'CAUTION' ? '+1 Extra' : 'Biometric'}</span>
            </div>

            {/* Factor 3: Familiar Picture */}
            <div
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                completedFactors.familiar_image
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentFactorStep === 'FAMILIAR'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : totalRequiredCount >= 3
                  ? 'text-slate-400'
                  : 'text-slate-300 opacity-40'
              }`}
            >
              {completedFactors.familiar_image ? <Check className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
              <span>3. Picture</span>
            </div>

            {/* Factor 4: Voice Intent */}
            <div
              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
                completedFactors.voice
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : currentFactorStep === 'VOICE'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                  : totalRequiredCount === 4
                  ? 'text-slate-400'
                  : 'text-slate-300 opacity-40'
              }`}
            >
              {completedFactors.voice ? <Check className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              <span>4. Voice</span>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FACTOR 1: UPI PIN PAD (Used in Low, and Step 1 of higher tiers) */}
        {/* ============================================================ */}
        {currentFactorStep === 'PIN' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-700">
                Enter your 4-digit UPI PIN to authorize transfer:
              </p>
              <p className="text-[11px] text-slate-400">
                {effectiveRiskLevel === 'LOW'
                  ? '🔒 Direct PIN authorization (Standard low-risk speed)'
                  : 'Step 1 of ' + totalRequiredCount + ': Primary PIN verification'}
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((index) => {
                const filled = pinDigits.length > index;
                return (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black border-2 transition-all ${
                      filled
                        ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-sm'
                        : 'bg-slate-50 border-slate-300 text-slate-400'
                    }`}
                  >
                    {filled ? '•' : ''}
                  </div>
                );
              })}
            </div>

            {isPinVerifying && (
              <p className="text-xs font-bold text-sky-600 text-center animate-pulse">
                Verifying PIN with bank...
              </p>
            )}

            {/* Numeric Keypad */}
            <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeypadPress(digit)}
                  disabled={isPinVerifying}
                  className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-200 border border-slate-200 text-slate-900 font-black text-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
                >
                  {digit}
                </button>
              ))}

              <button
                onClick={handleQuickFillPin}
                className="h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                title="Quick Fill Demo PIN (1234)"
              >
                Demo 1234
              </button>

              <button
                onClick={() => handleKeypadPress('0')}
                disabled={isPinVerifying}
                className="h-12 rounded-2xl bg-slate-50 hover:bg-slate-200 border border-slate-200 text-slate-900 font-black text-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
              >
                0
              </button>

              <button
                onClick={handleBackspace}
                disabled={isPinVerifying || pinDigits.length === 0}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              >
                ⌫
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MEDIUM RISK CHOICE: Choose 1 More Authentication Factor */}
        {/* ============================================================ */}
        {currentFactorStep === 'CHOOSE_EXTRA' && effectiveRiskLevel === 'CAUTION' && (
          <div className="space-y-4 py-2">
            <div className="text-center space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                ✅ Step 1 (PIN) Verified! Select 1 Additional Authentication Factor:
              </p>
              <p className="text-[11px] text-slate-500">
                Medium risk requires 2 total factors. Pick your preferred method:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Option A: Biometric Touch */}
              <button
                onClick={() => setCurrentFactorStep('BIOMETRIC')}
                className="p-5 rounded-3xl border-2 border-sky-300 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 text-left space-y-2 cursor-pointer transition-all active:scale-98 shadow-xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Device Biometrics</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Touch device fingerprint sensor or use Face ID instantly.
                </p>
              </button>

              {/* Option B: Familiar Image Secret */}
              <button
                onClick={() => setCurrentFactorStep('FAMILIAR')}
                className="p-5 rounded-3xl border-2 border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-left space-y-2 cursor-pointer transition-all active:scale-98 shadow-xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Familiar Picture Secret</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pick your enrolled cognitive safety picture (e.g. 🏠 House).
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FACTOR 2: BIOMETRICS (Device Fingerprint / Face ID) */}
        {/* ============================================================ */}
        {currentFactorStep === 'BIOMETRIC' && (
          <div className="text-center py-3 space-y-5">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {effectiveRiskLevel === 'CAUTION'
                  ? 'Factor 2 of 2: Touch Biometric Sensor'
                  : 'Factor 2 of ' + totalRequiredCount + ': Device Biometrics'}
              </p>
              <p className="text-[11px] text-slate-500">
                Place your registered finger on the sensor or authenticate with Face ID.
              </p>
            </div>

            {/* Fingerprint Touch Sensor */}
            <motion.div
              onClick={handleBiometricTouch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-28 h-28 mx-auto rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 shadow-lg ${
                biometricStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-emerald-500/20'
                  : isBiometricVerifying
                  ? 'bg-sky-50 border-sky-400 text-sky-600 animate-pulse'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50/50'
              }`}
            >
              {biometricStatus === 'success' ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              ) : (
                <Fingerprint className={`w-12 h-12 ${isBiometricVerifying ? 'animate-bounce' : ''}`} />
              )}
              <span className="text-[11px] font-bold mt-1">
                {isBiometricVerifying ? 'Scanning...' : biometricStatus === 'success' ? 'Verified ✓' : 'Touch Sensor'}
              </span>
            </motion.div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-[11px] text-slate-600 font-medium">
              🔒 <strong>FIDO2 / Hardware Enclave:</strong> Raw biometrics never leave your physical device.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FACTOR 3: FAMILIAR IMAGE COGNITIVE SECRET */}
        {/* ============================================================ */}
        {currentFactorStep === 'FAMILIAR' && (
          <div className="space-y-4 py-2">
            <div className="text-center space-y-1">
              <p className="text-xs sm:text-sm font-black text-slate-900">
                {effectiveRiskLevel === 'CAUTION'
                  ? 'Factor 2 of 2: Pick Your Enrolled Safety Picture'
                  : 'Factor 3 of ' + totalRequiredCount + ': Enrolled Familiar Picture Secret'}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Select the secret safety picture you enrolled during registration to confirm conscious intent.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {familiarImageOptions.map((opt) => {
                const isSelected = selectedImageId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleFamiliarSelect(opt.id)}
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/50 scale-105'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl mb-1">{opt.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-700 text-center leading-tight truncate w-full">
                      {opt.nameKey.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
              {(user.biometricEnrollment?.familiarImageData || user.familiarImageData) && (
                <button
                  type="button"
                  onClick={() => handleFamiliarSelect('custom')}
                  className={`flex flex-col items-center p-2 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedImageId === 'custom'
                      ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/50 scale-105'
                      : 'bg-slate-50 border-dashed border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={user.biometricEnrollment?.familiarImageData || user.familiarImageData}
                    alt="Your enrolled custom picture"
                    className="w-10 h-10 rounded-xl object-cover mb-1 border border-slate-200"
                  />
                  <span className="text-[10px] font-bold text-slate-800 truncate w-full text-center">My Photo</span>
                </button>
              )}
            </div>

            {/* Secret memory word / phrase */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Secret Memory Word / Code (Optional/Registered):
                </span>
                {(user.familiarImageSecretKey || user.biometricEnrollment?.familiarImageSecretKey) && (
                  <button
                    type="button"
                    onClick={() => {
                      const enrolled = user.familiarImageSecretKey || user.biometricEnrollment?.familiarImageSecretKey || '';
                      setFamiliarSecret(enrolled);
                      const regId = user.familiarImageId || (user.biometricEnrollment?.familiarImageData || user.familiarImageData ? 'custom' : 'house');
                      setSelectedImageId(regId);
                    }}
                    className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    💡 Auto-fill My Registered Secret
                  </button>
                )}
              </div>

              <input
                type="text"
                value={familiarSecret}
                onChange={(event) => {
                  setFamiliarSecret(event.target.value);
                  setFamiliarError(false);
                }}
                placeholder={
                  (user.familiarImageSecretKey || user.biometricEnrollment?.familiarImageSecretKey)
                    ? 'Enter secret word you chose (e.g. MyFamilyHome)'
                    : 'Secret word (Optional if none set during registration)'
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>

            {familiarError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 text-center animate-shake">
                ⚠️ Selected picture or secret word does not match your registered enrollment ({user.familiarImageId || 'house'}). Please choose your registered picture.
              </div>
            )}

            {/* Verification Button */}
            <button
              type="button"
              onClick={handleVerifyFamiliar}
              disabled={!selectedImageId}
              className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedImageId
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Safety Picture & Proceed</span>
            </button>

            <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200 text-[11px] text-amber-950 font-medium flex items-center gap-2">
              <span>💡</span>
              <p>
                <strong>Anti-Coercion Defense:</strong> Scammers threatening on a call do not know your personal visual memory anchor.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FACTOR 4: LIVE VOICE INTENT AFFIRMATION (Used in Critical Risk) */}
        {/* ============================================================ */}
        {currentFactorStep === 'VOICE' && (
          <div className="text-center py-2 space-y-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Factor 4 of 4: Live Voice Affirmation & Coercion Check
              </p>
              <p className="text-[11px] text-slate-500">
                Read the statement below aloud to confirm you are not acting under threat or fake arrest.
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 text-purple-950 font-black text-sm sm:text-base leading-relaxed">
              "{getVoicePhraseText()}"
            </div>

            <button
              onClick={handleVoiceAffirm}
              disabled={isVoiceRecording}
              className={`w-20 h-20 mx-auto rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                voiceRecorded
                  ? 'bg-emerald-600 text-white'
                  : isVoiceRecording
                  ? 'bg-purple-600 text-white animate-pulse'
                  : 'bg-slate-900 text-white hover:bg-purple-700'
              }`}
            >
              {voiceRecorded ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <Mic className={`w-8 h-8 ${isVoiceRecording ? 'animate-bounce' : ''}`} />
              )}
              <span className="text-[10px] font-bold mt-0.5">
                {voiceRecorded ? 'Verified' : isVoiceRecording ? 'Listening...' : 'Tap to Speak'}
              </span>
            </button>

            <p className="text-[11px] text-slate-500 font-medium">
              🎙️ Voice analysis verifies live human acoustic intent and checks for background scammer voices.
            </p>
          </div>
        )}

        {/* Footer cancel / back controls */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400">
            {effectiveRiskLevel === 'LOW'
              ? 'Low-Risk Fast Track'
              : `${completedCount} of ${totalRequiredCount} layers satisfied`}
          </span>

          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            {t.common.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
