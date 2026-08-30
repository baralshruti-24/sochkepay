import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import {
  Mic,
  Square,
  Play,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Globe,
  Award,
  Info,
  Zap,
  Plus,
  Upload,
  Trash2,
  Sparkles,
} from 'lucide-react';

import { INITIAL_CREATOR_PROMPTS } from '../data/voicePrompts';
import { CreatorVoicePrompt } from '../data/voicePrompts';

export const CreatorVoiceStudioPage: React.FC = () => {
  const { language, setLanguage, saveCreatorRecording, deleteCreatorRecording, creatorRecordings } = useApp();

  const [promptsList, setPromptsList] = useState<CreatorVoicePrompt[]>(INITIAL_CREATOR_PROMPTS);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);

  // New Custom Prompt Form state
  const [isAddingNewPrompt, setIsAddingNewPrompt] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [newBadge, setNewBadge] = useState<'SPECIAL' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newScriptEn, setNewScriptEn] = useState<string>('');
  const [newScriptHi, setNewScriptHi] = useState<string>('');
  const [newScriptOr, setNewScriptOr] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentScenario = promptsList[selectedScenarioIndex] || promptsList[0];
  const currentKey = `${currentScenario?.id || 'SCENARIO_REFUND_QR_SCAM'}_${language}`;
  const currentRecording = creatorRecordings ? creatorRecordings[currentKey] : undefined;

  useEffect(() => {
    console.log('CreatorVoiceStudioPage: currentKey =', currentKey, ', currentRecording =', currentRecording);
  }, [currentKey, currentRecording]);
  // Start recording using browser MediaRecorder API
  const startRecording = async () => {
    setAudioError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setAudioError('Microphone access is not available in this browser view. Please click "Upload Audio" to attach an audio file, or open in a new browser tab.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

       
            setPendingAudioUrl(audioUrl);

            setSuccessToast(`Recorded ${language.toUpperCase()} audio for "${currentScenario.scenarioTitle}"! Please save.`);
        setTimeout(() => setSuccessToast(null), 4000);

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting audio recording:', err);
      setAudioError('Microphone permission not granted or device unavailable. You can click "Upload Audio" to supply a recorded file.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn(e);
      }
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const audioUrl = URL.createObjectURL(file);
    setPendingAudioUrl(audioUrl);
    setSuccessToast(`Uploaded ${language.toUpperCase()} audio for "${currentScenario.scenarioTitle}"! Please save.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const playRecordedAudio = () => {
    if (!currentRecording?.url) return;
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(currentRecording.url);
    audioPlayerRef.current = audio;
    setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    audio.play().catch((err) => {
      console.warn('Playback error:', err);
      setIsPlayingAudio(false);
    });
  };

  const deleteCurrentRecording = () => {
    if (!currentRecording) return;
    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    deleteCreatorRecording(currentKey);
    setIsPlayingAudio(false);
    setSuccessToast('Audio clip deleted from this scenario and language.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

   const savePendingAudio = () => {
    if (!pendingAudioUrl) return;
    saveCreatorRecording(currentKey, pendingAudioUrl, recordingTime || 6);
    setPendingAudioUrl(null);
    setSuccessToast(`Saved ${language.toUpperCase()} audio for "${currentScenario.scenarioTitle}"! Active in Live Simulator.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };
  const handleAddNewPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newScriptEn.trim()) return;

    const newPrompt: CreatorVoicePrompt = {
      id: `CUSTOM_ALERT_${Date.now()}`,
      category: newCategory.trim() || 'Custom Safety Alert',
      scenarioTitle: newTitle.trim(),
      riskBadge: newBadge,
      situationDesc: newDesc.trim() || 'Custom user-defined security condition',
      scripts: {
        en: newScriptEn.trim(),
        hi: newScriptHi.trim() || newScriptEn.trim(),
        or: newScriptOr.trim() || newScriptEn.trim(),
      },
    };

    setPromptsList(prev => [newPrompt, ...prev]);
    setSelectedScenarioIndex(0);
    setIsAddingNewPrompt(false);
    setSuccessToast(`Added new scenario: "${newPrompt.scenarioTitle}"! You can now record its voice alerts.`);
    setTimeout(() => setSuccessToast(null), 4000);

    // Reset form
    setNewTitle('');
    setNewCategory('');
    setNewDesc('');
    setNewScriptEn('');
    setNewScriptHi('');
    setNewScriptOr('');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };
  }, []);

  const totalRecordingsNeeded = promptsList.length * 3;
  const recordedCount = creatorRecordings ? Object.keys(creatorRecordings).length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>Developer & Creator Studio • Official 3-Language Audio Voice System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Creator Voice Recording Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
              As the app creator, you record the official human voice warnings for SochKe Pay across <strong>Hindi (हिंदी)</strong>, <strong>Odia (ଓଡ଼ିଆ)</strong>, and <strong>English</strong>. When recorded, your voice replaces synthetic TTS in the real Payment Simulator for that scam intercept.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-2xl border border-slate-700 text-xs font-black text-amber-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>
                {recordedCount} of {totalRecordingsNeeded} Audio Clips Active
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (recordedCount / Math.max(1, totalRecordingsNeeded)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-900/90 border border-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {audioError && (
        <div className="p-4 rounded-2xl bg-rose-950 border border-rose-800 text-rose-200 text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{audioError}</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-rose-800 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            Upload Audio File
          </button>
        </div>
      )}

      {/* Language Selector Bar & Add Scenario Action */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-sky-600" />
          <span>Language Channel:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { code: 'hi' as Language, label: 'Hindi (हिंदी)', sub: 'Primary' },
            { code: 'or' as Language, label: 'Odia (ଓଡ଼ିଆ)', sub: 'Vernacular' },
            { code: 'en' as Language, label: 'English (Indian)', sub: 'Universal' },
          ].map((lang) => {
            const isSelected = language === lang.code;
            const langCount = promptsList.filter((p) => creatorRecordings && creatorRecordings[`${p.id}_${lang.code}`]).length;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{lang.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {langCount}/{promptsList.length}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setIsAddingNewPrompt(!isAddingNewPrompt)}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Alert</span>
          </button>
        </div>
      </div>

      {/* Add Custom Scenario Form Modal / Drawer */}
      {isAddingNewPrompt && (
        <form
          onSubmit={handleAddNewPrompt}
          className="bg-slate-900 text-white rounded-3xl p-6 border-2 border-indigo-500 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-black text-white">Create New Scenario Script for Creator Audio</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingNewPrompt(false)}
              className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Scenario Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 🔴 Couriers KYC Phishing Call"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Parcel Delivery Extortion"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Risk Category</label>
              <select
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="CRITICAL">🔴 CRITICAL (Intercept & Stop)</option>
                <option value="HIGH">🟠 HIGH (Multi-Factor Verification)</option>
                <option value="SPECIAL">🔵 SPECIAL / EMERGENCY (No Stop Audio)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Trigger Condition Context</label>
            <input
              type="text"
              placeholder="e.g. Triggered when user enters payment after courier SMS link"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">English Script *</label>
              <textarea
                required
                rows={2}
                placeholder="Stop immediately! Parcel companies do not..."
                value={newScriptEn}
                onChange={(e) => setNewScriptEn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Hindi (हिंदी) Script</label>
              <textarea
                rows={2}
                placeholder="तुरंत रुकिए! कूरियर कंपनियां कभी पर्सनल..."
                value={newScriptHi}
                onChange={(e) => setNewScriptHi(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Odia (ଓଡ଼ିଆ) Script</label>
              <textarea
                rows={2}
                placeholder="ତୁରନ୍ତ ଅଟକନ୍ତୁ! କୌଣସି ପାର୍ସଲ ପାଇଁ..."
                value={newScriptOr}
                onChange={(e) => setNewScriptOr(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-lg"
          >
            Save Scenario to Creator Audio Desk
          </button>
        </form>
      )}

      {/* Main Recording Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scenarios Master List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 max-h-[750px] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Safety Scenarios ({promptsList.length})
            </h3>
            <span className="text-[11px] font-bold text-slate-400">Click to record voice</span>
          </div>

          <div className="space-y-2">
            {promptsList.map((sc, index) => {
              const isSelected = selectedScenarioIndex === index;
              const hasAudio = !!(creatorRecordings && creatorRecordings[`${sc.id}_${language}`]);
              const scriptText = sc.scripts[language] || sc.scripts.en || '';
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    if (!isRecording) setSelectedScenarioIndex(index);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          sc.riskBadge === 'SPECIAL'
                            ? 'bg-teal-100 text-teal-800'
                            : sc.riskBadge === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sc.riskBadge}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 truncate">
                        {sc.category}
                      </span>
                    </div>
                    <p className="text-xs font-black text-slate-900 truncate">{sc.scenarioTitle}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      "{scriptText}"
                    </p>
                  </div>

                  {hasAudio ? (
                    <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Recorded</span>
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-lg">
                      Needs Voice
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Teleprompter, Audio Waveform & Recording Desk (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-amber-400">
                  Creator Teleprompter • {language.toUpperCase()} Mode
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    currentScenario.riskBadge === 'SPECIAL'
                      ? 'bg-teal-900 text-teal-300 border border-teal-700'
                      : currentScenario.riskBadge === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {currentScenario.riskBadge} RISK
                </span>
              </div>
              <h2 className="text-lg font-black text-white">{currentScenario.scenarioTitle}</h2>
            </div>

            {currentRecording && (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800">
                Active in App ({currentRecording.duration}s)
              </span>
            )}
          </div>

          {/* Trigger Context Note */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>When this plays:</strong> {currentScenario.situationDesc}
            </p>
          </div>

          {/* Studio Teleprompter Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/40 text-center space-y-4 shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Read This Official Creator Script:
            </span>
            <p className="text-base sm:text-xl font-black text-white leading-relaxed tracking-normal font-sans">
              "{currentScenario.scripts[language] || currentScenario.scripts.en}"
            </p>
            <p className="text-[11px] text-amber-300/80 font-medium">
              💡 Creator Delivery Tip: Speak with a calm, firm, protective tone so elderly citizens and beginners immediately understand.
            </p>
          </div>

          {/* Hidden File Input for uploading clips */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          {/* Recording & Playback Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95"
              >
                <Mic className="w-5 h-5 text-white" />
                <span>
                  {currentRecording
                    ? `Re-record Creator Audio (${language.toUpperCase()})`
                    : `Record Creator Voice (${language.toUpperCase()})`}
                </span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-500 text-white font-black text-xs sm:text-sm shadow-2xl animate-pulse flex items-center justify-center gap-2.5 cursor-pointer transition-all"
              >
                <Square className="w-5 h-5 text-white fill-white" />
                <span>Stop Recording ({recordingTime}s)</span>
              </button>
            )}

            {/* Upload File Alternative */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              title="Upload pre-recorded MP3/WAV/WebM audio file"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Upload Audio</span>
            </button>

        {(currentRecording || pendingAudioUrl) && !isRecording && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {pendingAudioUrl ? (
                  <>
                    <button
                      onClick={savePendingAudio}
                      className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save Recording</span>
                    </button>
                    <button
                      onClick={() => setPendingAudioUrl(null)}
                      className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 hover:border-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                     </>
            ) : (
              <>
                <button
                  onClick={playRecordedAudio}
                  disabled={isPlayingAudio}
                  className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isPlayingAudio ? 'Playing...' : 'Test Playback'}</span>
                </button>
                <button
                  onClick={deleteCurrentRecording}
                  className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-rose-950 text-rose-300 border border-slate-700 hover:border-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Integration Status Indicator */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Application State:</span>
            </span>
            <span className="font-semibold text-slate-300">
              {currentRecording
                ? '✅ Creator voice takes priority during payment warning intercepts'
                : '⚡ Standard localized synthesis engine active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
