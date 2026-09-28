import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { toPersianDigits } from '../utils/i18n';
import { DataSyncModal } from './common/DataSyncModal';
import {
  Scissors,
  Code2,
  Globe,
  Menu,
  X,
  User,
  Sun,
  Moon,
  LogIn,
  FileText,
  Heart,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    activeTab,
    setActiveTab,
    favoriteBarberIds,
    setIsProfileModalOpen,
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    t,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDataSyncModalOpen, setIsDataSyncModalOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setActiveTab('customer');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-amber-500/10 border border-blue-500/30 dark:border-amber-500/30 text-blue-600 dark:text-amber-400 shrink-0 shadow-inner">
              <Scissors className="h-5 w-5 rotate-45" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                {language === 'fa' ? 'قیچی' : 'Gheychi'}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-amber-400/90 font-mono">
                {language === 'fa' ? 'Gheychi' : 'قیچی'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pdf'
                ? 'text-blue-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{language === 'fa' ? 'سند معماری پلتفرم' : 'Platform Specs'}</span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'login'
                ? 'text-blue-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>{language === 'fa' ? 'ورود' : 'Sign In'}</span>
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'customer'
                ? 'text-blue-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {t.customerPortalTab}
          </button>
          <button
            onClick={() => {
              if (currentUser.role !== 'barber') switchUserRole('barber');
              setActiveTab('barber');
            }}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'barber'
                ? 'text-blue-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {t.barberDashboardTab}
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture'
                ? 'text-blue-600 dark:text-amber-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Code2 className="h-4 w-4" />
            {t.architectureTab}
          </button>
        </nav>

        {/* Zone 3: Actions, Data Sync, Login Button, Theme Switcher & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Customer Favorites & Profile Button */}
          {currentUser.role === 'customer' && (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              title={language === 'fa' ? 'علاقه‌مندی‌های من در پروفایل' : 'My Favorites & Profile'}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 min-h-[38px] text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all shadow-sm cursor-pointer"
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span className="hidden sm:inline">{language === 'fa' ? 'علاقه‌مندی‌ها' : 'Favorites'}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 font-bold">
                {language === 'fa' ? toPersianDigits(favoriteBarberIds.length) : favoriteBarberIds.length}
              </span>
            </button>
          )}

          {/* Database Backup & Sync Button */}
          <button
            onClick={() => setIsDataSyncModalOpen(true)}
            title={language === 'fa' ? 'پشتیبان‌گیری پایگاه‌داده و مدیریت داده‌ها (JSON)' : 'Database Sync & JSON Backup'}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-2.5 py-1.5 min-h-[38px] text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
          >
            <Database className="h-4 w-4 text-blue-600 dark:text-amber-400" />
            <span className="hidden xl:inline">{language === 'fa' ? 'پایگاه‌داده' : 'Data'}</span>
          </button>

          {/* Platform Specs Whitepaper Button */}
          <button
            onClick={() => setActiveTab('pdf')}
            title={language === 'fa' ? 'مشاهده و چاپ سند معماری و مشخصات فنی پلتفرم' : 'View & Print Platform Architecture Specs'}
            className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 min-h-[38px] text-xs font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'pdf'
                ? 'border-blue-600 bg-blue-600 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                : 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 hover:border-blue-300'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{language === 'fa' ? 'سند معماری' : 'Specs'}</span>
          </button>

          {/* Quick Login Button */}
          <button
            onClick={() => setActiveTab('login')}
            className={`hidden lg:flex items-center gap-1.5 rounded-xl border px-3 py-1.5 min-h-[38px] text-xs font-bold transition-all shadow-sm cursor-pointer ${
              activeTab === 'login'
                ? 'border-blue-600 bg-blue-600 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-slate-950'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>{language === 'fa' ? 'ورود' : 'Sign In'}</span>
          </button>

          {/* Theme Toggle Button (Light Mode with White Theme & Blue Buttons) */}
          <button
            onClick={toggleTheme}
            title={
              theme === 'light'
                ? (language === 'fa' ? 'تغییر به حالت تاریک' : 'Switch to Dark Mode')
                : (language === 'fa' ? 'تغییر به حالت روشن (پوسته سفید و دکمه‌های آبی)' : 'Switch to Light Mode (White & Blue)')
            }
            aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-2.5 py-1.5 min-h-[38px] text-xs font-semibold text-slate-800 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-blue-600" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {theme === 'light'
                ? (language === 'fa' ? 'تاریک' : 'Dark')
                : (language === 'fa' ? 'روشن' : 'Light')}
            </span>
          </button>

          {/* Language Switcher Toggle Button */}
          <button
            onClick={toggleLanguage}
            title={language === 'fa' ? 'Switch to English (LTR)' : 'تغییر به زبان فارسی (RTL)'}
            aria-label={language === 'fa' ? 'Switch to English' : 'تغییر به زبان فارسی'}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 px-2.5 py-1.5 min-h-[38px] text-xs font-bold text-slate-800 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
          >
            <Globe className="h-4 w-4 text-blue-600 dark:text-amber-400" />
            <span>{language === 'fa' ? 'EN' : 'فا'}</span>
          </button>

          {/* Desktop Role Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs font-medium">
            <button
              onClick={() => switchUserRole('customer')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentUser.role === 'customer'
                  ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {t.customerMode}
            </button>
            <button
              onClick={() => switchUserRole('barber')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentUser.role === 'barber'
                  ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {t.barberMode}
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center min-w-[38px] min-h-[38px] rounded-xl border border-slate-300 dark:border-slate-700/60 p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121c] px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Quick PDF Document Button */}
          <button
            onClick={() => {
              setActiveTab('pdf');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 py-3 min-h-[46px] text-xs font-bold shadow-md cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>{language === 'fa' ? 'مشاهده و چاپ فایل PDF معرفی MVP' : 'Open & Print MVP PDF Document'}</span>
          </button>

          {/* Customer Favorites in Mobile Drawer */}
          {currentUser.role === 'customer' && (
            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 p-3 min-h-[44px] text-xs font-bold shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                <span>{language === 'fa' ? 'بخش «علاقه‌مندی‌های من» در پروفایل' : 'My Favorites in Profile'}</span>
              </div>
              <span className="font-mono px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-xs">
                {language === 'fa' ? toPersianDigits(favoriteBarberIds.length) : favoriteBarberIds.length}
              </span>
            </button>
          )}

          {/* Quick Login Page Button in Mobile Drawer */}
          <button
            onClick={() => {
              setActiveTab('login');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 min-h-[44px] text-xs font-bold shadow-sm cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>{language === 'fa' ? 'ورود به سامانه (ورود آرایشگر / ورود مشتری)' : 'Sign In Page'}</span>
          </button>

          {/* Role selector in mobile */}
          <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-1 text-xs">
            <button
              onClick={() => {
                switchUserRole('customer');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 text-center rounded-lg font-bold transition-colors cursor-pointer ${
                currentUser.role === 'customer'
                  ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.customerMode}
            </button>
            <button
              onClick={() => {
                switchUserRole('barber');
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 text-center rounded-lg font-bold transition-colors cursor-pointer ${
                currentUser.role === 'barber'
                  ? 'bg-blue-600 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.barberMode}
            </button>
          </div>

          {/* Navigation links in mobile */}
          <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            <button
              onClick={() => {
                setActiveTab('customer');
                setMobileMenuOpen(false);
              }}
              className={`text-start px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-blue-600/10 text-blue-600 dark:bg-amber-500/10 dark:text-amber-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.customerPortalTab} — {t.customerPortalDesc}
            </button>
            <button
              onClick={() => {
                if (currentUser.role !== 'barber') switchUserRole('barber');
                setActiveTab('barber');
                setMobileMenuOpen(false);
              }}
              className={`text-start px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'barber'
                  ? 'bg-blue-600/10 text-blue-600 dark:bg-amber-500/10 dark:text-amber-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.barberDashboardTab} — {t.barberDashboardDesc}
            </button>
            <button
              onClick={() => {
                setActiveTab('architecture');
                setMobileMenuOpen(false);
              }}
              className={`text-start px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-blue-600/10 text-blue-600 dark:bg-amber-500/10 dark:text-amber-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {t.architectureTab}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-blue-600 dark:text-amber-400" />
              <span className="font-medium text-slate-800 dark:text-slate-300">{currentUser.fullName}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="text-blue-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                {theme === 'light' ? t.darkMode : t.lightMode}
              </button>
              <span className="text-slate-400 dark:text-slate-600">·</span>
              <button
                onClick={toggleLanguage}
                className="text-blue-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                {language === 'fa' ? 'English (LTR)' : 'فارسی (RTL)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Synchronization & JSON Backup Modal */}
      <DataSyncModal
        isOpen={isDataSyncModalOpen}
        onClose={() => setIsDataSyncModalOpen(false)}
      />
    </header>
  );
};
