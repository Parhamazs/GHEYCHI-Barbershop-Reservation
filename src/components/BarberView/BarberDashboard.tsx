import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Appointment, ScheduleTemplate } from '../../types';
import { getRelativeDateString } from '../../mockData';
import {
  toPersianDigits,
  formatPrice,
  getBarberName,
  getShopName,
  getAddress,
  getImageCaption,
} from '../../utils/i18n';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Save,
  Layers,
  Settings,
  Scissors,
  Check,
  User,
  MapPin,
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  FolderOpen,
  Sparkles,
  Link as LinkIcon,
  X,
  Upload,
  BarChart3,
} from 'lucide-react';
import {
  DashboardScheduleSkeleton,
  TemplateListSkeleton,
  GalleryGridSkeleton,
} from '../common/Skeleton';
import { BarberAnalyticsTab } from './BarberAnalyticsTab';

interface SampleGalleryItem {
  id: string;
  imageUrl: string;
  captionFa: string;
  captionEn: string;
  tagFa: string;
}

const SAMPLE_GALLERY_ITEMS: SampleGalleryItem[] = [
  {
    id: 'sample-1',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    captionFa: 'سالن اصلی پیرایش با صندلی‌های چرم وینتیج',
    captionEn: 'Artisanal hall with hydraulic vintage leather chairs',
    tagFa: 'صندلی پیرایش',
  },
  {
    id: 'sample-2',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
    captionFa: 'قیچی‌کاری حرفه‌ای و ایجاد بافت و حجم طبیعی مو',
    captionEn: 'Precision shear cut and texturizing',
    tagFa: 'قیچی و استایل',
  },
  {
    id: 'sample-3',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80',
    captionFa: 'تجهیزات اصلاح ریش با تیغ سنتی و واکس ارگانیک',
    captionEn: 'Straight razor grooming equipment & organic waxes',
    tagFa: 'اصلاح ریش',
  },
  {
    id: 'sample-4',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80',
    captionFa: 'بار اسپرسو و محیط اختصاصی انتظار مشتریان',
    captionEn: 'Espresso bar and client lounge',
    tagFa: 'محیط انتظار',
  },
  {
    id: 'sample-5',
    imageUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=800&auto=format&fit=crop&q=80',
    captionFa: 'استودیو کلاسیک با آینه‌های قدی و نورپردازی لوکس',
    captionEn: 'Historic salon mirror stations',
    tagFa: 'دکوراسیون',
  },
  {
    id: 'sample-6',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80',
    captionFa: 'اصلاح صورت با فوم گرم و تیغ استیل ایتالیایی',
    captionEn: 'Hot lather treatment and razor work',
    tagFa: 'حوله گرم',
  },
  {
    id: 'sample-7',
    imageUrl: 'https://images.unsplash.com/photo-1534778310322-a9b0d2d3a339?w=800&auto=format&fit=crop&q=80',
    captionFa: 'استودیو مدرن و ترند با نورپردازی متمرکز',
    captionEn: 'Modern studio main floor with focused lighting',
    tagFa: 'مدرن',
  },
  {
    id: 'sample-8',
    imageUrl: 'https://images.unsplash.com/photo-1593702295094-ada7554100c3?w=800&auto=format&fit=crop&q=80',
    captionFa: 'سوئیت اختصاصی VIP پیرایش و پذیرایی',
    captionEn: 'VIP Private Grooming Suite',
    tagFa: 'بخش VIP',
  },
];

export const BarberDashboard: React.FC = () => {
  const {
    currentUser,
    barbers,
    updateBarberProfile,
    addBarberImage,
    deleteBarberImage,
    appointments,
    templates,
    createSlot,
    deleteSlot,
    toggleManualReservation,
    createTemplate,
    applyTemplateToDates,
    language,
    direction,
    t,
  } = useApp();

  const currentBarber = barbers.find((b) => b.userId === currentUser.id) || barbers[0];

  // Active subtab in barber dashboard: 'schedule' | 'templates' | 'analytics' | 'profile' | 'gallery'
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'templates' | 'analytics' | 'profile' | 'gallery'>('schedule');

  // Selected date for graphical schedule
  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDateString(0));

  // Skeleton screen transitions for perceived performance
  const [isDateTransitioning, setIsDateTransitioning] = useState(false);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

  const handleDateChange = (newDate: string) => {
    setIsDateTransitioning(true);
    setSelectedDate(newDate);
    setTimeout(() => {
      setIsDateTransitioning(false);
    }, 220);
  };

  const handleSubTabChange = (tab: 'schedule' | 'templates' | 'analytics' | 'profile' | 'gallery') => {
    if (tab === activeSubTab) return;
    setIsTabTransitioning(true);
    setActiveSubTab(tab);
    setTimeout(() => {
      setIsTabTransitioning(false);
    }, 220);
  };

  // New slot form state
  const [newSlotStart, setNewSlotStart] = useState('12:00');
  const [newSlotEnd, setNewSlotEnd] = useState('12:30');
  const [newSlotPrice, setNewSlotPrice] = useState(currentBarber.pricePerSlot || 400000);

  // Profile edit form state
  const [profileForm, setProfileForm] = useState({
    shopName: currentBarber.shopName,
    barberName: currentBarber.barberName,
    phoneNumber: currentBarber.phoneNumber,
    address: currentBarber.address,
    latitude: currentBarber.latitude,
    longitude: currentBarber.longitude,
    workingHoursStart: currentBarber.workingHoursStart,
    workingHoursEnd: currentBarber.workingHoursEnd,
    bio: currentBarber.bio,
    pricePerSlot: currentBarber.pricePerSlot,
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Gallery upload state & modes
  type GalleryUploadMode = 'device' | 'presets' | 'url';
  const [uploadMode, setUploadMode] = useState<GalleryUploadMode>('device');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [deviceImagePreview, setDeviceImagePreview] = useState<string | null>(null);
  const [deviceImageCaption, setDeviceImageCaption] = useState<string>('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  // Template creation state
  const [newTemplateName, setNewTemplateName] = useState(
    language === 'fa' ? 'شیفت استاندارد روزانه' : 'Custom Daily Shift'
  );
  const [templateInterval, setTemplateInterval] = useState(30); // 30 mins
  const [templateStartHour, setTemplateStartHour] = useState(9);
  const [templateEndHour, setTemplateEndHour] = useState(18);

  // Template apply state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [applyDaysCount, setApplyDaysCount] = useState<number>(7);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);

  // Filter appointments for current barber on selected date
  const dayAppointments = appointments.filter(
    (a) => a.barberProfileId === currentBarber.id && a.slotDate === selectedDate
  );

  // Handle manual reservation toggle
  const handleToggleManual = (slot: Appointment) => {
    let note = '';
    if (slot.status === 'available') {
      const promptText =
        language === 'fa'
          ? 'یادداشت یا نام مشتری رزرو تلفنی / حضوری را وارد کنید:'
          : 'Enter customer note for this phone / walk-in reservation:';
      const defaultText = language === 'fa' ? 'رزرو تلفنی' : 'Phone reservation';
      const input = prompt(promptText, defaultText);
      if (input === null) return; // cancelled
      note = input || defaultText;
    }
    toggleManualReservation(slot.id, note);
  };

  // Add individual slot
  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    createSlot(selectedDate, newSlotStart, newSlotEnd, language === 'fa' ? 'اصلاح مو و پیرایش' : 'Standard Haircut', newSlotPrice);
  };

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBarberProfile({
      shopName: profileForm.shopName,
      barberName: profileForm.barberName,
      phoneNumber: profileForm.phoneNumber,
      address: profileForm.address,
      latitude: Number(profileForm.latitude),
      longitude: Number(profileForm.longitude),
      workingHoursStart: profileForm.workingHoursStart,
      workingHoursEnd: profileForm.workingHoursEnd,
      bio: profileForm.bio,
      pricePerSlot: Number(profileForm.pricePerSlot),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Add gallery image from URL (Max 4 images enforced)
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    setGalleryError(null);
    if (!newImageUrl.trim()) return;

    const res = addBarberImage(
      newImageUrl.trim(),
      newImageCaption.trim() || 'Barbershop Photo',
      newImageCaption.trim() || 'عکس سالن پیرایش'
    );
    if (!res.success) {
      setGalleryError(res.error || (language === 'fa' ? 'افزودن تصویر با شکست مواجه شد' : 'Failed to add image'));
    } else {
      setNewImageUrl('');
      setNewImageCaption('');
    }
  };

  // Add gallery image from Device Photo Library / File picker
  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setGalleryError(
        language === 'fa'
          ? 'لطفاً یک فایل تصویری معتبر (JPG, PNG, WEBP) انتخاب نمایید.'
          : 'Please select a valid image file (JPG, PNG, WEBP).'
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setGalleryError(
        language === 'fa'
          ? 'حجم فایل تصویر نباید بیشتر از ۵ مگابایت باشد.'
          : 'Image size cannot exceed 5MB.'
      );
      return;
    }

    setGalleryError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setDeviceImagePreview(dataUrl);
      if (!deviceImageCaption) {
        setDeviceImageCaption(language === 'fa' ? 'صندلی و دکوراسیون سالن' : 'Salon interior styling');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeviceUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceImagePreview) {
      setGalleryError(
        language === 'fa'
          ? 'لطفاً ابتدا تصویری از گالری دستگاه انتخاب کنید.'
          : 'Please select an image from your device gallery first.'
      );
      return;
    }

    const res = addBarberImage(
      deviceImagePreview,
      deviceImageCaption.trim() || 'Barbershop Photo',
      deviceImageCaption.trim() || 'عکس سالن آرایشگاه'
    );

    if (!res.success) {
      setGalleryError(res.error || (language === 'fa' ? 'افزودن تصویر با شکست مواجه شد' : 'Failed to add image'));
      return;
    }

    setDeviceImagePreview(null);
    setDeviceImageCaption('');
    setGalleryError(null);
  };

  // Add sample photo from curated barbershop showcase
  const handleSelectPresetSample = (sample: SampleGalleryItem) => {
    setGalleryError(null);
    const res = addBarberImage(
      sample.imageUrl,
      sample.captionEn,
      sample.captionFa
    );
    if (!res.success) {
      setGalleryError(res.error || (language === 'fa' ? 'سقف بارگذاری گالری تکمیل است' : 'Failed to add image'));
    }
  };

  // Generate & Save Template
  const handleCreateTemplate = () => {
    const slots: { startTime: string; endTime: string }[] = [];
    for (let h = templateStartHour; h < templateEndHour; h++) {
      const hStr = h.toString().padStart(2, '0');
      if (templateInterval === 30) {
        slots.push({ startTime: `${hStr}:00`, endTime: `${hStr}:30` });
        slots.push({ startTime: `${hStr}:30`, endTime: `${(h + 1).toString().padStart(2, '0')}:00` });
      } else {
        slots.push({ startTime: `${hStr}:00`, endTime: `${(h + 1).toString().padStart(2, '0')}:00` });
      }
    }
    createTemplate(newTemplateName, slots);
    alert(
      language === 'fa'
        ? `الگوی «${newTemplateName}» با ${toPersianDigits(slots.length)} نوبت زمانی ایجاد و ذخیره شد!`
        : `Template "${newTemplateName}" created with ${slots.length} time slots!`
    );
  };

  // Apply template to future dates
  const handleApplyTemplate = () => {
    if (!selectedTemplateId) return;
    setIsApplyingTemplate(true);
    setTimeout(() => {
      const dates: string[] = [];
      for (let i = 0; i < applyDaysCount; i++) {
        dates.push(getRelativeDateString(i));
      }
      applyTemplateToDates(selectedTemplateId, dates);
      setIsApplyingTemplate(false);
      const msg =
        language === 'fa'
          ? `الگو با موفقیت برای ${toPersianDigits(applyDaysCount)} روز آینده اعمال شد و بازه‌های زمانی ایجاد گردیدند.`
          : `Template applied to the next ${applyDaysCount} days! Available slots have been generated.`;
      setApplySuccessMessage(msg);
      setTimeout(() => setApplySuccessMessage(null), 3500);
    }, 280);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner / Shop Overview */}
      <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 shadow-inner">
              <Scissors className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">
                  {getShopName(currentBarber, language)}
                </h1>
                <span className="shrink-0 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {language === 'fa' ? 'آرایشگاه فعال' : 'Active Shop'}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-1">
                {language === 'fa' ? 'استاد آرایشگر: ' : 'Master Barber: '}
                <span className="text-slate-200 font-medium">{getBarberName(currentBarber, language)}</span> · {getAddress(currentBarber, language)}
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs (Mobile-friendly horizontal scroll with 44px touch targets) */}
          <div className="overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs whitespace-nowrap min-w-max shadow-sm">
              <button
                onClick={() => handleSubTabChange('schedule')}
                className={`flex items-center justify-center min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation cursor-pointer ${
                  activeSubTab === 'schedule'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.graphicalScheduleTab}
              </button>
              <button
                onClick={() => handleSubTabChange('templates')}
                className={`flex items-center justify-center min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation cursor-pointer ${
                  activeSubTab === 'templates'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.templatesTab}
              </button>
              <button
                onClick={() => handleSubTabChange('analytics')}
                className={`flex items-center justify-center min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation cursor-pointer ${
                  activeSubTab === 'analytics'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5 me-1.5" />
                <span>{language === 'fa' ? 'گزارشات و درآمد' : 'Analytics & Revenue'}</span>
              </button>
              <button
                onClick={() => handleSubTabChange('profile')}
                className={`flex items-center justify-center min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation cursor-pointer ${
                  activeSubTab === 'profile'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.profileTab}
              </button>
              <button
                onClick={() => handleSubTabChange('gallery')}
                className={`flex items-center justify-center min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg font-semibold transition-all touch-manipulation cursor-pointer ${
                  activeSubTab === 'gallery'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.galleryTab} ({language === 'fa' ? toPersianDigits(currentBarber.images.length) : currentBarber.images.length}/۴)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: GRAPHICAL SCHEDULE TABLE */}
      {activeSubTab === 'schedule' && (
        isDateTransitioning || isTabTransitioning ? (
          <DashboardScheduleSkeleton />
        ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Controls & Date Switcher (Collapses from row to stack on mobile) */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">{t.dailyAppointmentTableTitle}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.dailyAppointmentTableSubtitle}
                </p>
              </div>
            </div>

            {/* Date selection & quick jump with 44px touch targets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleDateChange(getRelativeDateString(0))}
                  className={`flex items-center justify-center min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer ${
                    selectedDate === getRelativeDateString(0)
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.today}
                </button>
                <button
                  type="button"
                  onClick={() => handleDateChange(getRelativeDateString(1))}
                  className={`flex items-center justify-center min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all touch-manipulation cursor-pointer ${
                    selectedDate === getRelativeDateString(1)
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.tomorrow}
                </button>
              </div>

              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                <label htmlFor="barber-schedule-date" className="text-xs text-slate-400 sr-only">
                  {t.dateLabel}
                </label>
                <input
                  id="barber-schedule-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full sm:w-auto min-h-[44px] rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-mono cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Color Code Legend */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 rounded-2xl border border-slate-800 bg-[#111622] px-4 sm:px-5 py-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded border border-slate-400 bg-white shrink-0" />
              <span className="text-slate-300 font-medium">{t.legendWhite}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-emerald-600 shrink-0" />
              <span className="text-slate-300 font-medium">{t.legendGreen}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-amber-400 shrink-0" />
              <span className="text-slate-300 font-medium">{t.legendYellow}</span>
            </div>
          </div>

          {/* Graphical Slots Grid: Responsive CSS Grid collapsing to single-column card stack on mobile */}
          <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {language === 'fa'
                  ? `نوبت‌های تاریخ ${toPersianDigits(selectedDate)} (${toPersianDigits(dayAppointments.length)} نوبت)`
                  : `Slots for ${selectedDate} (${dayAppointments.length} total)`}
              </h4>
              <span className="text-[11px] text-slate-500">
                {t.togglePhoneNotice}
              </span>
            </div>

            {dayAppointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 sm:p-12 text-center text-xs text-slate-500">
                {language === 'fa'
                  ? 'هنوز هیچ نوبتی برای این تاریخ تعریف نشده است. می‌توانید با کلیک روی تب الگوها، بازه‌های زمانی را برای چند روز آینده اعمال کنید.'
                  : 'No slots configured for this date yet. You can apply a reusable template or add slots below.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {dayAppointments.map((slot) => {
                  let borderClass = 'border-slate-300';
                  let bgClass = 'bg-white text-slate-900';
                  let statusText = t.statusAvailable;

                  if (slot.status === 'reserved_paid') {
                    bgClass = 'bg-emerald-600 text-white';
                    borderClass = 'border-emerald-500';
                    statusText = t.statusPaid;
                  } else if (slot.status === 'reserved_manual') {
                    bgClass = 'bg-amber-400 text-slate-950 font-medium';
                    borderClass = 'border-amber-300';
                    statusText = t.statusManual;
                  } else if (slot.status === 'pending_payment') {
                    bgClass = 'bg-sky-500 text-white animate-pulse';
                    borderClass = 'border-sky-400';
                    statusText = t.statusHolding;
                  }

                  return (
                    <div
                      key={slot.id}
                      className={`relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 shadow-sm transition-all ${bgClass} ${borderClass}`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-sm sm:text-base font-bold tracking-tight">
                            {language === 'fa'
                              ? `${toPersianDigits(slot.startTime)} - ${toPersianDigits(slot.endTime)}`
                              : `${slot.startTime} - ${slot.endTime}`}
                          </span>
                          {/* 44px Touch Target Delete Button */}
                          <button
                            onClick={() => deleteSlot(slot.id)}
                            title={language === 'fa' ? 'حذف این نوبت' : 'Delete this slot'}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-red-500 hover:bg-black/5 active:scale-90 transition-all touch-manipulation cursor-pointer -me-2 -mt-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 text-xs">
                          <span className="font-semibold uppercase tracking-wider text-[10px]">
                            {language === 'fa' ? 'وضعیت: ' : 'Status: '} {statusText}
                          </span>
                          {slot.customerName && (
                            <p className="mt-1 text-xs truncate font-medium">
                              {language === 'fa' ? 'مشتری: ' : 'Customer: '} {slot.customerName} ({slot.customerPhone})
                            </p>
                          )}
                          {slot.manualNotes && (
                            <p className="mt-1 text-xs italic opacity-90 truncate">
                              {language === 'fa' ? 'یادداشت: ' : 'Note: '} {slot.manualNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Manual Reservation Toggle Action Button (Min 46px touch target) */}
                      <div className="mt-4 pt-2.5 border-t border-black/10">
                        {slot.status === 'available' ? (
                          <button
                            onClick={() => handleToggleManual(slot)}
                            className="flex w-full min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-sm touch-manipulation cursor-pointer"
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                            <span>{t.markPhoneReserved}</span>
                          </button>
                        ) : slot.status === 'reserved_manual' ? (
                          <button
                            onClick={() => handleToggleManual(slot)}
                            className="flex w-full min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-white/95 border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 hover:bg-white active:scale-[0.98] transition-all touch-manipulation cursor-pointer"
                          >
                            <span>{t.releaseToAvailable}</span>
                          </button>
                        ) : (
                          <div className="min-h-[46px] flex items-center justify-center text-center text-xs opacity-90 font-medium">
                            {language === 'fa'
                              ? `رزرو آنلاین (${formatPrice(slot.price, language)})`
                              : `Booked via App (${formatPrice(slot.price, language)})`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New Individual Slot Form: Responsive CSS Grid (Collapses to single-column stack on mobile) */}
          <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5">
              {language === 'fa'
                ? `افزودن نوبت تکی برای تاریخ ${toPersianDigits(selectedDate)}`
                : `Add Individual Slot for ${selectedDate}`}
            </h4>
            <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-end text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">{language === 'fa' ? 'ساعت شروع' : 'Start Time'}</label>
                <input
                  type="time"
                  value={newSlotStart}
                  onChange={(e) => setNewSlotStart(e.target.value)}
                  className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white font-mono text-sm sm:text-xs focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">{language === 'fa' ? 'ساعت پایان' : 'End Time'}</label>
                <input
                  type="time"
                  value={newSlotEnd}
                  onChange={(e) => setNewSlotEnd(e.target.value)}
                  className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white font-mono text-sm sm:text-xs focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">{language === 'fa' ? 'قیمت (تومان)' : 'Price (Toman)'}</label>
                <input
                  type="number"
                  step="10000"
                  value={newSlotPrice}
                  onChange={(e) => setNewSlotPrice(Number(e.target.value))}
                  className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white font-mono text-sm sm:text-xs focus:ring-2 focus:ring-amber-500/40"
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[46px] flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all touch-manipulation shadow-md cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{t.addSlot}</span>
              </button>
            </form>
          </div>
        </div>
        )
      )}

      {/* SUBTAB 2: REUSABLE SCHEDULE TEMPLATES */}
      {activeSubTab === 'templates' && (
        isTabTransitioning || isApplyingTemplate ? (
          <div className="space-y-4 sm:space-y-6">
            <TemplateListSkeleton />
          </div>
        ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400 shrink-0" />
              <span>{t.templateManagerTitle}</span>
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t.templateManagerSubtitle}
            </p>
          </div>

          {/* Success Notification */}
          {applySuccessMessage && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-xs sm:text-sm text-emerald-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{applySuccessMessage}</span>
            </div>
          )}

          {/* Apply Template: Responsive CSS Grid */}
          <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t.step1Apply}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end text-xs">
              <div className="lg:col-span-5">
                <label className="block text-slate-400 mb-1.5 font-medium">{t.chooseTemplate}</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white text-sm sm:text-xs cursor-pointer focus:ring-2 focus:ring-amber-500/40"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.nameFa && language === 'fa' ? tpl.nameFa : tpl.name} ({language === 'fa' ? toPersianDigits(tpl.slots.length) : tpl.slots.length} نوبت)
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-slate-400 mb-1.5 font-medium">{t.targetHorizon}</label>
                <select
                  value={applyDaysCount}
                  onChange={(e) => setApplyDaysCount(Number(e.target.value))}
                  className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white text-sm sm:text-xs cursor-pointer focus:ring-2 focus:ring-amber-500/40"
                >
                  <option value={2}>{t.horizon2Days}</option>
                  <option value={7}>{t.horizon7Days}</option>
                  <option value={14}>{t.horizon14Days}</option>
                  <option value={30}>{t.horizon30Days}</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4">
                <button
                  onClick={handleApplyTemplate}
                  className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md touch-manipulation cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>{t.batchApplyBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* List Existing Templates: Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {templates.map((tpl) => (
              <div key={tpl.id} className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 space-y-3 shadow-sm hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white truncate">
                    {tpl.nameFa && language === 'fa' ? tpl.nameFa : tpl.name}
                  </h4>
                  <span className="font-mono text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg shrink-0">
                    {language === 'fa' ? `${toPersianDigits(tpl.slots.length)} نوبت` : `${tpl.slots.length} Slots`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tpl.slots.map((s) => (
                    <span
                      key={s.id}
                      className="font-mono text-[11px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300"
                    >
                      {language === 'fa' ? toPersianDigits(s.startTime) : s.startTime}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Create New Template: Responsive CSS Grid */}
          <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t.step2Create}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-end text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">{t.templateNameLabel}</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white text-sm sm:text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">{t.slotIntervalLabel}</label>
                <select
                  value={templateInterval}
                  onChange={(e) => setTemplateInterval(Number(e.target.value))}
                  className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white text-sm sm:text-xs cursor-pointer"
                >
                  <option value={30}>{language === 'fa' ? '۳۰ دقیقه' : '30 Minutes'}</option>
                  <option value={45}>{language === 'fa' ? '۴۵ دقیقه' : '45 Minutes'}</option>
                  <option value={60}>{language === 'fa' ? '۶۰ دقیقه (۱ ساعت)' : '60 Minutes'}</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">{t.operatingHoursLabel}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={6}
                    max={23}
                    value={templateStartHour}
                    onChange={(e) => setTemplateStartHour(Number(e.target.value))}
                    className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2.5 text-white font-mono text-center"
                  />
                  <span className="text-slate-500 font-medium">{language === 'fa' ? 'تا' : 'to'}</span>
                  <input
                    type="number"
                    min={6}
                    max={23}
                    value={templateEndHour}
                    onChange={(e) => setTemplateEndHour(Number(e.target.value))}
                    className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-2.5 text-white font-mono text-center"
                  />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleCreateTemplate}
                  className="w-full min-h-[46px] flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-bold text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all touch-manipulation shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t.generateTemplateBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* SUBTAB: ANALYTICS & REVENUE */}
      {activeSubTab === 'analytics' && (
        <BarberAnalyticsTab barber={currentBarber} appointments={appointments} />
      )}

      {/* SUBTAB 3: SHOP PROFILE EDIT (Collapsible Responsive Grid) */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">{t.profileTitle}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.profileSubtitle}</p>
            </div>
            {profileSaved && (
              <span className="text-xs sm:text-sm font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                <Check className="h-4 w-4" /> {t.savedSuccessfully}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">{t.shopNameLabel}</label>
              <input
                type="text"
                value={profileForm.shopName}
                onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">{t.barberNameLabel}</label>
              <input
                type="text"
                value={profileForm.barberName}
                onChange={(e) => setProfileForm({ ...profileForm, barberName: e.target.value })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">{t.contactPhoneLabel}</label>
              <input
                type="text"
                dir="ltr"
                value={profileForm.phoneNumber}
                onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                {language === 'fa' ? 'نرخ پایه نوبت (تومان)' : 'Base Price (Toman)'}
              </label>
              <input
                type="number"
                step="10000"
                value={profileForm.pricePerSlot}
                onChange={(e) => setProfileForm({ ...profileForm, pricePerSlot: Number(e.target.value) })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1.5 font-medium">{t.streetAddressLabel}</label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            {/* Geolocation Coordinates */}
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">{t.latitudeLabel}</label>
              <input
                type="number"
                step="0.0001"
                dir="ltr"
                value={profileForm.latitude}
                onChange={(e) => setProfileForm({ ...profileForm, latitude: Number(e.target.value) })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">{t.longitudeLabel}</label>
              <input
                type="number"
                step="0.0001"
                dir="ltr"
                value={profileForm.longitude}
                onChange={(e) => setProfileForm({ ...profileForm, longitude: Number(e.target.value) })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">{t.workingHoursStartLabel}</label>
              <input
                type="text"
                dir="ltr"
                value={profileForm.workingHoursStart}
                onChange={(e) => setProfileForm({ ...profileForm, workingHoursStart: e.target.value })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">{t.workingHoursEndLabel}</label>
              <input
                type="text"
                dir="ltr"
                value={profileForm.workingHoursEnd}
                onChange={(e) => setProfileForm({ ...profileForm, workingHoursEnd: e.target.value })}
                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm sm:text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1.5 font-medium">{t.bioLabel}</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3.5 text-sm sm:text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 min-h-[48px] text-xs sm:text-sm font-bold text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all shadow-md touch-manipulation cursor-pointer w-full sm:w-auto"
            >
              <Save className="h-4 w-4" />
              <span>{t.saveProfileBtn}</span>
            </button>
          </div>
        </form>
      )}

      {/* SUBTAB 4: GALLERY MANAGEMENT (Collapsible Grid) */}
      {activeSubTab === 'gallery' && (
        isTabTransitioning ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                {t.barbershopGalleryTitle}
              </h3>
              <GalleryGridSkeleton />
            </div>
          </div>
        ) : (
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t.barbershopGalleryTitle} ({language === 'fa' ? toPersianDigits(currentBarber.images.length) : currentBarber.images.length}/۴)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.galleryNotice}
                </p>
              </div>
              <span className={`self-start sm:self-auto font-mono text-xs font-semibold px-3 py-1.5 rounded-xl ${
                currentBarber.images.length >= 4
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {language === 'fa'
                  ? `${toPersianDigits(currentBarber.images.length)} از ۴ تصویر بارگذاری شده`
                  : `${currentBarber.images.length}/4 Images Active`}
              </span>
            </div>
          </div>

          {galleryError && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-500/20 border border-red-500/40 p-4 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{galleryError}</span>
            </div>
          )}

          {/* Current Images List: Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {currentBarber.images.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#111622] shadow-sm hover:border-slate-700 transition-colors"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={img.imageUrl}
                    alt={getImageCaption(img, language) || 'Barbershop photo'}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 text-xs">
                  <p className="text-slate-300 font-medium truncate">
                    {getImageCaption(img, language) || (language === 'fa' ? 'عکس سالن آرایشگاه' : 'Barbershop Photo')}
                  </p>
                  <button
                    onClick={() => deleteBarberImage(img.id)}
                    className="mt-3 flex w-full min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-red-950/60 border border-red-800/60 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/60 active:scale-95 transition-all touch-manipulation cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.deletePhoto}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload New Image: Multi-source Gallery & Device Picker */}
          <div className="rounded-2xl border border-slate-800 bg-[#111622] p-4 sm:p-5 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-amber-400" />
                  <span>{language === 'fa' ? 'افزودن تصویر جدید به گالری سالن' : 'Add New Photo to Salon Gallery'}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'fa'
                    ? 'تصویر را از گالری گوشی/کامپیوتر انتخاب کنید یا از آلبوم تصاویر آماده سالن قیچی برگزینید.'
                    : 'Choose from your device gallery, select from the curated salon album, or paste a URL.'}
                </p>
              </div>

              {/* Source Mode Tabs */}
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setUploadMode('device')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    uploadMode === 'device'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>{language === 'fa' ? 'گالری دستگاه' : 'Device Gallery'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('presets')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    uploadMode === 'presets'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{language === 'fa' ? 'آلبوم نمونه' : 'Presets'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    uploadMode === 'url'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>{language === 'fa' ? 'لینک URL' : 'Image URL'}</span>
                </button>
              </div>
            </div>

            {currentBarber.images.length >= 4 ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 leading-relaxed flex items-center gap-2">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
                <span>{t.maxImagesLimitReached}</span>
              </div>
            ) : (
              <>
                {/* MODE 1: CHOOSE FROM DEVICE PHOTO GALLERY */}
                {uploadMode === 'device' && (
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    {!deviceImagePreview ? (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(true);
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingFile(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileSelect(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                          isDraggingFile
                            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                            : 'border-slate-700 bg-slate-900/60 hover:border-amber-500/50 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <FolderOpen className="h-7 w-7" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {language === 'fa'
                              ? 'برای انتخاب عکس از گالری دستگاه / گوشی اینجا کلیک کنید'
                              : 'Click to choose photo from your device gallery'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {language === 'fa'
                              ? 'یا فایل تصویر را بکشید و در این قسمت رها کنید (فرمت‌های JPG، PNG و WEBP تا ۵ مگابایت)'
                              : 'or drag and drop your photo here (JPG, PNG, WEBP up to 5MB)'}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="mt-1 flex items-center gap-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 px-4 py-2 text-xs font-bold hover:bg-amber-500/30 transition-colors pointer-events-none"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>{language === 'fa' ? 'مرور گالری تصاویر دستگاه' : 'Browse Device Gallery'}</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleDeviceUploadSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                          {/* Live Preview Box */}
                          <div className="relative aspect-[4/3] w-full sm:w-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                            <img
                              src={deviceImagePreview}
                              alt="Device gallery preview"
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setDeviceImagePreview(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="absolute top-2 end-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/75 text-white hover:bg-red-600 transition-colors cursor-pointer"
                              title={language === 'fa' ? 'حذف و انتخاب مجدد' : 'Remove & choose again'}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Caption Input & Quick Suggestions */}
                          <div className="flex-1 w-full space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                {language === 'fa' ? 'عنوان و توضیح تصویر سالن:' : 'Photo Caption:'}
                              </label>
                              <input
                                type="text"
                                value={deviceImageCaption}
                                onChange={(e) => setDeviceImageCaption(e.target.value)}
                                placeholder={language === 'fa' ? 'مثال: صندلی پیرایش VIP چرم' : 'e.g. VIP Leather Styling Chair'}
                                className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm sm:text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                              />
                            </div>

                            {/* Quick Suggestion Chips */}
                            <div>
                              <span className="text-[11px] text-slate-400 block mb-1">
                                {language === 'fa' ? 'عناوین پیشنهادی سریع:' : 'Quick suggestions:'}
                              </span>
                              <div className="flex flex-wrap gap-1.5 text-[11px]">
                                {[
                                  'صندلی پیرایش VIP',
                                  'سالن اصلی پیرایش',
                                  'اصلاح سنتی با حوله داغ',
                                  'سرشور و اسپا پوست سر',
                                  'بار و سالن اختصاصی انتظار',
                                ].map((suggestion) => (
                                  <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => setDeviceImageCaption(suggestion)}
                                    className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setDeviceImagePreview(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="rounded-xl border border-slate-700 bg-slate-800 text-slate-300 px-4 py-2.5 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                          >
                            {language === 'fa' ? 'انصراف' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold px-6 py-2.5 text-xs shadow-md hover:bg-amber-400 active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus className="h-4 w-4" />
                            <span>
                              {language === 'fa'
                                ? `تأیید و ذخیره در گالری (${toPersianDigits(currentBarber.images.length)}/۴)`
                                : `Save to Gallery (${currentBarber.images.length}/4)`}
                            </span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* MODE 2: CHOOSE FROM CURATED SALON PRESET SHOWCASE */}
                {uploadMode === 'presets' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      {language === 'fa'
                        ? 'می‌توانید با یک کلیک از میان تصاویر عکاسی شده استاندارد زیر، عکس‌های حرفه‌ای به گالری آرایشگاه خود اضافه کنید:'
                        : 'Click on any professional barbershop image to immediately add it to your salon gallery:'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {SAMPLE_GALLERY_ITEMS.map((sample) => {
                        const isAlreadyAdded = currentBarber.images.some(
                          (img) => img.imageUrl === sample.imageUrl
                        );

                        return (
                          <div
                            key={sample.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 transition-all hover:border-amber-500/50 hover:shadow-md"
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                              <img
                                src={sample.imageUrl}
                                alt={language === 'fa' ? sample.captionFa : sample.captionEn}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <span className="absolute top-2 start-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-300 border border-white/10">
                                {sample.tagFa}
                              </span>
                            </div>

                            <div className="p-2.5 space-y-2">
                              <p className="text-[11px] font-medium text-slate-200 line-clamp-1">
                                {language === 'fa' ? sample.captionFa : sample.captionEn}
                              </p>

                              <button
                                type="button"
                                disabled={isAlreadyAdded || currentBarber.images.length >= 4}
                                onClick={() => handleSelectPresetSample(sample)}
                                className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isAlreadyAdded
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm active:scale-95'
                                }`}
                              >
                                {isAlreadyAdded ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    <span>{language === 'fa' ? 'اضافه شده' : 'Added'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>{language === 'fa' ? 'افزودن این عکس' : 'Select'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* MODE 3: DIRECT IMAGE URL */}
                {uploadMode === 'url' && (
                  <form onSubmit={handleAddImage} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 sm:gap-4 items-end text-xs">
                    <div className="lg:col-span-6">
                      <label className="block text-slate-400 mb-1.5 font-medium">{t.imageUrlLabel}</label>
                      <input
                        type="url"
                        dir="ltr"
                        placeholder="https://example.com/photo.jpg"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white font-mono text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>
                    <div className="lg:col-span-4">
                      <label className="block text-slate-400 mb-1.5 font-medium">{t.captionLabel}</label>
                      <input
                        type="text"
                        placeholder={language === 'fa' ? 'مثال: صندلی پیرایش VIP' : 'e.g. VIP Styling Chair'}
                        value={newImageCaption}
                        onChange={(e) => setNewImageCaption(e.target.value)}
                        className="w-full min-h-[46px] rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-white text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                      <button
                        type="submit"
                        className="w-full min-h-[46px] flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 font-bold text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all touch-manipulation shadow-md cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>
                          {t.uploadImageBtn} ({language === 'fa' ? toPersianDigits(currentBarber.images.length) : currentBarber.images.length}/۴)
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
        )
      )}
    </div>
  );
};
