import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AgeRange, Language, UserProfile, BiometricEnrollmentDetails } from '../types';
import { familiarImageOptions } from '../data/mockData';
import { INITIAL_CREATOR_PROMPTS } from '../data/voicePrompts';
import { checkMuleBiometrics, FLAGGED_MULE_DATABASE, FlaggedMuleRecord } from '../services/muleRegistry';
import { SochuMascot } from '../mascot/SochuMascot';
import {
  ShieldCheck,
  ShieldAlert,
  User,
  Phone,
  Mail,
  Globe,
  Camera,
  Mic,
  Fingerprint,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Users,
  RefreshCw,
  Eye,
  Sliders,
  Volume2,
  Check,
  Info,
  ChevronRight,
} from 'lucide-react';

interface LocalizedStrings {
  badge: string;
  title: string;
  subtitle: string;
  testPersonaTitle: string;
  personaRegular: string;
  personaSenior: string;
  personaScammer: string;
  personaFresh: string;
  step1Title: string;
  step1Sub: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  mobileLabel: string;
  mobileSub: string;
  ageRangeLabel: string;
  seniorGuideTitle: string;
  seniorGuideBody: string;
  seniorGuideButton: string;
  seniorShieldActive: string;
  age1825: string;
  age1825Sub: string;
  age2645: string;
  age2645Sub: string;
  age4660: string;
  age4660Sub: string;
  age60Plus: string;
  age60PlusSub: string;
  languageLabel: string;
  emailLabel: string;
  emailOptional: string;
  emailPlaceholder: string;
  btnNextBiometrics: string;

  step2Title: string;
  step2Sub: string;
  zeroCloudPrivacy: string;
  faceTitle: string;
  faceSub: string;
  faceEnrolled: string;
  faceScanning: string;
  faceSuccess: string;
  btnScanFace: string;
  voiceTitle: string;
  voiceSub: string;
  voiceEnrolled: string;
  voicePromptLabel: string;
  voicePrivacy: string;
  voiceListening: string;
  btnRecordVoice: string;
  familiarTitle: string;
  familiarSub: string;
  familiarSelected: string;
  familiarMemoryLabel: string;
  familiarMemoryPlaceholder: string;
  hardwareTitle: string;
  hardwareSub: string;
  hardwareBound: string;
  btnTestTouchId: string;
  btnBack: string;
  btnNextLimits: string;

  step3Title: string;
  step3Sub: string;
  dailyLimitLabel: string;
  dailyLimitSub: string;
  taalaPinLabel: string;
  taalaPinSub: string;
  nightModeLabel: string;
  nightModeSub: string;
  btnCompleteRegistration: string;
  btnCheckingRegistry: string;

  step4SuccessTitle: string;
  step4SuccessBadge: string;
  step4ScoreLabel: string;
  btnGoToFamilyMode: string;
  btnGoToDashboard: string;
  btnTryPaymentDemo: string;

  step4BlockedTitle: string;
  step4BlockedBadge: string;
  step4BlockedSub: string;
  whyBlockedTitle: string;
  syndicateLabel: string;
  burnerCountLabel: string;
  cybercrimeRefLabel: string;
  antiMuleExplainTitle: string;
  antiMuleExplainBody: string;
  btnResetClean: string;

  mascotStep1: string;
  mascotStep2: string;
  mascotStep3: string;
  mascotBlocked: string;
  mascotSuccess: string;
}

const REGISTER_TRANSLATIONS: Record<Language, LocalizedStrings> = {
  en: {
    badge: 'SochKe Pay Anti-Fraud Identity Layer',
    title: 'Safety Identity & Biometric Registration',
    subtitle:
      'Registering your device-local physical biometrics (Face, Voice, Familiar Image, Fingerprint) allows SochKe Pay to flag serial fraudsters. If a scammer attempts to re-register on burner SIMs or stolen devices, their physical biometric hash immediately matches our Civic Safety Watch list, permanently halting digital payment frauds.',
    testPersonaTitle: 'Test Personas (Click to test different fraud scenarios):',
    personaFresh: '✨ Fresh / Blank Registration',
    personaRegular: '👩 Shruti (Legitimate Citizen)',
    personaSenior: '👴 Rameshji (Senior Citizen 68y)',
    personaScammer: '🚨 Suspect Scammer (Burner SIM Mule)',
    step1Title: 'Step 1: Your Identity & Language Preferences',
    step1Sub: 'Enter your basic details so SochKe Pay can tailor voice warnings and assistive safety levels.',
    fullNameLabel: 'Full Name (As on Bank Account / Aadhaar)',
    fullNamePlaceholder: 'e.g. Shruti Baral',
    mobileLabel: 'Mobile Number (UPI Linked SIM)',
    mobileSub: 'Hardware SIM Binding Active',
    ageRangeLabel: 'Age Range (Determines Adaptive Cognitive Friction & Guardian Assistance)',
    seniorGuideTitle: 'Senior-friendly safety guide is on',
    seniorGuideBody: 'Take your time. SochKe Pay will help explain each step clearly and remind you that your UPI PIN sends money out of your account.',
    seniorGuideButton: 'Hear Safety Guide',
    seniorShieldActive: 'Senior Shield Mode Activated',
    age1825: '18 - 25 Years',
    age1825Sub: 'Youth & Students',
    age2645: '26 - 45 Years',
    age2645Sub: 'Working Professionals',
    age4660: '46 - 60 Years',
    age4660Sub: 'Mature Adults',
    age60Plus: '60+ Years (Senior)',
    age60PlusSub: 'Assisted Senior Shield',
    languageLabel: 'Preferred Spoken & Visual Language',
    emailLabel: 'Email Address',
    emailOptional: '(Optional for Monthly Safety Audit)',
    emailPlaceholder: 'e.g. user@example.com',
    btnNextBiometrics: 'Continue to Biometric Enrollment',

    step2Title: 'Step 2: Multi-Modal Anti-Fraud Biometric Enrollment',
    step2Sub:
      'These physical signals generate a hardware-bound cryptographic hash. Scammers using burner SIMs or stolen accounts fail these tests.',
    zeroCloudPrivacy: 'Zero Raw Cloud Storage • DPDP Act Compliant',
    faceTitle: '1. Face ID Liveness Vector',
    faceSub: 'Anti-deepfake 3D contour scanning',
    faceEnrolled: 'Enrolled & Bound',
    faceScanning: 'Scanning 3D Liveness Contour...',
    faceSuccess: 'Face Vector Cryptographically Bound',
    btnScanFace: 'Re-scan Face Liveness',
    voiceTitle: '2. Voice Safety Passphrase',
    voiceSub: 'Vocal tract harmonics capture',
    voiceEnrolled: 'Voice Enrolled',
    voicePromptLabel: 'Speak This Passphrase:',
    voicePrivacy: 'Your audio is processed on this device only. We do not store or upload the recording.',
    voiceListening: 'Listening & Validating Acoustics...',
    btnRecordVoice: 'Record Voice Passphrase Sample',
    familiarTitle: '3. Familiar Picture Safety Secret (Cognitive Auth)',
    familiarSub: 'Specially designed for seniors, rural users, and coercion resistance. Pick your visual anchor.',
    familiarSelected: 'Selected Visual Anchor:',
    familiarMemoryLabel: 'Secret Association Word / Personal Memory (Known only to you)',
    familiarMemoryPlaceholder: 'e.g. Childhood Home or Secret Memory',
    hardwareTitle: '4. Hardware Secure Enclave & Device Fingerprint',
    hardwareSub: 'Binds your physical smartphone TPM chip. Burner devices and clone APKs cannot forge this.',
    hardwareBound: 'Device Hardware ID Bound',
    btnTestTouchId: 'Test Touch ID Sensor',
    btnBack: 'Back',
    btnNextLimits: 'Continue to Safety Limits & TAALA',

    step3Title: 'Step 3: Transaction Baseline & Emergency Protection Rules',
    step3Sub:
      'Configure your normal behavioral envelope so anomalous midnight or high-velocity transfers trigger cognitive pauses.',
    dailyLimitLabel: 'Daily Outgoing Payment Comfort Limit',
    dailyLimitSub: 'Single transfers above this amount will trigger deliberate multi-factor verification or Guardian review.',
    taalaPinLabel: 'Emergency TAALA Outgoing Lock PIN',
    taalaPinSub: 'If you suspect coercion or remote access scam, TAALA immediately freezes outgoing UPI without blocking incoming payments.',
    nightModeLabel: '🌙 Nighttime Auto-Caution Mode (10:00 PM – 7:00 AM)',
    nightModeSub: 'Most extortion and impersonation scams occur late at night. Automatically increases friction for non-emergency payments.',
    btnCompleteRegistration: 'Verify Biometrics & Complete Registration',
    btnCheckingRegistry: 'Checking Civic Fraud Registry...',

    step4SuccessTitle: 'Welcome! Your Safety Profile is Active',
    step4SuccessBadge: 'Bank-Grade Enrolled',
    step4ScoreLabel: 'Device Trust Score',
    btnGoToFamilyMode: '🛡️ Configure Family Guardian Mode',
    btnGoToDashboard: 'Go to Safety Dashboard',
    btnTryPaymentDemo: 'Try Payment Simulator',

    step4BlockedTitle: 'Registration Permanently Intercepted & Blocked',
    step4BlockedBadge: 'Civic Fraud Registry Intercept',
    step4BlockedSub: "SochKe Pay's physical biometric matching engine has flagged this registration attempt.",
    whyBlockedTitle: 'Why Was This Registration Blocked?',
    syndicateLabel: 'Matched Syndicate Cluster:',
    burnerCountLabel: 'Associated Burner SIMs:',
    cybercrimeRefLabel: 'Cybercrime Case Ref:',
    antiMuleExplainTitle: 'How SochKe Pay Prevents Future Frauds:',
    antiMuleExplainBody:
      'Fraud syndicates frequently discard SIM cards and switch to new phones. Because SochKe Pay captures immutable device-local physical vectors (Face Mesh + Voice Harmonics), the fraudster cannot re-enter the digital banking network even if they buy 100 new burner SIMs or burner phones.',
    btnResetClean: 'Reset & Register as Legitimate Citizen',

    mascotStep1: "Let's set up your safe identity!",
    mascotStep2: 'Local biometrics protect against burner SIM scams.',
    mascotStep3: 'Almost done! Set your safety rules.',
    mascotBlocked: 'Alert! Scammer biometric matched in database!',
    mascotSuccess: 'Welcome to bank-grade protection!',
  },
  hi: {
    badge: 'सोचके पे फ्रॉड-रोकथाम सुरक्षा पहचान',
    title: 'सुरक्षा खाता एवं बायोमेट्रिक पंजीकरण',
    subtitle:
      'आपके डिवाइस में सुरक्षित बायोमेट्रिक्स (चेहरा, आवाज़, परिचित चित्र, फिंगरप्रिंट) दर्ज करके सोचके पे धोखेबाजों को रोकता है। जब कोई ठग नया बर्नर सिम या चुराया हुआ फोन लेकर दोबारा खाता बनाने की कोशिश करेगा, तो उसका बायोमेट्रिक हैश तुरंत हमारे सुरक्षा रजिस्ट्री में पकड़ा जाएगा और धोखाधड़ी हमेशा के लिए रुक जाएगी।',
    testPersonaTitle: 'परीक्षण प्रोफाइल (अलग-अलग धोखाधड़ी परिदृश्यों की जांच करें):',
    personaFresh: '✨ नया / खाली पंजीकरण (Fresh Registration)',
    personaRegular: '👩 श्रुति बराल (सच्चा भारतीय नागरिक)',
    personaSenior: '👴 रमेश चंद्र (वरिष्ठ नागरिक 68 वर्ष)',
    personaScammer: '🚨 संदिग्ध धोखेबाज (बर्नर सिम गिरोह)',
    step1Title: 'चरण 1: आपकी व्यक्तिगत जानकारी एवं भाषा',
    step1Sub: 'अपनी बुनियादी जानकारी दर्ज करें ताकि सोचके पे आपके लिए सही भाषा में चेतावनी और सुरक्षा प्रदान कर सके।',
    fullNameLabel: 'पूरा नाम (बैंक खाते / आधार कार्ड के अनुसार)',
    fullNamePlaceholder: 'उदा. श्रुति बराल',
    mobileLabel: 'मोबाइल नंबर (UPI से जुड़ा सिम)',
    mobileSub: 'हार्डवेयर सिम बाइंडिंग सक्रिय',
    ageRangeLabel: 'आयु वर्ग (इसके आधार पर सुरक्षा एवं परिवार सहायता तय होती है)',
    seniorGuideTitle: 'वरिष्ठ नागरिक सुरक्षा गाइड सक्रिय है',
    seniorGuideBody: 'आराम से समय लीजिए। हम आपको बड़े निर्देश दिखाएंगे, हर कदम को साफ तौर पर समझाएंगे, और आपको यह याद दिलाते रहेंगे कि आपका यूपीआई पिन दर्ज करने से पैसे आपके खाते से बाहर जाते हैं।',
    seniorGuideButton: 'सुरक्षा गाइड सुनें',
    seniorShieldActive: 'वरिष्ठ नागरिक सुरक्षा कवच सक्रिय',
    age1825: '18 - 25 वर्ष',
    age1825Sub: 'युवा एवं छात्र',
    age2645: '26 - 45 वर्ष',
    age2645Sub: 'कार्यरत पेशेवर',
    age4660: '46 - 60 वर्ष',
    age4660Sub: 'प्रौढ़ नागरिक',
    age60Plus: '60+ वर्ष (वरिष्ठ नागरिक)',
    age60PlusSub: 'सुरक्षित परिवार सहायता कवच',
    languageLabel: 'पसंदीदा बोलचाल एवं प्रदर्शन भाषा',
    emailLabel: 'ईमेल पता',
    emailOptional: '(मासिक सुरक्षा रिपोर्ट के लिए वैकल्पिक)',
    emailPlaceholder: 'उदा. shruti@example.com',
    btnNextBiometrics: 'बायोमेट्रिक सुरक्षा दर्ज करने के लिए आगे बढ़ें',

    step2Title: 'चरण 2: बहु-स्तरीय एंटी-फ्रॉड बायोमेट्रिक पंजीकरण',
    step2Sub: 'ये भौतिक संकेत डिवाइस के सिक्योर एन्क्लेव में सुरक्षित रहते हैं। बर्नर सिम या फर्जी आईडी इस्तेमाल करने वाले ठग इन जांचों में तुरंत पकड़े जाते हैं।',
    zeroCloudPrivacy: 'क्लाउड पर कोई कच्चा डेटा नहीं • DPDP एक्ट 2023 अनुरूप',
    faceTitle: '1. फेस आईडी 3D लाइवनेस वेक्टर',
    faceSub: 'डीपफेक एवं फोटो से बचाव हेतु 3D स्कैन',
    faceEnrolled: 'सफलतापूर्वक दर्ज',
    faceScanning: '3D लाइवनेस स्कैन जारी है...',
    faceSuccess: 'फेस वेक्टर एन्क्रिप्टेड रूप में सुरक्षित',
    btnScanFace: 'फेस स्कैन दोबारा करें',
    voiceTitle: '2. आवाज़ सुरक्षा पासफ़्रेज़',
    voiceSub: 'आवाज़ की ध्वनि तरंगों की पहचान',
    voiceEnrolled: 'आवाज़ दर्ज हो गई',
    voicePromptLabel: 'यह सुरक्षा वाक्य बोलें:',
    voicePrivacy: 'आपकी आवाज़ की जांच इसी डिवाइस पर होती है। रिकॉर्डिंग न तो सेव होती है और न अपलोड।',
    voiceListening: 'आवाज़ की जांच हो रही है...',
    btnRecordVoice: 'आवाज़ का नमूना रिकॉर्ड करें',
    familiarTitle: '3. परिचित चित्र सुरक्षा पहचान (संज्ञानात्मक सुरक्षा)',
    familiarSub: 'वरिष्ठ नागरिकों और दबाव में किए जाने वाले फ्रॉड से बचाव हेतु अपनी पसंद का पहचान चित्र चुनें।',
    familiarSelected: 'चुना गया सुरक्षा चित्र:',
    familiarMemoryLabel: 'गुप्त याद / शब्द (केवल आपको पता होना चाहिए)',
    familiarMemoryPlaceholder: 'उदा. बचपन का घर या कोई खास याद',
    hardwareTitle: '4. हार्डवेयर सिक्योर एन्क्लेव एवं डिवाइस फिंगरप्रिंट',
    hardwareSub: 'यह आपके फोन की फिजिकल TPM चिप से जुड़ता है। क्लोन ऐप या दूसरा फोन इसे कॉपी नहीं कर सकता।',
    hardwareBound: 'डिवाइस हार्डवेयर सुरक्षित बाउंड',
    btnTestTouchId: 'टच आईडी सेंसर जांचें',
    btnBack: 'पीछे जाएं',
    btnNextLimits: 'सुरक्षा सीमाएं एवं ताला PIN सेट करें',

    step3Title: 'चरण 3: दैनिक भुगतान सीमा एवं आपातकालीन ताला नियम',
    step3Sub: 'अपनी सामान्य लेन-देन सीमा निर्धारित करें ताकि देर रात या असामान्य रूप से बड़े भुगतान पर सुरक्षा रोक लग सके।',
    dailyLimitLabel: 'दैनिक भुगतान सहज सीमा',
    dailyLimitSub: 'इस राशि से अधिक के भुगतान पर अतिरिक्त सुरक्षा पुष्टि या परिवार की सहमति अनिवार्य होगी।',
    taalaPinLabel: 'आपातकालीन ताला (TAALA) आउटगोइंग लॉक पिन',
    taalaPinSub: 'यदि आपको किसी फ्रॉड या धमकी का अंदेशा हो, तो ताला तुरंत आपके खाते से पैसे जाने पर रोक लगा देगा।',
    nightModeLabel: '🌙 रात्रि सुरक्षा मोड (रात 10:00 बजे से सुबह 7:00 बजे तक)',
    nightModeSub: 'अधिकांश डिजिटल अरेस्ट और ठगी रात में होती हैं। यह गैर-आपातकालीन भुगतान पर अतिरिक्त सतर्कता लागू करता है।',
    btnCompleteRegistration: 'बायोमेट्रिक जांचें एवं पंजीकरण पूरा करें',
    btnCheckingRegistry: 'राष्ट्रीय फ्रॉड रजिस्ट्री में जांच हो रही है...',

    step4SuccessTitle: 'बधाई हो! आपकी सुरक्षा प्रोफाइल सक्रिय है',
    step4SuccessBadge: 'बैंक स्तर की सुरक्षा सक्षम',
    step4ScoreLabel: 'डिवाइस ट्रस्ट स्कोर',
    btnGoToFamilyMode: '🛡️ परिवार सुरक्षा मोड (Family Mode) सेट करें',
    btnGoToDashboard: 'सुरक्षा डैशबोर्ड पर जाएं',
    btnTryPaymentDemo: 'सुरक्षित भुगतान सिमुलेटर चलाएं',

    step4BlockedTitle: 'पंजीकरण तुरंत रोक दिया गया एवं ब्लॉक किया गया',
    step4BlockedBadge: 'फ्रॉड रजिस्ट्री इंटरसेप्ट अलर्ट',
    step4BlockedSub: 'सोचके पे के बायोमेट्रिक मिलान इंजन ने इस पंजीकरण को संदिग्ध साइबर अपराध नेटवर्क से जुड़ा पाया है।',
    whyBlockedTitle: 'यह पंजीकरण क्यों रोका गया?',
    syndicateLabel: 'पहचाना गया फ्रॉड गिरोह:',
    burnerCountLabel: 'जुड़े हुए बर्नर सिम कार्ड:',
    cybercrimeRefLabel: 'साइबर अपराध केस संदर्भ:',
    antiMuleExplainTitle: 'सोचके पे भविष्य की धोखाधड़ी कैसे रोकता है?',
    antiMuleExplainBody:
      'धोखेबाज अक्सर सिम कार्ड बदलते हैं और नए फोन खरीदते हैं। चूंकि सोचके पे व्यक्ति के चेहरे की 3D बनावट और आवाज़ की तरंगों को याद रखता है, इसलिए धोखेबाज 100 नए सिम कार्ड भी खरीद ले तो भी दोबारा खाता नहीं बना सकता।',
    btnResetClean: 'रीसेट करें और सच्चे नागरिक (श्रुति) के रूप में पंजीकृत हों',

    mascotStep1: 'आइए आपका सुरक्षित खाता तैयार करें!',
    mascotStep2: 'स्थानीय बायोमेट्रिक्स आपको बर्नर सिम फ्रॉड से बचाते हैं।',
    mascotStep3: 'बस थोड़ा और! अपनी सुरक्षा सीमाएं तय करें।',
    mascotBlocked: 'सावधान! इस धोखेबाज का बायोमेट्रिक डेटाबेस में मैच हो गया!',
    mascotSuccess: 'सोचके पे में आपका स्वागत है! आप पूरी तरह सुरक्षित हैं।',
  },
  or: {
    badge: 'ସୋଚକେ ପେ ଠକେଇ-ରୋଧକ ସୁରକ୍ଷା ପରିଚୟ',
    title: 'ସୁରକ୍ଷା ପରିଚୟ ଏବଂ ବାୟୋମେଟ୍ରିକ ପଞ୍ଜୀକରଣ',
    subtitle:
      'ଆପଣଙ୍କ ଫୋନରେ ଫେସ୍, ଭଏସ୍, ପରିଚିତ ଚିତ୍ର ଏବଂ ଫିଙ୍ଗରପ୍ରିଣ୍ଟ ସୁରକ୍ଷିତ ରଖି ସୋଚକେ ପେ ଠକମାନଙ୍କୁ ଚିହ୍ନଟ କରେ। ଯଦି ଜଣେ ସ୍କାମର ନୂଆ ବର୍ନର ସିମ୍ ବା ଚୋରି ଫୋନ୍ ବ୍ୟବହାର କରି ପୁଣି ଆକାଉଣ୍ଟ କରିବାକୁ ଚେଷ୍ଟା କରେ, ତାହାର ବାୟୋମେଟ୍ରିକ୍ସ ତୁରନ୍ତ ଧରାପଡ଼ିବ ଏବଂ ଠକେଇ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ ହେବ।',
    testPersonaTitle: 'ପରୀକ୍ଷଣ ପ୍ରୋଫାଇଲ୍ (ବିଭିନ୍ନ ଠକେଇ ପରିସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ):',
    personaFresh: '✨ ନୂତନ ପଞ୍ଜୀକରଣ (Fresh Registration)',
    personaRegular: '👩 ଶ୍ରୁତି ବରାଳ (ସାଧାରଣ ନାଗରିକ)',
    personaSenior: '👴 ରମେଶ ଚନ୍ଦ୍ର (ବରିଷ୍ଠ ନାଗରିକ ୬୮ ବର୍ଷ)',
    personaScammer: '🚨 ସନ୍ଦିଗ୍ଧ ଠକ (ବର୍ନର ସିମ୍ ଗ୍ୟାଙ୍ଗ)',
    step1Title: 'ପର୍ଯ୍ୟାୟ ୧: ଆପଣଙ୍କ ପରିଚୟ ଏବଂ ଭାଷା ପସନ୍ଦ',
    step1Sub: 'ଆପଣଙ୍କ ସଠିକ୍ ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ ଯାହାଦ୍ୱାରା ସୋଚକେ ପେ ଆପଣଙ୍କ ଭାଷାରେ ଚେତାବନୀ ଦେଇପାରିବ।',
    fullNameLabel: 'ପୂରା ନାମ (ବ୍ୟାଙ୍କ ଖାତା / ଆଧାର ଅନୁସାରେ)',
    fullNamePlaceholder: 'ଉଦା. ଶ୍ରୁତି ବରାଳ',
    mobileLabel: 'ମୋବାଇଲ୍ ନମ୍ବର (UPI ସଂଯୁକ୍ତ ସିମ୍)',
    mobileSub: 'ହାର୍ଡୱେର୍ ସିମ୍ ବାଇଣ୍ଡିଂ ସକ୍ରିୟ',
    ageRangeLabel: 'ବୟସ ସୀମା (ଏହା ସୁରକ୍ଷା ଓ ପରିବାର ସହାୟତା ସ୍ଥିର କରେ)',
    seniorGuideTitle: 'ବରିଷ୍ଠ ନାଗରିକ ସୁରକ୍ଷା ଗାଇଡ୍ ସକ୍ରିୟ',
    seniorGuideBody: 'ଧୀରେ ଧୀରେ କରନ୍ତୁ। SochKe Pay ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପ ସ୍ପଷ୍ଟ ଭାବେ ବୁଝାଇବ ଏବଂ UPI PIN ଦେଲେ ଟଙ୍କା ଆପଣଙ୍କ ଖାତାରୁ ବାହାରକୁ ଯାଏ ବୋଲି ମନେ ପକାଇବ।',
    seniorGuideButton: 'ସୁରକ୍ଷା ଗାଇଡ୍ ଶୁଣନ୍ତୁ',
    seniorShieldActive: 'ବରିଷ୍ଠ ନାଗରିକ ସୁରକ୍ଷା ସକ୍ରିୟ',
    age1825: '୧୮ - ୨୫ ବର୍ଷ',
    age1825Sub: 'ଯୁବକ ଓ ଛାତ୍ରଛାତ୍ରୀ',
    age2645: '୨୬ - ୪୫ ବର୍ଷ',
    age2645Sub: 'କାର୍ଯ୍ୟରତ ବୃତ୍ତିଜୀବୀ',
    age4660: '୪୬ - ୬୦ ବର୍ଷ',
    age4660Sub: 'ପରିପକ୍ୱ ବୟସ୍କ',
    age60Plus: '୬୦+ ବର୍ଷ (ବରିଷ୍ଠ ନାଗରିକ)',
    age60PlusSub: 'ସୁରକ୍ଷିତ ପରିବାର କବଚ',
    languageLabel: 'ପସନ୍ଦର କଥାବାର୍ତ୍ତା ଏବଂ ପ୍ରଦର୍ଶନ ଭାଷା',
    emailLabel: 'ଇମେଲ୍ ଠିକଣା',
    emailOptional: '(ମାସିକ ସୁରକ୍ଷା ରିପୋର୍ଟ ପାଇଁ ଇଚ୍ଛାଧୀନ)',
    emailPlaceholder: 'ଉଦା. shruti@example.com',
    btnNextBiometrics: 'ବାୟୋମେଟ୍ରିକ ପଞ୍ଜୀକରଣ ପାଇଁ ଆଗକୁ ଯାଆନ୍ତୁ',

    step2Title: 'ପର୍ଯ୍ୟାୟ ୨: ବହୁ-ସ୍ତରୀୟ ଆଣ୍ଟି-ଫ୍ରଡ୍ ବାୟୋମେଟ୍ରିକ ପଞ୍ଜୀକରଣ',
    step2Sub: 'ଏହି ଭୌତିକ ସଙ୍କେତ ଆପଣଙ୍କ ଫୋନ୍ ଭିତରେ ସୁରକ୍ଷିତ ରହେ। ବର୍ନର ସିମ୍ ବ୍ୟବହାର କରୁଥିବା ଠକମାନେ ଏହି ପରୀକ୍ଷାରେ ଧରାପଡ଼ନ୍ତି।',
    zeroCloudPrivacy: 'କ୍ଲାଉଡ୍ ରେ କୌଣସି ତଥ୍ୟ ରହେନାହିଁ • DPDP ଆଇନ ସୁରକ୍ଷିତ',
    faceTitle: '୧. ଫେସ୍ ଆଇଡି 3D ଲାଇଭନେସ୍ ଭେକ୍ଟର',
    faceSub: 'ଡିପ୍ ଫେକ୍ ରୋକିବା ପାଇଁ 3D ସ୍କାନ୍',
    faceEnrolled: 'ସଫଳତାର ସହ ପଞ୍ଜୀକୃତ',
    faceScanning: '3D ଲାଇଭନେସ୍ ସ୍କାନ୍ ଚାଲିଛି...',
    faceSuccess: 'ଫେସ୍ ଭେକ୍ଟର ସୁରକ୍ଷିତ ଭାବେ ବନ୍ଧାଗଲା',
    btnScanFace: 'ପୁନର୍ବାର ଫେସ୍ ସ୍କାନ୍ କରନ୍ତୁ',
    voiceTitle: '୨. ଭଏସ୍ ସୁରକ୍ଷା ବାକ୍ୟ',
    voiceSub: 'ସ୍ୱର ତରଙ୍ଗ ସଂରକ୍ଷଣ',
    voiceEnrolled: 'ଭଏସ୍ ପଞ୍ଜୀକୃତ ହେଲା',
    voicePromptLabel: 'ଏହି ସୁରକ୍ଷା ବାକ୍ୟ କୁହନ୍ତୁ:',
    voicePrivacy: 'ଆପଣଙ୍କ ସ୍ୱର କେବଳ ଏହି ଡିଭାଇସରେ ଯାଞ୍ଚ ହୁଏ। ରେକର୍ଡିଂ ସେଭ୍ ବା ଅପଲୋଡ୍ ହୁଏ ନାହିଁ।',
    voiceListening: 'ସ୍ୱର ଯାଞ୍ଚ କରାଯାଉଛି...',
    btnRecordVoice: 'ଭଏସ୍ ନମୁନା ରେକର୍ଡ କରନ୍ତୁ',
    familiarTitle: '୩. ପରିଚିତ ଚିତ୍ର ସୁରକ୍ଷା ରହସ୍ୟ',
    familiarSub: 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଜବରଦସ୍ତି ଠକେଇରୁ ରକ୍ଷା ପାଇଁ ପସନ୍ଦର ଚିତ୍ର ବାଛନ୍ତୁ।',
    familiarSelected: 'ମନୋନୀତ ଚିତ୍ର:',
    familiarMemoryLabel: 'ଗୁପ୍ତ ମନେପକା ଶବ୍ଦ (କେବଳ ଆପଣଙ୍କୁ ଜଣା)',
    familiarMemoryPlaceholder: 'ଉଦା. ପିଲାଦିନର ଘର କିମ୍ବା ଗୁପ୍ତ ସ୍ମୃତି',
    hardwareTitle: '୪. ହାର୍ଡୱେର୍ ସିକ୍ୟୋର୍ ଏନକ୍ଲେଭ୍ ଏବଂ ଡିଭାଇସ୍ ଫିଙ୍ଗରପ୍ରିଣ୍ଟ',
    hardwareSub: 'ଏହା ଆପଣଙ୍କ ଫୋନର ମୂଳ TPM ଚିପ୍ ସହିତ ସଂଯୁକ୍ତ ହୁଏ। ନକଲି ଆପ୍ ଏହାକୁ ଚୋରି କରିପାରିବ ନାହିଁ।',
    hardwareBound: 'ଡିଭାଇସ୍ ହାର୍ଡୱେର୍ ସଫଳତାର ସହ ବନ୍ଧାଗଲା',
    btnTestTouchId: 'ଟଚ୍ ଆଇଡି ସେନ୍ସର ଯାଞ୍ଚ କରନ୍ତୁ',
    btnBack: 'ପଛକୁ ଯାଆନ୍ତୁ',
    btnNextLimits: 'ସୁରକ୍ଷା ସୀମା ଓ ତାଲା PIN ସେଟ୍ କରନ୍ତୁ',

    step3Title: 'ପର୍ଯ୍ୟାୟ ୩: ଦୈନିକ ପେମେଣ୍ଟ ସୀମା ଓ ଜରୁରୀକାଳୀନ ତାଲା ନିୟମ',
    step3Sub: 'ଆପଣଙ୍କ ସାଧାରଣ ଟ୍ରାଞ୍ଜାକସନ ସୀମା ସେଟ୍ କରନ୍ତୁ ଯାହାଫଳରେ ବିଳମ୍ବିତ ରାତିର ଠକେଇ ଅଟକିବ।',
    dailyLimitLabel: 'ଦୈନିକ ପେମେଣ୍ଟ ସହଜ ସୀମା',
    dailyLimitSub: 'ଏହି ଟଙ୍କାଠାରୁ ଅଧିକ ପେମେଣ୍ଟ କଲେ ପରିବାରର ଅନୁମୋଦନ ବା ଅତିରିକ୍ତ ଯାଞ୍ଚ ଦରକାର ହେବ।',
    taalaPinLabel: 'ଜରୁରୀକାଳୀନ ତାଲା (TAALA) ପିନ୍ (PIN)',
    taalaPinSub: 'ଠକେଇ ବା ଭୟ ଲାଗିଲେ ତାଲା ଆପଣଙ୍କ ଆକାଉଣ୍ଟରୁ ଟଙ୍କା ଯିବା ତୁରନ୍ତ ବନ୍ଦ କରିଦେବ।',
    nightModeLabel: '🌙 ରାତ୍ରିକାଳୀନ ସୁରକ୍ଷା ମୋଡ୍ (ରାତି ୧୦:୦୦ ରୁ ସକାଳ ୭:୦୦)',
    nightModeSub: 'ଅଧିକାଂଶ ଠକେଇ ରାତିରେ ହୁଏ। ଏହା ଜରୁରୀ ନଥିବା ପେମେଣ୍ଟ ଉପରେ ସତର୍କତା ବଢ଼ାଇଥାଏ।',
    btnCompleteRegistration: 'ବାୟୋମେଟ୍ରିକ୍ସ ଯାଞ୍ଚ କରି ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ',
    btnCheckingRegistry: 'ଜାତୀୟ ଠକେଇ ରେଜିଷ୍ଟ୍ରିରେ ଯାଞ୍ଚ ଚାଲିଛି...',

    step4SuccessTitle: 'ଅଭିନନ୍ଦନ! ଆପଣଙ୍କ ସୁରକ୍ଷା ପ୍ରୋଫାଇଲ୍ ସକ୍ରିୟ ହେଲା',
    step4SuccessBadge: 'ବ୍ୟାଙ୍କ-ସ୍ତରୀୟ ସୁରକ୍ଷା ସକ୍ରିୟ',
    step4ScoreLabel: 'ଡିଭାଇସ୍ ବିଶ୍ୱାସ ସ୍କୋର',
    btnGoToFamilyMode: '🛡️ ପରିବାର ସୁରକ୍ଷା ମୋଡ୍ (Family Mode) ସେଟ୍ କରନ୍ତୁ',
    btnGoToDashboard: 'ସୁରକ୍ଷା ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ',
    btnTryPaymentDemo: 'ପେମେଣ୍ଟ ସିମୁଲେଟର ଚଲାନ୍ତୁ',

    step4BlockedTitle: 'ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ୍ଣ ରୂପେ ବନ୍ଦ ଓ ବ୍ଲକ୍ କରାଗଲା',
    step4BlockedBadge: 'ଠକେଇ ରେଜିଷ୍ଟ୍ରି ଆଲର୍ଟ',
    step4BlockedSub: 'ସୋଚକେ ପେ ବାୟୋମେଟ୍ରିକ ଯାଞ୍ଚ ଇଞ୍ଜିନ୍ ଏହି ପଞ୍ଜୀକରଣକୁ ଏକ ସାଇବର ଠକେଇ ଗ୍ୟାଙ୍ଗ ସହ ଚିହ୍ନଟ କରିଛି।',
    whyBlockedTitle: 'ଏହି ପଞ୍ଜୀକରଣ କାହିଁକି ବନ୍ଦ ହେଲା?',
    syndicateLabel: 'ଚିହ୍ନଟ ହୋଇଥିବା ଠକ ଗ୍ୟାଙ୍ଗ:',
    burnerCountLabel: 'ସଂପୃକ୍ତ ବର୍ନର ସିମ୍ ସଂଖ୍ୟା:',
    cybercrimeRefLabel: 'ସାଇବର କ୍ରାଇମ୍ କେସ୍ ନମ୍ବର:',
    antiMuleExplainTitle: 'ସୋଚକେ ପେ ଭବିଷ୍ୟତ ଠକେଇ କିପରି ରୋକେ?',
    antiMuleExplainBody:
      'ଠକମାନେ ବାରମ୍ବାର ସିମ୍ ଏବଂ ଫୋନ୍ ବଦଳାନ୍ତି। ସୋଚକେ ପେ ବ୍ୟକ୍ତିର ମୁହଁର 3D ଭେକ୍ଟର ଏବଂ ସ୍ୱର ତରଙ୍ଗକୁ ଚିହ୍ନି ରଖିଥିବାରୁ, ସେ ୧୦୦ଟି ନୂଆ ସିମ୍ କିଣିଲେ ମଧ୍ୟ ଆଉ ଆକାଉଣ୍ଟ କରିପାରିବ ନାହିଁ।',
    btnResetClean: 'ପୁନର୍ବାର ସାଧାରଣ ନାଗରିକ (ଶ୍ରୁତି) ଭାବେ ପଞ୍ଜୀକରଣ କରନ୍ତୁ',

    mascotStep1: 'ଆସନ୍ତୁ ଆପଣଙ୍କ ସୁରକ୍ଷିତ ଖାତା ପ୍ରସ୍ତୁତ କରିବା!',
    mascotStep2: 'ସ୍ଥାନୀୟ ବାୟୋମେଟ୍ରିକ୍ସ ଆପଣଙ୍କୁ ବର୍ନର ସିମ୍ ଠକେଇରୁ ରକ୍ଷା କରେ।',
    mascotStep3: 'ଆଉ କିଛି ସମୟ! ନିଜ ସୁରକ୍ଷା ନିୟମ ସେଟ୍ କରନ୍ତୁ।',
    mascotBlocked: 'ସାବଧାନ! ଏହି ଠକର ବାୟୋମେଟ୍ରିକ ଡାଟାବେସରେ ମ୍ୟାଚ୍ ହୋଇଗଲା!',
    mascotSuccess: 'ସୋଚକେ ପେ ରେ ସ୍ୱାଗତ! ଆପଣ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ।',
  },
};

export const RegisterPage: React.FC = () => {
  const { user, setUser, language, setLanguage, navigateTo, playVoiceWarning, isSeniorMode: globalIsSeniorMode } = useApp();
  
  const playGuideAudio = (promptId: string) => {
    const prompt = INITIAL_CREATOR_PROMPTS.find(p => p.id === promptId);
    if (prompt) {
       playVoiceWarning(prompt.scripts[language] || prompt.scripts.en);
    }
  }
  
  const startVoiceInput = (onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Voice input not supported.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.onresult = (event: any) => {
      onResult(event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      alert("Voice input failed. Please try again.");
    };
    recognition.start();
  };

  // Active registration language matches global or locally selected
  const [preferredLang, setPreferredLang] = useState<Language>(language || user.preferredLanguage || 'hi');
  const loc = REGISTER_TRANSLATIONS[preferredLang] || REGISTER_TRANSLATIONS.en;

  // Wizard Step: 1 = Basic Info, 2 = Biometric Enroll, 3 = Safety Limits & TAALA, 4 = Result & Verification
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State - Defaulting to user or clean citizen
  const [name, setName] = useState<string>(user.name || 'Priya Sharma');
  const [ageRange, setAgeRange] = useState<AgeRange>(user.ageRange || '26-45');
  const [isBeginnerGuideMode, setIsBeginnerGuideMode] = useState<boolean>(
    !!user.beginnerGuideMode || user.ageRange === '60+'
  );
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(ageRange === '60+' || isBeginnerGuideMode);
  useEffect(() => {
    setIsSeniorMode(ageRange === '60+' || isBeginnerGuideMode);
  }, [ageRange, isBeginnerGuideMode]);

  const seniorVoiceGuide = (ageRange === '60+' || isBeginnerGuideMode)
    ? `${loc.seniorGuideBody} ${currentStep === 1 ? loc.step1Sub : currentStep === 2 ? loc.step2Sub : loc.step3Sub}`
    : '';
  const [mobileNumber, setMobileNumber] = useState<string>(user.rawMobile || '9876543210');
  const [email, setEmail] = useState<string>(user.email || '');

  // Multi-Modal Biometric States (Clean citizen initialized)
  const [faceEnrolled, setFaceEnrolled] = useState<boolean>(true);
  const [isScanningFace, setIsScanningFace] = useState<boolean>(false);
  const [faceVectorSignature, setFaceVectorSignature] = useState<string>('VEC_FACE_CLEAN_USER_99');
  const [faceLivenessProgress, setFaceLivenessProgress] = useState<number>(100);

  const [voiceEnrolled, setVoiceEnrolled] = useState<boolean>(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceHarmonicsSignature, setVoiceHarmonicsSignature] = useState<string>('VOICE_HARMONICS_CLEAN_USER');
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const [voicePassphrase, setVoicePassphrase] = useState<string>(
    preferredLang === 'hi'
      ? 'रुकिए। सोचिए। सुरक्षित रहिए।'
      : preferredLang === 'or'
      ? 'ଅଟକନ୍ତୁ। ଭାବନ୍ତୁ। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।'
      : 'Ruko. Socho. Surakshit Raho.'
  );

  const [selectedFamiliarImage, setSelectedFamiliarImage] = useState<string>(user.familiarImageId || 'house');
  const [customFamiliarImage, setCustomFamiliarImage] = useState<string | null>(null);
  const [familiarSecretKey, setFamiliarSecretKey] = useState<string>(
    preferredLang === 'hi' ? 'बचपन का घर' : preferredLang === 'or' ? 'ପିଲାଦିନର ଘର' : 'Sweet Home'
  );

  const [fingerprintEnrolled, setFingerprintEnrolled] = useState<boolean>(true);
  const [isScanningFingerprint, setIsScanningFingerprint] = useState<boolean>(false);
  const [deviceHardwareId, setDeviceHardwareId] = useState<string>('DEV_HW_PIXEL9_IND_2026');

  // Baseline & Security Limits
  const [dailyLimit, setDailyLimit] = useState<number>(
    user.baseline?.averagePaymentAmount ? user.baseline.averagePaymentAmount * 5 : 15000
  );
  const [nightProtection, setNightProtection] = useState<boolean>(true);
  const [emergencyPin, setEmergencyPin] = useState<string>(user.emergencyPin || '');

  // Mule Detection Result (Starts CLEAN)
  const [isEvaluatingRegistry, setIsEvaluatingRegistry] = useState<boolean>(false);
  const [muleIntercept, setMuleIntercept] = useState<{
    blocked: boolean;
    cluster?: FlaggedMuleRecord;
    message: string;
  } | null>(null);

  // Sync voice passphrase when language changes
  useEffect(() => {
    if (preferredLang === 'hi') {
      setVoicePassphrase('रुकिए। सोचिए। सुरक्षित रहिए।');
    } else if (preferredLang === 'or') {
      setVoicePassphrase('ଅଟକନ୍ତୁ। ଭାବନ୍ତୁ। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।');
    } else {
      setVoicePassphrase('Ruko. Socho. Surakshit Raho.');
    }
  }, [preferredLang]);

  // Quick Persona loader for testing
  const loadPersona = (type: 'FRESH' | 'REGULAR' | 'SENIOR' | 'MULE_SCAMMER') => {
    if (type === 'FRESH') {
      setName('');
      setAgeRange('26-45');
      setIsBeginnerGuideMode(false);
      setMobileNumber('');
      setEmail('');
      setPreferredLang(language || 'en');
      setLanguage(language || 'en');
      setFaceVectorSignature(`VEC_FACE_FRESH_${Date.now().toString(36).toUpperCase()}`);
      setFaceEnrolled(false);
      setFaceLivenessProgress(0);
      setVoiceHarmonicsSignature(`VOICE_HARMONICS_FRESH_${Date.now().toString(36).toUpperCase()}`);
      setVoiceEnrolled(false);
      setDeviceHardwareId(`DEV_HW_DEVICE_${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setFingerprintEnrolled(false);
      setSelectedFamiliarImage('house');
      setFamiliarSecretKey('');
      setMuleIntercept(null);
      setCurrentStep(1);
      setUser({
        ...user,
        name: 'Guest User',
        isLoggedIn: false,
        rawMobile: '',
        phoneMasked: '+91 ••••• •••••',
      });
    } else if (type === 'REGULAR') {
      const personaName = 'Shruti Baral';
      setName(personaName);
      setAgeRange('26-45');
      setIsBeginnerGuideMode(false);
      setMobileNumber('9876543210');
      setEmail('baralshruti24@gmail.com');
      setPreferredLang('hi');
      setLanguage('hi');
      setFaceVectorSignature('VEC_FACE_CLEAN_USER_99');
      setFaceEnrolled(true);
      setFaceLivenessProgress(100);
      setVoiceHarmonicsSignature('VOICE_HARMONICS_CLEAN_USER');
      setVoiceEnrolled(true);
      setDeviceHardwareId('DEV_HW_PIXEL9_IND_2026');
      setFingerprintEnrolled(true);
      setSelectedFamiliarImage('house');
      setFamiliarSecretKey('बचपन का घर');
      setMuleIntercept(null);
      setCurrentStep(1);
      setUser({
        ...user,
        id: 'USER_SHRUTI_789',
        name: personaName,
        isLoggedIn: true,
        ageRange: '26-45',
        phoneMasked: '+91 98765 •••••',
        rawMobile: '9876543210',
        email: 'baralshruti24@gmail.com',
        preferredLanguage: 'hi',
        biometricEnabled: true,
        voiceAuthEnabled: true,
        familiarImageId: 'house',
        guardian: {
          id: 'GUARD_NOMINEE_01',
          name: 'Ananya (Daughter / Family Guardian)',
          relationship: 'Daughter',
          phoneMasked: '+91 98112 •••••',
          status: 'VERIFIED',
          approvalThreshold: 15000,
          enabled: true,
        },
      });
    } else if (type === 'SENIOR') {
      const personaName = 'Ramesh Chandra Joshi';
      setName(personaName);
      setAgeRange('60+');
      setIsBeginnerGuideMode(true);
      setMobileNumber('9822019482');
      setEmail('');
      setPreferredLang('hi');
      setLanguage('hi');
      setFaceVectorSignature('VEC_FACE_SENIOR_CLEAN_88');
      setFaceEnrolled(true);
      setFaceLivenessProgress(100);
      setVoiceHarmonicsSignature('VOICE_HARMONICS_SENIOR_CLEAN');
      setVoiceEnrolled(true);
      setDeviceHardwareId('DEV_HW_SAMSUNG_M34_SENIOR');
      setFingerprintEnrolled(true);
      setSelectedFamiliarImage('elephant');
      setFamiliarSecretKey('बचपन का हाथी');
      setMuleIntercept(null);
      setCurrentStep(1);
      setUser({
        ...user,
        id: 'USER_RAMESH_882',
        name: personaName,
        isLoggedIn: true,
        ageRange: '60+',
        phoneMasked: '+91 98220 •••••',
        rawMobile: '9822019482',
        email: '',
        preferredLanguage: 'hi',
        beginnerGuideMode: true,
        biometricEnabled: true,
        voiceAuthEnabled: true,
        familiarImageId: 'elephant',
        guardian: {
          id: 'GUARD_NOMINEE_01',
          name: 'Rohit Joshi (Son / Family Guardian)',
          relationship: 'Son',
          phoneMasked: '+91 98711 •••••',
          status: 'VERIFIED',
          approvalThreshold: 10000,
          enabled: true,
        },
      });
    } else if (type === 'MULE_SCAMMER') {
      setName('Vikram Singh (Alias: Fake Inspector)');
      setAgeRange('26-45');
      setIsBeginnerGuideMode(false);
      setMobileNumber('9999988888'); // Burner prefix
      setEmail('fake.courier.support@tempmail.in');
      setFaceVectorSignature('VEC_FACE_FLAGGED_SCAMMER_01'); // Flagged in Civic Mule Database
      setFaceEnrolled(true);
      setFaceLivenessProgress(100);
      setVoiceHarmonicsSignature('VOICE_HARMONICS_FLAGGED_SCAMMER_01');
      setVoiceEnrolled(true);
      setDeviceHardwareId('DEV_HW_BURNER_MULE_9901');
      setFingerprintEnrolled(true);
      setSelectedFamiliarImage('tree');
      setMuleIntercept(null);
      setCurrentStep(1);
    }
  };

  // Simulate Face Capture
  const handleScanFace = () => {
    setIsScanningFace(true);
    setFaceLivenessProgress(0);
    const interval = setInterval(() => {
      setFaceLivenessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanningFace(false);
          setFaceEnrolled(true);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleRecordVoice = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      window.alert('Voice recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      voiceStreamRef.current = stream;
      voiceRecorderRef.current = recorder;
      setIsRecordingVoice(true);
      recorder.ondataavailable = () => undefined;
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        voiceStreamRef.current = null;
        voiceRecorderRef.current = null;
        setIsRecordingVoice(false);
        setVoiceEnrolled(true);
        setVoiceHarmonicsSignature(`VOICE_HARMONICS_LOCAL_${Date.now().toString(36).toUpperCase()}`);
      };
      recorder.start();
      window.setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 2800);
    } catch {
      setIsRecordingVoice(false);
      window.alert('Microphone permission is required to record your passphrase.');
    }
  };

  const handleCustomImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCustomFamiliarImage(reader.result as string);
      setSelectedFamiliarImage('custom');
    };
    reader.readAsDataURL(file);
  };

  // Simulate Hardware Fingerprint Scanning
  const handleScanFingerprint = () => {
    setIsScanningFingerprint(true);
    setTimeout(() => {
      setIsScanningFingerprint(false);
      setFingerprintEnrolled(true);
    }, 1000);
  };

  // Final Registration Submission with Mule Database Integrity Check
  const handleSubmitRegistration = () => {
    setIsEvaluatingRegistry(true);

    setTimeout(() => {
      const muleCheck = checkMuleBiometrics(
        faceVectorSignature,
        voiceHarmonicsSignature,
        mobileNumber,
        deviceHardwareId
      );

      setIsEvaluatingRegistry(false);

      if (muleCheck.isBlocked) {
        setMuleIntercept({
          blocked: true,
          cluster: muleCheck.muleCluster,
          message: muleCheck.confidenceMessage,
        });
        setCurrentStep(4);
      } else {
        // Save clean profile to AppContext
        const updatedBiometrics: BiometricEnrollmentDetails = {
          faceEnrolled: true,
          faceLivenessScore: 0.99,
          faceCaptureTime: new Date().toLocaleTimeString(),
          voiceEnrolled: true,
          voicePhraseText: voicePassphrase,
          voiceSampleDuration: 2.8,
          familiarImageId: selectedFamiliarImage,
          familiarImageData: customFamiliarImage || undefined,
          familiarImageSecretKey: familiarSecretKey,
          fingerprintHardwareBound: true,
          secureEnclaveKeyId: 'SEC_ENC_HW_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          deviceHardwareId,
          simBindingStatus: 'BOUND_ACTIVE',
          muleCheckStatus: 'CLEAN',
        };

        const updatedProfile: UserProfile = {
          ...user,
          isLoggedIn: true,
          name: name.trim() || 'SochKe User',
          ageRange,
          phoneMasked: mobileNumber.replace(/(\d{5})(\d{5})/, '+91 $1 •••••'),
          rawMobile: mobileNumber,
          email: email || undefined,
          preferredLanguage: preferredLang,
          familiarImageId: selectedFamiliarImage,
          familiarImageData: customFamiliarImage || undefined,
          familiarImageSecretKey: familiarSecretKey,
          beginnerGuideMode: isBeginnerGuideMode || ageRange === '60+',
          emergencyPin,
          biometricEnrollment: updatedBiometrics,
          baseline: {
            ...user.baseline,
            averagePaymentAmount: Math.round(dailyLimit / 5),
          },
        };

        setUser(updatedProfile);
        setLanguage(preferredLang);
        setMuleIntercept({
          blocked: false,
          message:
            preferredLang === 'hi'
              ? 'बायोमेट्रिक्स सफलतापूर्वक डिवाइस सिक्योर एन्क्लेव में सुरक्षित हो गए हैं।'
              : preferredLang === 'or'
              ? 'ବାୟୋମେଟ୍ରିକ୍ସ ସଫଳତାର ସହ ଡିଭାଇସ୍ ସିକ୍ୟୋର୍ ଏନକ୍ଲେଭରେ ସୁରକ୍ଷିତ ରହିଲା।'
              : 'Biometrics verified and bound to Secure Hardware Enclave. Identity is 100% Protected.',
        });
        setCurrentStep(4);
      }
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER WITH PURPOSE & HACKATHON VALUE */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{loc.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{loc.title}</h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              {loc.subtitle}
            </p>
            {isSeniorMode && (
              <button
                type="button"
                onClick={() => playVoiceWarning(seniorVoiceGuide)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {loc.seniorGuideButton}
              </button>
            )}
          </div>

          <div className="flex-shrink-0 self-center md:self-auto">
            <SochuMascot
              mood={muleIntercept?.blocked ? 'CRITICAL' : 'LOW'}
              size="sm"
              showDialogue={true}
              customMessage={
                currentStep === 1
                  ? loc.mascotStep1
                  : currentStep === 2
                  ? loc.mascotStep2
                  : currentStep === 3
                  ? loc.mascotStep3
                  : muleIntercept?.blocked
                  ? loc.mascotBlocked
                  : loc.mascotSuccess
              }
            />
          </div>
        </div>

        {/* Demo Persona Quick-Switch Bar for Hackathon Reviewers */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{loc.testPersonaTitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => loadPersona('FRESH')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                name === '' && !faceEnrolled
                  ? 'bg-emerald-500 text-white shadow-md font-black'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/50'
              }`}
              title="Start a fresh blank registration with custom data"
            >
              {loc.personaFresh}
            </button>

            <button
              onClick={() => loadPersona('REGULAR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                name.includes('Shruti') && faceVectorSignature === 'VEC_FACE_CLEAN_USER_99'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {loc.personaRegular}
            </button>

            <button
              onClick={() => loadPersona('SENIOR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                ageRange === '60+' && faceVectorSignature === 'VEC_FACE_SENIOR_CLEAN_88'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {loc.personaSenior}
            </button>

            <button
              onClick={() => loadPersona('MULE_SCAMMER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                faceVectorSignature === 'VEC_FACE_FLAGGED_SCAMMER_01'
                  ? 'bg-rose-600 text-white shadow-md animate-pulse font-black'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-800/50 hover:bg-rose-900/50'
              }`}
              title="Test enrolling a serial fraudster to see SochKe cross-device intercept in action"
            >
              {loc.personaScammer}
            </button>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS STEPPER */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {[
            { step: 1, label: loc.step1Title.split(':')[0], icon: User },
            { step: 2, label: loc.step2Title.split(':')[0], icon: Fingerprint },
            { step: 3, label: loc.step3Title.split(':')[0], icon: Lock },
            { step: 4, label: loc.step4ScoreLabel, icon: ShieldCheck },
          ].map((item) => {
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div
                key={item.step}
                onClick={() => (item.step < currentStep ? setCurrentStep(item.step) : null)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-sky-50 text-sky-900 font-black ring-2 ring-sky-500'
                    : isCompleted
                    ? 'text-emerald-700 cursor-pointer hover:bg-slate-50'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    isCurrent
                      ? 'bg-sky-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                </div>
                <span className="text-[11px] sm:text-xs font-bold line-clamp-1">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. STEP 1: PERSONAL & DEMOGRAPHIC DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{loc.step1Title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{loc.step1Sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Spoken Voice & Display Language */}
            <div className="space-y-2 md:col-span-2 bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>{loc.languageLabel}</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { code: 'hi', label: 'हिंदी (Hindi)', sub: 'रुकिए। सोचिए। सुरक्षित रहिए।' },
                  { code: 'en', label: 'English', sub: 'Ruko. Socho. Surakshit Raho.' },
                  { code: 'or', label: 'ଓଡ଼ିଆ (Odia)', sub: 'ଅଟକନ୍ତୁ। ଭାବନ୍ତୁ। ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      const newLang = lang.code as Language;
                      setPreferredLang(newLang);
                      setLanguage(newLang);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      preferredLang === lang.code
                        ? 'border-sky-600 bg-sky-600 text-white font-black shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold'
                    }`}
                  >
                    <div className="text-sm">{lang.label}</div>
                    <div className={`text-[10px] ${preferredLang === lang.code ? 'text-sky-100' : 'text-slate-400'}`}>
                      {lang.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{loc.fullNameLabel}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={loc.fullNamePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
                />
                {isSeniorMode && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => playGuideAudio('GUIDE_REGISTRATION_NAME')}
                      className="p-3 bg-sky-100 text-sky-700 rounded-xl"
                      title="Listen to name guide"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startVoiceInput(setName)}
                      className="p-3 bg-amber-100 text-amber-700 rounded-xl"
                      title="Speak your name"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Number with SIM binding check */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{loc.mobileLabel}</span>
                  {isSeniorMode && (
                    <button
                      type="button"
                      onClick={() => playGuideAudio('GUIDE_REGISTRATION_MOBILE')}
                      className="p-1 text-slate-500 hover:text-sky-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </label>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {loc.mobileSub}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-500">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-bold tracking-wider focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Age Range */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{loc.ageRangeLabel}</span>
                </label>
                {isSeniorMode && (
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full animate-pulse">
                    {loc.seniorShieldActive}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: '18-25', label: loc.age1825, desc: loc.age1825Sub },
                  { id: '26-45', label: loc.age2645, desc: loc.age2645Sub },
                  { id: '46-60', label: loc.age4660, desc: loc.age4660Sub },
                  { id: '60+', label: loc.age60Plus, desc: loc.age60PlusSub },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const newAge = item.id as AgeRange;
                      setAgeRange(newAge);
                      if (newAge === '60+') {
                        setIsBeginnerGuideMode(true);
                      }
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      ageRange === item.id
                        ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-black">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Friendly Senior & Beginner Audio Guide Mode Toggle */}
            <div className="space-y-2 md:col-span-2 bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200/80">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎙️</span>
                    <h4 className="text-xs sm:text-sm font-black text-amber-950">
                      Friendly Beginner &amp; Senior Voice Guide Mode (सुगम ऑडियो मार्गदर्शिका)
                    </h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-900/90 font-medium leading-relaxed">
                    Uses friendly spoken voice cues in Hindi/Odia/English, simplified non-technical explanations, and automatic audio readouts for payments to protect elder citizens and new digital users.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={isBeginnerGuideMode}
                    onChange={(e) => setIsBeginnerGuideMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>
            
            {/* Email Address (Optional) */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{loc.emailLabel}</span>
                  {isSeniorMode && (
                    <button
                      type="button"
                      onClick={() => playGuideAudio('GUIDE_REGISTRATION_EMAIL')}
                      className="p-1 text-slate-500 hover:text-sky-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{loc.emailOptional}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={loc.emailPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Navigation Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!name.trim() || mobileNumber.length < 10}
              className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <span>{loc.btnNextBiometrics}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* 4. STEP 2: MULTI-MODAL ANTI-FRAUD BIOMETRIC ENROLLMENT */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{loc.step2Title}</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{loc.step2Sub}</p>
            </div>
            <span className="text-xs font-black text-sky-800 bg-sky-100 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>{loc.zeroCloudPrivacy}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Face ID & Anti-Spoof Liveness */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{loc.faceTitle}</h3>
                    <p className="text-[11px] text-slate-500">{loc.faceSub}</p>
                  </div>
                </div>
                {faceEnrolled && !isScanningFace && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {loc.faceEnrolled}
                  </span>
                )}
              </div>

              {/* Camera Scanner Simulation */}
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-800">
                {isSeniorMode && (
                  <button
                    type="button"
                    onClick={() => playGuideAudio('GUIDE_STEP2_FACE')}
                    className="absolute top-2 right-2 p-2 bg-amber-500/20 text-amber-300 rounded-lg backdrop-blur-sm"
                    title="Listen to face guide"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                {isScanningFace ? (
                  <div className="space-y-3 text-center z-10 px-4">
                    <div className="w-16 h-20 rounded-full border-2 border-dashed border-amber-400 mx-auto animate-pulse flex items-center justify-center">
                      <Eye className="w-6 h-6 text-amber-400 animate-spin" />
                    </div>
                    <p className="text-xs font-bold text-amber-300">{loc.faceScanning}</p>
                    <div className="w-36 bg-slate-800 rounded-full h-1.5 mx-auto overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${faceLivenessProgress}%` }}
                      />
                    </div>
                  </div>
                ) : faceEnrolled ? (
                  <div className="space-y-2 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-emerald-300">{loc.faceSuccess}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Hash: {faceVectorSignature.substring(0, 18)}...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400">Camera ready for liveness test</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleScanFace}
                disabled={isScanningFace}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanningFace ? 'animate-spin' : ''}`} />
                <span>{loc.btnScanFace}</span>
              </button>
            </div>

            {/* 2. Voice Passphrase Harmonics */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{loc.voiceTitle}</h3>
                    <p className="text-[11px] text-slate-500">{loc.voiceSub}</p>
                  </div>
                </div>
                {voiceEnrolled && !isRecordingVoice && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {loc.voiceEnrolled}
                  </span>
                )}
              </div>

              {/* Spoken script card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 text-center space-y-2 relative">
                {isSeniorMode && (
                  <button
                    type="button"
                    onClick={() => playGuideAudio('GUIDE_STEP2_VOICE')}
                    className="absolute top-2 right-2 p-2 bg-amber-100 text-amber-700 rounded-lg"
                    title="Listen to voice guide"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  {loc.voicePromptLabel}
                </p>
                <p className="text-sm font-black text-slate-900 font-serif italic">
                  "{voicePassphrase}"
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {loc.voicePrivacy}
                </p>

                {isRecordingVoice && (
                  <div className="flex items-center justify-center gap-1 py-1">
                    <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce" />
                    <span className="w-1 h-6 bg-rose-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1 h-8 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-5 bg-rose-600 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRecordVoice}
                disabled={isRecordingVoice}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecordingVoice ? loc.voiceListening : loc.btnRecordVoice}</span>
              </button>
            </div>

            {/* 3. Familiar Picture Safety Secret (Cognitive Authentication) */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{loc.familiarTitle}</h3>
                    <p className="text-[11px] text-slate-500">{loc.familiarSub}</p>
                  </div>
                </div>
                {isSeniorMode && (
                  <button
                    type="button"
                    onClick={() => playGuideAudio('GUIDE_STEP2_FAMILIAR')}
                    className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"
                    title="Listen to familiar picture guide"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                  {loc.familiarSelected} {familiarImageOptions.find((o) => o.id === selectedFamiliarImage)?.nameKey}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {familiarImageOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedFamiliarImage(opt.id)}
                    className={`p-3 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      selectedFamiliarImage === opt.id
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{opt.emoji}</span>
                    <span className="text-xs font-black line-clamp-1">{opt.nameKey}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">{opt.descriptionKey}</span>
                  </button>
                ))}
                <label className={`p-3 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  selectedFamiliarImage === 'custom'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-dashed border-slate-300 hover:border-indigo-400 bg-white text-slate-700'
                }`}>
                  {customFamiliarImage ? (
                    <img src={customFamiliarImage} alt="Your familiar picture" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-indigo-500" />
                  )}
                  <span className="text-xs font-black">Add Your Image</span>
                  <span className="text-[10px] text-slate-500">Stored on this device</span>
                  <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="sr-only" />
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{loc.familiarMemoryLabel}</label>
                <input
                  type="text"
                  value={familiarSecretKey}
                  onChange={(e) => setFamiliarSecretKey(e.target.value)}
                  placeholder={loc.familiarMemoryPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            {/* 4. Hardware Fingerprint & Secure Enclave Device Binding */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>

                  {isSeniorMode && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-amber-700" />
                        <h4 className="text-sm font-black">{loc.seniorGuideTitle}</h4>
                      </div>
                      <p className="text-xs leading-relaxed">{loc.seniorGuideBody}</p>
                      <button
                        type="button"
                        onClick={() => playVoiceWarning(loc.seniorGuideBody)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {loc.seniorGuideButton}
                      </button>
                    </div>
                  )}
                    <h3 className="text-sm font-black text-slate-900">{loc.hardwareTitle}</h3>
                    <p className="text-[11px] text-slate-500">{loc.hardwareSub}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {loc.hardwareBound}
                </span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-700">Bound Hardware Profile:</div>
                  <div className="font-mono text-[11px] text-slate-500">
                    {deviceHardwareId} • TPM 2.0 StrongBox
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleScanFingerprint}
                  disabled={isScanningFingerprint}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 self-start sm:self-auto"
                >
                  <Fingerprint className={`w-3.5 h-3.5 ${isScanningFingerprint ? 'animate-pulse text-amber-400' : ''}`} />
                  <span>{loc.btnTestTouchId}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-3 rounded-2xl border border-slate-300 font-bold text-slate-700 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{loc.btnBack}</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
            >
              <span>{loc.btnNextLimits}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* 5. STEP 3: SECURITY LIMITS & EMERGENCY TAALA PIN */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{loc.step3Title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">{loc.step3Sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Comfort Threshold */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {loc.dailyLimitLabel}
                {isSeniorMode && (
                  <button
                    type="button"
                    onClick={() => playGuideAudio('GUIDE_REGISTRATION_DAILY_LIMIT')}
                    className="p-1 text-slate-500 hover:text-sky-600"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </label>
                <span className="text-sm font-black text-sky-700">₹{dailyLimit.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-slate-500">{loc.dailyLimitSub}</p>
              <input
                type="range"
                min={2000}
                max={100000}
                step={1000}
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>₹2,000 (Conservative)</span>
                <span>₹25,000 (Standard)</span>
                <span>₹1,00,000 (High)</span>
              </div>
            </div>

            {/* Emergency TAALA PIN */}
            <div className="space-y-3 bg-rose-50/60 p-5 rounded-2xl border border-rose-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" />
                  <span>{loc.taalaPinLabel}</span>
                  {isSeniorMode && (
                    <button
                      type="button"
                      onClick={() => playGuideAudio('GUIDE_REGISTRATION_TAALA_PIN')}
                      className="p-1 text-rose-700 hover:text-rose-900"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </label>
                <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  Hold-to-Lock Master Key
                </span>
              </div>
              <p className="text-[11px] text-rose-800/80">{loc.taalaPinSub}</p>
              <input
                type="password"
                maxLength={4}
                value={emergencyPin}
                onChange={(e) => setEmergencyPin(e.target.value.replace(/\D/g, ''))}
                placeholder="4-digit Master PIN (e.g. 9110)"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-300 text-base font-mono font-bold tracking-widest text-center focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-white"
              />
            </div>

            {/* Nighttime Auto-Guard */}
            <div className="md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">{loc.nightModeLabel}</div>
                <div className="text-[11px] text-slate-500">{loc.nightModeSub}</div>
              </div>

              <input
                type="checkbox"
                checked={nightProtection}
                onChange={(e) => setNightProtection(e.target.checked)}
                className="w-5 h-5 accent-sky-600 rounded-md cursor-pointer"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-3 rounded-2xl border border-slate-300 font-bold text-slate-700 text-sm flex items-center gap-2 cursor-pointer hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{loc.btnBack}</span>
            </button>

            <button
              onClick={handleSubmitRegistration}
              disabled={isEvaluatingRegistry}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-sky-600/20 cursor-pointer transition-all hover:scale-105"
            >
              {isEvaluatingRegistry ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>{loc.btnCheckingRegistry}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>{loc.btnCompleteRegistration}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 6. STEP 4: VERIFICATION RESULT & MULE DETECTION AUDIT */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {muleIntercept?.blocked ? (
            /* 🚨 FRAUDSTER / MULE ACCOUNT INTERCEPTED ALERT */
            <div className="bg-rose-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-rose-600 shadow-2xl space-y-6 animate-in zoom-in-95">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg flex-shrink-0 animate-bounce">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-800 text-rose-200 text-xs font-black uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{loc.step4BlockedBadge}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-rose-100">{loc.step4BlockedTitle}</h2>
                  <p className="text-xs sm:text-sm text-rose-300 font-medium leading-relaxed">
                    {loc.step4BlockedSub}
                  </p>
                </div>
              </div>

              {/* Explanatory Fraud Breakdown Box */}
              <div className="bg-rose-900/60 rounded-2xl p-5 border border-rose-700/80 space-y-3">
                <div className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  {loc.whyBlockedTitle}
                </div>
                <p className="text-xs text-rose-100 leading-relaxed font-semibold">
                  {muleIntercept.message}
                </p>

                {muleIntercept.cluster && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="bg-rose-950/70 p-3 rounded-xl border border-rose-800/80">
                      <span className="text-[10px] text-rose-400 font-bold block">{loc.syndicateLabel}</span>
                      <span className="font-mono font-bold text-rose-200">{muleIntercept.cluster.muleClusterId}</span>
                    </div>
                    <div className="bg-rose-950/70 p-3 rounded-xl border border-rose-800/80">
                      <span className="text-[10px] text-rose-400 font-bold block">{loc.burnerCountLabel}</span>
                      <span className="font-bold text-amber-300">
                        {muleIntercept.cluster.associatedBurnerSimsCount} SIMs Tracked
                      </span>
                    </div>
                    <div className="bg-rose-950/70 p-3 rounded-xl border border-rose-800/80">
                      <span className="text-[10px] text-rose-400 font-bold block">{loc.cybercrimeRefLabel}</span>
                      <span className="font-mono text-rose-300">{muleIntercept.cluster.cybercrimeCaseRef}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Anti-Mule Innovation Note */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-black text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loc.antiMuleExplainTitle}</span>
                </div>
                <p className="leading-relaxed">{loc.antiMuleExplainBody}</p>
              </div>

              {/* Try clean persona button */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    loadPersona('REGULAR');
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-4 h-4 text-sky-600" />
                  <span>{loc.btnResetClean}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ✅ CLEAN CITIZEN REGISTRATION SUCCESS SCREEN */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xl space-y-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{loc.step4SuccessBadge}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{loc.step4SuccessTitle}</h2>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                    {loc.step4ScoreLabel}
                  </span>
                  <span className="text-2xl font-black text-emerald-600">98 / 100</span>
                </div>
              </div>

              {/* Profile Credentials Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px]">Registered Citizen:</span>
                  <span className="font-bold text-slate-900">{name}</span>
                  <span className="text-slate-500 block">
                    {ageRange} Years ({preferredLang.toUpperCase()})
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px]">Bound Mobile SIM:</span>
                  <span className="font-bold text-slate-900 font-mono">+91 {mobileNumber}</span>
                  <span className="text-emerald-600 font-bold block">SIM Binding Active</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px]">Biometric Mesh:</span>
                  <span className="font-bold text-slate-900">Face + Voice + Touch</span>
                  <span className="text-slate-500 block font-mono text-[10px]">Secure TPM Enclave</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px]">Familiar Picture Secret:</span>
                  <span className="font-bold text-indigo-900">
                    {familiarImageOptions.find((o) => o.id === selectedFamiliarImage)?.emoji}{' '}
                    {familiarImageOptions.find((o) => o.id === selectedFamiliarImage)?.nameKey}
                  </span>
                  <span className="text-slate-500 block">"{familiarSecretKey}"</span>
                </div>
              </div>

              {/* Action Buttons: Leads directly to Family Mode, Simulator, or Dashboard */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => navigateTo('guardian')}
                  className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105"
                >
                  <Users className="w-4 h-4" />
                  <span>{loc.btnGoToFamilyMode}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('pay')}
                    className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{loc.btnTryPaymentDemo}</span>
                  </button>

                  <button
                    onClick={() => navigateTo('dashboard')}
                    className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{loc.btnGoToDashboard}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
