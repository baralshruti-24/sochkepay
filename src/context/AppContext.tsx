import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../services/firebase';
import {
  UserProfile,
  Language,
  Transaction,
  SafetyWatchReport,
  Recipient,
  TransactionContext,
  RiskAssessment,
  AuthMethod,
  Guardian,
} from '../types';
import { initialUserProfile, guestUserProfile, mockRecipients, mockSafetyWatchReports, demoScenarios } from '../data/mockData';
import { translations, TranslationDictionary } from '../services/localization';
import { evaluateRisk } from '../services/riskEngine';
import { audioSpeech } from '../services/audioSpeech';

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  
  // Navigation / Active View
  activeRoute: string;
  navigateTo: (route: string) => void;

  // TAALA Emergency Outgoing Lock
  isTaalaLocked: boolean;
  lockTaala: () => void;
  unlockTaala: () => void;

  // Payment Simulator State
  currentRecipient: Recipient;
  setCurrentRecipient: (rec: Recipient) => void;
  currentAmount: number;
  setCurrentAmount: (amount: number) => void;
  currentNote: string;
  setCurrentNote: (note: string) => void;
  currentContext: TransactionContext;
  setCurrentContext: React.Dispatch<React.SetStateAction<TransactionContext>>;
  activeRiskAssessment: RiskAssessment;
  
  // Scenarios
  loadScenario: (scenarioId: string) => void;
  activeScenarioId: string | null;

  // Transaction Lifecycle
  transactions: Transaction[];
  executePayment: (authMethod: AuthMethod) => Promise<Transaction>;
  cancelPayment: () => void;
  pendingGuardianTransaction: Transaction | null;
  approveGuardianTransaction: (txId: string) => void;
  rejectGuardianTransaction: (txId: string) => void;

  // Safety Watch & Community Reports
  safetyWatchList: SafetyWatchReport[];
  reportSuspiciousAccount: (vpa: string, reason: string, category: string, phone?: string) => void;
  upvoteReport: (reportId: string) => void;

  // Guardian Management
  updateGuardian: (guardian: Partial<Guardian>) => void;

  // Account Session Lifecycle
  logoutUser: () => void;
  loginUser: (profile?: Partial<UserProfile>) => void;

  // Audio Speech & Creator Voice Recordings
  isAudioSpeaking: boolean;
  playVoiceWarning: (customScript?: string, playMode?: 'generic_only' | 'custom_only' | 'default') => void;
  stopVoiceWarning: () => void;
  creatorRecordings: Record<string, { url: string; duration: number; time: string }>;
 saveCreatorRecording: (key: string, blob: Blob, duration: number) => void;
  deleteCreatorRecording: (key: string) => void;
  isSeniorMode: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [language, setLanguageState] = useState<Language>('en');
  const [activeRoute, setActiveRoute] = useState<string>('landing');
  const [isTaalaLocked, setIsTaalaLocked] = useState<boolean>(false);

  // Audio State & Creator Recordings
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<boolean>(false);
  const [creatorRecordings, setCreatorRecordings] = useState<
    Record<string, { url: string; duration: number; time: string }>
  >({});
  const activeAudioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioSpeech.setSpeakingListener(setIsAudioSpeaking);
    // Fetch recordings from Firestore
    const fetchRecordings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'creatorRecordings'));
        const recordings: Record<string, { url: string; duration: number; time: string }> = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          recordings[doc.id] = {
            url: data.url,
            duration: data.duration,
            time: data.time,
          };
        });
          // Merge with local storage recordings as a robust offline/local fallback
        for (let i = 0; i < localStorage.length; i++) {
          const localKey = localStorage.key(i);
          if (localKey && localKey.startsWith('sochke_voice_')) {
            const key = localKey.replace('sochke_voice_', '');
            try {
              const localData = JSON.parse(localStorage.getItem(localKey) || '{}');
              if (localData.base64) {
                recordings[key] = {
                  url: localData.base64,
                  duration: localData.duration,
                  time: localData.time,
                };
              }
            } catch (e) {
              console.error('Error parsing local recording', e);
            }
          }
        }
        setCreatorRecordings(recordings);
      } catch (err) {
        console.error('Error fetching recordings:', err);
         // Fallback: load only from localStorage if Firestore fails
        const recordings: Record<string, { url: string; duration: number; time: string }> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const localKey = localStorage.key(i);
          if (localKey && localKey.startsWith('sochke_voice_')) {
            const key = localKey.replace('sochke_voice_', '');
            try {
              const localData = JSON.parse(localStorage.getItem(localKey) || '{}');
              if (localData.base64) {
                recordings[key] = {
                  url: localData.base64,
                  duration: localData.duration,
                  time: localData.time,
                };
              }
            } catch (e) {
              console.error('Error parsing local recording', e);
            }
              }
        }
        setCreatorRecordings(recordings);
      }
    };
    fetchRecordings();
  }, []);

  const saveCreatorRecording = async (key: string, blob: Blob, duration: number) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     // Always save to localStorage first as a guaranteed fast local fallback
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      localStorage.setItem(`sochke_voice_${key}`, JSON.stringify({ base64, duration, time }));
      
      // Update local state immediately with base64 url
      setCreatorRecordings(prev => ({
        ...prev,
        [key]: { url: base64, duration, time },
      }));
      console.log('Successfully saved recording to localStorage fallback:', key);
    } catch (localErr) {
      console.error('Failed to save to local storage:', localErr);
    }

    // Then attempt Firebase upload in background
    try {
      console.log('saveCreatorRecording: uploading blob for key=', key);
      const storageRef = ref(storage, `recordings/${key}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
    const recordingData = {
      url,
      duration,
      time,
      creatorId: auth.currentUser?.uid || 'guest',
      timestamp: Date.now(),
    };
    
      await setDoc(doc(db, 'creatorRecordings', key), recordingData);
      // Update state with cloud URL (preferred)
      setCreatorRecordings(prev => ({
        ...prev,
        [key]: { url, duration, time },
      }));
      console.log('saveCreatorRecording: state updated with Cloud URL', url);
    } catch (err) {
       console.warn('Error uploading recording to Firebase, using localStorage copy instead:', err);
    }
  };

  const deleteCreatorRecording = async (key: string) => {
     // Delete from localStorage
    localStorage.removeItem(`sochke_voice_${key}`);
      setCreatorRecordings(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
       // Attempt to delete from Firestore
    try {
      await deleteDoc(doc(db, 'creatorRecordings', key));
    } catch (err) {
       console.warn('Error deleting recording from Firestore (already removed locally):', err);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setUser(prev => ({ ...prev, preferredLanguage: lang }));
  };

  const t = translations[language] || translations.en;

  // Active Payment Simulator State
  const [currentRecipient, setCurrentRecipient] = useState<Recipient>(mockRecipients[0]);
  const [currentAmount, setCurrentAmount] = useState<number>(240);
  const [currentNote, setCurrentNote] = useState<string>('Weekly provisions & groceries');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>('SCENARIO_1_NORMAL_PURCHASE');
  const [currentContext, setCurrentContext] = useState<TransactionContext>({
    activeCall: false,
    screenSharing: false,
    appSwitchCount: 0,
    timeOfDayHour: 11,
    isNightTime: false,
    urgencyPrompted: false,
    emergencyType: 'none',
    isNewDevice: false,
    sourceAppFlow: 'direct',
  });

  // Calculate live risk evaluation
  const activeRiskAssessment = evaluateRisk(
    currentRecipient,
    currentAmount,
    currentContext,
    user.baseline,
    currentNote
  );

  // Transactions History
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TX_PREV_901',
      timestamp: 'Yesterday, 6:30 PM',
      recipient: mockRecipients[0],
      amount: 140,
      note: 'Milk and butter',
      context: {
        activeCall: false,
        screenSharing: false,
        appSwitchCount: 0,
        timeOfDayHour: 18,
        isNightTime: false,
        urgencyPrompted: false,
        emergencyType: 'none',
        isNewDevice: false,
        sourceAppFlow: 'direct',
      },
      status: 'SUCCESS',
      authUsed: 'biometric',
      educationalLesson: 'Routine everyday transaction verified.',
    },
    {
      id: 'TX_PREV_902',
      timestamp: '3 days ago, 2:15 PM',
      recipient: mockRecipients[1],
      amount: 1200,
      note: 'Dinner bill split',
      context: {
        activeCall: true,
        screenSharing: false,
        appSwitchCount: 1,
        timeOfDayHour: 14,
        isNightTime: false,
        urgencyPrompted: false,
        emergencyType: 'none',
        isNewDevice: false,
        sourceAppFlow: 'direct',
      },
      status: 'SUCCESS',
      authUsed: 'familiar_image',
      educationalLesson: 'Payment to known friend on call verified safely.',
    },
  ]);

  const [pendingGuardianTransaction, setPendingGuardianTransaction] = useState<Transaction | null>(null);
  const [safetyWatchList, setSafetyWatchList] = useState<SafetyWatchReport[]>(mockSafetyWatchReports);

  const navigateTo = (route: string) => {
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lockTaala = () => {
    setIsTaalaLocked(true);
    setUser(prev => ({ ...prev, taalaLocked: true }));
  };

  const unlockTaala = () => {
    setIsTaalaLocked(false);
    setUser(prev => ({ ...prev, taalaLocked: false }));
  };

  const loadScenario = (scenarioId: string) => {
    const found = demoScenarios.find(s => s.id === scenarioId);
    if (found) {
      setActiveScenarioId(found.id);
      setCurrentRecipient(found.recipient);
      setCurrentAmount(found.amount);
      setCurrentNote(found.note);
      setCurrentContext({ ...found.context });
    }
  };

 const playVoiceWarning = (
    customScript?: string,
    playMode: 'generic_only' | 'custom_only' | 'default' = 'default'
  ) => {
    // Check if creator recorded custom audio for the active scenario or category
    const scenarioKey = `${activeScenarioId}_${language}`;
    const creatorAudio = creatorRecordings[scenarioKey];
     let shouldPlayCustom = false;

    if (creatorAudio && creatorAudio.url) {
       if (language === 'or') {
        // For Odia, we ALWAYS play custom audio at both steps if it exists
        shouldPlayCustom = true;
      } else {
        // For English & Hindi, check playMode
        if (playMode === 'custom_only') {
          shouldPlayCustom = true;
        } else if (playMode === 'generic_only') {
          shouldPlayCustom = false;
        } else {
          // default behavior
          shouldPlayCustom = true;
        }
      }
    }

    if (shouldPlayCustom && creatorAudio && creatorAudio.url) {
      try {
        if (activeAudioPlayerRef.current) {
          activeAudioPlayerRef.current.pause();
        }
        const audio = new Audio(creatorAudio.url);
        activeAudioPlayerRef.current = audio;
        setIsAudioSpeaking(true);
        audio.onended = () => setIsAudioSpeaking(false);
        audio.onerror = () => {
          setIsAudioSpeaking(false);
        };
        audio.play().catch(() => {
          if (activeAudioPlayerRef.current === audio) {
            activeAudioPlayerRef.current = null;
          }
          setIsAudioSpeaking(false);
        });
        return; // Ensure we don't fall back to synthesis
      } catch (err) {
        console.warn('Creator audio playback error:', err);
        return; // Ensure we don't fall back to synthesis
      }
    }

    // Odia requirement: No fallback to synthesis
    if (language === 'or') {
        return;
    }

    const textToSpeak = customScript || activeRiskAssessment.voiceScript[language] || activeRiskAssessment.voiceScript.en;
    audioSpeech.speak(textToSpeak, language);
  };

  const isSeniorMode = user.ageRange === '60+' || !!user.beginnerGuideMode;

  const stopVoiceWarning = () => {
    if (activeAudioPlayerRef.current) {
      activeAudioPlayerRef.current.pause();
    }
    audioSpeech.stop();
    setIsAudioSpeaking(false);
  };

  const executePayment = async (authMethod: AuthMethod): Promise<Transaction> => {
    const newTx: Transaction = {
      id: `TX_${Date.now().toString(36).toUpperCase()}`,
      timestamp: 'Just now',
      recipient: currentRecipient,
      amount: currentAmount,
      note: currentNote,
      context: { ...currentContext },
      riskAssessment: activeRiskAssessment,
      status: user.guardian?.enabled && currentAmount >= (user.guardian?.approvalThreshold || 15000)
        ? 'PENDING_GUARDIAN'
        : 'SUCCESS',
      authUsed: authMethod,
      educationalLesson: activeRiskAssessment.educationalLessonKey,
    };

    if (newTx.status === 'PENDING_GUARDIAN') {
      setPendingGuardianTransaction(newTx);
    } else {
      setTransactions(prev => [newTx, ...prev]);
    }

    return newTx;
  };

  const cancelPayment = () => {
    stopVoiceWarning();
  };

  const approveGuardianTransaction = (txId: string) => {
    if (pendingGuardianTransaction && pendingGuardianTransaction.id === txId) {
      const approvedTx: Transaction = {
        ...pendingGuardianTransaction,
        status: 'SUCCESS',
      };
      setTransactions(prev => [approvedTx, ...prev]);
      setPendingGuardianTransaction(null);
    }
  };

  const rejectGuardianTransaction = (txId: string) => {
    if (pendingGuardianTransaction && pendingGuardianTransaction.id === txId) {
      const rejectedTx: Transaction = {
        ...pendingGuardianTransaction,
        status: 'BLOCKED',
      };
      setTransactions(prev => [rejectedTx, ...prev]);
      setPendingGuardianTransaction(null);
    }
  };

  const reportSuspiciousAccount = (vpa: string, reason: string, category: string, phone?: string) => {
    const newReport: SafetyWatchReport = {
      id: `REP_SW_${Date.now()}`,
      clusterId: `MULE-CLUSTER-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      vpaMasked: vpa.replace(/(.{3})(.*)(@.*)/, '$1••••$3'),
      accountMasked: 'XXXXXX' + Math.floor(1000 + Math.random() * 9000),
      category: category || 'Suspicious Activity',
      status: 'COMMUNITY_REPORTED',
      reportCount: 1,
      patterns: [reason || 'Reported by citizen', ...(phone ? [`Linked phone: ${phone}`] : [])],
      lastReportedDate: 'Just now',
      associatedDevicesCount: 1,
      associatedAccountsCount: 1,
    };
    setSafetyWatchList(prev => [newReport, ...prev]);
  };

  const upvoteReport = (reportId: string) => {
    setSafetyWatchList(prev =>
      prev.map(r => (r.id === reportId ? { ...r, reportCount: r.reportCount + 1 } : r))
    );
  };

  const updateGuardian = (guardianUpdate: Partial<Guardian>) => {
    setUser(prev => ({
      ...prev,
      guardian: prev.guardian ? { ...prev.guardian, ...guardianUpdate } : undefined,
    }));
  };

  const logoutUser = () => {
    setUser(guestUserProfile);
    setIsTaalaLocked(false);
    setPendingGuardianTransaction(null);
    setActiveRoute('landing');
  };

  const loginUser = (profile?: Partial<UserProfile>) => {
    setUser(prev => ({
      ...initialUserProfile,
      ...profile,
      isLoggedIn: true,
    }));
    setActiveRoute('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        language,
        setLanguage,
        t,
        activeRoute,
        navigateTo,
        isTaalaLocked,
        lockTaala,
        unlockTaala,
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
        transactions,
        executePayment,
        cancelPayment,
        pendingGuardianTransaction,
        approveGuardianTransaction,
        rejectGuardianTransaction,
        safetyWatchList,
        reportSuspiciousAccount,
        upvoteReport,
        updateGuardian,
        logoutUser,
        loginUser,
        isAudioSpeaking,
        playVoiceWarning,
        stopVoiceWarning,
        creatorRecordings,
        saveCreatorRecording,
        deleteCreatorRecording,
        isSeniorMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
