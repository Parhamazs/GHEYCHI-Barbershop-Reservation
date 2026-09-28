import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  BarberProfile,
  Appointment,
  ScheduleTemplate,
  Review,
  AppointmentStatus,
  BarberImage,
  ToastNotification,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_BARBER_PROFILES,
  INITIAL_SCHEDULE_TEMPLATES,
  INITIAL_REVIEWS,
  generateInitialAppointments,
  getRelativeDateString,
} from '../mockData';
import { calculateDistanceKm, CITY_PRESETS } from '../utils/geo';
import { Language, Direction, TRANSLATIONS } from '../utils/i18n';

export type Theme = 'light' | 'dark';

interface AppContextType {
  currentUser: User;
  switchUserRole: (role: 'customer' | 'barber') => void;
  userCoords: { lat: number; lng: number; cityName: string };
  setUserCoords: (coords: { lat: number; lng: number; cityName: string }) => void;
  requestBrowserLocation: () => Promise<void>;
  locationLoading: boolean;

  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof TRANSLATIONS.fa;

  barbers: BarberProfile[];
  selectedBarber: BarberProfile | null;
  setSelectedBarber: (barber: BarberProfile | null) => void;
  updateBarberProfile: (updated: Partial<BarberProfile>) => void;
  addBarberImage: (imageUrl: string, caption: string, captionFa?: string) => { success: boolean; error?: string };
  deleteBarberImage: (imageId: string) => void;

  appointments: Appointment[];
  templates: ScheduleTemplate[];
  reviews: Review[];

  // Customer Booking & Redis 15-minute Lock flow
  activeLockedSlot: Appointment | null;
  lockRemainingSeconds: number;
  expiredWarningMessage: string | null;
  clearExpiredWarning: () => void;
  holdSlotForPayment: (slot: Appointment) => { success: boolean; message?: string };
  confirmPaymentForSlot: (slotId: string) => { success: boolean; message?: string };
  cancelSlotLock: (slotId: string) => void;
  simulateLockTimeout: (slotId: string) => void;

  // Barber Schedule Management
  createSlot: (slotDate: string, startTime: string, endTime: string, serviceName?: string, price?: number) => void;
  deleteSlot: (slotId: string) => void;
  toggleManualReservation: (slotId: string, notes?: string) => void;
  createTemplate: (name: string, slots: { startTime: string; endTime: string }[]) => void;
  applyTemplateToDates: (templateId: string, dates: string[]) => void;

  // Reviews
  addReview: (barberProfileId: string, rating: number, comment: string) => void;

  // Active view/navigation
  activeTab: 'login' | 'customer' | 'barber' | 'architecture' | 'pdf';
  setActiveTab: (tab: 'login' | 'customer' | 'barber' | 'architecture' | 'pdf') => void;

  // Authentication & Login
  isLoggedIn: boolean;
  loginUser: (role: 'barber' | 'customer', phone?: string, name?: string) => void;
  logoutUser: () => void;

  // Customer Favorites
  favoriteBarberIds: string[];
  toggleFavoriteBarber: (barberId: string) => void;
  isBarberFavorite: (barberId: string) => boolean;

  // Customer Profile Modal
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Toast Notifications
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'createdAt'>) => string;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('gheychi_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[2]; // Arash (Customer) by default
  });

  // User Coordinates for Geolocation discovery (default: Tehran Jordan area near Kaveh)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; cityName: string }>({
    lat: 35.778,
    lng: 51.419,
    cityName: 'Tehran (Jordan / Valiasr)',
  });
  const [locationLoading, setLocationLoading] = useState(false);

  // Barbers list with persistent storage
  const [barbers, setBarbers] = useState<BarberProfile[]>(() => {
    const saved = localStorage.getItem('gheychi_barbers');
    if (!saved) return INITIAL_BARBER_PROFILES;
    try {
      const parsed = JSON.parse(saved);
      const merged = [...parsed];
      for (const initB of INITIAL_BARBER_PROFILES) {
        if (!merged.some((b: BarberProfile) => b.id === initB.id)) {
          merged.push(initB);
        }
      }
      return merged;
    } catch {
      return INITIAL_BARBER_PROFILES;
    }
  });

  // Selected Barber for detail view
  const [selectedBarber, setSelectedBarber] = useState<BarberProfile | null>(() => {
    return INITIAL_BARBER_PROFILES[0];
  });

  // Appointments list with persistent storage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('gheychi_appointments');
    return saved ? JSON.parse(saved) : generateInitialAppointments();
  });

  // Templates
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(() => {
    const saved = localStorage.getItem('gheychi_templates');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_TEMPLATES;
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gheychi_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'login' | 'customer' | 'barber' | 'architecture' | 'pdf'>('customer');

  // Login authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('gheychi_is_logged_in') === 'true';
  });

  const loginUser = (role: 'barber' | 'customer', phone?: string, name?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('gheychi_is_logged_in', 'true');
    if (role === 'barber') {
      const barberUser: User = {
        ...DEMO_USERS[0],
        phone: phone && phone.trim() ? phone.trim() : DEMO_USERS[0].phone,
        fullName: name && name.trim() ? name.trim() : DEMO_USERS[0].fullName,
      };
      setCurrentUser(barberUser);
      setActiveTab('barber');
      addToast({
        type: 'success',
        title: 'Barber Signed In',
        titleFa: 'ورود موفق آرایشگر',
        message: 'Welcome, Master Barber Kaveh Radmanesh! You can now manage your salon & schedule.',
        messageFa: 'خوش آمدید، استاد کاوه رادمنش! اکنون می‌توانید جدول نوبت‌ها و تنظیمات سالن را مدیریت نمایید.',
        durationMs: 5000,
      });
    } else {
      const customerUser: User = {
        ...DEMO_USERS[2],
        phone: phone && phone.trim() ? phone.trim() : DEMO_USERS[2].phone,
        fullName: name && name.trim() ? name.trim() : DEMO_USERS[2].fullName,
      };
      setCurrentUser(customerUser);
      setActiveTab('customer');
      addToast({
        type: 'success',
        title: 'Customer Signed In',
        titleFa: 'ورود موفق مشتری',
        message: 'Welcome, Arash Davoudi! You can now browse nearby barbers and book appointments.',
        messageFa: 'خوش آمدید، آرش داوودی! اکنون می‌توانید آرایشگاه‌های اطراف را مشاهده و نوبت رزرو کنید.',
        durationMs: 5000,
      });
    }
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    localStorage.setItem('gheychi_is_logged_in', 'false');
    setActiveTab('login');
    addToast({
      type: 'info',
      title: 'Signed Out',
      titleFa: 'خروج از حساب کاربری',
      message: 'You have been signed out successfully.',
      messageFa: 'با موفقیت از حساب کاربری خارج شدید.',
      durationMs: 4000,
    });
  };

  // Language & RTL State (defaults to Persian 'fa' as requested)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gheychi_lang');
    return (saved === 'en' || saved === 'fa') ? saved : 'fa';
  });

  const direction: Direction = language === 'fa' ? 'rtl' : 'ltr';
  const t = TRANSLATIONS[language];

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('gheychi_lang', newLang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fa' ? 'en' : 'fa');
  };

  // Theme state ('light' mode with white theme and blue bottoms/buttons by default)
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('gheychi_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('gheychi_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  // Customer Favorites State
  const [favoriteBarberIds, setFavoriteBarberIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gheychi_favorites');
    return saved ? JSON.parse(saved) : ['barber-profile-1'];
  });

  const toggleFavoriteBarber = (barberId: string) => {
    setFavoriteBarberIds((prev) => {
      const isFav = prev.includes(barberId);
      let updated: string[];
      if (isFav) {
        updated = prev.filter((id) => id !== barberId);
        addToast({
          type: 'info',
          title: language === 'fa' ? 'حذف از علاقه‌مندی‌ها' : 'Removed from Favorites',
          titleFa: 'حذف از علاقه‌مندی‌ها',
          message: language === 'fa' ? 'آرایشگاه از لیست علاقه‌مندی‌های شما برداشته شد.' : 'Barber removed from your favorites list.',
          messageFa: 'آرایشگاه از لیست علاقه‌مندی‌های شما برداشته شد.',
          durationMs: 3000,
        });
      } else {
        updated = [...prev, barberId];
        addToast({
          type: 'success',
          title: language === 'fa' ? 'افزودن به علاقه‌مندی‌ها' : 'Added to Favorites',
          titleFa: 'افزودن به علاقه‌مندی‌ها',
          message: language === 'fa' ? 'آرایشگاه به لیست «علاقه‌مندی‌های من» در پروفایل شما اضافه شد.' : 'Barber added to "My Favorites" in your profile.',
          messageFa: 'آرایشگاه به لیست «علاقه‌مندی‌های من» در پروفایل شما اضافه شد.',
          durationMs: 3500,
        });
      }
      localStorage.setItem('gheychi_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isBarberFavorite = (barberId: string) => {
    return favoriteBarberIds.includes(barberId);
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Active locked slot & 15-minute timer
  const [activeLockedSlot, setActiveLockedSlot] = useState<Appointment | null>(null);
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState<number>(0);
  const [expiredWarningMessage, setExpiredWarningMessage] = useState<string | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toastData: Omit<ToastNotification, 'id' | 'createdAt'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastNotification = {
      ...toastData,
      id,
      createdAt: Date.now(),
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gheychi_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gheychi_barbers', JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem('gheychi_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('gheychi_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('gheychi_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Update distances whenever userCoords change
  useEffect(() => {
    setBarbers((prev) =>
      prev.map((b) => ({
        ...b,
        distanceKm: calculateDistanceKm(userCoords.lat, userCoords.lng, b.latitude, b.longitude),
      }))
    );
  }, [userCoords]);

  // 15-Minute Countdown Timer for Redis Temporary Lock
  useEffect(() => {
    if (!activeLockedSlot || lockRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeLockedSlot, lockRemainingSeconds]);

  // Auto release expired slot when countdown hits 0
  useEffect(() => {
    if (activeLockedSlot && lockRemainingSeconds <= 0) {
      handleLockExpired(activeLockedSlot.id);
    }
  }, [activeLockedSlot, lockRemainingSeconds]);

  // Handle expired lock
  const handleLockExpired = (slotId: string) => {
    const expiredSlot = appointments.find((a) => a.id === slotId) || activeLockedSlot;
    const barber = expiredSlot ? barbers.find((b) => b.id === expiredSlot.barberProfileId) : null;

    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === slotId) {
          return {
            ...a,
            status: 'available',
            customerId: undefined,
            customerName: undefined,
            customerPhone: undefined,
            lockExpiresAt: undefined,
          };
        }
        return a;
      })
    );
    setActiveLockedSlot(null);
    setLockRemainingSeconds(0);
    // Display mandatory red warning message
    setExpiredWarningMessage('Please complete your payment. Your 15-minute reservation hold has expired.');

    // Trigger Notification Toast for Unpaid Reservation Lock Expiration
    addToast({
      type: 'error',
      title: '15-Minute Lock Expired',
      titleFa: 'انقضای مهلت رزرو موقت (۱۵ دقیقه)',
      message: 'Your 15-minute payment holding window has expired. The appointment slot has been released back to the schedule.',
      messageFa: 'مهلت پرداخت ۱۵ دقیقه‌ای شما به پایان رسید. نوبت آرایشگاه آزاد شد و مجدداً در دسترس عموم قرار گرفت.',
      durationMs: 8500,
      details: expiredSlot
        ? {
            barberName: barber?.barberNameFa || barber?.barberName,
            shopName: barber?.shopNameFa || barber?.shopName,
            slotDate: expiredSlot.slotDate,
            slotTime: `${expiredSlot.startTime} - ${expiredSlot.endTime}`,
            price: expiredSlot.price,
          }
        : undefined,
      actionLabel: 'Browse Slots',
      actionLabelFa: 'مشاهده مجدد نوبت‌ها',
      onAction: () => {
        setActiveTab('customer');
      },
    });
  };

  // Switch Role
  const switchUserRole = (role: 'customer' | 'barber') => {
    if (role === 'barber') {
      setCurrentUser(DEMO_USERS[0]); // Kaveh (Barber)
      setActiveTab('barber');
    } else {
      setCurrentUser(DEMO_USERS[2]); // Arash (Customer)
      setActiveTab('customer');
    }
  };

  // Browser Geolocation
  const requestBrowserLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          cityName: 'Your Live GPS Location',
        });
        setLocationLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationLoading(false);
        // Fallback to Tehran Jordan
        setUserCoords({
          lat: CITY_PRESETS[0].lat,
          lng: CITY_PRESETS[0].lng,
          cityName: CITY_PRESETS[0].name,
        });
      },
      { timeout: 8000 }
    );
  };

  // Customer: Hold slot for 15-minutes (Redis SETNX EX 900 simulation)
  const holdSlotForPayment = (slot: Appointment): { success: boolean; message?: string } => {
    // 1. Verify next 2 days rule
    const today = getRelativeDateString(0);
    const tomorrow = getRelativeDateString(1);
    if (slot.slotDate !== today && slot.slotDate !== tomorrow) {
      return { success: false, message: 'You can only reserve slots for the next 2 days.' };
    }

    // 2. Concurrency check
    const currentSlot = appointments.find((a) => a.id === slot.id);
    if (!currentSlot || currentSlot.status !== 'available') {
      return { success: false, message: 'This slot is already held or reserved by another customer.' };
    }

    const lockDurationSec = 15 * 60; // 15 minutes
    const expiresAt = Date.now() + lockDurationSec * 1000;

    const updatedSlot: Appointment = {
      ...currentSlot,
      status: 'pending_payment',
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerPhone: currentUser.phone,
      lockExpiresAt: expiresAt,
    };

    setAppointments((prev) => prev.map((a) => (a.id === slot.id ? updatedSlot : a)));
    setActiveLockedSlot(updatedSlot);
    setLockRemainingSeconds(lockDurationSec);
    setExpiredWarningMessage(null);

    return { success: true };
  };

  // Customer: Mock Payment Confirmation -> reserved_paid (Green)
  const confirmPaymentForSlot = (slotId: string): { success: boolean; message?: string } => {
    const slot = appointments.find((a) => a.id === slotId);
    if (!slot) return { success: false, message: 'Slot not found' };

    if (slot.status !== 'pending_payment') {
      return { success: false, message: 'Payment expired or slot is not in pending status' };
    }

    const confirmedSlot: Appointment = {
      ...slot,
      status: 'reserved_paid', // GREEN in UI
      lockExpiresAt: undefined,
      reservedAt: new Date().toISOString(),
    };

    setAppointments((prev) => prev.map((a) => (a.id === slotId ? confirmedSlot : a)));
    setActiveLockedSlot(null);
    setLockRemainingSeconds(0);
    setExpiredWarningMessage(null);

    const barber = barbers.find((b) => b.id === slot.barberProfileId);

    // Trigger Notification Toast for Customer Successfully Completing Reservation
    addToast({
      type: 'success',
      title: 'Reservation Confirmed & Paid!',
      titleFa: 'رزرو با موفقیت نهایی و پرداخت شد!',
      message: `Your appointment at ${barber?.shopName || 'the barbershop'} has been successfully booked for ${slot.startTime}.`,
      messageFa: `نوبت شما در ${barber?.shopNameFa || barber?.shopName || 'سالن آرایشگاه'} برای ساعت ${slot.startTime} با موفقیت ثبت شد.`,
      durationMs: 7500,
      details: {
        barberName: barber?.barberNameFa || barber?.barberName,
        shopName: barber?.shopNameFa || barber?.shopName,
        slotDate: slot.slotDate,
        slotTime: `${slot.startTime} - ${slot.endTime}`,
        price: slot.price,
      },
    });

    return { success: true, message: 'Payment confirmed! Your appointment is successfully booked.' };
  };

  // Customer: Cancel lock
  const cancelSlotLock = (slotId: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === slotId && a.status === 'pending_payment') {
          return {
            ...a,
            status: 'available',
            customerId: undefined,
            customerName: undefined,
            customerPhone: undefined,
            lockExpiresAt: undefined,
          };
        }
        return a;
      })
    );
    if (activeLockedSlot?.id === slotId) {
      setActiveLockedSlot(null);
      setLockRemainingSeconds(0);
    }
  };

  // Customer: Simulate 15m expiration
  const simulateLockTimeout = (slotId: string) => {
    handleLockExpired(slotId);
  };

  const clearExpiredWarning = () => {
    setExpiredWarningMessage(null);
  };

  // Barber: Toggle Manual Reservation (Yellow in UI)
  const toggleManualReservation = (slotId: string, notes?: string) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === slotId) {
          if (a.status === 'reserved_manual') {
            // Revert back to available (White)
            return {
              ...a,
              status: 'available',
              manualNotes: undefined,
              reservedAt: undefined,
            };
          } else if (a.status === 'available') {
            // Mark as reserved_manual (Yellow)
            return {
              ...a,
              status: 'reserved_manual',
              manualNotes: notes || 'Booked via phone / in-person walk-in',
              reservedAt: new Date().toISOString(),
            };
          }
        }
        return a;
      })
    );
  };

  // Barber: Create individual slot
  const createSlot = (
    slotDate: string,
    startTime: string,
    endTime: string,
    serviceName = 'Standard Haircut',
    price = 400000
  ) => {
    const currentBarberProfile = barbers.find((b) => b.userId === currentUser.id) || barbers[0];
    const newSlot: Appointment = {
      id: `slot-${Date.now()}`,
      barberProfileId: currentBarberProfile.id,
      slotDate,
      startTime,
      endTime,
      status: 'available',
      serviceName,
      price,
    };
    setAppointments((prev) => [...prev, newSlot]);
  };

  // Barber: Delete individual slot
  const deleteSlot = (slotId: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== slotId));
  };

  // Barber: Create schedule template
  const createTemplate = (name: string, slots: { startTime: string; endTime: string }[]) => {
    const currentBarberProfile = barbers.find((b) => b.userId === currentUser.id) || barbers[0];
    const newTemplateId = `tpl-${Date.now()}`;
    const newTemplate: ScheduleTemplate = {
      id: newTemplateId,
      barberProfileId: currentBarberProfile.id,
      name,
      isDefault: false,
      slots: slots.map((s, idx) => ({
        id: `ts-${Date.now()}-${idx}`,
        templateId: newTemplateId,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  // Barber: Apply reusable template to multiple dates
  const applyTemplateToDates = (templateId: string, dates: string[]) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const currentBarberProfile = barbers.find((b) => b.userId === currentUser.id) || barbers[0];

    const newSlots: Appointment[] = [];
    dates.forEach((dateStr) => {
      template.slots.forEach((ts) => {
        // Prevent duplicate start time on same date
        const exists = appointments.some(
          (a) =>
            a.barberProfileId === currentBarberProfile.id &&
            a.slotDate === dateStr &&
            a.startTime === ts.startTime
        );
        if (!exists) {
          newSlots.push({
            id: `appt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            barberProfileId: currentBarberProfile.id,
            slotDate: dateStr,
            startTime: ts.startTime,
            endTime: ts.endTime,
            status: 'available', // Empty available slots appear in WHITE
            serviceName: 'Standard Haircut',
            price: currentBarberProfile.pricePerSlot || 400000,
          });
        }
      });
    });

    setAppointments((prev) => [...prev, ...newSlots]);
  };

  // Barber: Update Profile
  const updateBarberProfile = (updated: Partial<BarberProfile>) => {
    const currentBarberProfile = barbers.find((b) => b.userId === currentUser.id) || barbers[0];
    const newProfile = { ...currentBarberProfile, ...updated };
    setBarbers((prev) => prev.map((b) => (b.id === newProfile.id ? newProfile : b)));
    if (selectedBarber?.id === newProfile.id) {
      setSelectedBarber(newProfile);
    }
  };

  // Barber: Add gallery image (Max 4 images enforcement)
  const addBarberImage = (
    imageUrl: string,
    caption: string,
    captionFa?: string
  ): { success: boolean; error?: string } => {
    const currentBarberProfile = barbers.find((b) => b.userId === currentUser.id) || barbers[0];
    if (currentBarberProfile.images.length >= 4) {
      return {
        success: false,
        error:
          language === 'fa'
            ? 'سقف بارگذاری گالری تکمیل است (حداکثر ۴ تصویر برای هر سالن آرایشگاه مجاز است).'
            : 'Maximum 4 images allowed per barbershop profile.',
      };
    }

    const newImage: BarberImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      barberProfileId: currentBarberProfile.id,
      imageUrl,
      caption,
      captionFa: captionFa || caption,
      displayOrder: currentBarberProfile.images.length + 1,
    };

    const updatedImages = [...currentBarberProfile.images, newImage];
    updateBarberProfile({ images: updatedImages });
    return { success: true };
  };

  // Barber: Delete gallery image
  const deleteBarberImage = (imageId: string) => {
    const currentBarberProfile = barbers.find((b) => b.userId === currentUser.id) || barbers[0];
    const updatedImages = currentBarberProfile.images.filter((img) => img.id !== imageId);
    updateBarberProfile({ images: updatedImages });
  };

  // Reviews: Add review
  const addReview = (barberProfileId: string, rating: number, comment: string) => {
    const now = Date.now();
    const newRev: Review = {
      id: `rev-${now}`,
      barberProfileId,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      rating,
      comment,
      createdAt: 'Just now',
      timestamp: now,
    };
    setReviews((prev) => [newRev, ...prev]);

    // Update average rating
    const barberRevs = [newRev, ...reviews.filter((r) => r.barberProfileId === barberProfileId)];
    const avg = barberRevs.reduce((acc, r) => acc + r.rating, 0) / barberRevs.length;

    setBarbers((prev) =>
      prev.map((b) => {
        if (b.id === barberProfileId) {
          return {
            ...b,
            ratingAvg: Math.round(avg * 10) / 10,
            reviewCount: barberRevs.length,
          };
        }
        return b;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        userCoords,
        setUserCoords,
        requestBrowserLocation,
        locationLoading,
        theme,
        setTheme,
        toggleTheme,
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
        barbers,
        selectedBarber,
        setSelectedBarber,
        updateBarberProfile,
        addBarberImage,
        deleteBarberImage,
        appointments,
        templates,
        reviews,
        activeLockedSlot,
        lockRemainingSeconds,
        expiredWarningMessage,
        clearExpiredWarning,
        holdSlotForPayment,
        confirmPaymentForSlot,
        cancelSlotLock,
        simulateLockTimeout,
        createSlot,
        deleteSlot,
        toggleManualReservation,
        createTemplate,
        applyTemplateToDates,
        addReview,
        activeTab,
        setActiveTab,
        isLoggedIn,
        loginUser,
        logoutUser,
        toasts,
        addToast,
        dismissToast,
        favoriteBarberIds,
        toggleFavoriteBarber,
        isBarberFavorite,
        isProfileModalOpen,
        setIsProfileModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
