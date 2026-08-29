import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import {
  Shield,
  ShieldAlert,
  Lock,
  Globe,
  Menu,
  X,
  CreditCard,
  PhoneCall,
  Sparkles,
  Sliders,
  BookOpen,
  Users,
  Eye,
  Zap,
  UserCheck,
  Headphones,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeRoute,
    navigateTo,
    isTaalaLocked,
    lockTaala,
    unlockTaala,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompactMenuOpen, setIsCompactMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const navItems = [
  { id: 'register', label: t.nav.register, icon: UserCheck },
  { id: 'dashboard', label: t.nav.dashboard, icon: CreditCard },
  { id: 'landing', label: t.nav.home, icon: Shield },
  { id: 'pay', label: t.nav.pay, icon: Zap, highlight: true },
  { id: 'guardian', label: t.nav.guardian, icon: Users },
  { id: 'safety-watch', label: t.nav.safetyWatch, icon: Eye },
  { id: 'learn', label: t.nav.learn, icon: BookOpen },
  { id: 'voice-studio', label: t.nav.voiceStudio, icon: Headphones },
  { id: 'demo', label: t.nav.demo, icon: Sliders },
];

  const handleNav = (route: string) => {
    navigateTo(route);
    setIsMobileMenuOpen(false);
    setIsCompactMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro banner for TAALA lock if active */}
      {isTaalaLocked && (
        <div className="bg-rose-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 mx-auto">
            <Lock className="w-3.5 h-3.5" />
            <span>{t.taala.lockedStatus}</span>
          </div>
          <button
            onClick={unlockTaala}
            className="text-rose-100 underline hover:text-white text-xs font-semibold ml-2 cursor-pointer"
          >
            {t.taala.unlockBtn}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div
            id="brand-logo"
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Custom SochKe Pay Logo Mark */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-950 p-0.5 shadow-md shadow-slate-900/10 border border-slate-700/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              {/* Golden safety spark */}
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-60" />
              {/* Inner symbol: Pause bars morphing into Shield */}
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-4.5 bg-sky-400 rounded-full" />
                <div className="w-1.5 h-4.5 bg-amber-400 rounded-full" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  Soch<span className="text-sky-600">Ke</span>
                </span>
                <span className="px-2 py-0.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-lg shadow-xs">
                  Pay
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-normal font-sans">
                {t.brand.subTagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xs font-bold'
                      : item.id === 'voice-studio'
                      ? 'text-indigo-700 hover:text-indigo-950 hover:bg-indigo-50 font-bold'
                      : item.highlight
                      ? 'text-sky-700 hover:text-sky-950 hover:bg-sky-50'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-sky-600' : item.id === 'voice-studio' ? 'text-indigo-600' : item.highlight ? 'text-sky-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.id === 'voice-studio' && (
                    <span className="px-1.5 py-0.2 bg-indigo-600 text-[10px] text-white font-extrabold rounded-md">
                      Creator
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Compact navigation dropdown for medium-width screens */}
          <div className="hidden lg:flex xl:hidden relative">
            <button
              id="compact-menu-toggle"
              onClick={() => setIsCompactMenuOpen(!isCompactMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
            {isCompactMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left cursor-pointer ${
                        activeRoute === item.id ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Action Controls: Creator Voice + Language + TAALA Emergency */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Quick Creator Studio Access Button */}
            <button
              id="header-creator-voice-btn"
              onClick={() => handleNav('voice-studio')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                activeRoute === 'voice-studio'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/20'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
              title="Creator Voice Studio: Record official warnings in 3 languages"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Creator Audio</span>
            </button>
            {/* Language Switcher */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                title="Change language / भाषा बदलें"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>
                  {language === 'hi' ? 'हिंदी' : language === 'or' ? 'ଓଡ଼ିଆ' : 'English'}
                </span>
              </button>

              {isLangDropdownOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                      language === 'en' ? 'text-sky-600 bg-sky-50/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                      language === 'hi' ? 'text-sky-600 bg-sky-50/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>हिंदी (Hindi)</span>
                    {language === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('or');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                      language === 'or' ? 'text-sky-600 bg-sky-50/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>ଓଡ଼ିଆ (Odia)</span>
                    {language === 'or' && <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* TAALA Emergency Quick Button */}
            <button
              id="navbar-taala-lock-btn"
              onClick={() => (isTaalaLocked ? unlockTaala() : lockTaala())}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs ${
                isTaalaLocked
                  ? 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-700 animate-pulse'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
              title={isTaalaLocked ? 'Unlock payments' : 'Emergency Lock Outgoing Payments'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isTaalaLocked ? t.nav.taalaLocked : t.nav.emergencyLock}
              </span>
              <span className="sm:hidden">{isTaalaLocked ? 'Locked' : 'TAALA'}</span>
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
