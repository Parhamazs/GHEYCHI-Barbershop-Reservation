import React, { useRef } from 'react';
import { Appointment, BarberProfile } from '../../types';
import { useApp } from '../../store/AppContext';
import {
  toPersianDigits,
  formatPrice,
  getShopName,
  getBarberName,
  getAddress,
} from '../../utils/i18n';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Scissors,
  MapPin,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface BookingReceiptModalProps {
  appointment: Appointment | null;
  barber: BarberProfile | null;
  onClose: () => void;
}

export const BookingReceiptModal: React.FC<BookingReceiptModalProps> = ({
  appointment,
  barber,
  onClose,
}) => {
  const { language, t } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!appointment || !barber) return null;

  const trackingCode = `GH-${appointment.id.replace(/[^0-9]/g, '').slice(-6) || '849201'}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = language === 'fa'
      ? `بلیت نوبت قیچی:\nسالن: ${getShopName(barber, 'fa')}\nتاریخ: ${appointment.slotDate}\nساعت: ${appointment.startTime} الی ${appointment.endTime}\nکد پیگیری: ${trackingCode}\nآدرس: ${getAddress(barber, 'fa')}`
      : `Gheychi Booking Ticket:\nSalon: ${barber.shopName}\nDate: ${appointment.slotDate}\nTime: ${appointment.startTime} - ${appointment.endTime}\nTracking Code: ${trackingCode}\nAddress: ${barber.address}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg my-auto overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111622] text-slate-900 dark:text-slate-100 shadow-2xl">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-xs sm:text-sm font-bold">
              {language === 'fa' ? 'رسید دیجیتال و فاکتور نوبت' : 'Digital Receipt & Ticket'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title={language === 'fa' ? 'چاپ یا ذخیره PDF' : 'Print or Save PDF'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-blue-600 dark:text-amber-400" />
              <span className="hidden sm:inline">{language === 'fa' ? 'چاپ / PDF' : 'Print'}</span>
            </button>

            <button
              onClick={handleShare}
              title={language === 'fa' ? 'اشتراک‌گذاری اطلاعات نوبت' : 'Share booking ticket'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-blue-600 dark:text-amber-400" />
              <span className="hidden sm:inline">
                {copied
                  ? (language === 'fa' ? 'کپی شد!' : 'Copied!')
                  : (language === 'fa' ? 'اشتراک' : 'Share')}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="booking-receipt-print-area" className="p-6 sm:p-8 space-y-6">
          {/* Header Branding */}
          <div className="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 dark:border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-amber-500/10 border border-blue-500/30 dark:border-amber-500/30 text-blue-600 dark:text-amber-400 shrink-0">
                  <Scissors className="h-4 w-4 rotate-45" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  {getShopName(barber, language)}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'fa' ? 'پلتفرم هوشمند نوبت‌دهی پیرایش قیچی' : 'Gheychi Barbershop Booking Network'}
              </p>
            </div>

            <div className="text-end">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>{language === 'fa' ? 'نوبت تأیید شده' : 'Confirmed'}</span>
              </span>
              <p className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {language === 'fa' ? toPersianDigits(trackingCode) : trackingCode}
              </p>
            </div>
          </div>

          {/* Appointment Essential Details Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 sm:p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-amber-400" />
                <span>{language === 'fa' ? 'تاریخ مراجعه:' : 'Appointment Date:'}</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm font-mono">
                {language === 'fa' ? toPersianDigits(appointment.slotDate) : appointment.slotDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-600 dark:text-amber-400" />
                <span>{language === 'fa' ? 'ساعت نوبت:' : 'Slot Time:'}</span>
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-amber-400 text-sm" dir="ltr">
                {language === 'fa' ? toPersianDigits(appointment.startTime) : appointment.startTime} -{' '}
                {language === 'fa' ? toPersianDigits(appointment.endTime) : appointment.endTime}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Scissors className="h-4 w-4 text-blue-600 dark:text-amber-400" />
                <span>{language === 'fa' ? 'آرایشگر اختصاصی:' : 'Master Barber:'}</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {getBarberName(barber, language)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-start justify-between gap-3">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-amber-400" />
                <span>{language === 'fa' ? 'نشانی سالن:' : 'Address:'}</span>
              </span>
              <span className="text-end text-slate-700 dark:text-slate-300 font-medium">
                {getAddress(barber, language)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-blue-600 dark:text-amber-400" />
                <span>{language === 'fa' ? 'شماره تماس سالن:' : 'Contact Phone:'}</span>
              </span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-300" dir="ltr">
                {barber.phoneNumber}
              </span>
            </div>
          </div>

          {/* Pricing & Financial Summary */}
          <div className="space-y-2 border-t border-b border-dashed border-slate-200 dark:border-slate-800 py-4 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{language === 'fa' ? 'هزینه خدمات اصلاح و پیرایش' : 'Grooming & Styling Service Fee'}</span>
              <span className="font-mono font-semibold">
                {formatPrice(appointment.price, language)}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>{language === 'fa' ? 'مالیات بر ارزش افزوده و کارمزد پلتفرم' : 'VAT & Platform Service Charge'}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {language === 'fa' ? '۰ تومان (رایگان)' : '0 Toman (Free)'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
              <span>{language === 'fa' ? 'مبلغ کل پرداخت شده:' : 'Total Amount Paid:'}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {formatPrice(appointment.price, language)}
              </span>
            </div>
          </div>

          {/* Verification QR Code & Policy Notice */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* SVG QR Code Simulation */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-300 dark:border-slate-700 shadow-sm shrink-0">
              <svg className="h-20 w-20" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                {/* QR Corners */}
                <rect x="10" y="10" width="25" height="25" fill="#0b0f17" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#0b0f17" />

                <rect x="65" y="10" width="25" height="25" fill="#0b0f17" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#0b0f17" />

                <rect x="10" y="65" width="25" height="25" fill="#0b0f17" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#0b0f17" />

                {/* QR Data Pattern */}
                <rect x="42" y="12" width="6" height="6" fill="#0b0f17" />
                <rect x="52" y="12" width="6" height="6" fill="#0b0f17" />
                <rect x="42" y="24" width="6" height="12" fill="#0b0f17" />
                <rect x="52" y="28" width="6" height="8" fill="#0b0f17" />
                <rect x="12" y="44" width="8" height="6" fill="#0b0f17" />
                <rect x="28" y="44" width="6" height="6" fill="#0b0f17" />
                <rect x="42" y="42" width="16" height="16" fill="#0b0f17" />
                <rect x="46" y="46" width="8" height="8" fill="#f59e0b" />
                <rect x="66" y="44" width="8" height="6" fill="#0b0f17" />
                <rect x="80" y="44" width="8" height="8" fill="#0b0f17" />
                <rect x="42" y="66" width="6" height="12" fill="#0b0f17" />
                <rect x="54" y="66" width="8" height="6" fill="#0b0f17" />
                <rect x="66" y="66" width="6" height="8" fill="#0b0f17" />
                <rect x="78" y="70" width="10" height="10" fill="#0b0f17" />
                <rect x="54" y="80" width="8" height="8" fill="#0b0f17" />
              </svg>
              <span className="font-mono text-[9px] text-slate-600 mt-1 font-bold">
                {trackingCode}
              </span>
            </div>

            <div className="text-xs space-y-1 text-center sm:text-start">
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {language === 'fa' ? 'بارکد احراز هویت و ورود به سالن' : 'Check-in & Verification QR'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'هنگام مراجعه به آرایشگاه، این بارکد یا کد پیگیری را به پذیرش سالن ارائه نمایید. امکان لغو نوبت تا ۲ ساعت پیش از موعد بدون کسر هزینه فراهم است.'
                  : 'Present this QR code or tracking code upon arrival. Free cancellation is permitted up to 2 hours before your scheduled appointment.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="no-print p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            {language === 'fa' ? 'بستن' : 'Close'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold shadow-md hover:bg-blue-700 dark:hover:bg-amber-400 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{language === 'fa' ? 'چاپ فاکتور و ذخیره PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
