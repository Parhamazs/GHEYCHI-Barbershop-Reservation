/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar } from './components/Navbar';
import { NearbyBarbers } from './components/CustomerView/NearbyBarbers';
import { BarberProfileModal } from './components/CustomerView/BarberProfileModal';
import { BarberDashboard } from './components/BarberView/BarberDashboard';
import { ArchitectureView } from './components/ArchitectureView';
import { LoginPage } from './components/AuthView/LoginPage';
import { MvpPdfDocument } from './components/PdfExport/MvpPdfDocument';
import { CustomerProfileModal } from './components/CustomerView/CustomerProfileModal';
import { ToastContainer } from './components/ToastContainer';
import { BarberProfile } from './types';
import { Scissors, Clock, ShieldCheck, MapPin, Users, Calendar, Terminal, LogIn, FileText } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    switchUserRole,
    isProfileModalOpen,
    setIsProfileModalOpen,
    language,
    direction,
    theme,
    t,
  } = useApp();
  const [selectedBarberForModal, setSelectedBarberForModal] = useState<BarberProfile | null>(null);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans pb-16 md:pb-0 transition-colors duration-200 ${
        theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f17] text-slate-100'
      }`}
      dir={direction}
    >
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Navigation Tabs (Responsive with smooth horizontal scroll on mobile) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
          <div className="overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
            <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold whitespace-nowrap min-w-max shadow-sm">
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'pdf'
                    ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-amber-400'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{language === 'fa' ? 'سند معماری و مشخصات فنی' : 'Platform Specs'}</span>
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>{language === 'fa' ? 'ورود به سامانه' : 'Login Page'}</span>
              </button>
              <button
                onClick={() => setActiveTab('customer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'customer'
                    ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>{t.tabCustomer}</span>
              </button>
              <button
                onClick={() => {
                  if (currentUser.role !== 'barber') switchUserRole('barber');
                  setActiveTab('barber');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'barber'
                    ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{t.tabBarber}</span>
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>{t.tabArchitecture}</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-amber-400 shrink-0" />
              <span>{language === 'fa' ? 'قفل موقت ۱۵ دقیقه‌ای ردیس' : '15-min Redis Hold Lock'}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{language === 'fa' ? 'رزرو حداکثر ۲ روز آینده' : 'Next 2 Days Limit'}</span>
            </span>
          </div>
        </div>

        {/* View Routing */}
        {activeTab === 'pdf' && <MvpPdfDocument />}

        {activeTab === 'login' && <LoginPage />}

        {activeTab === 'customer' && (
          <NearbyBarbers onSelectBarber={(b) => setSelectedBarberForModal(b)} />
        )}

        {activeTab === 'barber' && <BarberDashboard />}

        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Customer Barber Detail & Booking Modal */}
      {selectedBarberForModal && (
        <BarberProfileModal
          barber={selectedBarberForModal}
          onClose={() => setSelectedBarberForModal(null)}
        />
      )}

      {/* Customer Profile & Favorites Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSelectBarber={(b) => {
          setIsProfileModalOpen(false);
          setSelectedBarberForModal(b);
        }}
      />

      {/* Global Notification Toast Container (Reservation Confirmation & 15m Expiration) */}
      <ToastContainer />

      {/* Mobile Sticky Bottom Navigation Bar with Blue Bottoms theme */}
      <nav
        aria-label="Mobile navigation"
        className={`no-print md:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-md px-1 py-1.5 flex items-center justify-around text-[10px] transition-colors ${
          theme === 'light'
            ? 'bg-white/95 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
            : 'bg-[#0d121c]/95 border-slate-800'
        }`}
      >
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'pdf'
              ? (theme === 'light' ? 'text-blue-600 font-bold scale-105' : 'text-amber-400 font-bold')
              : (theme === 'light' ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-slate-200')
          }`}
        >
          <FileText className="h-4 w-4 mb-0.5" />
          <span>{language === 'fa' ? 'سند فنی' : 'Specs'}</span>
        </button>
        <button
          onClick={() => setActiveTab('login')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'login'
              ? (theme === 'light' ? 'text-blue-600 font-bold scale-105' : 'text-amber-400 font-bold')
              : (theme === 'light' ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-slate-200')
          }`}
        >
          <LogIn className="h-4 w-4 mb-0.5" />
          <span>{language === 'fa' ? 'ورود' : 'Login'}</span>
        </button>
        <button
          onClick={() => setActiveTab('customer')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'customer'
              ? (theme === 'light' ? 'text-blue-600 font-bold scale-105' : 'text-amber-400 font-bold')
              : (theme === 'light' ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-slate-200')
          }`}
        >
          <Users className="h-4 w-4 mb-0.5" />
          <span>{language === 'fa' ? 'مشتری' : 'Customer'}</span>
        </button>
        <button
          onClick={() => {
            if (currentUser.role !== 'barber') switchUserRole('barber');
            setActiveTab('barber');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'barber'
              ? (theme === 'light' ? 'text-blue-600 font-bold scale-105' : 'text-amber-400 font-bold')
              : (theme === 'light' ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-slate-200')
          }`}
        >
          <Calendar className="h-4 w-4 mb-0.5" />
          <span>{language === 'fa' ? 'آرایشگر' : 'Barber'}</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'architecture'
              ? (theme === 'light' ? 'text-blue-600 font-bold scale-105' : 'text-amber-400 font-bold')
              : (theme === 'light' ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-slate-200')
          }`}
        >
          <Terminal className="h-4 w-4 mb-0.5" />
          <span>{language === 'fa' ? 'معماری' : 'Arch'}</span>
        </button>
      </nav>

      {/* Quiet Footer */}
      <footer className="no-print border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#080c13] py-5 sm:py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-blue-600 dark:text-amber-400/80 shrink-0" />
            <span className="font-bold text-slate-700 dark:text-slate-400">Gheychi (قیچی)</span>
            <span>— {t.appTagline}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-slate-500 text-[11px]">
            <span>Golang & PostgreSQL</span>
            <span>·</span>
            <span>Redis 15-Minute Lock</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('pdf')}
              className="text-blue-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
            >
              دریافت فایل سند PDF معرفی
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
