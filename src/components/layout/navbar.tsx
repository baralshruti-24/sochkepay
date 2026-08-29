import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import {
  Shield,
  Lock,
  Globe,
  Menu,
  X,
  Sliders,
  BookOpen,
  Users,
  Eye,
  Zap,
  UserCheck,
  Headphones,
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  CheckCircle2,
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
    user,
    logoutUser,
    loginUser,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Language short letters display (EN / HI / OD)
  const getLanguageCode = (lang: Language): string => {
    switch (lang) {
      case 'hi':
        return 'HI';
      case 'or':
        return 'OD';
      default:
        return 'EN';
    }
  };

  const navLinks = [
    {
      id: 'landing',
      label: t.nav.home,
      desc: 'Platform overview & cognitive-safety philosophy',
      icon: Shield,
    },
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      desc: 'Readiness score, safe hours & protection metrics',
      icon: LayoutDashboard,
    },
    {
      id: 'pay',
      label: t.nav.pay,
      desc: 'Real-time UPI behavioral sandbox & scam checks',
      icon: Zap,
      highlight: true,
    },
    {
      id: 'safety-watch',
      label: t.nav.safetyWatch,
      desc: 'Crowdsourced community registry & mule accounts',
      icon: Eye,
    },
    {
      id: 'guardian',
      label: t.nav.guardian,
      desc: 'Family co-authorization & custom transfer limit',
      icon: Users,
    },
    {
      id: 'register',
      label: t.nav.register,
      desc: 'Voice biometric, visual anchors & SIM binding',
      icon: UserCheck,
    },
    {
      id: 'voice-studio',
      label: t.nav.voiceStudio,
      desc: 'Record vernacular scam alerts in 3 languages',
      icon: Headphones,
      badge: 'Creator',
    },
    {
      id: 'learn',
      label: t.nav.learn,
      desc: 'Psychological scam tactics & digital arrest guides',
      icon: BookOpen,
    },
    {
      id: 'demo',
      label: t.nav.demo,
      desc: 'Simulate high-pressure cyber fraud telemetry',
      icon: Sliders,
    },
  ];

  const handleNav = (route: string) => {
    navigateTo(route);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro banner for TAALA emergency lock if active */}
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

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-950 p-0.5 shadow-md shadow-slate-900/10 border border-slate-700/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-60" />
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-4.5 bg-sky-400 rounded-full" />
                <div className="w-1.5 h-4.5 bg-amber-400 rounded-full" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                  Soch<span className="text-sky-600">Ke</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-slate-950 rounded-lg shadow-xs">
                  Pay
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 tracking-normal font-sans hidden lg:inline">
                {t.brand.subTagline}
              </span>
            </div>
          </div>

          {/* Right Header Controls in Exact Sequence:
              1. Menu (3-lines classic)
              2. Make Payment
              3. TAALA Lock
              4. Registered Name & Language below it
              5. Log Out button
          */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap sm:flex-nowrap justify-end">
            {/* 1. CLASSIC 3-LINES DROPDOWN MENU */}
            <div className="relative" ref={menuRef}>
              <button
                id="classic-3-lines-menu-btn"
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`h-10 sm:h-11 px-3 sm:px-3.5 rounded-2xl border text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                  isMenuOpen
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title="Open Navigation Menu"
                aria-label="Navigation Menu"
              >
                {isMenuOpen ? <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                <span className="hidden md:inline">Menu</span>
              </button>

              {/* Navigation Dropdown List */}
              {isMenuOpen && (
                <div
                  id="classic-navigation-dropdown"
                  className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2.5 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  {/* User Profile Header in Dropdown */}
                  {user.isLoggedIn !== false ? (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs font-black">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{user.phoneMasked}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsMenuOpen(false);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Log out"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 mb-2 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-sky-950">Guest Mode</div>
                        <div className="text-[10px] text-sky-700">Setup your identity profile</div>
                      </div>
                      <button
                        onClick={() => handleNav('register')}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Register
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Navigation Menu
                  </div>

                  {/* Complete List of Navigation Items */}
                  <div className="py-1 space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                    {navLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeRoute === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`dropdown-nav-${item.id}`}
                          onClick={() => handleNav(item.id)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-2xl text-left transition-all cursor-pointer group ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isActive
                                ? 'bg-slate-800 text-amber-400'
                                : item.highlight
                                ? 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-xs font-black ${
                                  isActive ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                                    isActive
                                      ? 'bg-indigo-500 text-white'
                                      : 'bg-indigo-100 text-indigo-800'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {item.highlight && !isActive && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                                  Simulator
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] font-medium truncate ${
                                isActive ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>SochKe Cognitive UPI Engine</span>
                    </span>
                    <button
                      onClick={() => handleNav('learn')}
                      className="font-bold text-sky-600 hover:underline cursor-pointer"
                    >
                      Help & Guide
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. MAKE PAYMENT BUTTON */}
            <button
              id="header-quick-pay-btn"
              onClick={() => handleNav('pay')}
              className={`h-10 sm:h-11 px-3 sm:px-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border ${
                activeRoute === 'pay'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-amber-500/20'
                  : 'bg-amber-100/90 text-amber-950 hover:bg-amber-200 border-amber-300'
              }`}
              title="Open Payment Simulator & Scanner"
            >
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 fill-amber-700" />
              <span className="hidden sm:inline">{t.nav.pay}</span>
              <span className="sm:hidden">Pay</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping hidden sm:inline-block" />
            </button>

            {/* 3. TAALA LOCK BUTTON */}
            <button
              id="navbar-taala-lock-btn"
              onClick={() => (isTaalaLocked ? unlockTaala() : lockTaala())}
              className={`h-10 sm:h-11 px-3 sm:px-3.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 border ${
                isTaalaLocked
                  ? 'bg-rose-600 text-white hover:bg-rose-700 border-rose-700 animate-pulse'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
              }`}
              title={isTaalaLocked ? 'Unlock outgoing payments' : 'Emergency Lock Outgoing Payments'}
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />
              <span className="hidden sm:inline">
                {isTaalaLocked ? t.nav.taalaLocked : t.nav.emergencyLock}
              </span>
              <span className="sm:hidden">{isTaalaLocked ? 'Locked' : 'TAALA'}</span>
            </button>

            {/* 4. REGISTERED NAME AND LANGUAGE WIDGET (Enhanced readability, clear typography & seamless feel) */}
            <div className="relative" ref={langDropdownRef}>
              <div
                id="registered-user-lang-card"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/90 hover:bg-slate-100 hover:border-slate-300 text-slate-800 transition-all cursor-pointer shadow-xs flex items-center gap-2 sm:gap-2.5"
                title="Click to switch language or view identity profile"
              >
                {/* User Avatar Initial / Status */}
                <div className="relative flex-shrink-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                    {(user.isLoggedIn !== false ? user.name : 'G').charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>

                {/* Name & Language Details */}
                <div className="flex flex-col text-left justify-center min-w-0">
                  <div className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate max-w-[90px] sm:max-w-[130px]">
                    {user.isLoggedIn !== false ? user.name : 'Guest User'}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold leading-tight">
                    <Globe className="w-3 h-3 text-sky-600 flex-shrink-0" />
                    <span className="text-sky-700 font-extrabold tracking-wide">
                      {getLanguageCode(language)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      • {language === 'hi' ? 'हिंदी' : language === 'or' ? 'ଓଡ଼ିଆ' : 'English'}
                    </span>
                  </div>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ml-0.5 flex-shrink-0 ${isLangDropdownOpen ? 'rotate-180 text-sky-600' : ''}`} />
              </div>

              {/* Language Selection Popup */}
              {isLangDropdownOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Select Language / भाषा
                  </div>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${
                      language === 'en' ? 'text-sky-600 bg-sky-50/80 font-black' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-slate-100 text-slate-700">EN</span>
                      <span>English</span>
                    </div>
                    {language === 'en' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${
                      language === 'hi' ? 'text-sky-600 bg-sky-50/80 font-black' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-amber-100 text-amber-800">HI</span>
                      <span>हिंदी (Hindi)</span>
                    </div>
                    {language === 'hi' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('or');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer hover:bg-slate-50 flex items-center justify-between transition-colors ${
                      language === 'or' ? 'text-sky-600 bg-sky-50/80 font-black' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[10px] font-black rounded bg-sky-100 text-sky-800">OD</span>
                      <span>ଓଡ଼ିଆ (Odia)</span>
                    </div>
                    {language === 'or' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                  </button>

                  <div className="pt-1.5 mt-1.5 border-t border-slate-100 px-2.5 space-y-1">
                    {user.isLoggedIn === false ? (
                      <button
                        onClick={() => {
                          loginUser({ name: 'Shruti Baral', email: 'baralshruti24@gmail.com', rawMobile: '9876543210', phoneMasked: '+91 98765 •••••', isLoggedIn: true });
                          setIsLangDropdownOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl font-black flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Log in as Shruti Baral</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleNav('register');
                          setIsLangDropdownOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Manage Identity Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5. LOG OUT BUTTON (Or Log In) */}
            {user.isLoggedIn !== false ? (
              <button
                id="navbar-logout-btn"
                onClick={logoutUser}
                className="h-10 sm:h-11 px-2.5 sm:px-3.5 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                title="Log out of current profile"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            ) : (
              <button
                id="navbar-login-btn"
                onClick={() => loginUser({ name: 'Shruti Baral', email: 'baralshruti24@gmail.com', rawMobile: '9876543210', phoneMasked: '+91 98765 •••••', isLoggedIn: true })}
                className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                title="Log in as Shruti Baral"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Log In (Shruti)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
