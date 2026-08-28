import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Square, ShieldCheck, XCircle, ArrowRight, Zap, Volume2, VolumeX, AlertTriangle } from 'lucide-react';

interface SafetyChecklistProps {
  onAllVerified: () => void;
  onCancel: () => void;
}

export const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ onAllVerified, onCancel }) => {
  const { t, activeRiskAssessment, currentContext, currentRecipient, playVoiceWarning, stopVoiceWarning, isAudioSpeaking, language } = useApp();

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const isHospitalEmergency = currentContext.emergencyType === 'medical_hospital' || currentRecipient.category === 'hospital';
  const isLowRiskOrRoutine = activeRiskAssessment.riskLevel === 'LOW' || currentRecipient.isKnown;

  // Shorten checklist for emergency or routine payments
  const allFullQuestions = [
    { id: 1, text: t.checklist.q1, emergencyRelevant: true },
    { id: 2, text: t.checklist.q2, emergencyRelevant: false },
    { id: 3, text: t.checklist.q3, emergencyRelevant: true },
    { id: 4, text: t.checklist.q4, emergencyRelevant: false },
    { id: 5, text: t.checklist.q5, emergencyRelevant: false },
    { id: 6, text: t.checklist.q6, emergencyRelevant: true },
  ];

  const questions = isHospitalEmergency
    ? allFullQuestions.filter(q => q.emergencyRelevant)
    : allFullQuestions;

  // Auto read checklist out loud for elders if preferred
  const speakChecklist = () => {
    const promptText = isHospitalEmergency
      ? (language === 'hi'
          ? 'आपातकालीन चिकित्सा मोड: कृपया सुनिश्चित करें कि यह वास्तविक अस्पताल खाता है और राशि सही है।'
          : language === 'or'
          ? 'ଡାକ୍ତରଖାନା ଜରୁରୀକାଳୀନ ମୋଡ୍: ଦୟାକରି ଯାଞ୍ଚ କରନ୍ତୁ ଯେ ଏହା ସଠିକ୍ ଡାକ୍ତରଖାନା ଆକାଉଣ୍ଟ।'
          : 'Emergency Hospital Fast-Track: Please confirm this is the verified hospital merchant and the amount is exact.')
      : (language === 'hi'
          ? 'भुगतान से पहले सुरक्षा सूची: क्या आप इस व्यक्ति को जानते हैं? क्या किसी के दबाव में तो नहीं भेज रहे?'
          : language === 'or'
          ? 'ଟଙ୍କା ପଠାଇବା ପୂର୍ବରୁ ସୁରକ୍ଷା ଯାଞ୍ଚ: ଆପଣ ଏହି ବ୍ୟକ୍ତିଙ୍କୁ ଜାଣନ୍ତି ତ?'
          : 'Safety checklist: Do you know this recipient personally, and did you initiate this transfer yourself?');
    playVoiceWarning(promptText);
  };

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allChecked = questions.every(q => checkedItems[q.id]);
  const checkedCount = questions.filter(q => checkedItems[q.id]).length;

  return (
    <div
      id="safety-checklist-modal"
      className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl p-6 sm:p-7 space-y-6 max-w-xl mx-auto"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {isHospitalEmergency ? '🏥 Emergency Medical Fast-Track (Shortened 3-Point Checklist)' : t.checklist.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            {isHospitalEmergency
              ? 'Hospital lifesaving priority: Non-essential friction skipped to avoid medical delay.'
              : t.checklist.subtitle}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${
            isHospitalEmergency
              ? 'bg-rose-100 text-rose-900 border-rose-300'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {checkedCount}/{questions.length} Verified
          </span>

          <button
            onClick={isAudioSpeaking ? stopVoiceWarning : speakChecklist}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 cursor-pointer"
            title="Read checklist aloud in your language"
          >
            {isAudioSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5 text-amber-700" />}
            <span>{isAudioSpeaking ? 'Mute' : '🔊 Listen'}</span>
          </button>
        </div>
      </div>

      {isHospitalEmergency && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3 text-xs text-emerald-900 font-medium">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Hospital Verified Merchant: Friction reduced for patient care urgency.</span>
          </div>
          <button
            onClick={onAllVerified}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs cursor-pointer flex-shrink-0"
          >
            Instant Fast-Track ⚡
          </button>
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-2.5">
        {questions.map((q) => {
          const isChecked = !!checkedItems[q.id];
          return (
            <div
              key={q.id}
              onClick={() => toggleCheck(q.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                isChecked
                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                  : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="mt-0.5 text-emerald-600">
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <span className="text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                {q.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <XCircle className="w-4 h-4" />
          <span>{t.checklist.cancel}</span>
        </button>

        <button
          onClick={onAllVerified}
          disabled={!allChecked}
          className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
            allChecked
              ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{t.checklist.proceed}</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
