// Localization dictionary for Gheychi (قیچی)

import { BarberProfile, BarberImage, Appointment, Review } from '../types';

export type Language = 'fa' | 'en';
export type Direction = 'rtl' | 'ltr';

export const TRANSLATIONS = {
  en: {
    appName: 'Gheychi',
    appNamePersian: 'قیچی',
    appTagline: 'Barbershop Booking & Schedule System',
    tabCustomer: 'Customer Portal (Nearby Discovery & 2-Day Booking)',
    tabBarber: 'Barber Dashboard (Schedule Table & Templates)',
    tabArchitecture: 'System Architecture & API Console',
    customerPortalTab: 'Customer Portal',
    customerPortalDesc: 'Nearby Discovery & 2-Day Booking',
    barberDashboardTab: 'Barber Dashboard',
    barberDashboardDesc: 'Schedule Table & Templates',
    architectureTab: 'Architecture & API',
    customerMode: 'Customer Mode',
    barberMode: 'Barber Mode',
    liveGps: 'Live GPS',
    detectingGps: 'Detecting GPS...',
    searchOrigin: 'Search Origin:',
    searchPlaceholder: 'Search shop name, barber, or service (e.g. Fade, Beard)...',
    discoverNearby: 'Discover Nearby Barbers',
    from: 'From',
    perSlot: '/ 30-min slot',
    viewAndBook: 'View Profile & Book',
    viewAndBookSub: '(Next 2 Days)',
    hoursAndContact: 'Hours & Contact',
    address: 'Address',
    pricingAndRating: 'Pricing & Rating',
    bookAppointmentTitle: 'Book an Appointment (Next 2 Days Only)',
    bookAppointmentSubtitle: 'Select an available slot below. Slots are locked for 15 minutes while you complete payment.',
    today: 'Today',
    tomorrow: 'Tomorrow',
    legendAvailable: 'White: Available Slot (Click to Reserve)',
    legendPaid: 'Green: Reserved & Paid Online',
    legendManual: 'Yellow: Phone / Walk-in Booking',
    legendPending: 'Blue: Temporary 15m Redis Hold',
    legendWhite: 'White = Empty available slot',
    legendGreen: 'Green = Reserved & paid online',
    legendYellow: 'Yellow = Manually reserved (phone / walk-in)',
    statusAvailable: 'Available',
    statusPaid: 'Reserved',
    statusManual: 'Phone Booking',
    statusHolding: 'Holding (15m)',
    holdingWindow: 'Holding Window',
    holdingNotice: 'This appointment slot is locked exclusively for your account. If payment is not completed within 15 minutes, the slot will be released back to the public.',
    totalDue: 'Total Due',
    confirmAndPay: 'Confirm & Pay',
    cancelHold: 'Cancel Hold',
    simulateExpiry: 'Simulate 15m Expiry',
    reservationExpired: 'Reservation Expired',
    dismiss: 'Dismiss',
    reviewsTitle: 'Customer Comments & Reviews',
    sortBy: 'Sort by:',
    newest: 'Newest',
    highestRated: 'Highest Rated',
    leaveReview: 'Leave a Review',
    ratingLabel: 'Rating:',
    reviewPlaceholder: 'Share your experience with this barber...',
    postReview: 'Post Review',
    reviewPublished: 'Review published successfully!',
    noReviewsYet: 'No reviews yet for this barbershop. Be the first to leave feedback!',
    galleryTitle: 'Barbershop Gallery',
    maxImagesNotice: 'Max 4 photos allowed',
    clickPhotoToPreview: 'Click photo to preview',

    // Barber Dashboard Tabs & Controls
    graphicalScheduleTab: 'Graphical Schedule Table',
    templatesTab: 'Schedule Templates',
    profileTab: 'Shop Profile',
    galleryTab: 'Gallery',
    dailyAppointmentTableTitle: 'Daily Appointments Table',
    dailyAppointmentTableSubtitle: 'Select a date to manage slots, toggle phone reservations, or add/delete slots.',
    dateLabel: 'Date:',
    togglePhoneNotice: 'Click any slot to toggle phone reservation (Yellow / White)',
    slotsFor: 'Slots for',
    totalSlots: 'total',
    clickToTogglePhone: 'Click any slot to toggle phone reservation (Yellow / White)',
    noSlotsConfigured: 'No appointment slots configured for this date yet.',
    markPhoneReserved: 'Mark as Phone Reserved (Yellow)',
    releaseToAvailable: 'Release to Available (White)',
    bookedViaApp: 'Booked via App',
    addSlotForDate: 'Add Individual Slot for',
    startTime: 'Start Time',
    endTime: 'End Time',
    price: 'Price',
    addSlot: 'Add Slot',
    deleteSlot: 'Delete Slot',

    // Templates
    templateManagerTitle: 'Reusable Daily Schedule Templates',
    templateManagerSubtitle: 'Create your daily schedule structure once (e.g. 09:00, 09:30, 10:00) and save it as a reusable template. Apply to multiple future dates with one click!',
    templatesTitle: 'Reusable Daily Schedule Templates',
    templatesDesc: 'Create your daily schedule structure once (e.g. 09:00, 09:30, 10:00) and save it as a reusable template. Apply to multiple future dates with one click!',
    step1Apply: '1. Apply Existing Template to Future Dates',
    step2Create: '2. Create New Schedule Template',
    chooseTemplate: 'Choose Template',
    targetHorizon: 'Target Horizon',
    horizon2Days: 'Next 2 Days',
    horizon7Days: 'Next 7 Days (1 Week)',
    horizon14Days: 'Next 14 Days (2 Weeks)',
    horizon30Days: 'Next 30 Days (1 Month)',
    batchApplyBtn: 'Batch Apply Template to Dates',
    batchApply: 'Batch Apply Template to Dates',
    templateNameLabel: 'Template Name',
    templateName: 'Template Name',
    slotIntervalLabel: 'Slot Interval',
    slotInterval: 'Slot Interval',
    operatingHoursLabel: 'Operating Hours',
    operatingHours: 'Operating Hours',
    to: 'to',
    generateTemplateBtn: 'Generate Template',
    generateTemplate: 'Generate Template',

    // Profile
    profileTitle: 'Barber & Shop Profile',
    profileSubtitle: 'Update your public profile, coordinates, and contact details.',
    shopNameLabel: 'Barbershop Name',
    barberNameLabel: 'Master Barber Name',
    contactPhoneLabel: 'Contact Phone',
    basePriceLabel: 'Base Price ($)',
    streetAddressLabel: 'Street Address',
    latitudeLabel: 'Latitude',
    longitudeLabel: 'Longitude',
    workingHoursStartLabel: 'Working Hours Start',
    workingHoursEndLabel: 'Working Hours End',
    bioLabel: 'Description / Bio',
    saveProfileBtn: 'Save Profile Settings',
    saveProfile: 'Save Profile Settings',
    savedSuccessfully: 'Saved successfully',

    // Gallery
    barbershopGalleryTitle: 'Barbershop Gallery',
    galleryNotice: 'Business Rule: A barber can upload maximum 4 images of their barbershop.',
    addNewPhotoTitle: 'Add New Photo to Gallery',
    activeImagesNotice: 'Images Active',
    maxImagesLimitReached: 'You have reached the maximum limit of 4 gallery images. Please delete an existing image before adding a new one.',
    maxImagesReached: 'You have reached the maximum limit of 4 gallery images. Please delete an existing image before adding a new one.',
    imageUrlLabel: 'Image URL',
    imageUrl: 'Image URL',
    captionLabel: 'Caption',
    caption: 'Caption',
    uploadImageBtn: 'Upload Image',
    uploadImage: 'Upload Image',
    deletePhoto: 'Delete Photo',

    // Login Page
    loginTitle: 'Sign in to Gheychi',
    loginSubtitle: 'Choose your role to access the relevant portal or manage appointments',
    loginBarberBtn: 'ورود آرایشگر',
    loginBarberEn: 'Barber Login',
    loginBarberDesc: 'Salon management, graphical schedule table, shift templates & portfolio gallery',
    loginCustomerBtn: 'ورود مشتری',
    loginCustomerEn: 'Customer Login',
    loginCustomerDesc: 'Discover nearby barbers, 2-day booking window & secure online payment',
    loginTab: 'Login',
    loginAsTitle: 'Instant Access & Login',
    phoneInputLabel: 'Mobile Phone Number (Optional)',
    phoneInputPlaceholder: '09121234567',
    enterAsBarber: 'Enter as Barber',
    enterAsCustomer: 'Enter as Customer',
    currentUserStatus: 'Currently Signed In As',
    switchAccount: 'Switch Role / Sign In',

    // Footer
    footerNote: 'Production-grade barbershop appointment system',
    languageSwitch: 'فارسی (RTL)',
    themeToggle: 'Toggle Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
  },
  fa: {
    appName: 'قیچی',
    appNamePersian: 'Gheychi',
    appTagline: 'سامانه رزرواسیون و نوبت‌دهی آنلاین آرایشگاه',
    tabCustomer: 'پورتال مشتریان (کشف نزدیک‌ترین‌ها و رزرو ۲ روزه)',
    tabBarber: 'داشبورد آرایشگر (جدول گرافیکی و الگوهای شیفت)',
    tabArchitecture: 'معماری سیستم و مشخصات فنی API',
    customerPortalTab: 'پورتال مشتریان',
    customerPortalDesc: 'جستجوی نزدیک‌ترین‌ها و رزرو ۲ روزه',
    barberDashboardTab: 'داشبورد آرایشگر',
    barberDashboardDesc: 'جدول گرافیکی نوبت‌ها و الگوها',
    architectureTab: 'معماری و API',
    customerMode: 'حالت مشتری',
    barberMode: 'حالت آرایشگر',
    liveGps: 'موقعیت‌یاب زنده',
    detectingGps: 'در حال دریافت GPS...',
    searchOrigin: 'مبدا جستجو:',
    searchPlaceholder: 'جستجوی نام سالن، آرایشگر یا خدمت (فید، ریش، کوتاهی)...',
    discoverNearby: 'کشف آرایشگاه‌های نزدیک',
    from: 'از',
    perSlot: '/ نوبت ۳۰ دقیقه‌ای',
    viewAndBook: 'مشاهده پروفایل و رزرو',
    viewAndBookSub: '(فقط ۲ روز آینده)',
    hoursAndContact: 'ساعت کاری و تماس',
    address: 'نشانی',
    pricingAndRating: 'قیمت و امتیاز',
    bookAppointmentTitle: 'رزرو نوبت آرایشگاه (فقط ۲ روز آینده)',
    bookAppointmentSubtitle: 'نوبت دلخواه را انتخاب کنید. پس از انتخاب، اسلات به مدت ۱۵ دقیقه در ردیس برای پرداخت شما قفل موقت می‌شود.',
    today: 'امروز',
    tomorrow: 'فردا',
    legendAvailable: 'سفید: اسلات خالی و آماده رزرو',
    legendPaid: 'سبز: رزرو قطعی و پرداخت‌شده آنلاین',
    legendManual: 'زرد: رزرو تلفنی یا حضوری توسط آرایشگر',
    legendPending: 'آبی: قفل موقت ۱۵ دقیقه‌ای ردیس',
    legendWhite: 'سفید = اسلات خالی آماده رزرو',
    legendGreen: 'سبز = رزرو قطعی و پرداخت‌شده آنلاین',
    legendYellow: 'زرد = رزرو دستی (تلفنی / حضوری)',
    statusAvailable: 'خالی (سفید)',
    statusPaid: 'رزرو شده (سبز)',
    statusManual: 'رزرو تلفنی (زرد)',
    statusHolding: 'در حال پرداخت (۱۵ دقیقه)',
    holdingWindow: 'مهلت تکمیل پرداخت',
    holdingNotice: 'این نوبت به صورت اختصاصی برای حساب شما قفل شده است. در صورت عدم پرداخت تا ۱۵ دقیقه، نوبت به صورت خودکار آزاد می‌شود.',
    totalDue: 'مبلغ قابل پرداخت',
    confirmAndPay: 'تایید و پرداخت آنلاین',
    cancelHold: 'انصراف از رزرو',
    simulateExpiry: 'شبیه‌سازی انقضای ۱۵ دقیقه',
    reservationExpired: 'مهلت رزرو به پایان رسید',
    dismiss: 'بستن',
    reviewsTitle: 'نظرات و دیدگاه‌های مشتریان',
    sortBy: 'مرتب‌سازی براساس:',
    newest: 'جدیدترین',
    highestRated: 'بیشترین امتیاز',
    leaveReview: 'ثبت نظر جدید',
    ratingLabel: 'امتیاز شما:',
    reviewPlaceholder: 'تجربه خود را از این آرایشگاه و کیفیت خدمات بنویسید...',
    postReview: 'ارسال نظر',
    reviewPublished: 'نظر شما با موفقیت ثبت شد!',
    noReviewsYet: 'هنوز نظری برای این آرایشگاه ثبت نشده است. اولین نظر را ثبت کنید!',
    galleryTitle: 'گالری تصاویر سالن',
    maxImagesNotice: 'حداکثر ۴ تصویر',
    clickPhotoToPreview: 'برای مشاهده روی عکس بزنید',

    // Barber Dashboard Tabs & Controls
    graphicalScheduleTab: 'جدول گرافیکی نوبت‌ها',
    templatesTab: 'الگوهای برنامه هفتگی',
    profileTab: 'مشخصات سالن و آرایشگر',
    galleryTab: 'گالری تصاویر',
    dailyAppointmentTableTitle: 'جدول گرافیکی مدیریت نوبت‌های روزانه',
    dailyAppointmentTableSubtitle: 'تاریخ مورد نظر را انتخاب نمایید تا بازه‌های زمانی را مدیریت کرده یا رزروهای تلفنی را ثبت کنید.',
    dateLabel: 'تاریخ:',
    togglePhoneNotice: 'با کلیک روی هر اسلات می‌توانید رزرو تلفنی (زرد/سفید) را تغییر دهید',
    slotsFor: 'نوبت‌های تاریخ',
    totalSlots: 'نوبت در کل',
    clickToTogglePhone: 'روی هر نوبت بزنید تا وضعیت رزرو تلفنی (زرد / سفید) تغییر کند',
    noSlotsConfigured: 'هنوز نوبتی برای این تاریخ ثبت نشده است. می‌توانید از الگوهای آماده استفاده کنید.',
    markPhoneReserved: 'علامت‌گذاری رزرو تلفنی (زرد)',
    releaseToAvailable: 'آزادسازی به اسلات خالی (سفید)',
    bookedViaApp: 'رزرو شده از طریق اپلیکیشن',
    addSlotForDate: 'افزودن نوبت تکی برای',
    startTime: 'ساعت شروع',
    endTime: 'ساعت پایان',
    price: 'قیمت ($)',
    addSlot: 'افزودن نوبت',
    deleteSlot: 'حذف نوبت',

    // Templates
    templateManagerTitle: 'الگوهای ساختار زمانی قابل استفاده مجدد',
    templateManagerSubtitle: 'یک بار ساختار زمانی روزانه (مثلاً ۰۹:۰۰، ۰۹:۳۰، ۱۰:۰۰ و ...) را تعریف و به عنوان الگو ذخیره کنید. سپس با یک کلیک آن را به چندین روز آینده اختصاص دهید!',
    templatesTitle: 'الگوهای ساختار زمانی قابل استفاده مجدد',
    templatesDesc: 'یک بار ساختار زمانی روزانه (مثلاً ۰۹:۰۰، ۰۹:۳۰، ۱۰:۰۰ و ...) را تعریف و به عنوان الگو ذخیره کنید. سپس با یک کلیک آن را به چندین روز آینده اختصاص دهید!',
    step1Apply: '۱. اعمال الگوی ذخیره‌شده به روزهای آینده',
    step2Create: '۲. ساخت الگوی جدید روزانه',
    chooseTemplate: 'انتخاب الگو',
    targetHorizon: 'افق زمانی اعمال',
    horizon2Days: '۲ روز آینده',
    horizon7Days: '۷ روز آینده (یک هفته)',
    horizon14Days: '۱۴ روز آینده (دو هفته)',
    horizon30Days: '۳۰ روز آینده (یک ماه)',
    batchApplyBtn: 'اعمال دسته‌جمعی الگو به تاریخ‌ها',
    batchApply: 'اعمال دسته‌جمعی الگو به تاریخ‌ها',
    templateNameLabel: 'نام الگو',
    templateName: 'نام الگو',
    slotIntervalLabel: 'فاصله زمانی هر نوبت',
    slotInterval: 'فاصله زمانی هر نوبت',
    operatingHoursLabel: 'ساعات کاری سالن',
    operatingHours: 'ساعات کاری سالن',
    to: 'تا',
    generateTemplateBtn: 'تولید و ذخیره الگو',
    generateTemplate: 'تولید و ذخیره الگو',

    // Profile
    profileTitle: 'اطلاعات سالن و استاد آرایشگر',
    profileSubtitle: 'ویرایش مشخصات عمومی، مختصات مکانی سالن و اطلاعات تماس',
    shopNameLabel: 'نام سالن آرایشگاه',
    barberNameLabel: 'نام استاد آرایشگر',
    contactPhoneLabel: 'شماره تلفن تماس',
    basePriceLabel: 'نرخ پایه نوبت ($)',
    streetAddressLabel: 'آدرس و نشانی دقیق',
    latitudeLabel: 'عرض جغرافیایی (Latitude)',
    longitudeLabel: 'طول جغرافیایی (Longitude)',
    workingHoursStartLabel: 'ساعت شروع کار',
    workingHoursEndLabel: 'ساعت پایان کار',
    bioLabel: 'توضیحات و بیوگرافی سالن',
    saveProfileBtn: 'ذخیره تنظیمات پروفایل',
    saveProfile: 'ذخیره تنظیمات پروفایل',
    savedSuccessfully: 'اطلاعات با موفقیت ذخیره شد',

    // Gallery
    barbershopGalleryTitle: 'گالری تصاویر سالن',
    galleryNotice: 'قانون کسب‌وکار: هر آرایشگر می‌تواند حداکثر ۴ تصویر از سالن خود بارگذاری کند.',
    addNewPhotoTitle: 'افزودن تصویر جدید به گالری',
    activeImagesNotice: 'تصویر فعال',
    maxImagesLimitReached: 'سقف ۴ تصویر پر شده است. برای افزودن عکس جدید، ابتدا یکی از تصاویر قبلی را حذف کنید.',
    maxImagesReached: 'سقف ۴ تصویر پر شده است. برای افزودن عکس جدید، ابتدا یکی از تصاویر قبلی را حذف کنید.',
    imageUrlLabel: 'آدرس اینترنتی تصویر (URL)',
    imageUrl: 'آدرس اینترنتی تصویر (URL)',
    captionLabel: 'عنوان تصویر',
    caption: 'عنوان تصویر',
    uploadImageBtn: 'بارگذاری تصویر',
    uploadImage: 'بارگذاری تصویر',
    deletePhoto: 'حذف عکس',

    // Login Page
    loginTitle: 'ورود به سامانه رزرواسیون قیچی',
    loginSubtitle: 'جهت دسترسی به پنل و استفاده از امکانات سامانه، نقش خود را انتخاب کنید',
    loginBarberBtn: 'ورود آرایشگر',
    loginBarberEn: 'ورود آرایشگر',
    loginBarberDesc: 'مدیریت سالن، جدول گرافیکی نوبت‌ها، الگوهای شیفت روزانه و گالری تصاویر',
    loginCustomerBtn: 'ورود مشتری',
    loginCustomerEn: 'ورود مشتری',
    loginCustomerDesc: 'مشاهده نزدیک‌ترین آرایشگاه‌ها، انتخاب نوبت ۲ روز آینده و رزرو با قفل ۱۵ دقیقه‌ای ردیس',
    loginTab: 'ورود به سامانه',
    loginAsTitle: 'ورود سریع به حساب کاربری',
    phoneInputLabel: 'شماره تلفن همراه (اختیاری)',
    phoneInputPlaceholder: '۰۹۱۲۱۲۳۴۵۶۷',
    enterAsBarber: 'ورود به عنوان آرایشگر',
    enterAsCustomer: 'ورود به عنوان مشتری',
    currentUserStatus: 'کاربر فعلی سیستم',
    switchAccount: 'تغییر نقش / ورود مجدد',

    // Footer
    footerNote: 'سامانه پیشرفته رزرو نوبت آرایشگاه و سالن مردانه',
    languageSwitch: 'English (LTR)',
    themeToggle: 'تغییر پوسته (روشن / تاریک)',
    lightMode: 'حالت روشن',
    darkMode: 'حالت تاریک',
  },
};

export function toPersianDigits(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

/**
 * Formats a monetary amount into Iranian Tomans:
 * e.g. 400,000 -> "۴۰۰,۰۰۰ تومان" (in Persian) or "400,000 Toman" (in English)
 */
export function formatPrice(amount: number, language: Language = 'fa'): string {
  // If amount is small (e.g. 30, 40), scale it up to realistic Toman:
  const normalized = amount < 1000 ? amount * 10000 : amount;
  const formattedWithCommas = Math.round(normalized).toLocaleString('en-US'); // "400,000"
  
  if (language === 'fa') {
    return `${toPersianDigits(formattedWithCommas)} تومان`;
  }
  return `${formattedWithCommas} Toman`;
}

export function getBarberName(barber: BarberProfile, language: Language): string {
  return (language === 'fa' && barber.barberNameFa) ? barber.barberNameFa : barber.barberName;
}

export function getShopName(barber: BarberProfile, language: Language): string {
  return (language === 'fa' && barber.shopNameFa) ? barber.shopNameFa : barber.shopName;
}

export function getAddress(barber: BarberProfile, language: Language): string {
  return (language === 'fa' && barber.addressFa) ? barber.addressFa : barber.address;
}

export function getBio(barber: BarberProfile, language: Language): string {
  return (language === 'fa' && barber.bioFa) ? barber.bioFa : barber.bio;
}

export function getServices(barber: BarberProfile, language: Language): string[] {
  return (language === 'fa' && barber.servicesFa && barber.servicesFa.length > 0)
    ? barber.servicesFa
    : barber.services;
}

export function getImageCaption(image: BarberImage, language: Language): string {
  return (language === 'fa' && image.captionFa) ? image.captionFa : image.caption;
}

export function getAppointmentServiceName(appointment: Appointment, language: Language): string {
  return (language === 'fa' && appointment.serviceNameFa) ? appointment.serviceNameFa : appointment.serviceName;
}

export function getReviewCustomer(review: Review, language: Language): string {
  return (language === 'fa' && review.customerNameFa) ? review.customerNameFa : review.customerName;
}

export function getReviewComment(review: Review, language: Language): string {
  return (language === 'fa' && review.commentFa) ? review.commentFa : review.comment;
}

export function getReviewCreatedAt(review: Review, language: Language): string {
  return (language === 'fa' && review.createdAtFa) ? review.createdAtFa : review.createdAt;
}

