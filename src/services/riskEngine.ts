import { Recipient, TransactionContext, BehavioralBaseline, RiskAssessment, RiskSignal, RiskLevel, Decision } from '../types';

export function evaluateRisk(
  recipient: Recipient,
  amount: number,
  context: TransactionContext,
  baseline: BehavioralBaseline,
  note?: string
): RiskAssessment {
  const transactionId = `TX_${Date.now().toString(36).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const signals: RiskSignal[] = [];

  let transactionRisk = 0;
  let recipientRisk = 0;
  let contextRisk = 0;
  let behavioralRisk = 0;

  // 1. RECIPIENT CHECKS
  if (recipient.safetyWatchStatus === 'CONFIRMED_SUSPICIOUS') {
    recipientRisk += 45;
    signals.push({
      code: 'RECIPIENT_FLAGGED_CONFIRMED',
      titleKey: 'signalFlaggedAccount',
      explanationKey: 'signalFlaggedAccountDesc',
      severity: 'critical',
      points: 45,
      iconName: 'ShieldAlert',
    });
  } else if (recipient.safetyWatchStatus === 'UNDER_REVIEW' || recipient.safetyWatchStatus === 'COMMUNITY_REPORTED') {
    recipientRisk += 25;
    signals.push({
      code: 'RECIPIENT_UNDER_REVIEW',
      titleKey: 'signalFlaggedAccount',
      explanationKey: 'signalFlaggedAccountDesc',
      severity: 'high',
      points: 25,
      iconName: 'AlertTriangle',
    });
  } else if (!recipient.isKnown && recipient.historyCount === 0) {
    recipientRisk += 20;
    signals.push({
      code: 'NEW_RECIPIENT',
      titleKey: 'signalNewRecipient',
      explanationKey: 'signalNewRecipientDesc',
      severity: 'medium',
      points: 20,
      iconName: 'UserX',
    });
  }

  // Check Category Mismatch (e.g. personal account masquerading as utility or refund desk)
  const lowerNote = (note || '').toLowerCase();
  const lowerName = recipient.name.toLowerCase();
  if (
    (lowerNote.includes('refund') || lowerNote.includes('electricity') || lowerNote.includes('customs') || lowerNote.includes('police') || lowerNote.includes('cbi')) &&
    recipient.category !== 'utility' &&
    recipient.category !== 'hospital' &&
    !recipient.verifiedMerchant
  ) {
    recipientRisk += 20;
    signals.push({
      code: 'CONTEXT_MISMATCH',
      titleKey: 'signalContextMismatch',
      explanationKey: 'signalContextMismatchDesc',
      severity: 'high',
      points: 20,
      iconName: 'AlertOctagon',
    });
  }

  // 2. TRANSACTION AMOUNT & BEHAVIORAL DEVIATION
  const ratio = amount / (baseline.averagePaymentAmount || 2800);
  if (ratio > 10) {
    // 10x normal
    transactionRisk += 30;
    behavioralRisk += 15;
    signals.push({
      code: 'MASSIVE_AMOUNT_DEVIATION',
      titleKey: 'signalUnusualAmount',
      explanationKey: 'signalUnusualAmountDesc',
      severity: 'high',
      points: 30,
      iconName: 'TrendingUp',
    });
  } else if (ratio > 3.5) {
    // 3.5x normal
    transactionRisk += 18;
    behavioralRisk += 8;
    signals.push({
      code: 'UNUSUAL_AMOUNT',
      titleKey: 'signalUnusualAmount',
      explanationKey: 'signalUnusualAmountDesc',
      severity: 'medium',
      points: 18,
      iconName: 'TrendingUp',
    });
  }

  // 3. TIME OF DAY & NIGHTTIME SIGNAL
  const isNight = context.isNightTime || (context.timeOfDayHour !== undefined && (context.timeOfDayHour < baseline.normalHoursStart || context.timeOfDayHour >= baseline.normalHoursEnd));
  if (isNight && !recipient.isKnown && amount > 5000) {
    contextRisk += 18;
    signals.push({
      code: 'LATE_NIGHT_HIGH_VALUE',
      titleKey: 'signalUnusualTime',
      explanationKey: 'signalUnusualTimeDesc',
      severity: 'medium',
      points: 18,
      iconName: 'Moon',
    });
  }

  // 4. CONTEXTUAL SIGNALS & COMBINATIONS
  // SPECIAL RULE: Friend on Call Exemption!
  // If active call is ON, BUT recipient is known and amount is normal (< 3x baseline), do NOT penalize!
  const isFriendExemption = context.activeCall && recipient.isKnown && ratio <= 3.0 && recipient.safetyWatchStatus === 'SAFE';

  if (context.activeCall) {
    if (isFriendExemption) {
      // Exemption: Active call is benign here
      // No extra points added
    } else {
      // Scam risk: Active call with stranger or unusual amount
      contextRisk += 25;
      signals.push({
        code: 'ACTIVE_CALL_STRANGER',
        titleKey: 'signalActiveCall',
        explanationKey: 'signalActiveCallDesc',
        severity: 'high',
        points: 25,
        iconName: 'PhoneCall',
      });
    }
  }

  // Screen sharing app running (AnyDesk / TeamViewer)
  if (context.screenSharing) {
    contextRisk += 30;
    signals.push({
      code: 'SCREEN_SHARING_ACTIVE',
      titleKey: 'signalScreenSharing',
      explanationKey: 'signalScreenSharingDesc',
      severity: 'critical',
      points: 30,
      iconName: 'MonitorUp',
    });
  }

  // Rapid App Switching (victim being coached)
  if (context.appSwitchCount >= 4) {
    behavioralRisk += 15;
    signals.push({
      code: 'HIGH_APP_SWITCHING',
      titleKey: 'signalAppSwitching',
      explanationKey: 'signalAppSwitchingDesc',
      severity: 'medium',
      points: 15,
      iconName: 'Layers',
    });
  }

  // Urgency or coercion
  if (context.urgencyPrompted && !recipient.isKnown) {
    contextRisk += 15;
  }

  // 5. EMERGENCY FAST-TRACK CHECK
  const isGenuineFamilyEmergency =
    context.emergencyType === 'family_distress' &&
    recipient.isKnown &&
    recipient.safetyWatchStatus === 'SAFE';
  const isEmergencyFastTrack =
    ((context.emergencyType === 'medical_hospital' || recipient.category === 'hospital') &&
      (recipient.verifiedMerchant || recipient.isKnown || context.emergencyType === 'medical_hospital')) ||
    isGenuineFamilyEmergency;

  if (isEmergencyFastTrack) {
    // Discount night risk & unknown recipient risk for certified medical or family emergency
    recipientRisk = Math.min(recipientRisk, 5);
    contextRisk = Math.max(0, contextRisk - 30);
    transactionRisk = Math.min(transactionRisk, 10);
    behavioralRisk = Math.min(behavioralRisk, 5);
  }

  // Keyword-based deception checks for specific scam signatures
  if (lowerNote.includes('refund') || lowerNote.includes('cashback') || lowerNote.includes('qr')) {
    if (!recipient.verifiedMerchant && !recipient.isKnown) {
      contextRisk += 25;
      signals.push({
        code: 'REFUND_QR_DECEPTION',
        titleKey: 'signalContextMismatch',
        explanationKey: 'signalContextMismatchDesc',
        severity: 'high',
        points: 25,
        iconName: 'AlertTriangle',
      });
    }
  }

  if (lowerNote.includes('electricity') || lowerNote.includes('sim') || lowerNote.includes('kyc') || lowerNote.includes('disconnection')) {
    if (!recipient.verifiedMerchant) {
      contextRisk += 35;
      signals.push({
        code: 'UTILITY_DISCONNECTION_EXTORTION',
        titleKey: 'signalFlaggedAccount',
        explanationKey: 'signalFlaggedAccountDesc',
        severity: 'critical',
        points: 35,
        iconName: 'ShieldAlert',
      });
    }
  }

  if (lowerNote.includes('daughter') || lowerNote.includes('bail') || lowerNote.includes('sos')) {
    if (!recipient.isKnown) {
      contextRisk += 35;
      signals.push({
        code: 'FAMILY_IMPERSONATION_MULE',
        titleKey: 'signalNewRecipient',
        explanationKey: 'signalNewRecipientDesc',
        severity: 'critical',
        points: 35,
        iconName: 'AlertTriangle',
      });
    }
  }

  // Calculate raw aggregate score (capped at 100)
  let rawScore = transactionRisk + recipientRisk + contextRisk + behavioralRisk;

  // Additional synergy penalties for deadly scam combinations
  if (context.activeCall && !recipient.isKnown && ratio > 3.0) {
    rawScore += 18; // Classic social engineering recipe
  }
  if (context.screenSharing && !recipient.isKnown) {
    rawScore += 25; // Classic remote access drain
  }

  if (isEmergencyFastTrack) {
    rawScore = Math.min(rawScore, 20); // Emergency fast-track strictly caps risk score
  }

  const finalScore = Math.min(100, Math.max(0, rawScore));

  // Determine Risk Level & Decision
  let riskLevel: RiskLevel = 'LOW';
  let decision: Decision = 'ALLOW';

  if (finalScore >= 80) {
    riskLevel = 'CRITICAL';
    decision = 'INTERCEPT';
  } else if (finalScore >= 55) {
    riskLevel = 'HIGH';
    decision = 'INTERCEPT';
  } else if (finalScore >= 25) {
    riskLevel = 'CAUTION';
    decision = 'REVIEW';
  } else {
    riskLevel = 'LOW';
    decision = 'ALLOW';
  }

  // Generate localized voice scripts
  const voiceScript = generateVoiceScript(riskLevel, recipient, amount, context, isFriendExemption, isEmergencyFastTrack);

  // Pick suitable educational lesson
  let educationalLessonKey = 'pinRule';
  if (context.screenSharing) {
    educationalLessonKey = 'screenShareRule';
  } else if (lowerNote.includes('refund') || signals.some(s => s.code.includes('REFUND'))) {
    educationalLessonKey = 'refundScamRule';
  } else if (lowerNote.includes('arrest') || lowerNote.includes('police') || lowerNote.includes('cbi')) {
    educationalLessonKey = 'digitalArrestRule';
  } else if (lowerNote.includes('sim') || lowerNote.includes('electricity')) {
    educationalLessonKey = 'pinRule';
  } else if (!recipient.isKnown && amount > 10000) {
    educationalLessonKey = 'unknownRecipientRule';
  }

  const explanationKeys = signals.map(s => s.explanationKey);

  return {
    transactionId,
    timestamp,
    riskScore: finalScore,
    riskLevel,
    decision,
    signals,
    explanationKeys,
    recommendedAction: riskLevel === 'LOW' ? 'PROCEED' : riskLevel === 'CAUTION' ? 'REVIEW_TRANSPARENCY' : 'PAUSE_AND_VERIFY',
    voiceScript,
    educationalLessonKey,
    breakdown: {
      transactionRisk,
      recipientRisk,
      contextRisk,
      behavioralRisk,
    },
    isEmergencyFastTrack,
    isFriendExemption,
  };
}

function generateVoiceScript(
  riskLevel: RiskLevel,
  recipient: Recipient,
  amount: number,
  context: TransactionContext,
  isFriendExemption: boolean,
  isEmergencyFastTrack: boolean
) {
  // EMERGENCY / SPECIAL: NO STOP ALARM AUDIO
  if (isEmergencyFastTrack) {
    return {
      en: `Emergency Fast-Track active. You are transferring ₹${amount.toLocaleString('en-IN')} for an urgent emergency. Please verify recipient details and proceed safely with priority checkout.`,
      hi: `आपातकालीन फास्ट-ट्रैक सक्रिय है। आप आपातकालीन आवश्यकता के लिए ₹${amount.toLocaleString('en-IN')} भेज रहे हैं। कृपया विवरण जांचकर प्राथमिकता से सुरक्षित भुगतान करें।`,
      or: `ଜରୁରୀକାଳୀନ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ସକ୍ରିୟ। ଆପଣ ₹${amount.toLocaleString('en-IN')} ପଠାଉଛନ୍ତି। ବିବରଣୀ ଯାଞ୍ଚ କରି ଶୀଘ୍ର ପେମେଣ୍ଟ କରନ୍ତୁ।`,
    };
  }

  if (riskLevel === 'LOW') {
    if (isFriendExemption) {
      return {
        en: `Paying ₹${amount.toLocaleString('en-IN')} to your friend ${recipient.name}. Context is normal.`,
        hi: `आपके मित्र ${recipient.name} को ₹${amount.toLocaleString('en-IN')} का भुगतान। यह सुरक्षित है।`,
        or: `ଆପଣଙ୍କ ବନ୍ଧୁ ${recipient.name} ଙ୍କୁ ₹${amount.toLocaleString('en-IN')} ପେମେଣ୍ଟ। ଏହା ସୁରକ୍ଷିତ।`,
      };
    }
    return {
      en: `Payment of ₹${amount.toLocaleString('en-IN')} matches your normal pattern. Safe to proceed.`,
      hi: `₹${amount.toLocaleString('en-IN')} का भुगतान आपके सामान्य व्यवहार से मेल खाता है। सब सुरक्षित है।`,
      or: `₹${amount.toLocaleString('en-IN')} ର ପେମେଣ୍ଟ ସୁରକ୍ଷିତ ଜଣାପଡୁଛି।`,
    };
  }

  if (riskLevel === 'CAUTION') {
    return {
      en: `Please review before confirming. You are sending ₹${amount.toLocaleString('en-IN')} to ${recipient.name}.`,
      hi: `पुष्टि करने से पहले ध्यान दें। आप ${recipient.name} को ₹${amount.toLocaleString('en-IN')} भेज रहे हैं।`,
      or: `ନିଶ୍ଚିତ କରିବା ପୂର୍ବରୁ ଯାଞ୍ଚ କରନ୍ତୁ। ଆପଣ ${recipient.name} ଙ୍କୁ ₹${amount.toLocaleString('en-IN')} ପଠାଉଛନ୍ତି।`,
    };
  }

  if (riskLevel === 'HIGH') {
    if (context.activeCall) {
      return {
        en: `Hold on and verify. You are sending ₹${amount.toLocaleString('en-IN')} while on an active phone call. Entering your UPI PIN sends money OUT. Never scan QR codes to receive money.`,
        hi: `रुकिए और ध्यान से देखिए! आप फोन कॉल पर बात करते हुए ₹${amount.toLocaleString('en-IN')} भेज रहे हैं। यूपीआई पिन डालने से पैसे कटते हैं, आते नहीं हैं।`,
        or: `ଅଟକନ୍ତୁ ଏବଂ ଯାଞ୍ଚ କରନ୍ତୁ! ଆପଣ ଫୋନ୍ କଲ୍ ରେ ଥାଇ ₹${amount.toLocaleString('en-IN')} ପଠାଉଛନ୍ତି। UPI PIN ଦେଲେ ଟଙ୍କା କଟିଯିବ।`,
      };
    }
    return {
      en: `High-value verification required. You are sending ₹${amount.toLocaleString('en-IN')} to a new contact. Please review all details carefully before authenticating.`,
      hi: `उच्च सुरक्षा सत्यापन आवश्यक है। आप एक नए संपर्क को ₹${amount.toLocaleString('en-IN')} भेज रहे हैं। पुष्टि करने से पहले सभी विवरण ध्यान से जांचें।`,
      or: `ଉଚ୍ଚ ସୁରକ୍ଷା ଯାଞ୍ଚ ଆବଶ୍ୟକ। ଆପଣ ଏକ ନୂଆ ଆକାଉଣ୍ଟକୁ ₹${amount.toLocaleString('en-IN')} ପଠାଉଛନ୍ତି।`,
    };
  }

  // CRITICAL RISK: INTERCEPT & STOP
  if (context.activeCall) {
    return {
      en: `Stop immediately! You are sending ₹${amount.toLocaleString('en-IN')} to a new recipient while on a phone call. If someone told you this is a refund, electricity bill, or police matter, hang up now. Entering your UPI PIN sends money out.`,
      hi: `तुरंत रुकिए! आप फोन पर बात करते हुए अनजान खाते को ₹${amount.toLocaleString('en-IN')} भेज रहे हैं। अगर कोई इसे रिफंड, बिजली बिल या पुलिस केस बता रहा है, तो तुरंत फोन काटें। यूपीआई पिन डालने से पैसे कटते हैं।`,
      or: `ତୁରନ୍ତ ଅଟକନ୍ତୁ! ଆପଣ ଫୋନ୍ କଲ୍ ରେ କଥା ହୋଇ ଅଜଣା ଆକାଉଣ୍ଟକୁ ₹${amount.toLocaleString('en-IN')} ପଠାଉଛନ୍ତି। କଲ୍ କାଟନ୍ତୁ।`,
    };
  }

  return {
    warning: true,
    en: `Stop and verify! Severe fraud risk detected for ₹${amount.toLocaleString('en-IN')}. This recipient matches high-risk mule or extortion patterns. Do not enter your UPI PIN.`,
    hi: `रुकिए और जांचिए! ₹${amount.toLocaleString('en-IN')} के लिए गंभीर धोखाधड़ी का खतरा है। यह खाता संदिग्ध रजिस्ट्री से मेल खाता है। अपना यूपीआई पिन मत डालिए।`,
    or: `ଅଟକନ୍ତୁ ଏବଂ ଯାଞ୍ଚ କରନ୍ତୁ! ₹${amount.toLocaleString('en-IN')} ର କାରବାର ଅତ୍ୟନ୍ତ ସନ୍ଦେହଜନକ। ଆପଣଙ୍କ UPI PIN ଦିଅନ୍ତୁ ନାହିଁ।`,
  };
}
