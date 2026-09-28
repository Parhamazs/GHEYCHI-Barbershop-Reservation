import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Scissors, User, ShieldCheck, Clock, CheckCircle2, ArrowRight, ArrowLeft, Phone, Sparkles } from 'lucide-react';
import { toPersianDigits } from '../../utils/i18n';

export const LoginPage: React.FC = () => {
  const {
    loginUser,
    currentUser,
    isLoggedIn,
    logoutUser,
    activeTab,
    setActiveTab,
    theme,
    language,
    direction,
    t,
  } = useApp();

  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const handleBarberLogin = () => {
    loginUser('barber', phoneInput, nameInput);
  };

  const handleCustomerLogin = () => {
    loginUser('customer', phoneInput, nameInput);
  };

  return (
    <div className="mx-auto max-w-3xl py-4 sm:py-8 px-2 sm:px-4">
      {/* Brand Header */}
      <div className="text-center space-y-3 mb-6 sm:mb-8">
        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-blue-600/10 dark:bg-amber-500/10 border border-blue-500/30 dark:border-amber-500/30 text-blue-600 dark:text-amber-400 shadow-lg shadow-blue-500/10 dark:shadow-amber-500/10">
          <Scissors className="h-8 w-8 sm:h-10 sm:w-10 rotate-45" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.loginTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            {t.loginSubtitle}
          </p>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] p-5 sm:p-8 md:p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/40 space-y-6">
        {/* Optional Custom Phone Number Input */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Phone className="h-4 w-4 text-blue-600 dark:text-amber-400" />
            <span>{t.phoneInputLabel}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="tel"
              dir="ltr"
              placeholder={language === 'fa' ? '۰۹۱۲۳۴۵۶۷۸۹' : '09121234567'}
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-amber-500/40"
            />
            <input
              type="text"
              placeholder={language === 'fa' ? 'نام و نام‌خانوادگی (اختیاری)' : 'Your Name (Optional)'}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full min-h-[46px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-amber-500/40"
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {language === 'fa'
              ? 'در صورت خالی گذاشتن فیلدهای بالا، مستقیماً با حساب‌های پیش‌فرض دمو وارد سامانه خواهید شد.'
              : 'If left empty, you will instantly log in with pre-configured demo credentials.'}
          </p>
        </div>

        {/* =========================================================================
            THE TWO PRIMARY CLICKABLE BUTTONS (ورود آرایشگر & ورود مشتری)
            ========================================================================= */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-amber-400" />
            <span>{language === 'fa' ? 'انتخاب نوع حساب و ورود سریع:' : 'Select Account Type & Log In:'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* BUTTON 1: ورود آرایشگر (Barber Login) */}
            <button
              type="button"
              onClick={handleBarberLogin}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-blue-600 bg-blue-600 dark:border-amber-500 dark:bg-amber-500 p-5 sm:p-6 text-white text-start transition-all hover:bg-blue-700 dark:hover:bg-amber-400 active:scale-[0.98] shadow-lg shadow-blue-600/25 dark:shadow-amber-500/20 touch-manipulation cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                    <Scissors className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
                    {language === 'fa' ? 'پنل آرایشگر' : 'Barber Portal'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    {t.loginBarberBtn}
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed mt-1 font-medium">
                    {t.loginBarberDesc}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                <span>{language === 'fa' ? 'کاوه رادمنش (استودیو قیچی)' : 'Kaveh Radmanesh (Gheychi)'}</span>
                {direction === 'rtl' ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </div>
            </button>

            {/* BUTTON 2: ورود مشتری (Customer Login) */}
            <button
              type="button"
              onClick={handleCustomerLogin}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-blue-700 bg-blue-700 dark:border-slate-700 dark:bg-slate-800 p-5 sm:p-6 text-white text-start transition-all hover:bg-blue-800 dark:hover:bg-slate-700 active:scale-[0.98] shadow-lg shadow-blue-700/20 dark:shadow-black/20 touch-manipulation cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-inner">
                    <User className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
                    {language === 'fa' ? 'پورتال رزرو' : 'Customer Portal'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    {t.loginCustomerBtn}
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed mt-1 font-medium">
                    {t.loginCustomerDesc}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
                <span>{language === 'fa' ? 'آرش داوودی (مشتری آنلاین)' : 'Arash Davoudi (Online Client)'}</span>
                {direction === 'rtl' ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Current Signed-In Status (if applicable) */}
        {isLoggedIn && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-600 dark:text-slate-400 block">{t.currentUserStatus}:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentUser.fullName} ({currentUser.role === 'barber' ? (language === 'fa' ? 'آرایشگر' : 'Barber') : (language === 'fa' ? 'مشتری' : 'Customer')})
                </span>
                <span className="text-slate-500 font-mono text-[11px] ms-2" dir="ltr">{currentUser.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab(currentUser.role === 'barber' ? 'barber' : 'customer')}
                className="px-3.5 py-2 min-h-[40px] rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer"
              >
                {language === 'fa' ? 'ادامه به پنل' : 'Go to Portal'}
              </button>
              <button
                type="button"
                onClick={logoutUser}
                className="px-3.5 py-2 min-h-[40px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-red-500 hover:border-red-500/40 active:scale-95 transition-all cursor-pointer"
              >
                {language === 'fa' ? 'خروج از حساب' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}

        {/* Security & System Architecture Guarantees */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2.5">
            <Clock className="h-4 w-4 text-blue-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {language === 'fa' ? 'قفل موقت ۱۵ دقیقه‌ای ردیس (Redis)' : '15-Minute Redis Lock'}
              </p>
              <p className="text-[11px] leading-relaxed">
                {language === 'fa'
                  ? 'جلوگیری از تداخل همزمان رزروها و تضمین فرصت پرداخت امن'
                  : 'Concurrency control preventing double-booking during checkout'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {language === 'fa' ? 'محدودیت رزرو ۲ روز آینده' : 'Strict 2-Day Horizon'}
              </p>
              <p className="text-[11px] leading-relaxed">
                {language === 'fa'
                  ? 'کاهش نرخ لغو نوبت و حداکثر بهره‌وری صندلی‌های سالن'
                  : 'Reduces no-shows and maximizes salon chair utilization'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
