import React from 'react';
import { useApp } from '../context/AppContext';
import { SochuMascot } from '../mascot/SochuMascot';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Volume2,
  Lock,
  Eye,
  CheckCircle2,
  HelpCircle,
  Users,
  Zap,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { t, navigateTo, language } = useApp();

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 text-xs font-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.landing.heroBadge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {t.landing.heroTitle}
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                {t.landing.heroSub}
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  id="landing-cta-pay-btn"
                  onClick={() => navigateTo('pay')}
                  className="px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>{t.landing.ctaPay}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </button>

                <button
                  id="landing-cta-register-btn"
                  onClick={() => navigateTo('register')}
                  className="px-6 py-4 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-5 h-5 text-sky-600" />
                  <span>Register Safety Identity</span>
                </button>

                <button
                  id="landing-cta-learn-btn"
                  onClick={() => navigateTo('learn')}
                  className="px-5 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-5 h-5 text-slate-500" />
                  <span>{t.landing.ctaLearn}</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs font-bold text-slate-600 border-t border-slate-200/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t.landing.trust1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t.landing.trust2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t.dashboard.voiceAlerts}</span>
                </div>
              </div>
            </div>

            {/* Right Hero Mascot & Interactive Visual Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Soft background radial aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-200/40 via-amber-200/30 to-rose-200/30 rounded-3xl blur-2xl -z-10" />

              {/* Interactive Mascot with Dynamic Greeting */}
              <div className="mb-4">
                <SochuMascot
                  mood="LOW"
                  size="lg"
                  showDialogue={true}
                  customMessage={
                    language === 'hi'
                      ? 'नमस्ते! मैं सोचू हूँ। पैसे भेजने से पहले सोचिए!'
                      : 'Namaste! I am Sochu. Think before you pay!'
                  }
                  onMascotClick={() => navigateTo('pay')}
                />
              </div>

              {/* Mini Interactive Preview Card */}
              <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-slate-200 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    How SochKe Protects You
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

               <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200">
    <p className="text-sm font-bold text-slate-600">
      1. Check the recipient and context
    </p>
  </div>

  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200">
    <p className="text-sm font-bold text-slate-600">
      2. Explain the risk before authorization
    </p>
  </div>

  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200">
    <p className="text-sm font-bold text-slate-600">
      3. Protect your decision
    </p>
  </div>
</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE PROBLEM SECTION */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-extrabold uppercase tracking-wider border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.landing.problemTitle}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
            "Fraudsters don't always hack the payment system. They manipulate the person using it."
          </h2>

          <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            {t.landing.problemDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <h4 className="font-bold text-sm text-amber-400">Coached Over Call</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Victims are kept on a phone call while being guided step-by-step into authorizing fraudulent transfers.
              </p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <h4 className="font-bold text-sm text-amber-400">Fake Refund Collects</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scammers claim "accept this request to receive money" when it is actually a collect request draining funds.
              </p>
            </div>
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2">
              <h4 className="font-bold text-sm text-amber-400">Digital Arrest Panic</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Imposters pretend to be CBI, Police, or Customs over video calls, demanding money to avoid arrest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS IN 4 CLEAR QUESTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.landing.howItWorksTitle}
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Explainable protection designed so your grandmother can understand every single screen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-black text-base">
              1
            </div>
            <h3 className="text-base font-black text-slate-900">{t.landing.step1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.landing.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base">
              2
            </div>
            <h3 className="text-base font-black text-slate-900">{t.landing.step2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.landing.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-base">
              3
            </div>
            <h3 className="text-base font-black text-slate-900">{t.landing.step3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.landing.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-base">
              4
            </div>
            <h3 className="text-base font-black text-slate-900">{t.landing.step4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.landing.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRIVACY-FIRST COMMITMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50/50 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Trust & Privacy Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              {t.landing.trustTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t.landing.trust1}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Biometrics stay in your device hardware. The server only receives local success tokens.
                </p>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t.landing.trust2}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  We never ask for, intercept, or record your confidential 4 or 6 digit UPI PIN.
                </p>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t.landing.trust3}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Every score is explainable with transparent signal point weights.
                </p>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900">{t.landing.trust4}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Optionally designate trusted family members to assist during high-risk transfers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Ready to experience safe, explainable payments?
        </h2>
        <p className="text-base text-slate-600 font-medium">
          Test real fraud scenarios with live voice guidance in the interactive simulator.
        </p>
        <button
          onClick={() => navigateTo('pay')}
          className="px-8 py-4.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base inline-flex items-center gap-3 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Zap className="w-5 h-5" />
          <span>Launch Payment Simulator</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
