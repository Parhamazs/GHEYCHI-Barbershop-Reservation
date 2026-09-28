import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { BarberProfile, Appointment } from '../../types';
import { getRelativeDateString } from '../../mockData';
import {
  toPersianDigits,
  formatPrice,
  getBarberName,
  getShopName,
  getAddress,
  getImageCaption,
  getAppointmentServiceName,
  getReviewCustomer,
  getReviewComment,
  getReviewCreatedAt,
} from '../../utils/i18n';
import { PaymentDrawer } from './PaymentDrawer';
import { AddReviewModal } from './AddReviewModal';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Star,
  Scissors,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Heart,
} from 'lucide-react';

interface BarberProfileModalProps {
  barber: BarberProfile;
  onClose: () => void;
}

export const BarberProfileModal: React.FC<BarberProfileModalProps> = ({ barber, onClose }) => {
  const {
    appointments,
    reviews,
    addReview,
    holdSlotForPayment,
    activeLockedSlot,
    expiredWarningMessage,
    clearExpiredWarning,
    toggleFavoriteBarber,
    isBarberFavorite,
    language,
    t,
  } = useApp();

  const todayStr = getRelativeDateString(0);
  const tomorrowStr = getRelativeDateString(1);

  // Tab for 2-day constraint: Today or Tomorrow
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Active slot for payment drawer
  const [slotToPay, setSlotToPay] = useState<Appointment | null>(null);

  // Gallery image lightbox
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState<boolean>(false);

  // Filter appointments for this barber and selected date
  const daySlots = appointments.filter(
    (a) => a.barberProfileId === barber.id && a.slotDate === selectedDate
  );

  // Reviews sorting state: 'newest' | 'highest_rated'
  const [reviewSort, setReviewSort] = useState<'newest' | 'highest_rated'>('newest');

  // Filter reviews for this barber and sort accordingly
  const barberReviews = reviews.filter((r) => r.barberProfileId === barber.id);

  const parseApproximateTimestamp = (r: typeof barberReviews[0]): number => {
    if (r.timestamp) return r.timestamp;
    if (r.createdAt.includes('Just now') || r.createdAt.includes('همین الان')) return Date.now();
    if (r.createdAt.includes('day') || r.createdAt.includes('روز')) {
      const match = r.createdAt.match(/\d+/);
      const days = match ? parseInt(match[0], 10) : 1;
      return Date.now() - days * 24 * 60 * 60 * 1000;
    }
    if (r.createdAt.includes('week') || r.createdAt.includes('هفته')) {
      const match = r.createdAt.match(/\d+/);
      const weeks = match ? parseInt(match[0], 10) : 1;
      return Date.now() - weeks * 7 * 24 * 60 * 60 * 1000;
    }
    const parsed = Date.parse(r.createdAt);
    return isNaN(parsed) ? 0 : parsed;
  };

  const sortedReviews = [...barberReviews].sort((a, b) => {
    if (reviewSort === 'highest_rated') {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return parseApproximateTimestamp(b) - parseApproximateTimestamp(a);
    }
    return parseApproximateTimestamp(b) - parseApproximateTimestamp(a);
  });

  const handleSlotClick = (slot: Appointment) => {
    if (slot.status === 'reserved_paid') {
      alert(
        language === 'fa'
          ? 'این نوبت قبلاً رزرو و پرداخت آنلاین شده است.'
          : 'This slot is already booked and confirmed.'
      );
      return;
    }
    if (slot.status === 'reserved_manual') {
      alert(
        language === 'fa'
          ? 'این نوبت مستقیماً توسط آرایشگر (تلفنی یا حضوری) رزرو شده است.'
          : 'This slot was reserved directly with the barber (phone or walk-in).'
      );
      return;
    }
    if (slot.status === 'pending_payment') {
      if (activeLockedSlot?.id === slot.id) {
        setSlotToPay(slot);
      } else {
        alert(
          language === 'fa'
            ? 'این نوبت در حال حاضر توسط مشتری دیگری در حال پرداخت است (قفل موقت ۱۵ دقیقه‌ای در ردیس).'
            : 'This slot is currently held by another customer (15-minute payment window in Redis).'
        );
      }
      return;
    }

    // Attempt to lock slot
    const res = holdSlotForPayment(slot);
    if (!res.success) {
      alert(res.message);
      return;
    }

    // Open payment drawer
    setSlotToPay(slot);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(barber.id, newRating, newComment.trim());
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[96vh] flex flex-col rounded-2xl border border-slate-700 bg-[#0d121c] shadow-2xl text-slate-100 overflow-hidden my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#111622] px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{getShopName(barber, language)}</h2>
              <p className="text-xs text-slate-400">
                {language === 'fa' ? `استاد آرایشگر: ${getBarberName(barber, language)}` : `Master Barber: ${getBarberName(barber, language)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteBarber(barber.id)}
              title={
                isBarberFavorite(barber.id)
                  ? (language === 'fa' ? 'حذف از علاقه‌مندی‌ها' : 'Remove from Favorites')
                  : (language === 'fa' ? 'افزودن به علاقه‌مندی‌های من' : 'Add to My Favorites')
              }
              className={`flex items-center justify-center h-9 w-9 rounded-xl border transition-all cursor-pointer ${
                isBarberFavorite(barber.id)
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-500'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-rose-400'
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isBarberFavorite(barber.id) ? 'fill-rose-500' : ''
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Expired Warning Banner */}
          {expiredWarningMessage && (
            <div className="flex items-center justify-between rounded-xl border border-red-500/40 bg-red-950/60 p-3.5 sm:p-4 text-xs text-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span className="font-semibold text-red-300">{expiredWarningMessage}</span>
              </div>
              <button onClick={clearExpiredWarning} className="underline text-red-300 hover:text-white">
                {t.dismiss}
              </button>
            </div>
          )}

          {/* Gallery Section (Strictly up to 4 images) */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.galleryTitle} ({language === 'fa' ? toPersianDigits(barber.images.length) : barber.images.length}/۴)
              </h3>
              <span className="text-[11px] text-slate-500">{t.clickPhotoToPreview}</span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {barber.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border transition-all ${
                    activeImageIndex === idx
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={getImageCaption(img, language) || `Barbershop photo ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                </button>
              ))}
            </div>

            {/* Active image caption */}
            {barber.images[activeImageIndex] && (
              <p className="text-xs text-slate-400 italic">
                {getImageCaption(barber.images[activeImageIndex], language) || (language === 'fa' ? 'فضای داخلی سالن و صندلی‌ها' : 'Shop interior & styling station')}
              </p>
            )}
          </div>

          {/* Details Overview (Single column on mobile, 3 on tablet/desktop) */}
          <div className="grid grid-cols-1 gap-3.5 rounded-xl border border-slate-800 bg-[#111622] p-4 text-xs sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-slate-500">{t.address}</span>
              <p className="font-medium text-slate-200 flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{getAddress(barber, language)}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500">{t.hoursAndContact}</span>
              <p className="font-medium text-slate-200 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="font-mono" dir="ltr">
                  {language === 'fa' ? toPersianDigits(barber.workingHoursStart) : barber.workingHoursStart} -{' '}
                  {language === 'fa' ? toPersianDigits(barber.workingHoursEnd) : barber.workingHoursEnd}
                </span>
              </p>
              <p className="font-medium text-slate-200 flex items-center gap-1 mt-1">
                <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="font-mono" dir="ltr">{barber.phoneNumber}</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500">{t.pricingAndRating}</span>
              <p className="font-mono text-sm font-semibold text-emerald-400">
                {formatPrice(barber.pricePerSlot, language)}{' '}
                <span className="text-[11px] font-normal text-slate-400">{t.perSlot}</span>
              </p>
              <p className="flex items-center gap-1 font-medium text-slate-200 mt-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>
                  {language === 'fa' ? toPersianDigits(barber.ratingAvg.toFixed(1)) : barber.ratingAvg.toFixed(1)} / ۵.۰{' '}
                  ({language === 'fa' ? toPersianDigits(barber.reviewCount) : barber.reviewCount} نظر)
                </span>
              </p>
            </div>
          </div>

          {/* Graphical Appointment Table for Next 2 Days Only */}
          <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{t.bookAppointmentTitle}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {t.bookAppointmentSubtitle}
                </p>
              </div>

              {/* Day Selector (Next 2 Days Constraint - Responsive fluid pills) */}
              <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs w-full sm:w-auto">
                <button
                  onClick={() => setSelectedDate(todayStr)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-medium transition-colors text-center whitespace-nowrap ${
                    selectedDate === todayStr
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.today} ({language === 'fa' ? toPersianDigits(todayStr) : todayStr})
                </button>
                <button
                  onClick={() => setSelectedDate(tomorrowStr)}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md font-medium transition-colors text-center whitespace-nowrap ${
                    selectedDate === tomorrowStr
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.tomorrow} ({language === 'fa' ? toPersianDigits(tomorrowStr) : tomorrowStr})
                </button>
              </div>
            </div>

            {/* Color Legend (Mandatory Business Rule) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 rounded border border-slate-300 bg-white shrink-0" />
                <span className="text-slate-300">{t.legendAvailable}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 rounded bg-emerald-600 shrink-0" />
                <span className="text-slate-300">{t.legendPaid}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 rounded bg-amber-400 shrink-0" />
                <span className="text-slate-300">{t.legendManual}</span>
              </div>
            </div>

            {/* Appointment Slots Grid */}
            <div className="mt-3">
              {daySlots.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
                  {language === 'fa'
                    ? 'هیچ نوبتی برای این روز تعریف نشده است.'
                    : 'No appointment slots scheduled for this day yet.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 sm:gap-2.5">
                  {daySlots.map((slot) => {
                    let cellClass = '';
                    let label = '';

                    if (slot.status === 'reserved_paid') {
                      cellClass = 'bg-emerald-600 text-white border-emerald-500 cursor-not-allowed';
                      label = t.statusPaid;
                    } else if (slot.status === 'reserved_manual') {
                      cellClass = 'bg-amber-400 text-slate-950 border-amber-300 cursor-not-allowed font-medium';
                      label = t.statusManual;
                    } else if (slot.status === 'pending_payment') {
                      cellClass =
                        'bg-sky-500 text-white border-sky-400 animate-pulse font-medium shadow-md';
                      label = t.statusHolding;
                    } else {
                      cellClass =
                        'bg-white text-slate-900 border-slate-200 hover:bg-slate-100 hover:border-amber-400 shadow-sm cursor-pointer';
                      label = t.statusAvailable;
                    }

                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot)}
                        className={`flex flex-col items-center justify-center rounded-lg border p-2.5 min-h-[56px] text-center transition-all ${cellClass}`}
                      >
                        <span className="font-mono text-xs font-semibold tabular-nums">
                          {language === 'fa'
                            ? `${toPersianDigits(slot.startTime)} - ${toPersianDigits(slot.endTime)}`
                            : `${slot.startTime} - ${slot.endTime}`}
                        </span>
                        <span className="mt-1 text-[10px] font-medium tracking-tight opacity-95">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews & Comment Section */}
          <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  {t.reviewsTitle} ({language === 'fa' ? toPersianDigits(barberReviews.length) : barberReviews.length})
                </span>
              </h3>

              {/* Sorting Filter Controls: 'Newest' or 'Highest Rated' */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <ArrowUpDown className="h-3 w-3 text-slate-500" />
                  {t.sortBy}
                </span>
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setReviewSort('newest')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      reviewSort === 'newest'
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.newest}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewSort('highest_rated')}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      reviewSort === 'highest_rated'
                        ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.highestRated}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddReviewModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Star className="h-3.5 w-3.5 fill-slate-950" />
                  <span>{language === 'fa' ? 'ثبت نظر و امتیاز' : 'Write Review'}</span>
                </button>
              </div>
            </div>

            {/* List Reviews */}
            <div className="space-y-3">
              {sortedReviews.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
                  {t.noReviewsYet}
                </div>
              ) : (
                sortedReviews.map((rev) => (
                  <div key={rev.id} className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{getReviewCustomer(rev, language)}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-slate-300 leading-relaxed">{getReviewComment(rev, language)}</p>
                    <span className="mt-1 block text-[10px] text-slate-500">{getReviewCreatedAt(rev, language)}</span>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleReviewSubmit} className="mt-4 pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300">{t.leaveReview}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{t.ratingLabel}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          star <= newRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                placeholder={t.reviewPlaceholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {reviewSubmitted && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{t.reviewPublished}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!newComment.trim()}
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {t.postReview}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Drawer if active */}
      {slotToPay && (
        <PaymentDrawer
          barber={barber}
          slot={slotToPay}
          onClose={() => setSlotToPay(null)}
        />
      )}

      {/* Add Review Modal */}
      <AddReviewModal
        barber={barber}
        isOpen={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
      />
    </div>
  );
};
