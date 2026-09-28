import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { ToastNotification } from '../types';
import { toPersianDigits, formatPrice } from '../utils/i18n';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Clock,
  Scissors,
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
  language: 'fa' | 'en';
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, language }) => {
  const duration = toast.durationMs ?? 6000;
  const [remainingMs, setRemainingMs] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (duration <= 0 || isPaused) return;

    const intervalTime = 50;
    const interval = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - intervalTime));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, isPaused]);

  useEffect(() => {
    if (duration > 0 && remainingMs <= 0) {
      onDismissRef.current(toast.id);
    }
  }, [remainingMs, duration, toast.id]);

  const progress = duration > 0 ? (remainingMs / duration) * 100 : 0;

  const title = language === 'fa' ? toast.titleFa || toast.title : toast.title;
  const message = language === 'fa' ? toast.messageFa || toast.message : toast.message;
  const actionLabel = language === 'fa' ? toast.actionLabelFa || toast.actionLabel : toast.actionLabel;

  // Visual styles by toast type
  let borderClass = 'border-slate-700 bg-slate-900/95';
  let iconBadgeClass = 'bg-slate-800 text-slate-300';
  let progressBarClass = 'bg-amber-500';
  let IconComponent = Info;

  if (toast.type === 'success') {
    borderClass = 'border-emerald-500/50 bg-[#0e171b]/95 shadow-xl shadow-emerald-950/30';
    iconBadgeClass = 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400';
    progressBarClass = 'bg-emerald-500';
    IconComponent = CheckCircle2;
  } else if (toast.type === 'error') {
    borderClass = 'border-red-500/60 bg-[#190f13]/95 shadow-xl shadow-red-950/40';
    iconBadgeClass = 'bg-red-500/20 border border-red-500/40 text-red-400';
    progressBarClass = 'bg-red-500';
    IconComponent = AlertCircle;
  } else if (toast.type === 'warning') {
    borderClass = 'border-amber-500/60 bg-[#18130e]/95 shadow-xl shadow-amber-950/30';
    iconBadgeClass = 'bg-amber-500/20 border border-amber-500/40 text-amber-400';
    progressBarClass = 'bg-amber-500';
    IconComponent = AlertTriangle;
  }

  return (
    <div
      role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className={`pointer-events-auto relative w-full sm:max-w-md overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out animate-in slide-in-from-bottom-5 sm:slide-in-from-top-3 ${borderClass}`}
    >
      <div className="flex items-start gap-3">
        {/* Leading Icon Badge */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBadgeClass}`}>
          <IconComponent className={`h-5 w-5 ${toast.type === 'error' ? 'animate-pulse' : ''}`} />
        </div>

        {/* Content Body */}
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
              {title}
            </h4>
            <span className="shrink-0 text-[10px] font-mono text-slate-400">
              {language === 'fa' ? 'اکنون' : 'Just now'}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            {message}
          </p>

          {/* Optional Rich Booking Details Pills (For completed reservation) */}
          {toast.details && (
            <div className="mt-3 rounded-xl border border-slate-800 bg-black/40 p-2.5 text-xs space-y-1.5">
              {(toast.details.shopName || toast.details.barberName) && (
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold truncate">
                  <Scissors className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{toast.details.shopName || toast.details.barberName}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 pt-0.5">
                {toast.details.slotTime && (
                  <span className="flex items-center gap-1 font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>
                      {language === 'fa' ? toPersianDigits(toast.details.slotTime) : toast.details.slotTime}
                    </span>
                  </span>
                )}

                {toast.details.price !== undefined && (
                  <span className="flex items-center gap-1 font-mono font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    <CreditCard className="h-3 w-3 shrink-0" />
                    <span>{formatPrice(toast.details.price, language)}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button if specified */}
          {actionLabel && toast.onAction && (
            <div className="mt-3 pt-1">
              <button
                onClick={() => {
                  toast.onAction?.();
                  onDismiss(toast.id);
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span>{actionLabel}</span>
                {language === 'fa' ? (
                  <ChevronLeft className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button with accessible touch target */}
        <button
          onClick={() => onDismiss(toast.id)}
          aria-label={language === 'fa' ? 'بستن پیام' : 'Dismiss notification'}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all touch-manipulation cursor-pointer -me-1 -mt-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Auto-Dismiss Progress Bar */}
      {duration > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
          <div
            className={`h-full transition-all duration-75 ease-linear ${progressBarClass}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, language, direction } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      dir={direction}
      aria-live="polite"
      className="fixed inset-x-3 sm:inset-x-auto sm:end-6 bottom-20 md:bottom-6 z-50 flex flex-col gap-3 pointer-events-none max-w-md w-auto"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
          language={language}
        />
      ))}
    </div>
  );
};
