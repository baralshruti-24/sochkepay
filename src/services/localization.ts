import { Language } from '../types';

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    subTagline: string;
    philosophy: string;
  };
  mascot: {
    ready: string;
    caution: string;
    highRisk: string;
    success: string;
    poke: string;
  };
  nav: {
    home: string;
    dashboard: string;
    register: string;
    pay: string;
    safetyWatch: string;
    guardian: string;
    learn: string;
    demo: string;
    voiceStudio: string;
    about: string;
    taalaActive: string;
    taalaLocked: string;
    emergencyLock: string;
  };
  landing: {
    heroTitle: string;
    heroSub: string;
    ctaPay: string;
    ctaLearn: string;
    heroBadge: string;
    cardPreviewTitle: string;
    problemTitle: string;
    problemDesc: string;
    howItWorksTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    trustTitle: string;
    trust1: string;
    trust2: string;
    trust3: string;
    trust4: string;
  };
  dashboard: {
    greeting: string;
    protectedBadge: string;
    safetyProfileTitle: string;
    safetyProfileDesc: string;
    scoreExplanation: string;
    todayStats: string;
    protectedCount: string;
    suspiciousPrevented: string;
    voiceAlerts: string;
    recentActivity: string;
    viewAll: string;
    quickActions: string;
    actionPay: string;
    actionSafetyWatch: string;
    actionGuardian: string;
    actionLearn: string;
    actionTaala: string;
    taalaDesc: string;
    emptyHistory: string;
  };
  pay: {
    title: string;
    subtitle: string;
    scenarioPicker: string;
    scenarioLabel: string;
    recipientInput: string;
    amountInput: string;
    noteInput: string;
    contextSignals: string;
    activeCall: string;
    screenSharing: string;
    nightTime: string;
    appSwitches: string;
    urgency: string;
    emergencyToggle: string;
    payButton: string;
    analyzing: string;
    normalBaselineNote: string;
  };
  transparency: {
    youArePaying: string;
    recipientStatus: string;
    newRecipient: string;
    knownRecipient: string;
    flaggedRecipient: string;
    verifiedMerchant: string;
    yourHistory: string;
    historyNever: string;
    historyCount: string;
    amountLabel: string;
    yourAverage: string;
    contextLabel: string;
    onCallNotice: string;
    sochkeSays: string;
    pauseAndVerify: string;
    looksGood: string;
    cautionAdvised: string;
  };
  whyRisk: {
    title: string;
    whatMeansTitle: string;
    whatMeansText: string;
    whatToDoTitle: string;
    whatToDoText: string;
    signalNewRecipient: string;
    signalNewRecipientDesc: string;
    signalActiveCall: string;
    signalActiveCallDesc: string;
    signalUnusualAmount: string;
    signalUnusualAmountDesc: string;
    signalUnusualTime: string;
    signalUnusualTimeDesc: string;
    signalHighVelocity: string;
    signalHighVelocityDesc: string;
    signalScreenSharing: string;
    signalScreenSharingDesc: string;
    signalAppSwitching: string;
    signalAppSwitchingDesc: string;
    signalFlaggedAccount: string;
    signalFlaggedAccountDesc: string;
    signalContextMismatch: string;
    signalContextMismatchDesc: string;
    friendExemptionNote: string;
    emergencyFastTrackNote: string;
  };
  voiceWarning: {
    heading: string;
    playAgain: string;
    stopAudio: string;
    liveVoiceActive: string;
  };
  checklist: {
    title: string;
    subtitle: string;
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    q5: string;
    q6: string;
    allChecked: string;
    proceed: string;
    cancel: string;
  };
  auth: {
    title: string;
    subtitle: string;
    tabBiometric: string;
    tabVoice: string;
    tabFamiliar: string;
    biometricPrompt: string;
    biometricNotice: string;
    voicePrompt: string;
    voicePhrase: string;
    voiceNotice: string;
    familiarPrompt: string;
    familiarNotice: string;
    verifySuccess: string;
    verifyFailed: string;
    cancel: string;
    confirm: string;
  };
  guardian: {
    title: string;
    subtitle: string;
    currentGuardian: string;
    relationship: string;
    threshold: string;
    status: string;
    verified: string;
    pending: string;
    pendingApprovalTitle: string;
    pendingApprovalDesc: string;
    simulatedApprove: string;
    simulatedReject: string;
    addGuardian: string;
    guardianNote: string;
  };
  safetyWatch: {
    title: string;
    subtitle: string;
    communityReported: string;
    underReview: string;
    confirmedSuspicious: string;
    reportsCount: string;
    associatedMules: string;
    disclaimer: string;
    reportNewBtn: string;
    reportModalTitle: string;
  };
  taala: {
    title: string;
    subtitle: string;
    holdToLock: string;
    lockedStatus: string;
    lockedDesc: string;
    unlockBtn: string;
    safeNote: string;
  };
  learn: {
    title: string;
    subtitle: string;
    tabBasics: string;
    tabScams: string;
    tabChecklist: string;
    pinRuleTitle: string;
    pinRuleDesc: string;
    qrRuleTitle: string;
    qrRuleDesc: string;
    refundScamTitle: string;
    refundScamDesc: string;
    digitalArrestTitle: string;
    digitalArrestDesc: string;
    customerCareTitle: string;
    customerCareDesc: string;
  };
  common: {
    cancel: string;
    continue: string;
    safe: string;
    caution: string;
    highRisk: string;
    critical: string;
    close: string;
    back: string;
    demoTag: string;
    rupees: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brand: {
      name: 'SochKe Pay',
      tagline: 'Ruko. Socho. Surakshit Raho.',
      subTagline: 'Ruko. Socho. Surakshit Raho.',
      philosophy: "Fraudsters don't always hack the payment system. They manipulate the person using it.",
    },
    mascot: {
      ready: 'Ready when you are.',
      caution: "Hmm… let's check this payment.",
      highRisk: "Ruko. Let's understand this first.",
      success: "You're good to go!",
      poke: 'Sochu is here to protect your hard-earned money!',
    },
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      register: 'Safety Identity',
      pay: 'Make Payment',
      safetyWatch: 'Safety Watch',
      guardian: 'Family Mode',
      learn: 'Learn & Safety',
      demo: 'Demo Panel',
      voiceStudio: 'Voice Studio (Creator)',
      about: 'About & Privacy',
      taalaActive: 'TAALA Active',
      taalaLocked: 'Payments Locked',
      emergencyLock: '🔒 TAALA Lock',
    },
    landing: {
      heroTitle: 'Before you pay, SochKe.',
      heroSub: 'Real-time payment safety that explains risk in simple, honest language before money leaves your account.',
      ctaPay: 'Try a Safe Payment Simulator',
      ctaLearn: 'See How It Protects You',
      heroBadge: 'Designed for Every Indian Family & Digital Beginner',
      cardPreviewTitle: 'Context-Aware Real-time Protection',
      problemTitle: 'The Problem: Social Engineering, Not System Hacks',
      problemDesc: 'Most payment scams do not break banking cryptography. Scammers trick users into sending money by impersonating officials, promising fake refunds, or rushing them over a phone call.',
      howItWorksTitle: 'How SochKe Pay Protects You In 4 Clear Questions',
      step1Title: '1. What is happening?',
      step1Desc: 'We display transparent recipient identity, your payment history with them, and normal vs unusual amounts.',
      step2Title: '2. Why could it be risky?',
      step2Desc: 'We evaluate contextual signals like active calls, screen sharing, and timing rather than a single metric.',
      step3Title: '3. What should I do now?',
      step3Desc: 'We provide clear Hindi, English, and Odia voice guidance and adaptive friction with zero financial jargon.',
      step4Title: '4. What did I learn?',
      step4Desc: 'Micro-learning embedded right after payments teaches you UPI safety habits for a lifetime.',
      trustTitle: 'Our Privacy-First Architectural Promises',
      trust1: 'Device-Local Biometrics (No raw fingerprint hashes stored)',
      trust2: 'Never Asks For or Stores Your Secret UPI PIN',
      trust3: 'Transparent AI & Rule Engine (No Black-box Hallucinations)',
      trust4: 'Opt-in Family Guardian Mode for Multi-Generational Peace of Mind',
    },
    dashboard: {
      greeting: 'Namaste',
      protectedBadge: 'Your Payments are Protected',
      safetyProfileTitle: 'Payment Safety Profile',
      safetyProfileDesc: 'Based on your familiar recipient network, verified authentication checks, and proactive review habits.',
      scoreExplanation: 'A holistic measure of your safety readiness — not a credit score.',
      todayStats: 'Activity Today',
      protectedCount: 'Payments Checked',
      suspiciousPrevented: 'High-Risk Interceptions',
      voiceAlerts: 'Hindi, English & Odia Voice Alerts',
      recentActivity: 'Recent Protected Activity',
      viewAll: 'View All Logs',
      quickActions: 'Quick Safety Actions',
      actionPay: 'Safe Pay',
      actionSafetyWatch: 'Safety Watch',
      actionGuardian: 'Family Mode',
      actionLearn: 'Learn Rules',
      actionTaala: 'Emergency Lock',
      taalaDesc: 'Temporarily freeze all outgoing payments if you suspect a scam.',
      emptyHistory: 'No payments yet. Try making a simulated payment above.',
    },
    pay: {
      title: 'Simulated UPI Payment',
      subtitle: 'Experience real-time contextual risk detection and explainable safety guidance.',
      scenarioPicker: '⚡ Quick Demo Scenarios (Select one to test):',
      scenarioLabel: 'Load Preset Scenario',
      recipientInput: 'Paying Recipient / VPA',
      amountInput: 'Amount (₹)',
      noteInput: 'Add a message or note (optional)',
      contextSignals: 'Live Context Signals (Simulated Device Telemetry):',
      activeCall: 'Active Phone Call',
      screenSharing: 'Screen Sharing / Remote App Active',
      nightTime: 'Late Night (Outside 8 AM - 10 PM)',
      appSwitches: 'Rapid App Switching Detected',
      urgency: 'High Urgency / Coercive Language',
      emergencyToggle: 'Genuine Hospital / Medical Emergency',
      payButton: 'Verify & Pay with SochKe',
      analyzing: 'Evaluating Contextual Risk Signals...',
      normalBaselineNote: 'Your normal payment baseline is ₹2,800 between 8:00 AM and 10:00 PM.',
    },
    transparency: {
      youArePaying: 'YOU ARE PAYING',
      recipientStatus: 'Recipient Status',
      newRecipient: 'New Recipient (First Time)',
      knownRecipient: 'Known Recipient',
      flaggedRecipient: '⚠️ Flagged by Community Safety Watch',
      verifiedMerchant: 'Verified Merchant',
      yourHistory: 'Your History',
      historyNever: 'You have NEVER sent money to this account before.',
      historyCount: 'You have paid this recipient {count} times before (Total ₹{total}).',
      amountLabel: 'Amount',
      yourAverage: 'Your normal average is ₹2,800.',
      contextLabel: 'Context Detected',
      onCallNotice: 'You are currently on an active voice call.',
      sochkeSays: 'SochKe Advice:',
      pauseAndVerify: 'PAUSE AND VERIFY',
      looksGood: 'Looks Safe to Proceed',
      cautionAdvised: 'Review Before Confirming',
    },
    whyRisk: {
      title: 'Why did we pause this payment?',
      whatMeansTitle: 'What this means',
      whatMeansText: 'You are sending money OUT of your bank account. Entering your UPI PIN or authorizing this transfer will immediately deduct money from your account.',
      whatToDoTitle: 'What should you do?',
      whatToDoText: 'If someone on a phone call or chat told you this is a "refund", "lottery prize", "customs clearance", or "police fine", HANG UP IMMEDIATELY. Legitimate refunds NEVER require you to pay money or enter your PIN.',
      signalNewRecipient: 'New Unknown Recipient',
      signalNewRecipientDesc: 'You have never transferred money to this VPA before.',
      signalActiveCall: 'Active Phone Call Detected',
      signalActiveCallDesc: 'You are on an active voice call while making a payment to an unknown party.',
      signalUnusualAmount: 'Unusually Large Amount',
      signalUnusualAmountDesc: 'This payment is significantly higher than your typical ₹2,800 payment baseline.',
      signalUnusualTime: 'Late-Night Transaction',
      signalUnusualTimeDesc: 'This transaction is occurring outside your standard 8 AM–10 PM routine.',
      signalHighVelocity: 'Rapid Transaction Sequence',
      signalHighVelocityDesc: 'Multiple high-value payment attempts detected in a short time frame.',
      signalScreenSharing: 'Screen Sharing App Active',
      signalScreenSharingDesc: 'A remote desktop or screen sharing app is running (e.g. AnyDesk, TeamViewer).',
      signalAppSwitching: 'Repeated App Switching',
      signalAppSwitchingDesc: 'Rapid switches between phone call, messaging, and payment apps indicate coached guidance.',
      signalFlaggedAccount: 'Reported in Safety Watch Registry',
      signalFlaggedAccountDesc: 'This recipient has been reported by multiple citizens for fraudulent activity.',
      signalContextMismatch: 'Mismatched Category & Context',
      signalContextMismatchDesc: 'A personal account is masquerading as customer support or electricity utility.',
      friendExemptionNote: 'Note: Because this is a known friend and normal amount, the active call does NOT raise an alert.',
      emergencyFastTrackNote: 'Emergency fast-track applied for verified medical/hospital facility.',
    },
    voiceWarning: {
      heading: 'SochKe Audio Safety Warning',
      playAgain: 'Replay Audio Guidance',
      stopAudio: 'Mute Voice',
      liveVoiceActive: 'Voice Safety Playing...',
    },
    checklist: {
      title: 'Before You Pay — 6-Point Safety Checklist',
      subtitle: 'Take a breath and verify each point before transferring money:',
      q1: 'Do I know this person or merchant personally?',
      q2: 'Did I initiate this payment myself (not instructed by a stranger)?',
      q3: 'Is the amount exact and expected by me?',
      q4: 'Is anyone rushing, threatening, or panicking me?',
      q5: 'Am I being told what buttons or PIN to press over a call?',
      q6: 'Do I understand that entering my UPI PIN sends money OUT?',
      allChecked: 'All 6 points verified by me',
      proceed: 'I have verified. Proceed to Authenticate',
      cancel: 'Stop & Cancel Payment',
    },
    auth: {
      title: 'Human-Friendly Safety Verification',
      subtitle: 'Complete privacy-first authentication to confirm this is your intentional decision.',
      tabBiometric: 'Device Biometric',
      tabVoice: 'Voice Phrase',
      tabFamiliar: 'Familiar Picture',
      biometricPrompt: 'Touch Fingerprint / Face ID sensor on your device',
      biometricNotice: 'Privacy Promise: Biometric validation occurs locally in your phone’s Secure Enclave. We never store raw biometrics.',
      voicePrompt: 'Speak this safety phrase into your microphone:',
      voicePhrase: '"Main Soch Samajhkar Yeh Payment Kar Raha Hoon"',
      voiceNotice: 'Prototype voice verification analyzes live cadence and phrase matching.',
      familiarPrompt: 'Choose your personal SochKe Safety Picture selected during onboarding:',
      familiarNotice: 'Cognitive familiarity verification designed for elders and low-literacy users.',
      verifySuccess: 'Verification Successful!',
      verifyFailed: 'Verification failed. Please try again.',
      cancel: 'Cancel Payment',
      confirm: 'Authorize Transaction',
    },
    guardian: {
      title: 'Family Mode & Guardian Protection',
      subtitle: 'Empower a trusted family member to help review unusually high-risk transfers.',
      currentGuardian: 'Nominated Family Guardian',
      relationship: 'Relationship',
      threshold: 'Approval Threshold',
      status: 'Status',
      verified: 'Verified & Active',
      pending: 'Awaiting Acceptance',
      pendingApprovalTitle: 'Guardian Review Requested',
      pendingApprovalDesc: 'Because this transaction was flagged as high-risk, a secure review request was dispatched to your guardian.',
      simulatedApprove: 'Simulate Guardian APPROVE',
      simulatedReject: 'Simulate Guardian REJECT',
      addGuardian: 'Change / Add Family Guardian',
      guardianNote: 'Family Mode is 100% opt-in and configurable. It never blocks everyday routine payments.',
    },
    safetyWatch: {
      title: 'Safety Watch — Community Risk Registry',
      subtitle: 'Decentralized citizen reports, anonymized mule clusters, and reviewed scam entities.',
      communityReported: 'Community Reported',
      underReview: 'Under Review by Analysts',
      confirmedSuspicious: 'Confirmed Suspicious Cluster',
      reportsCount: 'Reports',
      associatedMules: 'Linked Mule Entities',
      disclaimer: 'Safety Watch is a prototype risk-intelligence registry. All displayed identifiers are anonymized demo tokens.',
      reportNewBtn: 'Report a Suspicious VPA / Number',
      reportModalTitle: 'Report Suspicious Activity to Safety Watch',
    },
    taala: {
      title: 'TAALA — Emergency Outgoing Payment Lock',
      subtitle: 'Suspect you are being targeted by a scammer? Freeze all outgoing payments immediately.',
      holdToLock: 'Press and Hold for 2 seconds to Lock TAALA',
      lockedStatus: '🔒 ALL OUTGOING PAYMENTS ARE LOCKED',
      lockedDesc: 'No transfers can be authorized until you unlock with your device biometric or familiar picture.',
      unlockBtn: 'Unlock Outgoing Payments',
      safeNote: 'Incoming transfers are unaffected. Your bank account balance is safe.',
    },
    learn: {
      title: 'Learn & Build Payment Immunity',
      subtitle: 'Simple visual lessons that explain how UPI works and expose common scam tricks.',
      tabBasics: 'UPI Fundamentals',
      tabScams: 'Common Scams Exposed',
      tabChecklist: 'Safe Habits Checklist',
      pinRuleTitle: 'The Golden Rule of UPI PIN',
      pinRuleDesc: 'You ONLY enter your UPI PIN when SENDING money. You NEVER need to enter a PIN to receive a refund, lottery prize, or payment.',
      qrRuleTitle: 'QR Codes are for Paying, Not Receiving',
      qrRuleDesc: 'Scanning a QR code always requests money from your account. No merchant needs you to scan a QR code to send you a refund.',
      refundScamTitle: 'The "Customer Care Refund" Scam',
      refundScamDesc: 'Scammers pose as Swiggy, Amazon, or bank support. They tell you: "We are sending a refund, please open GPay and accept the request." That request is a COLLECT request taking your money!',
      digitalArrestTitle: 'The "Digital Arrest" Extortion Scam',
      digitalArrestDesc: 'Imposters dress as police or CBI over video calls, claiming your Aadhaar or parcel was found with illegal contraband. They demand money to "clear your name". Real police NEVER demand UPI payments!',
      customerCareTitle: 'Fake Google Search Numbers',
      customerCareDesc: 'Never trust phone numbers found on random Google search or Instagram for courier/airline customer care. Always use the official verified app.',
    },
    common: {
      cancel: 'Cancel',
      continue: 'Continue',
      safe: 'Safe',
      caution: 'Caution',
      highRisk: 'High Risk',
      critical: 'Critical Risk',
      close: 'Close',
      back: 'Back',
      demoTag: 'Simulated Demo Data',
      rupees: '₹',
    },
  },
  hi: {
    brand: {
      name: 'सोचके Pay',
      tagline: 'रुकिए। सोचिए। सुरक्षित रहिए।',
      subTagline: 'रुकिए। सोचिए। सुरक्षित रहिए।',
      philosophy: 'धोखेबाज हमेशा सिस्टम को नहीं हैक करते, बल्कि वो इंसान की घबराहट और भरोसे का गलत फायदा उठाते हैं।',
    },
    mascot: {
      ready: 'मैं तैयार हूँ, जब आप कहें।',
      caution: 'हम्म… पहले इस पेमेंट की जांच कर लेते हैं।',
      highRisk: 'रुकिए! पहले इसे अच्छी तरह समझते हैं।',
      success: 'सब ठीक है! आप सुरक्षित हैं।',
      poke: 'सोचू आपकी मेहनत की कमाई की रक्षा के लिए हमेशा साथ है!',
    },
    nav: {
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      register: 'सुरक्षा खाता',
      pay: 'भुगतान करें',
      safetyWatch: 'सेफ्टी वॉच',
      guardian: 'परिवार सुरक्षा',
      learn: 'सीखें और समझें',
      demo: 'डेमो पैनल',
      voiceStudio: 'वॉइस स्टूडियो (निर्माता)',
      about: 'प्राइवेसी और नियम',
      taalaActive: 'ताला सक्रिय',
      taalaLocked: 'पेमेंट लॉक है',
      emergencyLock: '🔒 ताला (आपातकालीन लॉक)',
    },
    landing: {
      heroTitle: 'पैसे भेजने से पहले, सोचके।',
      heroSub: 'असली समय में खतरे की पहचान जो कठिन तकनीकी शब्दों के बिना, आपकी अपनी भाषा में सही कारण समझाती है।',
      ctaPay: 'सुरक्षित पेमेंट सिमुलेटर चलाएं',
      ctaLearn: 'जानिए यह कैसे बचाता है',
      heroBadge: 'हर भारतीय परिवार और नए डिजिटल उपयोगकर्ताओं के लिए विशेष रूप से निर्मित',
      cardPreviewTitle: 'परिस्थिति के अनुसार रीयल-टाइम सुरक्षा',
      problemTitle: 'समस्या: सिस्टम हैक नहीं, मनोवैज्ञानिक धोखा',
      problemDesc: 'अधिकांश यूपीआई फ्रॉड बैंक की तकनीक तोड़कर नहीं होते। धोखेबाज खुद को अधिकारी बताकर या फोन कॉल पर डराकर पैसे ट्रांसफर करवाते हैं।',
      howItWorksTitle: 'सोचके Pay 4 सरल सवालों में आपकी रक्षा करता है',
      step1Title: '१. क्या हो रहा है?',
      step1Desc: 'हम पाने वाले की पूरी पहचान, आपका पुराना इतिहास और सामान्य भुगतान की तुलना स्पष्ट दिखाते हैं।',
      step2Title: '२. इसमें क्या खतरा हो सकता है?',
      step2Desc: 'हम सिर्फ स्कोर नहीं बताते, बल्कि कॉल पर होना, स्क्रीन शेयरिंग और समय जैसे संकेतों को परखते हैं।',
      step3Title: '३. अब मुझे क्या करना चाहिए?',
      step3Desc: 'हिंदी और अंग्रेजी में साफ आवाज में चेतावनी और आसान कदम ताकि कोई आपको गुमराह न कर सके।',
      step4Title: '४. इससे मैंने क्या सीखा?',
      step4Desc: 'हर पेमेंट के साथ छोटी-छोटी जरूरी सीख ताकि अगली बार आप खुद सुरक्षित फैसला ले सकें।',
      trustTitle: 'हमारी प्राइवेसी और सुरक्षा की पक्की गारंटी',
      trust1: 'डिवाइस-लोकल बायोमेट्रिक (आपका फिंगरप्रिंट कभी फोन से बाहर नहीं जाता)',
      trust2: 'आपका सीक्रेट यूपीआई पिन कभी न तो मांगते हैं और न ही स्टोर करते हैं',
      trust3: 'पारदर्शी और सटीक नियम आधारित इंजन (कोई नकली दावे नहीं)',
      trust4: 'बुजुर्गों और परिवार की सुरक्षा के लिए वैकल्पिक गार्जियन मोड',
    },
    dashboard: {
      greeting: 'नमस्ते',
      protectedBadge: 'आपके भुगतान सुरक्षित हैं',
      safetyProfileTitle: 'पेमेंट सुरक्षा प्रोफाइल',
      safetyProfileDesc: 'आपके जाने-पहचाने संपर्कों, सुरक्षित बायोमेट्रिक सत्यापन और सावधान आदतों पर आधारित।',
      scoreExplanation: 'यह आपकी सतर्कता का पैमाना है — कोई सिबिल या क्रेडिट स्कोर नहीं।',
      todayStats: 'आज की सुरक्षा गतिविधि',
      protectedCount: 'जांचे गए पेमेंट',
      suspiciousPrevented: 'रोके गए संदिग्ध प्रयास',
      voiceAlerts: 'हिंदी, अंग्रेजी और ओड़िया में आवाज़ की चेतावनी',
      recentActivity: 'हाल के सुरक्षित लेन-देन',
      viewAll: 'सभी लेन-देन देखें',
      quickActions: 'त्वरित सुरक्षा विकल्प',
      actionPay: 'सुरक्षित भुगतान',
      actionSafetyWatch: 'सेफ्टी वॉच',
      actionGuardian: 'परिवार मोड',
      actionLearn: 'सुरक्षा नियम',
      actionTaala: 'ताला (आपातकालीन लॉक)',
      taalaDesc: 'धोखे का शक होने पर तुरंत अपने सारे आउटगोइंग पेमेंट रोकें।',
      emptyHistory: 'अभी कोई लेन-देन नहीं है। ऊपर दिए गए बटन से सुरक्षित भुगतान का अभ्यास करें।',
    },
    pay: {
      title: 'यूपीआई भुगतान सिमुलेटर',
      subtitle: 'जानिए कैसे सोचके Pay हर स्थिति को समझकर आपको सही समय पर सचेत करता है।',
      scenarioPicker: '⚡ डेमो परिस्थितियाँ (जांचने के लिए कोई एक चुनें):',
      scenarioLabel: 'तैयार परिदृश्य लोड करें',
      recipientInput: 'पाने वाले का नाम / UPI ID (VPA)',
      amountInput: 'रुपये (₹)',
      noteInput: 'संदेश या नोट (वैकल्पिक)',
      contextSignals: 'लाइव परिस्थितियाँ (सिम्युलेटेड डिवाइस संकेत):',
      activeCall: 'फोन कॉल चालू है (Active Call)',
      screenSharing: 'स्क्रीन शेयरिंग चालू है (AnyDesk/TeamViewer)',
      nightTime: 'देर रात (रात 10 से सुबह 8 के बीच)',
      appSwitches: 'बार-बार ऐप्स बदलना (App Switching)',
      urgency: 'जल्दबाजी या दबाव (Urgency/Threat)',
      emergencyToggle: 'अस्पताल / मेडिकल इमरजेंसी',
      payButton: 'सोचके के साथ जांचें और भुगतान करें',
      analyzing: 'परिस्थिति और जोखिम की जांच हो रही है...',
      normalBaselineNote: 'आपका सामान्य भुगतान औसत ₹2,800 है (सुबह 8:00 से रात 10:00 के बीच)।',
    },
    transparency: {
      youArePaying: 'आप पैसे भेज रहे हैं',
      recipientStatus: 'प्राप्तकर्ता की स्थिति',
      newRecipient: 'नया खाता (पहली बार भुगतान)',
      knownRecipient: 'जाना-पहचाना खाता',
      flaggedRecipient: '⚠️ सेफ्टी वॉच में संदिग्ध रिपोर्ट किया गया',
      verifiedMerchant: 'सत्यापित मर्चेंट',
      yourHistory: 'आपका पिछला इतिहास',
      historyNever: 'आपने इस खाते में पहले कभी पैसे नहीं भेजे हैं।',
      historyCount: 'आप इन्हें पहले {count} बार पैसे भेज चुके हैं (कुल ₹{total})।',
      amountLabel: 'राशि',
      yourAverage: 'आपका सामान्य औसत ₹2,800 है।',
      contextLabel: 'पहचाना गया माहौल',
      onCallNotice: 'आप इस समय फोन कॉल पर बात कर रहे हैं।',
      sochkeSays: 'सोचके की सलाह:',
      pauseAndVerify: 'रुकिए और जांचिए',
      looksGood: 'भुगतान सुरक्षित लग रहा है',
      cautionAdvised: 'पुष्टि करने से पहले ध्यान दें',
    },
    whyRisk: {
      title: 'हमने इस भुगतान को क्यों रोका?',
      whatMeansTitle: 'इसका क्या अर्थ है?',
      whatMeansText: 'आप अपने खाते से पैसे बाहर भेज रहे हैं। अपना यूपीआई पिन दर्ज करने से पैसे तुरंत आपके बैंक खाते से कट जाएंगे।',
      whatToDoTitle: 'अब आपको क्या करना चाहिए?',
      whatToDoText: 'अगर फोन पर कोई आपसे कह रहा है कि यह "रिफंड", "लॉटरी", "बिजली बिल छूट" या "पुलिस जुर्माना" है, तो तुरंत फोन काट दें। रिफंड या पैसे पाने के लिए कभी भी यूपीआई पिन की जरूरत नहीं होती।',
      signalNewRecipient: 'नया और अनजान खाता',
      signalNewRecipientDesc: 'आपने इस यूपीआई पते पर पहले कभी पैसे नहीं भेजे हैं।',
      signalActiveCall: 'फोन कॉल चालू है',
      signalActiveCallDesc: 'आप अनजान खाते में पैसे भेजते समय किसी से फोन पर बात कर रहे हैं।',
      signalUnusualAmount: 'असामान्य रूप से बड़ी रकम',
      signalUnusualAmountDesc: 'यह राशि आपके सामान्य ₹2,800 के औसत से बहुत ज्यादा है।',
      signalUnusualTime: 'देर रात का भुगतान',
      signalUnusualTimeDesc: 'यह लेन-देन आपके सामान्य दिनचर्या के समय से बाहर हो रहा है।',
      signalHighVelocity: 'लगातार कई भुगतान',
      signalHighVelocityDesc: 'कम समय में बार-बार बड़ी रकम भेजने की कोशिश हो रही है।',
      signalScreenSharing: 'स्क्रीन शेयरिंग ऐप चालू है',
      signalScreenSharingDesc: 'फोन में एनीडेस्क या टीमव्यूअर जैसा रिमोट कंट्रोल ऐप चालू है।',
      signalAppSwitching: 'बार-बार ऐप्स बदलना',
      signalAppSwitchingDesc: 'कॉल, व्हाट्सएप और यूपीआई ऐप के बीच बार-बार जाने से संकेत मिलता है कि कोई फोन पर निर्देश दे रहा है।',
      signalFlaggedAccount: 'सेफ्टी वॉच में संदिग्ध दर्ज',
      signalFlaggedAccountDesc: 'इस खाते की शिकायत पहले कई अन्य नागरिकों द्वारा फ्रॉड के रूप में की जा चुकी है।',
      signalContextMismatch: 'गलत पहचान का शक',
      signalContextMismatchDesc: 'बिजली बोर्ड या कस्टमर केयर के नाम पर किसी निजी व्यक्ति का खाता इस्तेमाल हो रहा है।',
      friendExemptionNote: 'ध्यान दें: यह आपके जाने-पहचाने मित्र हैं और सामान्य रकम है, इसलिए कॉल पर होने पर भी चेतावनी नहीं दी गई।',
      emergencyFastTrackNote: 'सत्यापित अस्पताल के लिए इमरजेंसी फास्ट-ट्रैक लागू किया गया।',
    },
    voiceWarning: {
      heading: 'सोचके ऑडियो सुरक्षा चेतावनी',
      playAgain: 'आवाज फिर से सुनें',
      stopAudio: 'आवाज बंद करें',
      liveVoiceActive: 'आवाज में चेतावनी दी जा रही है...',
    },
    checklist: {
      title: 'भुगतान से पहले — ६ बिंदुओं की सुरक्षा जांच',
      subtitle: 'पैसे भेजने से पहले एक गहरी सांस लें और इन सवालों के सही जवाब जांचें:',
      q1: 'क्या मैं इस व्यक्ति या दुकानदार को व्यक्तिगत रूप से जानता हूँ?',
      q2: 'क्या यह भुगतान मैंने खुद शुरू किया है (किसी अजनबी के कहने पर नहीं)?',
      q3: 'क्या रकम बिल्कुल वही है जिसकी मुझे उम्मीद थी?',
      q4: 'क्या कोई मुझे डरा रहा है, धमका रहा है या जल्दबाजी कर रहा है?',
      q5: 'क्या कोई फोन पर मुझे कौन सा बटन या पिन दबाना है, यह बता रहा है?',
      q6: 'क्या मैं समझता हूँ कि यूपीआई पिन डालने से पैसे मेरे खाते से कटते हैं?',
      allChecked: 'मैंने सभी ६ बिंदुओं की जांच कर ली है',
      proceed: 'मैंने जांच लिया है, आगे बढ़ें',
      cancel: 'रुकें और भुगतान रद्द करें',
    },
    auth: {
      title: 'मानवीय और आसान सुरक्षा सत्यापन',
      subtitle: 'पुष्टि करें कि यह फैसला पूरी तरह से आपका अपना और सोच-समझकर लिया गया है।',
      tabBiometric: 'फिंगरप्रिंट / फेस आईडी',
      tabVoice: 'आवाज का वाक्य',
      tabFamiliar: 'पहचानी हुई तस्वीर',
      biometricPrompt: 'अपने फोन के फिंगरप्रिंट या फेस आईडी सेंसर को छुएं',
      biometricNotice: 'प्राइवेसी सुरक्षा: बायोमेट्रिक जांच आपके फोन के अंदर ही होती है। हम आपका फिंगरप्रिंट कभी स्टोर नहीं करते।',
      voicePrompt: 'माइक में यह सुरक्षा वाक्य साफ-साफ बोलें:',
      voicePhrase: '"मैं सोच समझकर यह पेमेंट कर रहा हूँ"',
      voiceNotice: 'प्रोटोटाइप आवाज सत्यापन आपकी स्वाभाविक आवाज और वाक्य की पुष्टि करता है।',
      familiarPrompt: 'अपनी चुनी हुई सोचके सुरक्षा तस्वीर चुनें:',
      familiarNotice: 'बुजुर्गों और नए डिजिटल उपयोगकर्ताओं के लिए सरल चित्र-आधारित पहचान।',
      verifySuccess: 'सत्यापन सफल रहा!',
      verifyFailed: 'सत्यापन नहीं हो सका। कृपया दोबारा प्रयास करें।',
      cancel: 'भुगतान रद्द करें',
      confirm: 'भुगतान अधिकृत करें',
    },
    guardian: {
      title: 'परिवार मोड और अभिभावक सुरक्षा',
      subtitle: 'अपने परिवार के किसी भरोसेमंद सदस्य को असामान्य रूप से बड़े भुगतान की समीक्षा का अधिकार दें।',
      currentGuardian: 'नामित पारिवारिक अभिभावक',
      relationship: 'रिश्ता',
      threshold: 'अनुमति सीमा',
      status: 'स्थिति',
      verified: 'सत्यापित और सक्रिय',
      pending: 'स्वीकृति की प्रतीक्षा में',
      pendingApprovalTitle: 'अभिभावक की मंजूरी मांगी गई',
      pendingApprovalDesc: 'क्योंकि यह भुगतान अत्यधिक जोखिम भरा पाया गया, आपके अभिभावक के फोन पर मंजूरी का सुरक्षित अनुरोध भेजा गया है।',
      simulatedApprove: 'सिम्युलेट: अभिभावक ने मंज़ूर किया (Approve)',
      simulatedReject: 'सिम्युलेट: अभिभावक ने अस्वीकार किया (Reject)',
      addGuardian: 'अभिभावक बदलें या जोड़ें',
      guardianNote: 'परिवार मोड पूरी तरह आपकी इच्छा पर है। यह रोजमर्रा के सामान्य भुगतानों को कभी नहीं रोकता।',
    },
    safetyWatch: {
      title: 'सेफ्टी वॉच — समुदाय आधारित फ्रॉड रजिस्ट्री',
      subtitle: 'नागरिकों द्वारा रिपोर्ट किए गए संदिग्ध खाते, म्यूल अकाउंट क्लस्टर और फ्रॉड पैटर्न।',
      communityReported: 'नागरिकों द्वारा रिपोर्ट किया गया',
      underReview: 'विशेषज्ञों द्वारा समीक्षाधीन',
      confirmedSuspicious: 'पुष्ट संदिग्ध क्लस्टर',
      reportsCount: 'कुल शिकायतें',
      associatedMules: 'जुड़े हुए संदिग्ध खाते',
      disclaimer: 'सेफ्टी वॉच एक प्रोटोटाइप जोखिम-सूचना प्रणाली है। दिखाए गए सभी पहचानकर्ता केवल डेमो के लिए हैं।',
      reportNewBtn: 'संदिग्ध यूपीआई आईडी / नंबर की रिपोर्ट करें',
      reportModalTitle: 'सेफ्टी वॉच में संदिग्ध गतिविधि की शिकायत दर्ज करें',
    },
    taala: {
      title: 'ताला (TAALA) — आपातकालीन आउटगोइंग पेमेंट लॉक',
      subtitle: 'धोखाधड़ी का संदेह होते ही तुरंत अपने सभी आउटगोइंग भुगतान एक क्लिक में रोकें।',
      holdToLock: 'ताला लगाने के लिए २ सेकंड तक दबाकर रखें',
      lockedStatus: '🔒 सभी आउटगोइंग भुगतान सुरक्षित रूप से लॉक हैं',
      lockedDesc: 'जब तक आप बायोमेट्रिक या अपनी पहचान वाली तस्वीर से अनलॉक नहीं करते, कोई पैसा बाहर नहीं जा सकता।',
      unlockBtn: 'भुगतान फिर से शुरू करें (Unlock)',
      safeNote: 'आपके खाते में पैसे आ सकते हैं, केवल बाहर जाना रोका गया है। आपका बैलेंस सुरक्षित है।',
    },
    learn: {
      title: 'सीखें और डिजिटल रूप से सजग बनें',
      subtitle: 'आसान सचित्र पाठ जो यूपीआई के असली नियमों को समझाते हैं और धोखाधड़ी से बचाते हैं।',
      tabBasics: 'यूपीआई के मूल नियम',
      tabScams: 'प्रचलित फ्रॉड के तरीके',
      tabChecklist: 'सुरक्षित आदतों की चेकलिस्ट',
      pinRuleTitle: 'यूपीआई पिन का स्वर्णिम नियम',
      pinRuleDesc: 'यूपीआई पिन केवल पैसे भेजते समय डाला जाता है। पैसे प्राप्त करने या रिफंड पाने के लिए पिन की कभी आवश्यकता नहीं होती।',
      qrRuleTitle: 'क्यूआर कोड केवल पैसे देने के लिए है',
      qrRuleDesc: 'क्यूआर कोड स्कैन करने का मतलब हमेशा आपके खाते से पैसा कटना है। कोई भी दुकानदार आपको पैसे भेजने के लिए क्यूआर स्कैन नहीं करवा सकता।',
      refundScamTitle: 'फर्जी "कस्टमर केयर रिफंड" घोटाला',
      refundScamDesc: 'धोखेबाज बैंक या स्विगी कस्टमर केयर बनकर कहते हैं कि रिफंड के लिए गूगल पे खोलें और कलेक्ट रिक्वेस्ट स्वीकार करें। वह कलेक्ट रिक्वेस्ट आपके पैसे निकालने के लिए होती है!',
      digitalArrestTitle: 'फर्जी "डिजिटल अरेस्ट" का डर',
      digitalArrestDesc: 'धोखेबाज पुलिस या सीबीआई की वर्दी में वीडियो कॉल करके गिरफ्तारी का डर दिखाते हैं और पैसे ट्रांसफर मांगते हैं। असली पुलिस कभी फोन पर यूपीआई से पैसे नहीं मांगती!',
      customerCareTitle: 'गूगल सर्च पर फर्जी नंबर',
      customerCareDesc: 'कूरियर या एयरलाइन का कस्टमर केयर नंबर कभी भी गूगल सर्च से न उठाएं। हमेशा आधिकारिक ऐप का ही इस्तेमाल करें।',
    },
    common: {
      cancel: 'रद्द करें',
      continue: 'जारी रखें',
      safe: 'सुरक्षित',
      caution: 'सावधानी',
      highRisk: 'उच्च जोखिम',
      critical: 'अत्यंत गंभीर',
      close: 'बंद करें',
      back: 'पीछे जाएं',
      demoTag: 'सिम्युलेटेड डेमो डेटा',
      rupees: '₹',
    },
  },
  or: {
    // Odia structure with clean authentic fallbacks
    brand: {
      name: 'SochKe Pay',
      tagline: 'ଅଟକନ୍ତୁ। ଭାବନ୍ତୁ। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।',
      subTagline: 'ଅଟକନ୍ତୁ। ଭାବନ୍ତୁ। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।',
      philosophy: 'ଠକମାନେ ସବୁବେଳେ ସିଷ୍ଟମ ହ୍ୟାକ୍ କରନ୍ତି ନାହିଁ, ସେମାନେ ଲୋକଙ୍କ ଭୟ ଏବଂ ବିଶ୍ୱାସର ଭୁଲ ଫାଇଦା ଉଠାନ୍ତି।',
    },
    mascot: {
      ready: 'ମୁଁ ପ୍ରସ୍ତୁତ ଅଛି, ଆପଣ କହିବା ମାତ୍ରେ।',
      caution: 'ପ୍ରଥମେ ଏହି ପେମେଣ୍ଟ ଯାଞ୍ଚ କରିବା।',
      highRisk: 'ଅଟକନ୍ତୁ! ପ୍ରଥମେ ଏହାକୁ ଭଲଭାବେ ବୁଝିବା।',
      success: 'ସବୁ ଠିକ୍ ଅଛି! ଆପଣ ସୁରକ୍ଷିତ।',
      poke: 'ସୋଚୁ ଆପଣଙ୍କ କଷ୍ଟଅର୍ଜିତ ଟଙ୍କା ସୁରକ୍ଷା ପାଇଁ ସର୍ବଦା ପ୍ରସ୍ତୁତ!',
    },
    nav: {
      home: 'ମୂଳପୃଷ୍ଠା',
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
      register: 'ସୁରକ୍ଷା ଖାତା',
      pay: 'ପେମେଣ୍ଟ କରନ୍ତୁ',
      safetyWatch: 'ସେଫ୍ଟି ୱାଚ୍',
      guardian: 'ପରିବାର ସୁରକ୍ଷା',
      learn: 'ଶିଖନ୍ତୁ ଏବଂ ବୁଝନ୍ତୁ',
      demo: 'ଡେମୋ ପ୍ୟାନେଲ',
      voiceStudio: 'ଭଏସ୍ ଷ୍ଟୁଡିଓ (ନିର୍ମାତା)',
      about: 'ନିୟମ ଏବଂ ସୁରକ୍ଷା',
      taalaActive: 'ତାଲା ସକ୍ରିୟ',
      taalaLocked: 'ପେମେଣ୍ଟ ଲକ୍ ଅଛି',
      emergencyLock: '🔒 ତାଲା (Emergency Lock)',
    },
    landing: {
      heroTitle: 'ଟଙ୍କା ପଠାଇବା ପୂର୍ବରୁ, ଭାବନ୍ତୁ।',
      heroSub: 'ରିଅଲ-ଟାଇମ୍ ସୁରକ୍ଷା ଯାହା ସରଳ ଭାଷାରେ ବିପଦର କାରଣ ବୁଝାଇଥାଏ।',
      ctaPay: 'ସୁରକ୍ଷିତ ପେମେଣ୍ଟ ଚେଷ୍ଟା କରନ୍ତୁ',
      ctaLearn: 'ଏହା କିପରି ସୁରକ୍ଷା ଦିଏ ଦେଖନ୍ତୁ',
      heroBadge: 'ଭାରତୀୟ ପରିବାର ଏବଂ ନୂତନ ଡିଜିଟାଲ ବ୍ୟବହାରକାରୀଙ୍କ ପାଇଁ',
      cardPreviewTitle: 'ପରିସ୍ଥିତି ଆଧାରିତ ରିଅଲ-ଟାଇମ୍ ସୁରକ୍ଷା',
      problemTitle: 'ସମସ୍ୟା: ଡିଜିଟାଲ ଠକେଇ ଓ ମାନସିକ ଚାପ',
      problemDesc: 'ଠକମାନେ ଫୋନ୍ କଲ୍ ବା ମିଥ୍ୟା ପୁରସ୍କାରର ଲୋଭ ଦେଖାଇ ଟଙ୍କା ଟ୍ରାନ୍ସଫର କରାଇନିଅନ୍ତି।',
      howItWorksTitle: 'SochKe Pay ୪ଟି ସରଳ ପ୍ରଶ୍ନରେ ଆପଣଙ୍କୁ ସୁରକ୍ଷା ଦିଏ',
      step1Title: '୧. କଣ ଘଟୁଛି?',
      step1Desc: 'ପ୍ରାପ୍ତକର୍ତ୍ତାଙ୍କ ସଠିକ୍ ପରିଚୟ ଏବଂ ପୂର୍ବ ଇତିହାସ ଦେଖାଯାଏ।',
      step2Title: '୨. ଏଥିରେ କି ବିପଦ ଥାଇପାରେ?',
      step2Desc: 'କଲ୍ ଚାଲିଥିବା, ସ୍କ୍ରିନ୍ ସେୟାରିଂ ଏବଂ ସମୟ ଆଦି ଯାଞ୍ଚ କରାଯାଏ।',
      step3Title: '୩. ମୋତେ ବର୍ତ୍ତମାନ କଣ କରିବାକୁ ହେବ?',
      step3Desc: 'ସ୍ପଷ୍ଟ ସ୍ୱର ଚେତାବନୀ ଏବଂ ସହଜ ପରାମର୍ଶ ମିଳେ।',
      step4Title: '୪. ଏଥିରୁ ମୁଁ କଣ ଶିଖିଲି?',
      step4Desc: 'ପ୍ରତିଟି କାରବାର ସହିତ ଜରୁରୀ ସୁରକ୍ଷା ନିୟମ ଶିଖନ୍ତୁ।',
      trustTitle: 'ଆମର ପ୍ରାଇଭେସି ଏବଂ ସୁରକ୍ଷା ପ୍ରତିବଦ୍ଧତା',
      trust1: 'ଡିଭାଇସ୍-ସ୍ଥାନୀୟ ବାୟୋମେଟ୍ରିକ୍ (ଫିଙ୍ଗରପ୍ରିଣ୍ଟ କେବେ ବାହାରକୁ ଯାଏ ନାହିଁ)',
      trust2: 'ଆପଣଙ୍କ ଗୁପ୍ତ UPI PIN କେବେ ସଂରକ୍ଷଣ କରାଯାଏ ନାହିଁ',
      trust3: 'ସ୍ୱଚ୍ଛ ନିୟମ ଭିତ୍ତିକ ସୁରକ୍ଷା ଇଞ୍ଜିନ୍',
      trust4: 'ପରିବାରର ସୁରକ୍ଷା ପାଇଁ ଗାର୍ଡିଆନ୍ ମୋଡ୍',
    },
    dashboard: {
      greeting: 'ନମସ୍କାର',
      protectedBadge: 'ଆପଣଙ୍କ କାରବାର ସୁରକ୍ଷିତ ଅଛି',
      safetyProfileTitle: 'ପେମେଣ୍ଟ ସୁରକ୍ଷା ପ୍ରୋଫାଇଲ୍',
      safetyProfileDesc: 'ଆପଣଙ୍କ ପରିଚିତ କଣ୍ଟାକ୍ଟ ଏବଂ ସତର୍କ ଅଭ୍ୟାସ ଉପରେ ଆଧାରିତ।',
      scoreExplanation: 'ଏହା ଆପଣଙ୍କ ସତର୍କତାର ମାପକ — କୌଣସି କ୍ରେଡିଟ୍ ସ୍କୋର ନୁହେଁ।',
      todayStats: 'ଆଜିର ସୁରକ୍ଷା କାର୍ଯ୍ୟକଳାପ',
      protectedCount: 'ଯାଞ୍ଚ ହୋଇଥିବା ପେମେଣ୍ଟ',
      suspiciousPrevented: 'ଅଟକାଯାଇଥିବା ସନ୍ଦିଗ୍ଧ ଚେଷ୍ଟା',
      voiceAlerts: 'ହିନ୍ଦୀ, ଇଂରାଜୀ ଏବଂ ଓଡ଼ିଆ ସ୍ୱର ଚେତାବନୀ',
      recentActivity: 'ନିକଟ ଅତୀତର ସୁରକ୍ଷିତ କାରବାର',
      viewAll: 'ସମସ୍ତ କାରବାର ଦେଖନ୍ତୁ',
      quickActions: 'ଶୀଘ୍ର ସୁରକ୍ଷା ବିକଳ୍ପ',
      actionPay: 'ସୁରକ୍ଷିତ ପେମେଣ୍ଟ',
      actionSafetyWatch: 'ସେଫ୍ଟି ୱାଚ୍',
      actionGuardian: 'ପରିବାର ମୋଡ୍',
      actionLearn: 'ସୁରକ୍ଷା ନିୟମ',
      actionTaala: 'ତାଲା (ଜରୁରୀକାଳୀନ ଲକ୍)',
      taalaDesc: 'ସନ୍ଦେହ ହେଲେ ତୁରନ୍ତ ସମସ୍ତ ପେମେଣ୍ଟ ବନ୍ଦ କରନ୍ତୁ।',
      emptyHistory: 'କୌଣସି କାରବାର ହୋଇନାହିଁ।',
    },
    pay: {
      title: 'ସିମୁଲେଟେଡ୍ UPI ପେମେଣ୍ଟ',
      subtitle: 'ରିଅଲ-ଟାଇମ୍ ସୁରକ୍ଷା ଏବଂ ସଠିକ୍ ପରାମର୍ଶ ଅନୁଭବ କରନ୍ତୁ।',
      scenarioPicker: '⚡ ଡେମୋ ପରିସ୍ଥିତି ବାଛନ୍ତୁ:',
      scenarioLabel: 'ଡେମୋ ଲୋଡ୍ କରନ୍ତୁ',
      recipientInput: 'ପ୍ରାପ୍ତକର୍ତ୍ତାଙ୍କ ନାମ / UPI ID (VPA)',
      amountInput: 'ଟଙ୍କା (₹)',
      noteInput: 'ବାର୍ତ୍ତା ବା ନୋଟ୍ (ଇଚ୍ଛାଧୀନ)',
      contextSignals: 'ଲାଇଭ୍ ପରିସ୍ଥିତି ସଙ୍କେତ:',
      activeCall: 'ଫୋନ୍ କଲ୍ ଚାଲିଛି (Active Call)',
      screenSharing: 'ସ୍କ୍ରିନ୍ ସେୟାରିଂ ଚାଲିଛି (Screen Sharing)',
      nightTime: 'ବିଳମ୍ବିତ ରାତି (ରାତି ୧୦ ରୁ ସକାଳ ୮)',
      appSwitches: 'ବାରମ୍ବାର ଆପ୍ ବଦଳାଇବା',
      urgency: 'ଜରୁରୀ ବା ଚାପପୂର୍ଣ୍ଣ କଥାବାର୍ତ୍ତା',
      emergencyToggle: 'ଡାକ୍ତରଖାନା / ମେଡିକାଲ ଜରୁରୀ ପରିସ୍ଥିତି',
      payButton: 'SochKe ସହିତ ଯାଞ୍ଚ କରି ପେମେଣ୍ଟ କରନ୍ତୁ',
      analyzing: 'ବିପଦ ଏବଂ ପରିସ୍ଥିତିର ଯାଞ୍ଚ ଚାଲିଛି...',
      normalBaselineNote: 'ଆପଣଙ୍କ ସାଧାରଣ ହାରାହାରି ପେମେଣ୍ଟ ₹୨,୮୦୦ ଅଟେ।',
    },
    transparency: {
      youArePaying: 'ଆପଣ ଟଙ୍କା ପଠାଉଛନ୍ତି',
      recipientStatus: 'ପ୍ରାପ୍ତକର୍ତ୍ତାଙ୍କ ସ୍ଥିତି',
      newRecipient: 'ନୂତନ ଆକାଉଣ୍ଟ (ପ୍ରଥମ ଥର)',
      knownRecipient: 'ପରିଚିତ ଆକାଉଣ୍ଟ',
      flaggedRecipient: '⚠️ ସେଫ୍ଟି ୱାଚ୍ ରେ ସନ୍ଦିଗ୍ଧ ବୋଲି ରିପୋର୍ଟ ହୋଇଛି',
      verifiedMerchant: 'ଯାଞ୍ଚ ହୋଇଥିବା ବ୍ୟବସାୟୀ',
      yourHistory: 'ପୂର୍ବ ଇତିହାସ',
      historyNever: 'ଆପଣ ଏହି ଆକାଉଣ୍ଟକୁ ପୂର୍ବରୁ କେବେ ଟଙ୍କା ପଠାଇ ନାହାଁନ୍ତି।',
      historyCount: 'ଆପଣ ପୂର୍ବରୁ ଏହାଙ୍କୁ {count} ଥର ଟଙ୍କା ପଠାଇଛନ୍ତି (ମୋଟ ₹{total})।',
      amountLabel: 'ରାଶି',
      yourAverage: 'ଆପଣଙ୍କ ସାଧାରଣ ହାରାହାରି ₹୨,୮୦୦ ଅଟେ।',
      contextLabel: 'ଚିହ୍ନଟ ହୋଇଥିବା ପରିବେଶ',
      onCallNotice: 'ଆପଣ ବର୍ତ୍ତମାନ ଏକ ଫୋନ୍ କଲ୍ ରେ କଥା ହେଉଛନ୍ତି।',
      sochkeSays: 'SochKe ପରାମର୍ଶ:',
      pauseAndVerify: 'ଅଟକନ୍ତୁ ଏବଂ ଯାଞ୍ଚ କରନ୍ତୁ',
      looksGood: 'ସୁରକ୍ଷିତ ଜଣାପଡୁଛି',
      cautionAdvised: 'ନିଶ୍ଚିତ କରିବା ପୂର୍ବରୁ ଭାବନ୍ତୁ',
    },
    whyRisk: {
      title: 'ଆମେ ଏହି ପେମେଣ୍ଟ କାହିଁକି ଅଟକାଇଲୁ?',
      whatMeansTitle: 'ଏହାର ଅର୍ଥ କଣ?',
      whatMeansText: 'ଆପଣ ନିଜ ବ୍ୟାଙ୍କରୁ ଟଙ୍କା ବାହାରକୁ ପଠାଉଛନ୍ତି। UPI PIN ଦେବା ମାତ୍ରେ ଟଙ୍କା କଟିଯିବ।',
      whatToDoTitle: 'ବର୍ତ୍ତମାନ କଣ କରିବେ?',
      whatToDoText: 'ଯଦି କେହି ଫୋନ୍ ରେ ଏହାକୁ ରିଫଣ୍ଡ ବୋଲି କହୁଛନ୍ତି, ତୁରନ୍ତ ଫୋନ୍ କାଟନ୍ତୁ। ଟଙ୍କା ପାଇବା ପାଇଁ କେବେହେଲେ UPI PIN ଦରକାର ହୁଏ ନାହିଁ।',
      signalNewRecipient: 'ନୂଆ ଏବଂ ଅପରିଚିତ ଆକାଉଣ୍ଟ',
      signalNewRecipientDesc: 'ଆପଣ ପୂର୍ବରୁ ଏହି UPI ID କୁ ଟଙ୍କା ପଠାଇ ନାହାଁନ୍ତି।',
      signalActiveCall: 'ଫୋନ୍ କଲ୍ ଚାଲିଛି',
      signalActiveCallDesc: 'ଅଜଣା ଲୋକଙ୍କୁ ଟଙ୍କା ପଠାଇବା ସମୟରେ ଆପଣ ଫୋନ୍ ରେ କଥା ହେଉଛନ୍ତି।',
      signalUnusualAmount: 'ଅସ୍ୱାଭାବିକ ଅଧିକ ଟଙ୍କା',
      signalUnusualAmountDesc: 'ଏହି ରାଶି ଆପଣଙ୍କ ସାଧାରଣ ₹୨,୮୦୦ ହାରାହାରି ଠାରୁ ବହୁତ ଅଧିକ।',
      signalUnusualTime: 'ବିଳମ୍ବିତ ରାତିର କାରବାର',
      signalUnusualTimeDesc: 'ଏହି କାରବାର ଆପଣଙ୍କ ନିୟମିତ ସମୟ ବାହାରେ ହେଉଛି।',
      signalHighVelocity: 'ବାରମ୍ବାର ଟଙ୍କା ପଠାଇବା ଚେଷ୍ଟା',
      signalHighVelocityDesc: 'କମ୍ ସମୟରେ ବାରମ୍ବାର ଟଙ୍କା ପଠାଇବାକୁ ଚେଷ୍ଟା କରାଯାଉଛି।',
      signalScreenSharing: 'ସ୍କ୍ରିନ୍ ସେୟାରିଂ ଆପ୍ ଚାଲିଛି',
      signalScreenSharingDesc: 'AnyDesk ବା TeamViewer ଭଳି ଆପ୍ ସକ୍ରିୟ ଅଛି।',
      signalAppSwitching: 'ବାରମ୍ବାର ଆପ୍ ବଦଳାଇବା',
      signalAppSwitchingDesc: 'ଫୋନ୍ କଲ୍ ଏବଂ ପେମେଣ୍ଟ ଆପ୍ ମଧ୍ୟରେ ବାରମ୍ବାର ଯିବା ଆସିବା।',
      signalFlaggedAccount: 'ସେଫ୍ଟି ୱାଚ୍ ରେ ଅଭିଯୋଗ',
      signalFlaggedAccountDesc: 'ଏହି ଆକାଉଣ୍ଟ ବିରୁଦ୍ଧରେ ପୂର୍ବରୁ ଅଭିଯୋଗ ହୋଇଛି।',
      signalContextMismatch: 'ଅସଙ୍ଗତ ପରିଚୟ',
      signalContextMismatchDesc: 'ସରକାରୀ ବା ବିଦ୍ୟୁତ୍ ବିଭାଗ ନାମରେ ବ୍ୟକ୍ତିଗତ ଆକାଉଣ୍ଟ ବ୍ୟବହାର।',
      friendExemptionNote: 'ଧ୍ୟାନ ଦିଅନ୍ତୁ: ଏହା ଆପଣଙ୍କ ପରିଚିତ ବନ୍ଧୁ ଥିବାରୁ କଲ୍ ରେ ଥିଲେ ମଧ୍ୟ ବିପଦ ଚେତାବନୀ ଦିଆଯାଇ ନାହିଁ।',
      emergencyFastTrackNote: 'ଡାକ୍ତରଖାନା ପାଇଁ ଜରୁରୀକାଳୀନ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ସୁବିଧା।',
    },
    voiceWarning: {
      heading: 'SochKe ସ୍ୱର ସୁରକ୍ଷା ଚେତାବନୀ',
      playAgain: 'ସ୍ୱର ପୁଣି ଶୁଣନ୍ତୁ',
      stopAudio: 'ଶବ୍ଦ ବନ୍ଦ କରନ୍ତୁ',
      liveVoiceActive: 'ସ୍ୱର ଚେତାବନୀ ଚାଲିଛି...',
    },
    checklist: {
      title: 'ପେମେଣ୍ଟ ପୂର୍ବରୁ — ୬ଟି ବିନ୍ଦୁର ଯାଞ୍ଚ',
      subtitle: 'ଟଙ୍କା ପଠାଇବା ପୂର୍ବରୁ ନିମ୍ନଲିଖିତ ପ୍ରଶ୍ନଗୁଡ଼ିକ ଯାଞ୍ଚ କରନ୍ତୁ:',
      q1: 'ମୁଁ ଏହି ବ୍ୟକ୍ତି ବା ଦୋକାନୀଙ୍କୁ ବ୍ୟକ୍ତିଗତ ଭାବେ ଜାଣିଛି କି?',
      q2: 'ଏହି ପେମେଣ୍ଟ ମୁଁ ନିଜ ଇଚ୍ଛାରେ କରୁଛି କି?',
      q3: 'ରାଶି ଠିକ୍ ଅଛି ତ?',
      q4: 'କେହି ମୋତେ ଡରାଉଛନ୍ତି ବା ବ୍ୟତିବ୍ୟସ୍ତ କରୁଛନ୍ତି କି?',
      q5: 'ଫୋନ୍ ରେ କେହି ମୋତେ PIN ଦେବାକୁ କହୁଛନ୍ତି କି?',
      q6: 'ମୁଁ ବୁଝିଛି ଯେ UPI PIN ଦେଲେ ମୋ ଖାତାରୁ ଟଙ୍କା କଟିଯିବ?',
      allChecked: 'ମୁଁ ସମସ୍ତ ୬ଟି ବିନ୍ଦୁ ଯାଞ୍ଚ କରିସାରିଛି',
      proceed: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
      cancel: 'ବାତିଲ କରନ୍ତୁ',
    },
    auth: {
      title: 'ସହଜ ସୁରକ୍ଷା ପ୍ରମାଣୀକରଣ',
      subtitle: 'ନିଶ୍ଚିତ କରନ୍ତୁ ଯେ ଏହି ନିଷ୍ପତ୍ତି ସମ୍ପୂର୍ଣ୍ଣ ଆପଣଙ୍କର।',
      tabBiometric: 'ଫିଙ୍ଗରପ୍ରିଣ୍ଟ / ଫେସ୍ ID',
      tabVoice: 'ସ୍ୱର ବାକ୍ୟ',
      tabFamiliar: 'ପରିଚିତ ଛବି',
      biometricPrompt: 'ଫୋନର ଫିଙ୍ଗରପ୍ରିଣ୍ଟ ସେନ୍ସର ସ୍ପର୍ଶ କରନ୍ତୁ',
      biometricNotice: 'ବାୟୋମେଟ୍ରିକ୍ ସୂଚନା କେବଳ ଆପଣଙ୍କ ଫୋନ୍ ଭିତରେ ରହେ।',
      voicePrompt: 'ମାଇକ୍ ରେ ସ୍ପଷ୍ଟ ଭାବେ କୁହନ୍ତୁ:',
      voicePhrase: '"ମୁଁ ଭାବିଚିନ୍ତି ଏହି ପେମେଣ୍ଟ କରୁଛି"',
      voiceNotice: 'ସ୍ୱର ପ୍ରମାଣୀକରଣ ପ୍ରୋଟୋଟାଇପ୍।',
      familiarPrompt: 'ଆପଣଙ୍କ ଚୟନ କରିଥିବା ସୁରକ୍ଷା ଛବି ବାଛନ୍ତୁ:',
      familiarNotice: 'ସରଳ ଛବି ଆଧାରିତ ପରିଚୟ।',
      verifySuccess: 'ପ୍ରମାଣୀକରଣ ସଫଳ ହେଲା!',
      verifyFailed: 'ପ୍ରମାଣୀକରଣ ହୋଇପାରିଲା ନାହିଁ।',
      cancel: 'ବାତିଲ କରନ୍ତୁ',
      confirm: 'ଅନୁମୋଦନ କରନ୍ତୁ',
    },
    guardian: {
      title: 'ପରିବାର ମୋଡ୍ ଏବଂ ଅଭିଭାବକ ସୁରକ୍ଷା',
      subtitle: 'ଅଧିକ ବିପଦ ଥିବା କାରବାର ପାଇଁ ପରିବାରର ବିଶ୍ୱସ୍ତ ସଦସ୍ୟଙ୍କ ସାହାଯ୍ୟ ନିଅନ୍ତୁ।',
      currentGuardian: 'ପାରିବାରିକ ଅଭିଭାବକ',
      relationship: 'ସମ୍ପର୍କ',
      threshold: 'ସୀମା',
      status: 'ସ୍ଥିତି',
      verified: 'ସକ୍ରିୟ ଅଛି',
      pending: 'ଅପେକ୍ଷାରେ ଅଛି',
      pendingApprovalTitle: 'ଅଭିଭାବକଙ୍କ ଅନୁମତି ଅପେକ୍ଷାରେ',
      pendingApprovalDesc: 'ଏହି ପେମେଣ୍ଟ ରେ ଅଧିକ ବିପଦ ଥିବାରୁ ଅଭିଭାବକଙ୍କୁ ଅନୁରୋଧ ପଠାଯାଇଛି।',
      simulatedApprove: 'ସିମୁଲେସନ୍: ଅଭିଭାବକ ଅନୁମୋଦନ କଲେ',
      simulatedReject: 'ସିମୁଲେସନ୍: ଅଭିଭାବକ ପ୍ରତ୍ୟାଖ୍ୟାନ କଲେ',
      addGuardian: 'ଅଭିଭାବକ ବଦଳାନ୍ତୁ',
      guardianNote: 'ଏହା ନିୟମିତ କାରବାରକୁ କେବେ ବାଧା ଦିଏ ନାହିଁ।',
    },
    safetyWatch: {
      title: 'ସେଫ୍ଟି ୱାଚ୍ — ସମୁଦାୟ ଆଧାରିତ ରେଜିଷ୍ଟ୍ରି',
      subtitle: 'ସନ୍ଦିଗ୍ଧ ଆକାଉଣ୍ଟ ଏବଂ ଫ୍ରଡ୍ ପାଟର୍ଣ୍ଣ ସୂଚନା।',
      communityReported: 'ନାଗରିକଙ୍କ ଦ୍ୱାରା ରିପୋର୍ଟ ହୋଇଛି',
      underReview: 'ସମୀକ୍ଷାଧୀନ',
      confirmedSuspicious: 'ନିଶ୍ଚିତ ସନ୍ଦିଗ୍ଧ',
      reportsCount: 'ଅଭିଯୋଗ ସଂଖ୍ୟା',
      associatedMules: 'ସଂଯୁକ୍ତ ଆକାଉଣ୍ଟ',
      disclaimer: 'ସେଫ୍ଟି ୱାଚ୍ ଏକ ପ୍ରୋଟୋଟାଇପ୍ ରିସ୍କ ରେଜିଷ୍ଟ୍ରି।',
      reportNewBtn: 'ସନ୍ଦିଗ୍ଧ ନମ୍ବର ରିପୋର୍ଟ କରନ୍ତୁ',
      reportModalTitle: 'ସେଫ୍ଟି ୱାଚ୍ ରେ ଅଭିଯୋଗ କରନ୍ତୁ',
    },
    taala: {
      title: 'ତାଲା (TAALA) — ଜରୁରୀକାଳୀନ ପେମେଣ୍ଟ ଲକ୍',
      subtitle: 'ସନ୍ଦେହ ହେଲେ ତୁରନ୍ତ ନିଜର ସମସ୍ତ ପେମେଣ୍ଟ ଲକ୍ କରନ୍ତୁ।',
      holdToLock: 'ତାଲା ଲଗାଇବା ପାଇଁ ୨ ସେକେଣ୍ଡ ଚାପି ଧରନ୍ତୁ',
      lockedStatus: '🔒 ସମସ୍ତ ପେମେଣ୍ଟ ଲକ୍ ଅଛି',
      lockedDesc: 'ଆପଣ ବାୟୋମେଟ୍ରିକ୍ ଦ୍ୱାରା ଅନଲକ୍ ନକରିବା ପର୍ଯ୍ୟନ୍ତ କୌଣସି ଟଙ୍କା ଯାଇପାରିବ ନାହିଁ।',
      unlockBtn: 'ଅନଲକ୍ କରନ୍ତୁ',
      safeNote: 'ଆପଣଙ୍କ ଆକାଉଣ୍ଟ ସୁରକ୍ଷିତ ଅଛି।',
    },
    learn: {
      title: 'ଶିଖନ୍ତୁ ଏବଂ ସଚେତନ ରୁହନ୍ତୁ',
      subtitle: 'ସରଳ ପାଠ ଯାହା ଆପଣଙ୍କୁ ଡିଜିଟାଲ ଠକେଇରୁ ରକ୍ଷା କରେ।',
      tabBasics: 'UPI ମୂଳ ନିୟମ',
      tabScams: 'ପ୍ରଚଳିତ ଠକେଇ',
      tabChecklist: 'ସୁରକ୍ଷିତ ଅଭ୍ୟାସ',
      pinRuleTitle: 'UPI PIN ର ସୁବର୍ଣ୍ଣ ନିୟମ',
      pinRuleDesc: 'PIN କେବଳ ଟଙ୍କା ପଠାଇବା ପାଇଁ ଦିଆଯାଏ, ପାଇବା ପାଇଁ ନୁହେଁ।',
      qrRuleTitle: 'QR Code କେବଳ ପେମେଣ୍ଟ ଦେବା ପାଇଁ',
      qrRuleDesc: 'QR ସ୍କାନ୍ କଲେ ଆପଣଙ୍କ ଖାତାରୁ ଟଙ୍କା କଟିଥାଏ।',
      refundScamTitle: 'ମିଥ୍ୟା ରିଫଣ୍ଡ ଠକେଇ',
      refundScamDesc: 'ଠକମାନେ ରିଫଣ୍ଡ ଆଳରେ ଟଙ୍କା କାଟିନିଅନ୍ତି।',
      digitalArrestTitle: 'ଡିଜିଟାଲ ଆରେଷ୍ଟ ଭୟ',
      digitalArrestDesc: 'ପୋଲିସ କେବେହେଲେ ଫୋନ୍ ରେ UPI ପେମେଣ୍ଟ ମାଗନ୍ତି ନାହିଁ।',
      customerCareTitle: 'ଗୁଗଲ ରେ ମିଥ୍ୟା ନମ୍ବର',
      customerCareDesc: 'ସର୍ବଦା ଅଫିସିଆଲ୍ ଆପ୍ ରୁ ନମ୍ବର ନିଅନ୍ତୁ।',
    },
    common: {
      cancel: 'ବାତିଲ',
      continue: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
      safe: 'ସୁରକ୍ଷିତ',
      caution: 'ସାବଧାନ',
      highRisk: 'ଅଧିକ ବିପଦ',
      critical: 'ଅତ୍ୟନ୍ତ ଗୁରୁତର',
      close: 'ବନ୍ଦ କରନ୍ତୁ',
      back: 'ପଛକୁ ଯାଆନ୍ତୁ',
      demoTag: 'ସିମୁଲେଟେଡ୍ ଡେମୋ',
      rupees: '₹',
    },
  },
};
