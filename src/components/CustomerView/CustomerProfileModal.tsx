import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { BarberProfile, Appointment } from '../../types';
import {
  toPersianDigits,
  formatPrice,
  getBarberName,
  getShopName,
  getAddress,
} from '../../utils/i18n';
import { getBarberPriceTier } from './NearbyBarbers';
import { BookingReceiptModal } from './BookingReceiptModal';
import {
  User,
  Heart,
  Calendar,
  MapPin,
  Star,
  Scissors,
  X,
  Phone,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Trash2,
  FileText,
} from 'lucide-react';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBarber: (barber: BarberProfile) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectBarber,
}) => {
  const {
    currentUser,
    barbers,
    favoriteBarberIds,
    toggleFavoriteBarber,
    appointments,
    language,
    direction,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'favorites' | 'bookings'>('favorites');
  const [receiptModalData, setReceiptModalData] = useState<{
    appointment: Appointment;
    barber: BarberProfile;
  } | null>(null);

  if (!isOpen) return null;

  // Filter favorited barbers
  const favoriteBarbers = barbers.filter((b) => favoriteBarberIds.includes(b.id));

  // Customer's booked appointments (pending or confirmed)
  const myBookings = appointments.filter(
    (a) => a.customerName === currentUser.fullName || a.customerPhone === currentUser.phone
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121c] p-5 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col overflow-hidden"
        dir={direction}
      >
        {/* Modal Header & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 dark:bg-amber-500/10 border border-blue-500/30 dark:border-amber-500/30 text-blue-600 dark:text-amber-400 shrink-0 shadow-inner">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {currentUser.fullName}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-amber-500/20 text-blue-700 dark:text-amber-300 border border-blue-300 dark:border-amber-500/30">
                  {language === 'fa' ? 'مشتری طلایی قیچی' : 'Gold Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1 font-mono" dir="ltr">
                  <Phone className="h-3 w-3" />
                  {currentUser.phone}
                </span>
                <span>·</span>
                <span>{language === 'fa' ? 'عضو سامانه از ۱۴۰۴' : 'Member since 2025'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-rose-500 text-white shadow-md'
                : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                activeTab === 'favorites' ? 'fill-white text-white' : 'text-rose-500'
              }`}
            />
            <span>{language === 'fa' ? 'علاقه‌مندی‌های من' : 'My Favorites'}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}
            >
              {language === 'fa' ? toPersianDigits(favoriteBarbers.length) : favoriteBarbers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>{language === 'fa' ? 'نوبت‌های رزرو شده من' : 'My Bookings'}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              }`}
            >
              {language === 'fa' ? toPersianDigits(myBookings.length) : myBookings.length}
            </span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pt-3 pb-2 space-y-3">
          {activeTab === 'favorites' && (
            <>
              {favoriteBarbers.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-400 border border-rose-200 dark:border-rose-900/50 mx-auto">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'fa' ? 'هنوز آرایشگاهی را به علاقه‌مندی‌ها اضافه نکرده‌اید' : 'No Favorite Barbers Yet'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {language === 'fa'
                      ? 'با کلیک روی آیکون قلب در کارت‌های آرایشگاه، می‌توانید آرایشگران مورد علاقه خود را در این بخش ذخیره کنید و در دفعات بعدی سریع‌تر نوبت بگیرید.'
                      : 'Click the heart icon on any barber card to save your favorite shops for quick access and faster booking.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {favoriteBarbers.map((barber) => (
                    <div
                      key={barber.id}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        {/* Salon thumbnail */}
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                          {barber.images.length > 0 ? (
                            <img
                              src={barber.images[0].imageUrl}
                              alt={getShopName(barber, language)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Scissors className="h-6 w-6" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {getShopName(barber, language)}
                            </h4>
                            <button
                              onClick={() => toggleFavoriteBarber(barber.id)}
                              title={language === 'fa' ? 'حذف از علاقه‌مندی‌ها' : 'Remove from Favorites'}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            >
                              <Heart className="h-4 w-4 fill-rose-500" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {getBarberName(barber, language)}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">
                              {language === 'fa'
                                ? toPersianDigits(barber.ratingAvg.toFixed(1))
                                : barber.ratingAvg.toFixed(1)}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
                              {formatPrice(barber.pricePerSlot, language)}
                            </span>
                            {(() => {
                              const tier = getBarberPriceTier(barber.pricePerSlot);
                              if (tier === 'economy') {
                                return (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                    {language === 'fa' ? 'اقتصادی' : 'Economy'}
                                  </span>
                                );
                              } else if (tier === 'standard') {
                                return (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-amber-950 text-blue-700 dark:text-amber-300">
                                    {language === 'fa' ? 'استاندارد' : 'Standard'}
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-0.5">
                                    <Sparkles className="h-2.5 w-2.5 text-purple-500" />
                                    <span>{language === 'fa' ? 'پریمیوم' : 'Premium'}</span>
                                  </span>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                          <MapPin className="h-3 w-3 shrink-0 text-blue-600 dark:text-amber-400" />
                          <span className="truncate">{getAddress(barber, language)}</span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectBarber(barber);
                          }}
                          className="flex items-center gap-1 shrink-0 rounded-xl bg-blue-600 dark:bg-amber-500 hover:bg-blue-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 px-3 py-1.5 text-xs font-bold shadow-sm transition-all cursor-pointer"
                        >
                          <Scissors className="h-3 w-3" />
                          <span>{language === 'fa' ? 'رزرو نوبت' : 'Book'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'bookings' && (
            <>
              {myBookings.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-amber-400 border border-blue-200 dark:border-blue-900 mx-auto">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'fa' ? 'هنوز نوبتی رزرو نکرده‌اید' : 'No Bookings Yet'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {language === 'fa'
                      ? 'شما می‌توانید برای امروز یا فردا از میان آرایشگاه‌های اطراف نوبت مورد نظر خود را رزرو و آنلاین پرداخت نمایید.'
                      : 'You can book available slots for today or tomorrow and pay online with instant confirmation.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.map((booking) => {
                    const shop = barbers.find((b) => b.id === booking.barberProfileId);
                    return (
                      <div
                        key={booking.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {shop ? getShopName(shop, language) : booking.serviceName}
                              </h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                {booking.status === 'reserved_paid'
                                  ? (language === 'fa' ? 'قطعی و پرداخت‌شده' : 'Confirmed & Paid')
                                  : (language === 'fa' ? 'در انتظار پرداخت' : 'Pending')}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {language === 'fa' ? toPersianDigits(booking.slotDate) : booking.slotDate}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {language === 'fa' ? toPersianDigits(booking.startTime) : booking.startTime} -{' '}
                                {language === 'fa' ? toPersianDigits(booking.endTime) : booking.endTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2 shrink-0">
                          <div>
                            <span className="text-[10px] text-slate-400 block">{t.price}</span>
                            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {formatPrice(booking.price, language)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setReceiptModalData({
                                appointment: booking,
                                barber: shop || barbers[0],
                              });
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-blue-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>{language === 'fa' ? 'بلیت و رسید' : 'View Ticket'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            {t.dismiss}
          </button>
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {receiptModalData && (
        <BookingReceiptModal
          appointment={receiptModalData.appointment}
          barber={receiptModalData.barber}
          onClose={() => setReceiptModalData(null)}
        />
      )}
    </div>
  );
};
