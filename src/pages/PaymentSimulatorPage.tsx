import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { demoScenarios, mockRecipients } from '../data/mockData';
import { Recipient, AuthMethod, Transaction } from '../types';
import { SochuMascot } from '../mascot/SochuMascot';
import { RecipientTransparencyCard } from '../safety/RecipientTransparencyCard';
import { WhyRiskCard } from '../safety/WhyRiskCard';
import { VoiceWarningBanner } from '../safety/VoiceWarningBanner';
import { RiskMeter } from '../safety/RiskMeter';
import { SafetyChecklist } from '../safety/SafetyChecklist';
import { AuthVerificationModal } from '../safety/AuthVerificationModal';
import { GuardianApprovalModal } from '../safety/GuardianApproval';
import { PaymentSuccessModal } from '../safety/PaymentSuccessModal';
import { QrScannerModal } from '../safety/QrScannerModal';
import { audioSpeech } from '../services/audioSpeech';
import {
  PhoneCall,
  MonitorUp,
  Moon,
  Layers,
  Zap,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Search,
  ArrowRight,
  AlertTriangle,
  Lock,
  QrCode,
  Volume2,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export const PaymentSimulatorPage: React.FC = () => {
  const {
    t,
    currentRecipient,
    setCurrentRecipient,
    currentAmount,
    setCurrentAmount,
    currentNote,
    setCurrentNote,
    currentContext,
    setCurrentContext,
    activeRiskAssessment,
    loadScenario,
    activeScenarioId,
    executePayment,
    cancelPayment,
    pendingGuardianTransaction,
    approveGuardianTransaction,
    rejectGuardianTransaction,
    isTaalaLocked,
    user,
    language,
  } = useApp();

  const [step, setStep] = useState<'FORM' | 'PAUSE_WARNING' | 'CHECKLIST' | 'AUTH' | 'SUCCESS'>('FORM');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [qrSuccessNotice, setQrSuccessNotice] = useState<string | null>(null);
  const [isBeginnerModeActive, setIsBeginnerModeActive] = useState<boolean>(
    !!user.beginnerGuideMode || user.ageRange === '60+'
  );

  // Payer / Sender account state to detect mismatch against registered user profile
  const [payerName, setPayerName] = useState<string>(user.name);
  const [payerPhone, setPayerPhone] = useState<string>(user.phoneMasked);
  const [isEditingSender, setIsEditingSender] = useState<boolean>(false);

  useEffect(() => {
    setPayerName(user.name);
    setPayerPhone(user.phoneMasked);
  }, [user.name, user.phoneMasked]);

  const isAccountMismatch =
    user.isLoggedIn !== false &&
    (payerName.trim().toLowerCase() !== user.name.trim().toLowerCase() ||
      payerPhone.trim() !== user.phoneMasked.trim());

  const isHighRisk =
    activeRiskAssessment.riskLevel === 'HIGH' ||
    activeRiskAssessment.riskLevel === 'CRITICAL' ||
    isAccountMismatch;
  const isCaution = activeRiskAssessment.riskLevel === 'CAUTION' && !isHighRisk;

  // Toggle helpers
  const toggleContext = (key: keyof typeof currentContext) => {
    setCurrentContext(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleScenarioChange = (id: string) => {
    loadScenario(id);
    setStep('FORM');
  };

  const handleInitialPayClick = () => {
    if (isTaalaLocked) {
      alert('Payments are locked via TAALA Emergency Lock. Please unlock first from Dashboard or Navbar.');
      return;
    }

    if (isHighRisk) {
      // Step into high-risk adaptive friction
      setStep('PAUSE_WARNING');
    } else if (isCaution) {
      // Step into quick review checklist
      setStep('CHECKLIST');
    } else {
      // Low risk seamless auth
      setStep('AUTH');
    }
  };

  const handleAuthSuccess = async (method: AuthMethod) => {
    const tx = await executePayment(method);
    setCompletedTx(tx);
    if (tx.status === 'PENDING_GUARDIAN') {
      setStep('FORM');
    } else {
      setStep('SUCCESS');
    }
  };

  const handleDone = () => {
    setStep('FORM');
    setCompletedTx(null);
  };

  const handleQrScanComplete = (recipient: Recipient, amount?: number, note?: string) => {
    setCurrentRecipient(recipient);
    if (amount !== undefined) setCurrentAmount(amount);
    if (note !== undefined) setCurrentNote(note);
    setQrSuccessNotice(
      `QR Code Scanned: ${recipient.name} (${recipient.vpa})${
        recipient.safetyWatchStatus === 'CONFIRMED_SUSPICIOUS' ? ' • ⚠️ Safety Watch Match!' : ''
      }`
    );
    setTimeout(() => setQrSuccessNotice(null), 5000);
  };

  // Senior / Friendly Voice guidance reader
  const handlePlaySeniorGuidance = () => {
    const recName = currentRecipient.name;
    const amountStr = currentAmount.toLocaleString('en-IN');
    let speechText = '';

    if (language === 'hi') {
      if (isHighRisk) {
        speechText = `सावधान! आप ${recName} को ${amountStr} रुपये भेज रहे हैं। यह एक नया या संदिग्ध खाता हो सकता है। कृपया किसी के कहने पर या फोन कॉल पर यूपीआई पिन दर्ज न करें।`;
      } else {
        speechText = `आप ${recName} को ${amountStr} रुपये भेज रहे हैं। यूपीआई पिन केवल पैसे भेजने के लिए होता है, पैसे प्राप्त करने के लिए नहीं।`;
      }
    } else if (language === 'or') {
      if (isHighRisk) {
        speechText = `ସାବଧାନ! ଆପଣ ${recName} ଙ୍କୁ ${amountStr} ଟଙ୍କା ପଠାଉଛନ୍ତି। ଏହା ଏକ ନୂଆ ବା ସନ୍ଦିଗ୍ଧ ଆକାଉଣ୍ଟ ହୋଇପାରେ। କଲ୍ ରେ ଥିବା ସମୟରେ UPI PIN ଦିଅନ୍ତୁ ନାହିଁ।`;
      } else {
        speechText = `ଆପଣ ${recName} ଙ୍କୁ ${amountStr} ଟଙ୍କା ପଠାଉଛନ୍ତି। UPI PIN କେବଳ ଟଙ୍କା ପଠାଇବା ପାଇଁ ବ୍ୟବହାର ହୁଏ।`;
      }
    } else {
      if (isHighRisk) {
        speechText = `Warning! You are sending ${amountStr} rupees to ${recName}. This recipient has elevated risk signals. Never enter your UPI PIN on a phone call or for receiving money.`;
      } else {
        speechText = `You are sending ${amountStr} rupees to ${recName}. Remember that UPI PIN is only used to send money, never to receive.`;
      }
    }

    audioSpeech.speak(speechText, language);
  };

  const filteredRecipients = mockRecipients.filter(
    r =>
      r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
      r.vpa.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Banner: Scenario Switcher for Hackathon Judges & Demos */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <h2 className="text-sm sm:text-base font-black tracking-wide text-amber-300">
              {t.pay.scenarioPicker}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/80 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Safe Sandbox: No Real Money Deducted</span>
            </span>
            <span className="text-slate-400 font-medium hidden md:inline">
              • Simulates cognitive UPI telemetry
            </span>
          </div>
        </div>

        {/* Horizontal Scenario Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {demoScenarios.map((sc) => {
            const isSelected = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border flex-shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{sc.titleKey}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-black uppercase ${
                    sc.expectedRisk === 'CRITICAL' || sc.expectedRisk === 'HIGH'
                      ? isSelected ? 'bg-rose-900 text-white' : 'bg-rose-950 text-rose-300'
                      : isSelected ? 'bg-slate-900 text-amber-300' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {sc.expectedRisk}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Payment Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Telemetry Toggles (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            {/* Header: Paying Account info with personalized user name & verification status */}
            <div className="space-y-2 border-b border-slate-100 pb-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm">
                    ₹
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                      {t.pay.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>
                        Paying as: <strong>{payerName}</strong> ({payerPhone})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingSender(!isEditingSender)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                    title="Simulate entering a different paying account to test identity mismatch detection"
                  >
                    {isEditingSender ? 'Done' : 'Test Account Mismatch'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBeginnerModeActive(!isBeginnerModeActive)}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 transition-all cursor-pointer ${
                      isBeginnerModeActive
                        ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Toggle Elder / Beginner Voice Guide Mode"
                  >
                    <Volume2 className="w-3 h-3 text-amber-600" />
                    <span>{isBeginnerModeActive ? 'Senior Voice Active' : 'Enable Voice Guide'}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Edit Payer Input (To test Mismatch Detection for Judges) */}
              {isEditingSender && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Simulate Sender Account Details:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPayerName(user.name);
                        setPayerPhone(user.phoneMasked);
                      }}
                      className="text-[10px] text-sky-600 font-black hover:underline cursor-pointer"
                    >
                      Reset to Verified User ({user.name})
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                        Payer Account Name
                      </label>
                      <input
                        type="text"
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="e.g. Unknown User / Stolen SIM"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                        Payer Mobile / SIM
                      </label>
                      <input
                        type="text"
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        placeholder="+91 99999 •••••"
                        className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPayerName('Manoj (Burner Account)');
                        setPayerPhone('+91 88888 12345');
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-bold border border-rose-200 cursor-pointer hover:bg-rose-200"
                    >
                      ⚡ Test Foreign/Mule Account
                    </button>
                  </div>
                </div>
              )}

              {/* ⚠️ Account Identity Mismatch Notice */}
              {isAccountMismatch && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 animate-bounce" />
                    <span>⚠️ Account Identity Mismatch Notice</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    The payment source details (<strong>{payerName}</strong> / <strong>{payerPhone}</strong>) do not match your registered SochKe safety profile (<strong>{user.name}</strong> / <strong>{user.phoneMasked}</strong>).
                  </p>
                  <p className="text-[11px] text-amber-900 font-bold bg-amber-100/80 p-2 rounded-xl border border-amber-200">
                    🛡️ <strong>Safety Safeguard:</strong> This may indicate a device swap, guest access, or unauthorized attempt. Strict biometric authentication and guardian check are enforced.
                  </p>
                </div>
              )}

              {/* Guest Mode Alert if user is logged out */}
              {user.isLoggedIn === false && (
                <div className="bg-slate-100 border border-slate-300 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Operating in <strong>Guest Mode</strong> (Not Logged In).</span>
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 underline cursor-pointer">
                    Register Safety Profile
                  </span>
                </div>
              )}
            </div>

            {/* Senior / Beginner Voice Guide Bar */}
            {isBeginnerModeActive && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3.5 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1.5 text-amber-900">
                    <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Friendly Senior & Beginner Voice Guide</span>
                  </span>
                  <button
                    type="button"
                    onClick={handlePlaySeniorGuidance}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>🔊 Listen in Voice</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-900/90 font-medium leading-relaxed">
                  {language === 'hi'
                    ? 'याद रखें: यूपीआई पिन केवल पैसे भेजने के लिए होता है। किसी भी फोन कॉल पर या पैसे प्राप्त करने के लिए पिन कभी दर्ज न करें।'
                    : language === 'or'
                    ? 'ମନେରଖନ୍ତୁ: UPI PIN କେବଳ ଟଙ୍କା ପଠାଇବା ପାଇଁ ବ୍ୟବହାର ହୁଏ। କଲ୍ ରେ ଥିବା ସମୟରେ କାହାକୁ PIN କୁହନ୍ତୁ ନାହିଁ।'
                    : 'Remember: Your UPI PIN is only used to SEND money. Never enter your PIN to receive money or upon requests from unknown callers.'}
                </p>
              </div>
            )}

            {/* QR Scan Success Alert */}
            {qrSuccessNotice && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{qrSuccessNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setQrSuccessNotice(null)}
                  className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Recipient Picker & QR Scanner Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.pay.recipientInput}
                </label>
                <button
                  type="button"
                  onClick={() => setIsQrScannerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan UPI QR Code</span>
                </button>
              </div>

              <div className="relative">
                <select
                  value={currentRecipient.id}
                  onChange={(e) => {
                    const rec = mockRecipients.find(r => r.id === e.target.value);
                    if (rec) setCurrentRecipient(rec);
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none"
                >
                  {mockRecipients.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.vpa}) — {r.isKnown ? 'Known' : r.safetyWatchStatus === 'CONFIRMED_SUSPICIOUS' ? '⚠️ Flagged' : 'New'}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold">
                  ▼
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.pay.amountInput}
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  Baseline avg: ₹2,800
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(Number(e.target.value) || 0)}
                  className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xl font-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Note / Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.pay.noteInput}
              </label>
              <input
                type="text"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="e.g. Refund processing / Groceries"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Live Context Signal Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.pay.contextSignals}
              </label>

              <div className="grid grid-cols-2 gap-2">
                {/* Active Call Toggle */}
                <button
                  type="button"
                  onClick={() => toggleContext('activeCall')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    currentContext.activeCall
                      ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <PhoneCall className={`w-3.5 h-3.5 ${currentContext.activeCall ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span>Active Call</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${currentContext.activeCall ? 'bg-amber-500 animate-ping' : 'bg-slate-300'}`} />
                </button>

                {/* Screen Sharing Toggle */}
                <button
                  type="button"
                  onClick={() => toggleContext('screenSharing')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    currentContext.screenSharing
                      ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <MonitorUp className={`w-3.5 h-3.5 ${currentContext.screenSharing ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>Screen Share</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${currentContext.screenSharing ? 'bg-rose-600 animate-ping' : 'bg-slate-300'}`} />
                </button>

                {/* Night Time Toggle */}
                <button
                  type="button"
                  onClick={() => toggleContext('isNightTime')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    currentContext.isNightTime
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-xs font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Moon className={`w-3.5 h-3.5 ${currentContext.isNightTime ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>2:00 AM Night</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${currentContext.isNightTime ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                </button>

                {/* App Switches Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentContext(prev => ({
                      ...prev,
                      appSwitchCount: prev.appSwitchCount >= 5 ? 0 : 6,
                    }));
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                    currentContext.appSwitchCount >= 5
                      ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs font-black'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Layers className={`w-3.5 h-3.5 ${currentContext.appSwitchCount >= 5 ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span>App Switching</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${currentContext.appSwitchCount >= 5 ? 'bg-amber-500' : 'bg-slate-300'}`} />
                </button>
              </div>
            </div>

            {/* Guardian Family Mode Active Status & Limit Indicator */}
            {user.guardian?.enabled && (
              <div
                className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                  currentAmount >= (user.guardian.approvalThreshold || 15000)
                    ? 'bg-purple-950/30 border-purple-400/60 text-purple-200 shadow-sm'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      currentAmount >= (user.guardian.approvalThreshold || 15000)
                        ? 'bg-purple-500 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-black text-slate-200 block text-[11px]">
                      Family Guardian Mode Active
                    </span>
                    <span className="text-[10px] text-slate-300">
                      Guardian: <strong>{user.guardian.name || 'Nominee'}</strong> • Threshold: ₹
                      {(user.guardian.approvalThreshold || 15000).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    currentAmount >= (user.guardian.approvalThreshold || 15000)
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {currentAmount >= (user.guardian.approvalThreshold || 15000)
                    ? '⚡ Exceeds Limit (Requires Approval)'
                    : 'Within Limit'}
                </span>
              </div>
            )}

            {/* Main Action Button */}
            <div className="space-y-2">
              <button
                onClick={handleInitialPayClick}
                className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  activeRiskAssessment.riskLevel === 'CRITICAL'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25 animate-pulse'
                    : isHighRisk
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25'
                    : isCaution
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/25'
                }`}
              >
                <Zap className="w-5 h-5 text-amber-400" />
                <span>{t.pay.payButton}</span>
              </button>

              <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500">
                <span>Security Protocol:</span>
                <span
                  className={`px-2 py-0.5 rounded-md font-mono ${
                    activeRiskAssessment.riskLevel === 'LOW'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeRiskAssessment.riskLevel === 'CAUTION'
                      ? 'bg-amber-100 text-amber-900'
                      : activeRiskAssessment.riskLevel === 'HIGH'
                      ? 'bg-orange-100 text-orange-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {activeRiskAssessment.riskLevel === 'LOW'
                    ? '🟢 1 Factor (PIN Only)'
                    : activeRiskAssessment.riskLevel === 'CAUTION'
                    ? '🟡 2 Factors (PIN + 1 Extra Auth)'
                    : activeRiskAssessment.riskLevel === 'HIGH'
                    ? '🟠 3 Factors (PIN + Multi-Auth)'
                    : '🔴 4 Factors (Use All Auth Layers)'}
                </span>
              </div>

              {/* Simulation Safety Assurance Note */}
              <p className="text-[11px] text-center font-semibold text-slate-400 pt-1">
                🔒 Safe simulation environment • No actual bank account is debited
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Evaluation, Mascot & Transparency Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Risk Score & Reactive Sochu Mascot Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <RiskMeter
                  score={activeRiskAssessment.riskScore}
                  riskLevel={activeRiskAssessment.riskLevel}
                />
              </div>

              {/* Reactive Mascot Widget */}
              <div className="flex-shrink-0">
                <SochuMascot
                  mood={activeRiskAssessment.riskLevel}
                  riskScore={activeRiskAssessment.riskScore}
                  size="sm"
                  showDialogue={false}
                />
              </div>
            </div>
          </div>

          {/* Voice Warning Banner (Visible on High Risk or when user plays) */}
          {(isHighRisk || step === 'PAUSE_WARNING') && (
            <VoiceWarningBanner autoPlay={step === 'PAUSE_WARNING'} />
          )}

          {/* Recipient Transparency Card */}
          <RecipientTransparencyCard
            recipient={currentRecipient}
            amount={currentAmount}
            context={currentContext}
            riskScore={activeRiskAssessment.riskScore}
          />

          {/* Why Risk Card (Detailed breakdown of detected signals) */}
          <WhyRiskCard assessment={activeRiskAssessment} />
        </div>
      </div>

      {/* Adaptive Friction Modals / Steps */}
      {/* 1. Pause Warning & Checklist Step (RED EMERGENCY SCREEN FOR HIGH RISK & FLAGGED ACCOUNTS) */}
      {step === 'PAUSE_WARNING' && (
        <div className="fixed inset-0 z-50 bg-rose-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          {/* Red Alert Ambient Glow */}
          <div className="absolute inset-0 bg-radial from-rose-600/30 via-rose-900/60 to-slate-950/90 pointer-events-none animate-pulse" />

          <div className="relative z-10 max-w-2xl w-full space-y-4 my-auto">
            {/* Top Red Flashing Alert Header */}
            <div className="bg-rose-900/90 text-rose-100 border-2 border-rose-500 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xl shadow-rose-900/50 animate-bounce">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl">🚨</span>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                    HIGH-RISK SCAM INTERCEPT: RED ALERT
                  </h2>
                  <p className="text-xs text-rose-200 font-medium">
                    {currentRecipient.safetyWatchStatus === 'CONFIRMED_SUSPICIOUS'
                      ? '⚠️ This recipient is a KNOWN FLAGGED FRAUDSTER in the Civic Safety Watch registry.'
                      : '⚠️ Critical coercion, fake official threat, or extortion pattern detected.'}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-block px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-black uppercase tracking-wider animate-pulse">
                Audio Active
              </span>
            </div>

            <VoiceWarningBanner autoPlay={true} />
            <SafetyChecklist
              onAllVerified={() => setStep('AUTH')}
              onCancel={() => {
                cancelPayment();
                setStep('FORM');
              }}
            />
          </div>
        </div>
      )}

      {/* 2. Checklist for Caution cases */}
      {step === 'CHECKLIST' && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <SafetyChecklist
            onAllVerified={() => setStep('AUTH')}
            onCancel={() => {
              cancelPayment();
              setStep('FORM');
            }}
          />
        </div>
      )}

      {/* 3. Authentication Verification Step */}
      {step === 'AUTH' && (
        <AuthVerificationModal
          amount={currentAmount}
          recipientName={currentRecipient.name}
          riskLevel={activeRiskAssessment.riskLevel}
          onSuccess={handleAuthSuccess}
          onCancel={() => setStep('FORM')}
        />
      )}

      {/* 4. Payment Success Celebration Modal */}
      {step === 'SUCCESS' && completedTx && (
        <PaymentSuccessModal transaction={completedTx} onDone={handleDone} />
      )}

      {/* 5. Guardian Pending Review Simulator Modal */}
      {pendingGuardianTransaction && (
        <GuardianApprovalModal
          transaction={pendingGuardianTransaction}
          onApprove={() => {
            approveGuardianTransaction(pendingGuardianTransaction.id);
            setStep('SUCCESS');
          }}
          onReject={() => {
            rejectGuardianTransaction(pendingGuardianTransaction.id);
          }}
          onClose={() => {}}
        />
      )}

      {/* 6. UPI QR Code Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanComplete={handleQrScanComplete}
      />
    </div>
  );
};
