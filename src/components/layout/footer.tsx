import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, HeartHandshake, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, navigateTo, language } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">
                Soch<span className="text-sky-400">Ke</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-md">
                Pay
              </span>
            </div>
            <p className="text-slate-300 font-medium text-base">
              {t.brand.tagline}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              {t.brand.philosophy} Designed as a human-friendly safety intelligence layer between user psychology and instant payment authorization.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Device-Local Biometrics
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero PIN Retention
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multilingual Voice Guidance
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Explore SochKe
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => navigateTo('pay')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Payment Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('dashboard')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Safety Center Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('safety-watch')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Community Safety Watch
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('guardian')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Family & Guardian Mode
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('learn')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Micro-Learning & Scam Habits
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical & Compliance */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Architecture & Trust
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  About & Phase Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('demo')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-sky-400"
                >
                  ⚡ Judge / Demo Control Panel
                </button>
              </li>
              <li>
                <span className="text-slate-500 block pt-2 text-[11px] leading-relaxed">
                  Prototype disclaimer: SochKe Pay simulates payment context & risk intelligence. It does not replace authorized banking PSPs or NPCI infrastructure directly.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SochKe Pay. सोचके भेजो • समझके भरोसा करो.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy-First Architecture</span>
            <span>WCAG 2.1 AA Accessible</span>
            <span>Ruko. Socho. Surakshit Raho.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};