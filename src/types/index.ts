export type RiskLevel = 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL';
export type Decision = 'ALLOW' | 'REVIEW' | 'INTERCEPT';
export type Language = 'en' | 'hi' | 'or';
export type AuthMethod = 'biometric' | 'voice' | 'familiar_image' | 'pin' | 'multi_factor_tiered';
export type EmergencyType = 'none' | 'medical_hospital' | 'family_distress';

export interface RiskSignal {
  code: string;
  titleKey: string;
  explanationKey: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  points: number;
  iconName?: string;
  metadata?: Record<string, any>;
}

export interface RiskAssessment {
  transactionId: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  decision: Decision;
  signals: RiskSignal[];
  explanationKeys: string[];
  recommendedAction: string;
  voiceScript: {
    en: string;
    hi: string;
    or: string;
  };
  educationalLessonKey: string;
  breakdown: {
    transactionRisk: number;
    recipientRisk: number;
    contextRisk: number;
    behavioralRisk: number;
  };
  isEmergencyFastTrack: boolean;
  isFriendExemption: boolean;
}

export interface Recipient {
  id: string;
  name: string;
  vpa: string;
  bankName: string;
  category: 'merchant' | 'individual' | 'hospital' | 'utility' | 'suspicious';
  isKnown: boolean;
  historyCount: number;
  totalPaidAmount: number;
  lastPaidDate?: string;
  safetyWatchStatus: 'SAFE' | 'COMMUNITY_REPORTED' | 'UNDER_REVIEW' | 'CONFIRMED_SUSPICIOUS';
  safetyReportsCount: number;
  verifiedMerchant: boolean;
  avatarText?: string;
}

export interface BehavioralBaseline {
  averagePaymentAmount: number;
  normalHoursStart: number; // e.g. 8 (8 AM)
  normalHoursEnd: number; // e.g. 22 (10 PM)
  typicalWeeklyVelocity: number;
  knownRecipientsCount: number;
  usualCategories: string[];
}

export interface TransactionContext {
  activeCall: boolean;
  screenSharing: boolean;
  appSwitchCount: number;
  timeOfDayHour: number;
  isNightTime: boolean;
  urgencyPrompted: boolean;
  emergencyType: EmergencyType;
  isNewDevice: boolean;
  sourceAppFlow: 'direct' | 'marketplace_olx' | 'whatsapp_call' | 'browser_link';
}

export interface Transaction {
  id: string;
  timestamp: string;
  recipient: Recipient;
  amount: number;
  note?: string;
  context: TransactionContext;
  riskAssessment?: RiskAssessment;
  status: 'SUCCESS' | 'BLOCKED' | 'PENDING_GUARDIAN' | 'CANCELLED';
  authUsed?: AuthMethod;
  educationalLesson?: string;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phoneMasked: string;
  status: 'VERIFIED' | 'PENDING';
  approvalThreshold: number; // e.g. payments above ₹10,000 or high risk
  enabled: boolean;
}

export interface SafetyWatchReport {
  id: string;
  clusterId: string;
  vpaMasked: string;
  accountMasked: string;
  category: string;
  status: 'COMMUNITY_REPORTED' | 'UNDER_REVIEW' | 'CONFIRMED_SUSPICIOUS';
  reportCount: number;
  patterns: string[];
  lastReportedDate: string;
  associatedDevicesCount: number;
  associatedAccountsCount: number;
}

export interface FamiliarImageOption {
  id: string;
  nameKey: string;
  emoji: string;
  descriptionKey: string;
}

export interface DemoScenario {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tag: string;
  recipient: Recipient;
  amount: number;
  note: string;
  context: TransactionContext;
  expectedRisk: RiskLevel;
  highlightedLearning: string;
}

export type AgeRange = '18-25' | '26-45' | '46-60' | '60+';

export interface BiometricEnrollmentDetails {
  faceEnrolled: boolean;
  faceLivenessScore?: number;
  faceCaptureTime?: string;
  voiceEnrolled: boolean;
  voicePhraseText?: string;
  voiceSampleDuration?: number;
  familiarImageId: string;
  familiarImageData?: string;
  familiarImageSecretKey?: string;
  fingerprintHardwareBound: boolean;
  secureEnclaveKeyId?: string;
  deviceHardwareId: string;
  simBindingStatus: 'BOUND_ACTIVE' | 'PENDING' | 'FLAGGED_BURNER';
  muleCheckStatus: 'CLEAN' | 'FLAGGED_MULE_MATCH';
  flaggedReason?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  isLoggedIn?: boolean;
  ageRange: AgeRange;
  phoneMasked: string;
  rawMobile?: string;
  email?: string;
  preferredLanguage: Language;
  biometricEnabled: boolean;
  voiceAuthEnabled: boolean;
  familiarImageId: string;
  familiarImageData?: string;
  familiarImageSecretKey?: string;
  beginnerGuideMode?: boolean;
  biometricEnrollment?: BiometricEnrollmentDetails;
  guardian?: Guardian;
  taalaLocked: boolean;
  taalaLockedUntil?: string;
  emergencyPin?: string;
  baseline: BehavioralBaseline;
}

