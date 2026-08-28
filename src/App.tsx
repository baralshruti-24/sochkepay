/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/navbar';
import { Footer } from './components/layout/footer';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PaymentSimulatorPage } from './pages/PaymentSimulatorPage';
import { SafetyWatchPage } from './pages/SafetyWatchPage';
import { GuardianPage } from './pages/GuardianPage';
import { LearnPage } from './pages/LearnPage';
import { DemoControlPanel } from './pages/DemoControlPanel';
import { CreatorVoiceStudioPage } from './pages/CreatorVoiceStudioPage';
import { AboutFuturePage } from './pages/AboutFuturePage';

const AppContent: React.FC = () => {
  const { activeRoute } = useApp();

  const renderView = () => {
    switch (activeRoute) {
      case 'landing':
        return <LandingPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'pay':
        return <PaymentSimulatorPage />;
      case 'safety-watch':
        return <SafetyWatchPage />;
      case 'guardian':
        return <GuardianPage />;
      case 'learn':
        return <LearnPage />;
      case 'demo':
      case 'demo-controls':
        return <DemoControlPanel />;
      case 'voice-studio':
      case 'studio':
        return <CreatorVoiceStudioPage />;
      case 'about':
        return <AboutFuturePage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
