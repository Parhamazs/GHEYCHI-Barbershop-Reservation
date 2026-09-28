import React, { useRef } from 'react';
import { useApp } from '../../store/AppContext';
import {
  Scissors,
  Printer,
  Download,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  Calendar,
  Layers,
  Sparkles,
  Smartphone,
  Cpu,
  Database,
  Lock,
  DollarSign,
  Star,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { toPersianDigits } from '../../utils/i18n';

export const MvpPdfDocument: React.FC = () => {
  const { setActiveTab } = useApp();
  const documentRef = useRef<HTMLDivElement>(null);

  // Trigger Native Browser Print (which saves as high-resolution PDF)
  const handlePrint = () => {
    window.print();
  };

  // Generate and download a standalone standalone HTML file of the document
  const handleDownloadHtml = () => {
    if (!documentRef.current) return;
    const content = documentRef.current.innerHTML;
    const fullHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>مستندات و کتابچه معرفی جامع سامانه رزرواسیون قیچی (نسخه MVP)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.7;
    }
    @media print {
      @page { size: A4; margin: 15mm; }
      body { background-color: #ffffff; color: #0f172a; font-size: 11pt; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; break-before: page; }
    }
  </style>
</head>
<body class="p-6 md:p-12 max-w-5xl mx-auto bg-white">
  ${content}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Gheychi-MVP-Customer-Presentation-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 max-w-5xl mx-auto">
      {/* Sticky Action Toolbar (Hidden in Print) */}
      <div className="no-print sticky top-20 z-30 mb-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-[#111622]/95 backdrop-blur-md p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              کتابچه جامع معرفی و ارائه MVP قیچی (مخصوص مشتریان و سرمایه‌گذاران)
            </h2>
            <p className="text-xs text-slate-500">
              فرمت استاندارد قطع A4 · زبان فارسی رسمی · آماده پرینت و ذخیره به عنوان فایل PDF
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>چاپ و ذخیره فایل PDF</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">دانلود فایل آفلاین سند</span>
          </button>

          <button
            onClick={() => setActiveTab('customer')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 px-3 py-2.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowRight className="h-4 w-4" />
            <span>بازگشت به برنامه</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Body */}
      <div
        ref={documentRef}
        id="mvp-pdf-document"
        className="pdf-container rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121c] p-6 sm:p-12 md:p-16 text-slate-900 dark:text-slate-100 shadow-2xl space-y-12 leading-relaxed"
        dir="rtl"
      >
        {/* =========================================================================
            صفحه جلد رسمی (COVER PAGE)
            ========================================================================= */}
        <div className="text-center py-12 sm:py-16 border-b border-slate-200 dark:border-slate-800 space-y-6">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-600/10 dark:bg-amber-500/10 border-2 border-blue-600 dark:border-amber-500 text-blue-600 dark:text-amber-400 shadow-xl mx-auto">
            <Scissors className="h-12 w-12 rotate-45" />
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-4 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>مستندات رسمی و راهنمای جامع محصول MVP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              سامانه رزرواسیون آنلاین قیچی (Gheychi)
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-normal">
              تشریح کامل داستان پیدایش، کلیه صفحات، حالت‌ها و سناریوهای کاربری جهت ارائه به مشتریان و آرایشگران
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-6 text-xs font-semibold">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[10px]">نسخه محصول</span>
              <span className="font-bold text-blue-600 dark:text-amber-400 text-sm">MVP تجاری ۱.۰</span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[10px]">پشته فنی</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Golang & Postgres</span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[10px]">مکانیزم قفل</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Redis ۱۵ دقیقه‌ای</span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3">
              <span className="text-slate-400 block text-[10px]">افق رزرواسیون</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">فقط ۲ روز آینده</span>
            </div>
          </div>

          <div className="pt-4 text-xs text-slate-400">
            تاریخ تنظیم: مهر ۱۴۰۵ (سپتامبر ۲۰۲۶) · آماده‌شده برای ارائه به مشتریان و سالن‌های آرایشگاهی سراسر کشور
          </div>
        </div>

        {/* =========================================================================
            فهرست عناوین و سرفصل‌ها (TABLE OF CONTENTS)
            ========================================================================= */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-6 space-y-4 pdf-avoid-break">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600 dark:text-amber-400" />
            <span>فهرست سرفصل‌های این سند</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">فصل اول: داستان پیدایش و فلسفه کسب‌وکار</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 ps-4 list-disc">
                <li>چالش‌های بنیادین نوبت‌دهی سنتی و کاغذی</li>
                <li>معضل بزرگ لغوهای بی‌خبر (No-Shows)</li>
                <li>نوآوری افق ۲ روزه قیچی (۲-Day Booking Horizon)</li>
                <li>قفل رزرواسیون ۱۵ دقیقه‌ای با Redis Distributed Lock</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">فصل دوم: تشریح تک‌تک صفحات و مودهای MVP</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 ps-4 list-disc">
                <li>صفحه ۱: ورود به سامانه و احراز هویت (ورود آرایشگر / ورود مشتری)</li>
                <li>صفحه ۲: پورتال کشف مشتری بر مبنای فاصله و GPS Haversine</li>
                <li>صفحه ۳: پروفایل آرایشگر، گالری ۴ عکس و انتخاب نوبت</li>
                <li>صفحه ۴: کشوی پرداخت، شمارشگر معکوس و قفل آنلاین</li>
                <li>صفحه ۵: داشبورد آرایشگر، ماتریس گرافیکی و رزرو دستی تلفنی</li>
                <li>صفحه ۶: سیستم الگوهای شیفت و اعمال دسته‌جمعی نوبت‌ها</li>
                <li>صفحه ۷: تنظیمات مشخصات سالن و قیمت خدمات به تومان</li>
                <li>صفحه ۸: سیستم اعلان‌های توست بلادرنگ و دوگانه تم سفید/آبی</li>
              </ul>
            </div>
          </div>
        </div>

        {/* =========================================================================
            فصل اول: داستان پیدایش و فلسفه شکل‌گیری محصول (APPLICATION STORY)
            ========================================================================= */}
        <div className="space-y-6 pdf-avoid-break">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              ۱
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              فصل اول: داستان پیدایش و فلسفه شکل‌گیری سامانه قیچی
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ۱.۱ معضلات ساختاری نوبت‌دهی سنتی در بازار آرایشگاه‌های مردانه
            </h3>
            <p>
              صنعت پیرایش و زیبایی مردانه در سال‌های اخیر دستخوش تحول و تخصصی‌تر شدن خدمات شده است؛ با این حال، شیوه
              ارتباطی مشتری و آرایشگر هنوز بر پایه تماس‌های تلفنی شتاب‌زده، پیامک‌های پراکنده و دفترچه‌های دست‌نویس نوبت‌دهی
              استوار است. این پارادایم سنتی سه معضل بنیادین را پدید می‌آورد:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 p-4 space-y-1.5">
                <span className="font-bold text-red-700 dark:text-red-400 block text-xs">۱. تداخل زمانی و نارضایتی</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  رزرو همزمان برای دو مشتری روی یک ساعت مشترک یا بی‌اطلاعی از تاخیرها که به معطلی‌های طولانی منجر می‌شود.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 space-y-1.5">
                <span className="font-bold text-amber-700 dark:text-amber-400 block text-xs">۲. اتلاف ظرفیت صندلی‌ها</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  ساعت‌های خالی پیش‌بینی‌نشده در اواسط شیفت کاری که موجب زیان مالی غیرقابل جبران برای سالن‌دار می‌شود.
                </p>
              </div>
              <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/60 dark:bg-purple-950/20 p-4 space-y-1.5">
                <span className="font-bold text-purple-700 dark:text-purple-400 block text-xs">۳. انقطاع تمرکز آرایشگر</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  زنگ خوردن مکرر تلفن همراه حین کوتاهی مو و تمرکز روی مشتری، که کیفیت سرویس را کاهش می‌دهد.
                </p>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white pt-3">
              ۱.۲ بحران اقتصادی «عدم حضور مشتری» (No-Shows) و راه‌حل نوآورانه قیچی
            </h3>
            <p>
              مطالعات میدانی نشان می‌دهد که در رزروهای سنتیِ بلندمدت (مثلاً یک یا دو هفته جلوتر)، بیش از ۳۵ درصد مشتریان
              بدون اطلاع قبلی حاضر نمی‌شوند. <strong>سامانه قیچی بر مبنای دو ستون طلایی این معادله را حل کرده است:</strong>
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4">
                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                    ستون اول: محدودیت سفت‌وسخت رزرواسیون فقط برای ۲ روز آینده (امروز و فردا)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    مشتری تنها مجاز است برای روز جاری یا روز بعد نوبت ثبت کند. این محدودیت هدفمند باعث می‌شود فرد نوبتی را
                    رزرو کند که برنامه قطعی برای آن دارد؛ نتیجه عملی این قانون، کاهش نرخ No-Show به زیر ۵ درصد است!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
                <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                    ستون دوم: قفل همزمانی توزیع‌شده ۱۵ دقیقه‌ای (Redis TTL Hold Lock)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    هنگامی که مشتری نوبتی را انتخاب می‌کند، آن اسلات به مدت دقیق ۱۵ دقیقه به صورت اتمیک در ردیس قفل
                    می‌شود. در طول این ۱۵ دقیقه هیچ کاربر دیگری نمی‌تواند اسلات را تصاحب کند (وضعیت در حال پرداخت/زرد). اگر
                    مشتری هزینه را پرداخت کند نوبت سبز (قطعی) می‌شود؛ و اگر انصراف دهد یا زمان سپری شود، اسلات به صورت
                    بلادرنگ به تقویم عمومی بازمی‌گردد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            فصل دوم: تشریح تک‌تک صفحات و مودهای MVP
            ========================================================================= */}
        <div className="pdf-page-break space-y-8 pt-6">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              ۲
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              فصل دوم: تشریح جامع تمام صفحات، حالت‌ها و سناریوهای کاربری MVP
            </h2>
          </div>

          {/* PAGE 1: LOGIN */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-3 pdf-avoid-break">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۱</span>
              <span className="text-xs text-slate-500 font-mono">Authentication & Role Selection</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              صفحه ورود به سامانه و انتخاب نقش (Login Page)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              این صفحه به عنوان ورودی اصلی پلتفرم طراحی شده و دو دکمه بزرگ و برجسته با اکشن‌های متمایز ارائه می‌دهد:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-blue-600 dark:text-amber-400 block mb-1">دکمه «ورود آرایشگر»:</span>
                ورود تک‌کلیکی به عنوان استاد کاوه رادمنش، انتقال مستقیم به داشبورد مدیریتی، جدول نوبت‌ها و گالری.
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-blue-600 dark:text-amber-400 block mb-1">دکمه «ورود مشتری»:</span>
                ورود تک‌کلیکی به عنوان آرش داوودی، انتقال مستقیم به پورتال جستجوی نزدیک‌ترین سالن‌ها و رزرو.
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              * علاوه بر ورود سریع، امکان درج شماره تلفن همراه دلخواه (سیم‌کارت‌های ایران مانند ۰۹۱۲...) جهت شبیه‌سازی دقیق احراز هویت پیامکی فراهم است.
            </p>
          </div>

          {/* PAGE 2: CUSTOMER DISCOVERY */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-3 pdf-avoid-break">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۲</span>
              <span className="text-xs text-slate-500 font-mono">Nearby Barbers Discovery</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              پورتال مشتریان و موتور کشف مکانی آرایشگاه‌ها (Customer Portal)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              صفحه اصلی مشتری با تمرکز بر یافتن سریع‌ترین و نزدیک‌ترین آرایشگر اطراف طراحی شده است:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 ps-4 list-disc">
              <li>
                <strong>مکان‌یابی زنده GPS با فرمول ریاضی Haversine:</strong> محاسبه دقیق فاصله هوایی بر حسب کیلومتر بین مختصات دستگاه کاربر و سالن‌های ثبت‌شده.
              </li>
              <li>
                <strong>فیلتر شهرهای اصلی ایران:</strong> انتخاب سریع میان تهران (جردن/نیاوران)، اصفهان، شیراز، مشهد و تبریز.
              </li>
              <li>
                <strong>کارت‌های اطلاعاتی جذاب:</strong> نمایش تصویر شاخص سالن، نام آرایشگر، امتیاز ستاره‌ای (از ۵)، نشانی محلی، فاصله تقریبی و قیمت پایه خدمات به تومان.
              </li>
              <li>
                <strong>دکمه فراخوان عمل (CTA):</strong> کلید «مشاهده پروفایل و رزرو نوبت» با رنگ آبی برجسته برای ورود به صفحه اختصاصی هر آرایشگر.
              </li>
            </ul>
          </div>

          {/* PAGE 3: BARBER PROFILE MODAL */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-3 pdf-avoid-break">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۳</span>
              <span className="text-xs text-slate-500 font-mono">Barber Profile & Schedule Modal</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              پروفایل تفصیلی سالن، گالری ۴ عکس و انتخاب نوبت
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              با کلیک روی هر آرایشگر، پنجره جامع مشخصات و نوبت‌ها باز می‌شود:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">گالری ۴ عکس و معرفی:</span>
                نمایش آلبوم عکس‌های باکیفیت سالن با کپشن‌های فارسی، بیوگرافی استادکار، سابقه فعالیت و لیست نرخ خدمات.
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">ماتریس انتخاب نوبت ۲ روزه:</span>
                تفکیک نوبت‌های امروز و فردا در باکس‌های زمانی ۳۰ دقیقه‌ای با رنگ‌های راهنما (سبز، زرد، قرمز، خاکستری).
              </div>
            </div>
          </div>

          {/* PAGE 4: PAYMENT DRAWER & LOCK */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-3 pdf-avoid-break">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۴</span>
              <span className="text-xs text-slate-500 font-mono">Payment Drawer & Redis Hold Lock</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              کشوی پرداخت آنلاین و مکانیزم شمارشگر ۱۵ دقیقه‌ای
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              به محض کلیک مشتری روی یک اسلات خالی، کشوی پرداخت باز شده و قفل موقت ردیس فعال می‌گردد:
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 ps-4 list-disc">
              <li>
                <strong>تایمر معکوس زنده:</strong> شمارش از ۱۵:۰۰ دقیقه به سمت صفر به صورت بلادرنگ.
              </li>
              <li>
                <strong>پیش‌نمایش فاکتور:</strong> نام خدمت (مثلاً اصلاح کلاسیک + شستشو)، نام سالن، ساعت دقیق نوبت، و مبلغ خالص به تومان.
              </li>
              <li>
                <strong>دکمه‌های تایید و شبیه‌ساز:</strong> امکان تایید پرداخت (تغییر نوبت به سبز دائمی) یا شبیه‌سازی انقضای زمان جهت تست رفتار سامانه.
              </li>
              <li>
                <strong>پیام اخطار قرمز در صورت انقضا:</strong> در صورت رسیدن زمان به صفر، نوبت فوراً آزاد شده و کادر اخطار قرمز ظاهر می‌گردد.
              </li>
            </ul>
          </div>

          {/* PAGE 5: BARBER DASHBOARD */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-3 pdf-avoid-break">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۵</span>
              <span className="text-xs text-slate-500 font-mono">Barber Matrix & Manual Phone Booking</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              داشبورد آرایشگر و جدول گرافیکی نوبت‌ها
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              پنل مدیریت روزانه آرایشگر با امکانات متناسب با نیازهای واقعی سالن‌داران ایرانی:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center font-bold">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                سبز: رزرو پرداخت‌شده
              </div>
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-300">
                قرمز: رزرو دستی تلفنی
              </div>
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300">
                زرد: قفل ۱۵ دقیقه‌ای
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300">
                خاکستری: اسلات آزاد
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
              <strong>پشتیبانی از مراجعین سنتی (تلفنی):</strong> آرایشگر می‌تواند با یک کلیک روی هر اسلات آزاد، آن را به عنوان «رزرو تلفنی» با رنگ قرمز علامت بزند تا نوبت در تقویم عمومی بسته شود؛ این قابلیت برای سازگاری کامل با مشتریان قدیمی الزامی است.
            </p>
          </div>

          {/* PAGE 6: SHIFT TEMPLATES */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-3 pdf-avoid-break">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۶</span>
              <span className="text-xs text-slate-500 font-mono">Shift Templates & Batch Generation</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              الگوهای شیفت روزانه و تولید دسته‌جمعی نوبت‌ها (Shift Templates)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              آرایشگر نیاز ندارد نوبت‌ها را تک‌تک وارد کند. با ابزار الگوهای آماده (شیفت صبح، شیفت عصر، تمام‌وقت)، می‌تواند
              با انتخاب چند تاریخ، تمام نوبت‌های بازه‌های انتخابی را با یک کلیک روی تقویم مستقر سازد.
            </p>
          </div>

          {/* PAGE 7 & 8: PROFILE & GALLERY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pdf-avoid-break">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-2">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۷</span>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">تنظیمات پروفایل و کسب‌وکار</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ویرایش آنلاین نام سالن، شماره تماس، آدرس دقیق، قیمت پایه هر نوبت اصلاح، و بیوگرافی استادکار به صورت زنده در دیتابیس.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-2">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۸</span>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">گالری ۴ عکس سالن (قانون بیزینس)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                امکان بارگذاری حداکثر ۴ تصویر از سالن و نمونه‌کارها همراه با توضیحات کپشن؛ اعتبارسنجی خودکار مانع آپلود بیش از ۴ تصویر می‌شود.
              </p>
            </div>
          </div>

          {/* PAGE 9 & 10: TOASTS & LIGHT MODE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pdf-avoid-break">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-2">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۹</span>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">سیستم اعلان‌های توست هوشمند</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                اطلاع‌رسانی بلادرنگ تایید رزرو قطعی با جزئیات کامل و انقضای ۱۵ دقیقه‌ای قفل با دکمه بازگشت و نوار تایمر انیمیشنی.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-2">
              <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-md">صفحه ۱۰</span>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">پوسته روشن با دکمه‌های آبی</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                پوسته سفید خالص همراه با دکمه‌های آبی رویال (Blue Buttons) و نوار شناور ناوبری موبایل برای تجربه کاربری ارگونومیک با یک دست.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            فصل سوم: معماری فنی و مهندسی سیستم
            ========================================================================= */}
        <div className="pdf-page-break space-y-6 pt-6">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              ۳
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              فصل سوم: مشخصات فنی، معماری زیرساخت و امنیت سیستم
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <p>
              سامانه قیچی بر مبنای استاندارد تولید صنعتی (Production-Grade Architecture) پیاده‌سازی شده تا پایداری و مقیاس‌پذیری
              در لحظات اوج ترافیک شب‌های عید و روزهای تعطیل تضمین شود:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 dark:text-amber-400 font-bold">
                  <Cpu className="h-5 w-5" />
                  <span>بک‌اند پرسرعت با Golang (Gin Engine)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  معماری میکروسرویس با Go با مصرف رم بسیار پایین، توان پردازش هزاران ریکوئست همزمان در ثانیه و تاخیر پاسخ‌دهی زیر ۲۰ میلی‌ثانیه.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Database className="h-5 w-5" />
                  <span>پایگاه داده رابطه‌ای PostgreSQL</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  تضمین یکپارچگی تراکنش‌ها (ACID)، ذخیره‌سازی نمایه‌های آرایشگران، لاگ نوبت‌ها، تاریخچه پرداخت‌ها و امتیازات کاربران.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                  <Lock className="h-5 w-5" />
                  <span>قفل توزیع‌شده با Redis (SETNX + TTL)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  جلوگیری اتمیک از رزرو همزمان (Race Conditions). انقضای خودکار نوبت پس از ۹۰۰ ثانیه با دستور انقضای محلی ردیس.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                  <Smartphone className="h-5 w-5" />
                  <span>طراحی مدرن موبایل و PWA Ready</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  رابط کاربری کامپوننت‌محور با ری‌اکت و تایپ‌اسکریپت، استایل‌های واکنش‌گرا و قابلیت نصب به عنوان وب‌اپلیکیشن روی اندروید و آیفون.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            فصل چهارم: پیشنهاد ارزش و جمع‌بندی ارائه به مشتری (PITCH SUMMARY)
            ========================================================================= */}
        <div className="pdf-page-break space-y-6 pt-6">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              ۴
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              فصل چهارم: پیشنهاد ارزش و مزیت رقابتی جهت ارائه به مشتریان
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              جدول مقایسه نوبت‌دهی سنتی تلفنی در مقابل پلتفرم قیچی:
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold">
                    <th className="p-3 border border-slate-200 dark:border-slate-800 text-start">شاخص عملکرد</th>
                    <th className="p-3 border border-slate-200 dark:border-slate-800 text-start text-red-600 dark:text-red-400">روش سنتی تلفنی و دفتری</th>
                    <th className="p-3 border border-slate-200 dark:border-slate-800 text-start text-blue-600 dark:text-amber-400">سامانه هوشمند قیچی (MVP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">نرخ لغو و غیبت (No-Show)</td>
                    <td className="p-3 text-red-600 dark:text-red-400">بالای ۳۰٪ تا ۴۰٪ در نوبت‌های آتی</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">کمتر از ۵٪ به دلیل افق ۲ روزه</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">تداخل رزروهای همزمان</td>
                    <td className="p-3 text-slate-500">مکرر به دلیل خطای انسانی یادداشت‌ها</td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">صفر (قفل توزیع‌شده ردیس SETNX)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">تمرکز آرایشگر در حین کار</td>
                    <td className="p-3 text-slate-500">پاسخگویی مداوم به تماس‌ها حین کوتاهی</td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">۱۰۰٪ تمرکز روی مشتری، رزرو خودکار</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">کشف مشتریان جدید منطقه‌ای</td>
                    <td className="p-3 text-slate-500">محدود به معرفین و مراجعین عبوری</td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">کشف آنلاین بر پایه فاصله زنده GPS</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">سازگاری با مشتریان قدیمی</td>
                    <td className="p-3 text-slate-500">فقط تماس تلفنی</td>
                    <td className="p-3 text-slate-800 dark:text-slate-200">پشتیبانی تلفنی دستی + رزرو آنلاین مدرن</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                گام‌های بعدی توسعه و ادغام تجاری:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                  <span className="font-bold text-blue-600 block mb-1">فاز ۲: درگاه پرداخت شتاب</span>
                  اتصال به پروتکل‌های شاپرک و درگاه‌های بانکی عضو شتاب با تسهیم خودکار سهم آرایشگر.
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                  <span className="font-bold text-blue-600 block mb-1">فاز ۳: پنل پیامک خدماتی</span>
                  ارسال پیامک یادآوری ۲ ساعت قبل از نوبت و ارسال لینک لغو در موارد اضطراری.
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                  <span className="font-bold text-blue-600 block mb-1">فاز ۴: باشگاه وفاداری</span>
                  تخفیف هوشمند برای مشتریان ثابت و سیستم پاداش معرفی دوستان به سالن.
                </div>
              </div>
            </div>
          </div>

          {/* Official Seal & Signature */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-blue-600 dark:text-amber-400" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                سامانه رزرواسیون قیچی — تاییدیه مستندات فنی و نسخه MVP
              </span>
            </div>
            <div className="text-slate-500 font-mono text-[11px]" dir="ltr">
              Gheychi Platform · MVP Release v1.0.0 · Tehran, Iran
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
