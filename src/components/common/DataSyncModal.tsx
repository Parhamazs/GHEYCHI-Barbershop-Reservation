import React, { useRef, useState } from 'react';
import { useApp } from '../../store/AppContext';
import {
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  X,
  Database,
  FileJson,
  ShieldCheck,
} from 'lucide-react';
import { toPersianDigits } from '../../utils/i18n';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    barbers,
    appointments,
    templates,
    reviews,
    favoriteBarberIds,
    language,
    addToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export database state to a JSON file
  const handleExportData = () => {
    const exportPayload = {
      app: 'Gheychi Barbershop Platform',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        barbers,
        appointments,
        templates,
        reviews,
        favoriteBarberIds,
      },
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportPayload, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `gheychi-platform-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast({
      type: 'success',
      title: language === 'fa' ? 'پشتیبان پایگاه‌داده با موفقیت ذخیره شد' : 'Database Backup Exported',
      message: language === 'fa'
        ? 'فایل JSON حاوی تمامی سالن‌ها، نوبت‌ها و قالب‌ها دانلود شد.'
        : 'All salons, slots, and templates exported as JSON file.',
    });
  };

  // 2. Import JSON backup file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.data || !parsed.data.barbers) {
          throw new Error('Invalid Gheychi backup format');
        }

        if (parsed.data.barbers) {
          localStorage.setItem('gheychi_barbers', JSON.stringify(parsed.data.barbers));
        }
        if (parsed.data.appointments) {
          localStorage.setItem('gheychi_appointments', JSON.stringify(parsed.data.appointments));
        }
        if (parsed.data.templates) {
          localStorage.setItem('gheychi_templates', JSON.stringify(parsed.data.templates));
        }
        if (parsed.data.favoriteBarberIds) {
          localStorage.setItem('gheychi_favorite_barbers', JSON.stringify(parsed.data.favoriteBarberIds));
        }

        addToast({
          type: 'success',
          title: language === 'fa' ? 'بازیابی داده‌ها با موفقیت انجام شد' : 'Data Restored Successfully',
          message: language === 'fa'
            ? 'صفحه اکنون جهت بارگذاری داده‌های جدید به‌روزرسانی می‌شود.'
            : 'Reloading to reflect imported state...',
        });

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        setStatusMessage(
          language === 'fa'
            ? 'خطا در خواندن فایل! لطفاً از فایل پشتیبان معتبر JSON سامانه قیچی استفاده فرمایید.'
            : 'Invalid JSON file. Please provide a valid Gheychi backup file.'
        );
      }
    };
    reader.readAsText(file);
  };

  // 3. Reset to Factory Default Seed
  const handleResetFactory = () => {
    if (
      window.confirm(
        language === 'fa'
          ? 'آیا از بازنشانی داده‌ها به حالت پیش‌فرض کارخانه اطمینان دارید؟ تمام تغییرات شخصی بازگردانی خواهند شد.'
          : 'Are you sure you want to reset all data to default factory seed?'
      )
    ) {
      localStorage.removeItem('gheychi_barbers');
      localStorage.removeItem('gheychi_appointments');
      localStorage.removeItem('gheychi_templates');
      localStorage.removeItem('gheychi_favorite_barbers');
      localStorage.removeItem('gheychi_recent_searches');

      addToast({
        type: 'info',
        title: language === 'fa' ? 'داده‌ها به حالت کارخانه بازنشانی شدند' : 'Factory Reset Complete',
        message: language === 'fa' ? 'صفحه در حال بارگذاری مجدد است...' : 'Reloading...',
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-amber-500/10 border border-blue-500/30 dark:border-amber-500/30 text-blue-600 dark:text-amber-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {language === 'fa' ? 'مدیریت داده‌ها و همگام‌سازی پایگاه‌داده' : 'Data Management & Sync'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'fa' ? 'پشتیبان‌گیری JSON و انتقال بین محیط‌ها' : 'Export & Import Local JSON State'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {statusMessage && (
            <div className="p-3 rounded-xl border border-red-500/40 bg-red-950/30 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileJson className="h-4 w-4 text-blue-600 dark:text-amber-400" />
                <span>{language === 'fa' ? 'خروجی کامل پایگاه‌داده (JSON)' : 'Export Full State (JSON)'}</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {language === 'fa' ? toPersianDigits(barbers.length) : barbers.length} {language === 'fa' ? 'سالن' : 'salons'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'fa'
                ? 'تمامی اطلاعات سالن‌ها، نوبت‌های رزرو، قالب‌های روزانه و علاقه‌مندی‌ها را در قالب یک فایل استاندارد ذخیره کنید.'
                : 'Download all active profiles, slots, reviews, and templates as a portable JSON backup file.'}
            </p>
            <button
              onClick={handleExportData}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 py-2.5 font-bold shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>{language === 'fa' ? 'دانلود فایل پشتیبان JSON' : 'Download Backup File'}</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'fa' ? 'بازیابی و ورود اطلاعات از فایل JSON' : 'Restore from JSON File'}</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'fa'
                ? 'فایل پشتیبان از پیش دانلود شده را انتخاب کنید تا وضعیت سیستم به همان نسخه بازگردانده شود.'
                : 'Select an existing Gheychi JSON backup file to restore full salon state.'}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>{language === 'fa' ? 'انتخاب فایل JSON پشتیبان' : 'Select Backup JSON File'}</span>
            </button>
          </div>

          {/* Reset Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {language === 'fa' ? 'بازنشانی به داده‌های اولیه کارخانه' : 'Factory Reset'}
              </p>
              <p className="text-[10px] text-slate-400">
                {language === 'fa' ? 'بازگشت به آرایشگاه‌های پیش‌فرض تهران' : 'Reset to default initial seed'}
              </p>
            </div>
            <button
              onClick={handleResetFactory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{language === 'fa' ? 'بازنشانی' : 'Reset'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
