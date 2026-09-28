import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Appointment, BarberProfile } from '../../types';
import {
  toPersianDigits,
  formatPrice,
  getBarberName,
  getShopName,
  getAppointmentServiceName,
} from '../../utils/i18n';
import { Clock, CheckCircle2, X, AlertTriangle, CreditCard, Lock } from 'lucide-react';

interface PaymentDrawerProps {
  barber: BarberProfile;
  slot: Appointment;
  onClose: () => void;
}

export const PaymentDrawer: React.FC<PaymentDrawerProps> = ({ barber, slot, onClose }) => {
  const {
    lockRemainingSeconds,
    confirmPaymentForSlot,
    cancelSlotLock,
    simulateLockTimeout,
    language,
    t,
  } = useApp();

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return language === 'fa' ? toPersianDigits(formatted) : formatted;
  };

  const handlePay = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      const res = confirmPaymentForSlot(slot.id);
      setPaymentProcessing(false);
      if (res.success) {
        setSuccessMessage(
          language === 'fa'
            ? 'پرداخت آنلاین با موفقیت انجام شد! نوبت شما قطعی و ثبت گردید.'
            : 'Payment successful! Your appointment is confirmed.'
        );
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    }, 800);
  };

  const handleSimulateExpiry = () => {
    simulateLockTimeout(slot.id);
    onClose();
  };

  const handleCancel = () => {
    cancelSlotLock(slot.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl border border-slate-700 bg-[#111622] p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                {language === 'fa' ? 'قفل موقت نوبت در سامانه' : 'Temporary Slot Reservation Hold'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {language === 'fa' ? 'قفل توزیع‌شده ردیس (مهلت ۱۵ دقیقه)' : 'Redis Distributed Lock (15 min TTL)'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 15-Minute Countdown Indicator */}
        <div className="mt-4 sm:mt-5 rounded-lg border border-amber-500/30 bg-amber-950/20 p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="h-4 w-4 animate-pulse shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">{t.holdingWindow}</span>
            </div>
            <div className="font-mono text-2xl font-bold tracking-wider text-amber-300 tabular-nums">
              {formatTimer(lockRemainingSeconds)}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {t.holdingNotice}
          </p>
        </div>

        {/* Booking Details */}
        <div className="mt-4 sm:mt-5 space-y-2.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3.5 sm:p-4 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">{t.shopNameLabel}</span>
            <span className="font-medium text-white">{getShopName(barber, language)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">{t.barberNameLabel}</span>
            <span className="font-medium text-white">{getBarberName(barber, language)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">{language === 'fa' ? 'تاریخ و زمان نوبت' : 'Date & Time'}</span>
            <span className="font-medium text-amber-300 font-mono" dir="ltr">
              {language === 'fa' ? toPersianDigits(slot.slotDate) : slot.slotDate} ·{' '}
              {language === 'fa' ? toPersianDigits(slot.startTime) : slot.startTime} -{' '}
              {language === 'fa' ? toPersianDigits(slot.endTime) : slot.endTime}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">{language === 'fa' ? 'نوع خدمت' : 'Service'}</span>
            <span className="font-medium text-white">{getAppointmentServiceName(slot, language)}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-semibold">
            <span className="text-slate-300">{t.totalDue}</span>
            <span className="text-emerald-400 font-mono">
              {formatPrice(slot.price, language)}
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 sm:mt-6 space-y-2.5">
          <button
            onClick={handlePay}
            disabled={paymentProcessing || lockRemainingSeconds <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            <CreditCard className="h-4 w-4" />
            {paymentProcessing
              ? (language === 'fa' ? 'در حال ثبت تراکنش بانکی...' : 'Processing Transaction...')
              : `${t.confirmAndPay} (${formatPrice(slot.price, language)})`}
          </button>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleCancel}
              className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-center"
            >
              {t.cancelHold}
            </button>
            <button
              onClick={handleSimulateExpiry}
              title="Test the 15-minute Redis expiration behavior and red warning"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/40 px-2 sm:px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-900/40 transition-colors text-center"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{t.simulateExpiry}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
