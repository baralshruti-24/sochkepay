export interface CreatorVoicePrompt {
  id: string;
  category: string;
  scenarioTitle: string;
  riskBadge: 'SPECIAL' | 'HIGH' | 'CRITICAL';
  situationDesc: string;
  scripts: {
    en: string;
    hi: string;
    or: string;
  };
}

export const INITIAL_CREATOR_PROMPTS: CreatorVoicePrompt[] = [
  {
    id: 'SCENARIO_REFUND_QR_SCAM',
    category: 'QR Code & Refund Deception',
    scenarioTitle: '🟠 Refund QR Code Scam',
    riskBadge: 'HIGH',
    situationDesc: 'Triggered when a merchant or caller sends a QR code claiming "Scan QR to receive your cashback / refund".',
    scripts: {
      en: 'Ruko and verify! Entering your UPI PIN sends money OUT, it never receives money or refunds. Do not scan QR codes to receive money.',
      hi: 'रुकिए और ध्यान दें! यूपीआई पिन डालने से पैसे केवल कटते हैं, कभी रिफंड नहीं आता। पैसे पाने के लिए कभी भी क्यूआर कोड स्कैन मत कीजिए।',
      or: 'ଅଟକନ୍ତୁ! UPI PIN ଦେଲେ ଟଙ୍କା କଟିଯାଏ, ରିଫଣ୍ଡ ମିଳେ ନାହିଁ। ଟଙ୍କା ପାଇବା ପାଇଁ QR କୋଡ୍ ସ୍କାନ କରନ୍ତୁ ନାହିଁ।',
    },
  },
  {
    id: 'SCENARIO_OLX_MARKETPLACE_SCAM',
    category: 'Marketplace / Army Officer Fraud',
    scenarioTitle: '🔴 OLX Army / Advance QR Scam',
    riskBadge: 'CRITICAL',
    situationDesc: 'Triggered when an unverified marketplace buyer claims to be an Army/CISF officer sending advance booking money via QR/collect request.',
    scripts: {
      en: 'Stop immediately! Severe fraud risk. Fake buyers posing as Army officers trick sellers into scanning QR codes. Do not approve this payment.',
      hi: 'तुरंत रुकिए! गंभीर धोखाधड़ी का खतरा है। फौजी अफसर बनकर फर्जी खरीदार आपको पेमेंट रिक्वेस्ट भेज रहे हैं। इस पेमेंट को तुरंत रद्द करें।',
      or: 'ତୁରନ୍ତ ଅଟକନ୍ତୁ! ଏହା ସମ୍ପୂର୍ଣ୍ଣ ଠକେଇ। ଆର୍ମି ଅଫିସର ନାମରେ ନକଲି ଗ୍ରାହକ ଆପଣଙ୍କୁ ଠକିବାକୁ ଚେଷ୍ଟା କରୁଛନ୍ତି। UPI PIN ଦିଅନ୍ତୁ ନାହିଁ।',
    },
  },
  {
    id: 'SCENARIO_FAMILY_IMPERSONATION_SCAM',
    category: 'Family Impersonation / DP Cloned Mule',
    scenarioTitle: '🔴 Family Impersonation / Emergency Bail Scam',
    riskBadge: 'CRITICAL',
    situationDesc: 'Triggered when someone on WhatsApp impersonates a daughter/son in distress from an unknown number demanding urgent bail or hospital money.',
    scripts: {
      en: 'Emergency Stop! Unknown account requesting urgent distress transfer. Call your family member on their original number before entering your PIN.',
      hi: 'तुरंत रुकिए! परिवार के नाम पर अनजान नंबर से पैसे मांगे जा रहे हैं। पिन डालने से पहले अपने परिजन को उनके असली पुराने नंबर पर सीधे कॉल करें।',
      or: 'ତୁରନ୍ତ ଅଟକନ୍ତୁ! ପରିବାର ନାମରେ ଅଜଣା ନମ୍ବରରୁ ଟଙ୍କା ମଗାଯାଉଛି। PIN ଦେବା ପୂର୍ବରୁ ସେମାନଙ୍କ ଅସଲି ନମ୍ବରରେ କଲ୍ କରନ୍ତୁ।',
    },
  },
  {
    id: 'SCENARIO_SIM_ELECTRICITY_DEACTIVATION',
    category: 'Utility & SIM Disconnection Extortion',
    scenarioTitle: '🔴 SIM / Electricity Deactivation Threat',
    riskBadge: 'CRITICAL',
    situationDesc: 'Triggered when victims are threatened with immediate power cutoff or SIM block unless they pay a small fee or install quick-support apps.',
    scripts: {
      en: 'Stop! Real electricity boards and telecom operators never send personal UPI IDs or threaten immediate disconnection. Cut the call now.',
      hi: 'रुकिए! बिजली विभाग या सिम कंपनियां कभी पर्सनल यूपीआई पर पैसे नहीं मांगतीं। यह पूरी तरह से जबरन वसूली का फ्रॉड है। फोन काटें।',
      or: 'ଅଟକନ୍ତୁ! ବିଦ୍ୟୁତ୍ ବିଭାଗ କିମ୍ବା ଟେଲିକମ୍ କମ୍ପାନୀ ବ୍ୟକ୍ତିଗତ UPI ରେ ଟଙ୍କା ମାଗନ୍ତି ନାହିଁ। ତୁରନ୍ତ ଫୋନ୍ କାଟନ୍ତୁ।',
    },
  },
  {
    id: 'WARN_FLAGGED_SCAMMER',
    category: 'Civic Fraud Registry Scammer',
    scenarioTitle: '🔴 Civic Fraud Registry Intercept',
    riskBadge: 'CRITICAL',
    situationDesc: 'Triggered when the recipient VPA is confirmed fraudulent in the Community Safety Watch Registry.',
    scripts: {
      en: 'Attention! This account is flagged in the Civic Fraud Registry. Do not enter your UPI PIN or you will lose your money. Cancel this transaction immediately.',
      hi: 'सावधान! यह खाता धोखाधड़ी रजिस्ट्री में दर्ज है। अपना यूपीआई पिन कभी मत डालिए वरना आपके खाते से पैसे कट जाएंगे। इस पेमेंट को तुरंत रद्द करें।',
      or: 'ସାବଧାନ! ଏହି ଆକାଉଣ୍ଟ ଠକେଇ ତାଲିକାରେ ଚିହ୍ନଟ ହୋଇଛି। ଆପଣଙ୍କ UPI PIN ଦିଅନ୍ତୁ ନାହିଁ। ଏହି କାରବାରକୁ ତୁରନ୍ତ ବାତିଲ କରନ୍ତୁ।',
    },
  },
  {
    id: 'SCENARIO_DIGITAL_ARREST_POLICE',
    category: 'Fake Police / Digital Arrest',
    scenarioTitle: '🔴 Digital Arrest & Fake Police Threat',
    riskBadge: 'CRITICAL',
    situationDesc: 'Triggered when scammers threaten arrest, customs seizure, or CBI/ED investigation over video call.',
    scripts: {
      en: 'Emergency Warning! Real police officers and judges NEVER demand money or penalties over WhatsApp or video calls. You cannot be arrested digitally. Cut the call now.',
      hi: 'आपातकालीन चेतावनी! असली पुलिस या अदालत कभी फोन या व्हाट्सएप पर पैसे या जुर्माना नहीं मांगती। डिजिटल अरेस्ट पूरी तरह से फर्जी है। तुरंत कॉल काटें।',
      or: 'ଜରୁରୀକାଳୀନ ଚେତାବନୀ! ପ୍ରକୃତ ପୋଲିସ କିମ୍ବା କୋର୍ଟ କେବେ ଫୋନରେ ଟଙ୍କା ମାଗନ୍ତି ନାହିଁ। ଡିଜିଟାଲ ଆରେଷ୍ଟ ସମ୍ପୂର୍ଣ୍ଣ ମିଥ୍ୟା। ତୁରନ୍ତ କଲ୍ କାଟନ୍ତୁ।',
    },
  },
  {
    id: 'SCENARIO_UPFRONT_LOAN_FEE',
    category: 'Loan Processing Fee Fraud',
    scenarioTitle: '🟠 Fake Loan Upfront Processing Fee',
    riskBadge: 'HIGH',
    situationDesc: 'Triggered when victim is promised an instant loan but asked to pay advance processing charges.',
    scripts: {
      en: 'Warning! Legitimate banks NEVER demand upfront processing fees via personal UPI before giving a loan. Genuine fees are deducted directly from loan disbursement.',
      hi: 'सावधान! असली बैंक या वित्तीय संस्थाएं लोन देने से पहले कभी पर्सनल यूपीआई पर एडवांस फीस नहीं मांगतीं। लोन की फीस लोन राशि से ही कटती है। पैसे मत भेजिए।',
      or: 'ସାବଧାନ! ପ୍ରକୃତ ବ୍ୟାଙ୍କ ଋଣ ଦେବା ପୂର୍ବରୁ ବ୍ୟକ୍ତିଗତ UPI ମାଧ୍ୟମରେ ଅଗ୍ରିମ ଫି ମାଗନ୍ତି ନାହିଁ। ଟଙ୍କା ପଠାନ୍ତୁ ନାହିଁ।',
    },
  },
  {
    id: 'SCENARIO_PAYING_FOR_REWARD',
    category: 'Lottery & Cash Prize Scam',
    scenarioTitle: '🔴 Lottery & Prize Advance Fee Scam',
    riskBadge: 'CRITICAL',
    situationDesc: 'Triggered when victim believes they won a lucky draw or cashback but must pay "processing tax".',
    scripts: {
      en: 'Stop! You never have to pay tax or advance fees to receive a genuine lottery or cashback prize. Any prize requiring a fee is one hundred percent a scam.',
      hi: 'रुकिए! असली लॉटरी या इनाम पाने के लिए आपको कभी पहले टैक्स या फीस नहीं देनी पड़ती। इनाम पाने के लिए पैसे मांगना पूरी तरह से धोखा है।',
      or: 'ଅଟକନ୍ତୁ! ପ୍ରକୃତ ପୁରସ୍କାର ପାଇବା ପାଇଁ ଆଗୁଆ ଟଙ୍କା କିମ୍ବା ଟ୍ୟାକ୍ସ ଦେବାକୁ ପଡ଼େ ନାହିଁ। ଏହା ସମ୍ପୂର୍ଣ୍ଣ ଠକେଇ।',
    },
  },
  {
    id: 'SCENARIO_HOSPITAL_EMERGENCY',
    category: 'Emergency Medical Care (No Alarm Audio)',
    scenarioTitle: '🔵 Hospital Verified Fast-Track',
    riskBadge: 'SPECIAL',
    situationDesc: 'Triggered during certified medical hospital payments. No stop-alarm audio will be played; only calm priority guidance.',
    scripts: {
      en: 'Hospital verified fast-track is active. Please confirm the hospital counter name and proceed safely for priority medical care.',
      hi: 'अस्पताल वेरीफाइड फास्ट-ट्रैक सक्रिय है। कृपया अस्पताल का नाम और काउंटर जांचकर तुरंत सुरक्षित भुगतान करें।',
      or: 'ଡାକ୍ତରଖାନା ଯାଞ୍ଚ ହୋଇଥିବା ଫାଷ୍ଟ-ଟ୍ରାକ୍ ସକ୍ରିୟ। ଡାକ୍ତରଖାନାର ନାମ ଯାଞ୍ଚ କରି ଶୀଘ୍ର ପେମେଣ୍ଟ କରନ୍ତୁ।',
    },
  },
  {
    id: 'SCENARIO_FAMILY_GENUINE_EMERGENCY',
    category: 'Family Distress Safe Fast-Track (No Alarm Audio)',
    scenarioTitle: '🔵 Genuine Family Emergency Fast-Track',
    riskBadge: 'SPECIAL',
    situationDesc: 'Triggered for verified emergency payments to known contacts. Alarm audio is suppressed.',
    scripts: {
      en: 'Family emergency fast-track active. Context verified. Please verify recipient details and proceed safely with priority checkout.',
      hi: 'पारिवारिक आपातकाल फास्ट-ट्रैक सक्रिय है। कृपया विवरण जांचकर प्राथमिकता से सुरक्षित भुगतान करें।',
      or: 'ପାରିବାରିକ ଜରୁରୀକାଳୀନ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ସକ୍ରିୟ। ବିବରଣୀ ଯାଞ୍ଚ କରି ଶୀଘ୍ର ପେମେଣ୍ଟ କରନ୍ତୁ।',
    },
  },
  {
    id: 'GUIDE_PAYMENT_DASHBOARD',
    category: 'Friendly Senior/Beginner Guide',
    scenarioTitle: '🔵 Payment Dashboard Welcome',
    riskBadge: 'SPECIAL',
    situationDesc: 'Friendly audio guide for when the user enters the Payment Dashboard.',
    scripts: {
      en: 'Welcome to the payment dashboard. You can send money securely to your contacts here. Select a recipient to start.',
      hi: 'भुगतान डैशबोर्ड में आपका स्वागत है। यहाँ से आप सुरक्षित रूप से पैसे भेज सकते हैं। भेजने के लिए एक संपर्क चुनें।',
      or: 'ପେମେଣ୍ଟ ଡ୍ୟାସବୋର୍ଡକୁ ସ୍ୱାଗତ। ଏଠାରୁ ଆପଣ ନିରାପଦରେ ଟଙ୍କା ପଠାଇ ପାରିବେ। ଜଣେ ଗ୍ରାହକ ବାଛନ୍ତୁ।',
    },
  },
  {
    id: 'GUIDE_REGISTRATION_NAME',
    category: 'Friendly Senior/Beginner Guide',
    scenarioTitle: '🔵 Registration: Name Entry',
    riskBadge: 'SPECIAL',
    situationDesc: 'Friendly audio guide for entering the name during registration.',
    scripts: {
      en: 'Please enter your full name as it appears on your bank account or Aadhaar card.',
      hi: 'कृपया अपना पूरा नाम दर्ज करें जैसा कि आपके बैंक खाते या आधार कार्ड पर है।',
      or: 'କୃପୟା ଆପଣଙ୍କ ପୂରା ନାମ ଲେଖନ୍ତୁ ଯାହା ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଖାତା କିମ୍ବା ଆଧାର କାର୍ଡରେ ଅଛି।',
    },
  },
  {
    id: 'GUIDE_REGISTRATION_MOBILE',
    category: 'Friendly Senior/Beginner Guide',
    scenarioTitle: '🔵 Registration: Mobile Number',
    riskBadge: 'SPECIAL',
    situationDesc: 'Friendly audio guide for entering mobile number.',
    scripts: {
      en: 'Enter your 10-digit mobile number linked to your UPI account.',
      hi: 'अपने यूपीआई खाते से जुड़ा 10 अंकों का मोबाइल नंबर दर्ज करें।',
      or: 'ଆପଣଙ୍କ UPI ଆକାଉଣ୍ଟ ସହିତ ସଂଯୁକ୍ତ 10 ଅଙ୍କର ମୋବାଇଲ୍ ନମ୍ବର ଲେଖନ୍ତୁ।',
    },
  },
  {
    id: 'GUIDE_REGISTRATION_EMAIL',
    category: 'Friendly Senior/Beginner Guide',
    scenarioTitle: '🔵 Registration: Email Entry',
    riskBadge: 'SPECIAL',
    situationDesc: 'Friendly audio guide for entering email address.',
    scripts: {
      en: 'Enter your email address to receive monthly safety reports. This is optional.',
      hi: 'मासिक सुरक्षा रिपोर्ट प्राप्त करने के लिए अपना ईमेल दर्ज करें। यह वैकल्पिक है।',
      or: 'ମାସିକ ସୁରକ୍ଷା ରିପୋର୍ଟ ପାଇଁ ନିଜ ଇମେଲ୍ ଦିଅନ୍ତୁ। ଏହା ଇଚ୍ଛାଧୀନ।',
    },
  },
  {
    id: 'GUIDE_REGISTRATION_DAILY_LIMIT',
    category: 'Friendly Senior/Beginner Guide',
    scenarioTitle: '🔵 Registration: Daily Limit',
    riskBadge: 'SPECIAL',
    situationDesc: 'Friendly audio guide for setting daily transfer limit.',
    scripts: {
      en: 'Set your daily outgoing transfer limit to keep your account safe.',
      hi: 'अपने खाते को सुरक्षित रखने के लिए अपनी दैनिक भुगतान सीमा निर्धारित करें।',
      or: 'ଆକାଉଣ୍ଟ ସୁରକ୍ଷିତ ରଖିବା ପାଇଁ ଆପଣଙ୍କ ଦୈନିକ ପେମେଣ୍ଟ ସୀମା ସେଟ୍ କରନ୍ତୁ।',
    },
  },
  {
    id: 'GUIDE_REGISTRATION_TAALA_PIN',
    category: 'Friendly Senior/Beginner Guide',
    scenarioTitle: '🔵 Registration: TAALA PIN',
    riskBadge: 'SPECIAL',
    situationDesc: 'Friendly audio guide for setting TAALA emergency PIN.',
    scripts: {
      en: 'Set a 4-digit Emergency TAALA PIN to quickly lock your outgoing payments.',
      hi: 'अपने आउटगोइंग भुगतान को जल्दी लॉक करने के लिए 4 अंकों का आपातकालीन ताला पिन सेट करें।',
      or: 'ଆପଣଙ୍କ ପେମେଣ୍ଟ ଲକ୍ କରିବା ପାଇଁ 4 ଅଙ୍କର ଜରୁରୀକାଳୀନ ତାଲା ପିନ୍ (PIN) ସେଟ୍ କରନ୍ତୁ।',
    },
  },
];