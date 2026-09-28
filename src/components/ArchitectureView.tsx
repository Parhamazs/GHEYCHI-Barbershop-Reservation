import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Database, Server, Cpu, ShieldCheck, Terminal, Layers, Box, GitBranch } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const { language, t } = useApp();
  const [activeSection, setActiveSection] = useState<'overview' | 'redis' | 'postgres' | 'golang' | 'docker'>('overview');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title */}
      <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {language === 'fa' ? 'معماری فنی سامانه قیچی (Gheychi)' : 'System Architecture & Engineering Specification'}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Gheychi (قیچی) — Golang · PostgreSQL · Redis Lock · React · Docker Compose · GitHub Actions
            </p>
          </div>

          <div className="overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
            <div className="flex items-center gap-1.5 text-xs whitespace-nowrap min-w-max">
              <button
                onClick={() => setActiveSection('overview')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeSection === 'overview' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'fa' ? 'نمای کلی و APIها' : 'Overview & APIs'}
              </button>
              <button
                onClick={() => setActiveSection('redis')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeSection === 'redis' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'fa' ? 'قفل موقت ردیس (۱۵ دقیقه)' : 'Redis 15m Lock'}
              </button>
              <button
                onClick={() => setActiveSection('postgres')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeSection === 'postgres' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'fa' ? 'طرح دیتابیس پستگرس' : 'PostgreSQL Schema'}
              </button>
              <button
                onClick={() => setActiveSection('golang')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeSection === 'golang' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'fa' ? 'بک‌اند گولنگ' : 'Golang Backend'}
              </button>
              <button
                onClick={() => setActiveSection('docker')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeSection === 'docker' ? 'bg-amber-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'fa' ? 'داکر و CI/CD' : 'Docker & CI/CD'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: OVERVIEW & APIS */}
      {activeSection === 'overview' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-5">
              <div className="flex items-center gap-3 text-amber-400 mb-2">
                <Server className="h-5 w-5 shrink-0" />
                <h3 className="text-sm font-semibold text-white">Go Backend (Gin + GORM)</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'معماری لایه‌ای تمیز: cmd/، internal/domain، repository، service و handler. احراز هویت با JWT و توکن‌های تجدید دوره‌ای (Refresh Token).'
                  : 'Layered clean architecture: cmd/, internal/domain, repository, service, and handler. JWT authentication with refresh token rotation.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-5">
              <div className="flex items-center gap-3 text-sky-400 mb-2">
                <Cpu className="h-5 w-5 shrink-0" />
                <h3 className="text-sm font-semibold text-white">Redis Lock Engine</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'دستور اتمیک SET lock:slot:id customer_id NX EX 900 تضمین می‌کند که هر نوبت دقیقاً ۱۵ دقیقه برای پرداخت کاربر رزرو موقت شده و بدون هیچ مسابقه داده‌ای رها یا نهایی گردد.'
                  : 'Atomic SET lock:slot:id customer_id NX EX 900 ensures exactly 15 minutes of payment holding without race conditions or double-booking.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-5">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Database className="h-5 w-5 shrink-0" />
                <h3 className="text-sm font-semibold text-white">PostgreSQL Storage</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'fa'
                  ? 'طراحی ساختار رابطه‌ای با فرمول مکانی Haversine، تریگرهای اعتبارسنجی محدودیت حداکثر ۴ عکس گالری و تراکنش‌های ایزوله روی جدول نوبت‌ها.'
                  : 'Relational schema with Haversine distance spatial queries, PostgreSQL triggers enforcing max 4 gallery images, and strict transaction isolation on reservations.'}
              </p>
            </div>
          </div>

          {/* REST API Endpoints Specification */}
          <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">
              {language === 'fa' ? 'مشخصات کامل اندپوینت‌های RESTful API' : 'RESTful API Endpoints Specification'}
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Endpoint</th>
                    <th className="py-2.5 px-3">Access</th>
                    <th className="py-2.5 px-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">POST</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/auth/register</td>
                    <td className="py-2.5 px-3 text-slate-400">Public</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'ثبت‌نام مشتری یا آرایشگر با هش bcrypt' : 'Register customer or barber with bcrypt hash'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">POST</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/auth/login</td>
                    <td className="py-2.5 px-3 text-slate-400">Public</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'ورود و صدور JWT و Refresh Token' : 'Generate JWT access & refresh tokens'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">GET</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/barbers/nearby</td>
                    <td className="py-2.5 px-3 text-slate-400">Public</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'جستجوی آرایشگاه‌های نزدیک بر اساس مختصات Haversine' : 'Haversine great-circle distance query'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-sky-400 font-bold">GET</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/barbers/:id/slots</td>
                    <td className="py-2.5 px-3 text-slate-400">Public</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'مشاهده نوبت‌های فقط ۲ روز آینده (امروز و فردا)' : 'View slots for next 2 days only (Today & Tomorrow)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">POST</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/customer/slots/:id/lock</td>
                    <td className="py-2.5 px-3 text-amber-300">Customer</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'ایجاد قفل توزیع‌شده ۱۵ دقیقه‌ای در ردیس' : 'Acquire 15-minute temporary lock in Redis'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">POST</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/customer/slots/:id/pay</td>
                    <td className="py-2.5 px-3 text-amber-300">Customer</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'تایید پرداخت و تبدیل وضعیت به سبز (قطعی)' : 'Confirm payment, finalize to reserved_paid (Green)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-purple-400 font-bold">POST</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/barber/templates</td>
                    <td className="py-2.5 px-3 text-purple-300">Barber</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'ایجاد و ذخیره الگوی برنامه زمانی روزانه' : 'Save reusable schedule slot pattern'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-purple-400 font-bold">POST</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/barber/templates/apply</td>
                    <td className="py-2.5 px-3 text-purple-300">Barber</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'اعمال دسته‌ای الگو برای روزهای آینده' : 'Batch instantiate template slots for future dates'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-orange-400 font-bold">PATCH</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/barber/appointments/:id/toggle-manual</td>
                    <td className="py-2.5 px-3 text-purple-300">Barber</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'رزرو دستی تلفنی / حضوری آرایشگر (زرد / سفید)' : 'Toggle phone booking status (Yellow / White)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-purple-400 font-bold">POST</td>
                    <td className="py-2.5 px-3 text-slate-200">/api/v1/barber/gallery</td>
                    <td className="py-2.5 px-3 text-purple-300">Barber</td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {language === 'fa' ? 'آپلود تصویر (با الزام حداکثر ۴ عکس)' : 'Upload image (Enforces strict max 4 constraint)'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: REDIS LOCKING STRATEGY */}
      {activeSection === 'redis' && (
        <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">
            {language === 'fa' ? 'معماری قفل موقت رزرو در ردیس (Redis)' : 'Redis Temporary Reservation Lock Architecture'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'fa'
              ? 'جهت جلوگیری از رزرواسیون تکراری و تداخل همزمان (Race Conditions) و فراهم آوردن فرصت پرداخت مطمئن برای مشتری، سیستم قیچی از قفل توزیع‌شده با طول عمر ۱۵ دقیقه در ردیس استفاده می‌کند:'
              : 'To prevent double-booking while giving customers a fair payment holding window, Gheychi implements a distributed lock with Redis:'}
          </p>

          <div className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-3 overflow-x-auto" dir="ltr">
            <p className="text-amber-400">// 1. Atomic acquisition command in Go</p>
            <p className="text-slate-100">
              SET gheychi:lock:slot:&lt;slot_id&gt; &lt;customer_id&gt; NX EX 900
            </p>
            <p className="text-slate-400">// TTL = 900 seconds (15 minutes). NX flag ensures atomic SET-if-Not-eXists.</p>

            <p className="text-amber-400 pt-2">// 2. PostgreSQL sync transaction (SELECT FOR UPDATE)</p>
            <p className="text-slate-100">
              UPDATE appointments SET status = 'pending_payment', lock_expires_at = NOW() + INTERVAL '15 min' WHERE id = :slot_id AND status = 'available';
            </p>

            <p className="text-amber-400 pt-2">// 3. Atomic release via Redis Lua script (prevents deleting another user's lock if expired)</p>
            <p className="text-emerald-400">
              {`if redis.call("get", KEYS[1]) == ARGV[1] then\n    return redis.call("del", KEYS[1])\nelse\n    return 0\nend`}
            </p>
          </div>

          <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-200">
            <strong className="text-red-300">{language === 'fa' ? 'مدیریت انقضای زمان:' : 'Expiration Handling:'}</strong>{' '}
            {language === 'fa'
              ? 'در صورتی که ۱۵ دقیقه بگذرد و پرداخت ثبت نشود، کلید ردیس منقضی گشته و نوبت دوباره آزاد (سفید) می‌گردد و هشدار قرمز نمایش داده می‌شود:'
              : 'When 15 minutes expire without payment confirmation, Redis automatically discards the key via its TTL. Subsequent queries release the PostgreSQL slot back to available (White) and trigger the required warning:'}
            <span className="mt-1.5 block font-semibold text-red-300 italic">
              {language === 'fa' ? '«لطفاً پرداخت خود را تکمیل نمایید. مهلت رزرو موقت ۱۵ دقیقه‌ای شما به پایان رسیده است.»' : '"Please complete your payment. Your 15-minute reservation hold has expired."'}
            </span>
          </div>
        </div>
      )}

      {/* SECTION: POSTGRESQL SCHEMA */}
      {activeSection === 'postgres' && (
        <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">
            {language === 'fa' ? 'طرح پایگاه‌داده رابطه‌ای PostgreSQL' : 'PostgreSQL Relational Schema'}
          </h3>
          <p className="text-xs text-slate-300">
            {language === 'fa' ? 'تعریف‌شده در مایگریشن‌های سیستم:' : 'Created in migrations/000001_init_schema.up.sql:'}
          </p>

          <pre className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-96" dir="ltr">
{`-- Enums
CREATE TYPE user_role AS ENUM ('barber', 'customer', 'admin');
CREATE TYPE appointment_status AS ENUM ('available', 'pending_payment', 'reserved_paid', 'reserved_manual', 'cancelled');

-- Barber Profiles & Geolocation
CREATE TABLE barber_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    shop_name VARCHAR(200) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 30,
    price_per_slot NUMERIC(10, 2) NOT NULL DEFAULT 25.00
);

-- Maximum 4 Images Database Trigger
CREATE OR REPLACE FUNCTION enforce_barber_images_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM barber_images WHERE barber_profile_id = NEW.barber_profile_id) >= 4 THEN
        RAISE EXCEPTION 'A barber cannot have more than 4 gallery images';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barber_profile_id UUID NOT NULL REFERENCES barber_profiles(id),
    customer_id UUID REFERENCES users(id),
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status NOT NULL DEFAULT 'available',
    manual_notes VARCHAR(255),
    price NUMERIC(10, 2) NOT NULL,
    CONSTRAINT uq_barber_slot UNIQUE (barber_profile_id, slot_date, start_time)
);`}
          </pre>
        </div>
      )}

      {/* SECTION: GOLANG BACKEND */}
      {activeSection === 'golang' && (
        <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">
            {language === 'fa' ? 'ساختار بک‌اند گولنگ (Clean Architecture)' : 'Go Backend Layout'}
          </h3>
          <p className="text-xs text-slate-300">
            {language === 'fa' ? 'طراحی شده بر اساس الگوهای استاندارد کدنویسی تمیز در گو:' : 'Engineered using standard production Go idioms:'}
          </p>
          <div className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto" dir="ltr">
            <p className="text-amber-400 font-semibold">backend/</p>
            <p className="pl-4">├── cmd/api/main.go <span className="text-slate-500">// Entrypoint, router, graceful shutdown</span></p>
            <p className="pl-4">├── internal/</p>
            <p className="pl-8">├── config/config.go <span className="text-slate-500">// Environment configs</span></p>
            <p className="pl-8">├── entity/models.go <span className="text-slate-500">// GORM models & constraints</span></p>
            <p className="pl-8">├── repository/</p>
            <p className="pl-12">├── postgres/ <span className="text-slate-500">// Haversine distance, queries, transactions</span></p>
            <p className="pl-12">└── redis/ <span className="text-slate-500">// 15-minute distributed lock repo</span></p>
            <p className="pl-8">├── service/</p>
            <p className="pl-12">├── auth_service.go <span className="text-slate-500">// JWT + refresh tokens</span></p>
            <p className="pl-12">├── barber_service.go <span className="text-slate-500">// Templates, 4-photo limit</span></p>
            <p className="pl-12">└── booking_service.go <span className="text-slate-500">// 2-day limit, Redis locking</span></p>
            <p className="pl-8">├── handler/handlers.go <span className="text-slate-500">// Gin REST endpoints</span></p>
            <p className="pl-8">└── middleware/ <span className="text-slate-500">// JWT & RBAC (Barber/Customer)</span></p>
            <p className="pl-4">├── tests/ <span className="text-slate-500">// Unit & concurrency booking tests</span></p>
            <p className="pl-4">└── Dockerfile <span className="text-slate-500">// Multi-stage Go 1.22 scratch image</span></p>
          </div>
        </div>
      )}

      {/* SECTION: DOCKER & CI/CD */}
      {activeSection === 'docker' && (
        <div className="rounded-xl border border-slate-800 bg-[#111622] p-4 sm:p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">
            {language === 'fa' ? 'کانفیگ داکر کامپوز و خط لوله گیت‌هاب اکشنز' : 'Docker Compose & GitHub Actions Setup'}
          </h3>
          <p className="text-xs text-slate-300">
            {language === 'fa' ? 'راه‌اندازی یکپارچه تمام زیرساخت با یک دستور:' : 'Spin up the entire stack with a single command:'}
          </p>
          <div className="rounded-lg bg-slate-950 p-4 font-mono text-xs text-amber-300" dir="ltr">
            docker compose up --build
          </div>

          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <p><strong className="text-white">{language === 'fa' ? 'سرویس‌های موجود در فایل docker-compose.yml:' : 'Services included in docker-compose.yml:'}</strong></p>
            <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 space-y-1.5 text-slate-400">
              <li><strong className="text-slate-200">postgres</strong> (Port 5432) — {language === 'fa' ? 'مایگریشن‌ها و داده‌های اولیه را در آغاز به شکل خودکار اجرا می‌کند' : 'Auto runs migrations and seed data on startup'}</li>
              <li><strong className="text-slate-200">redis</strong> (Port 6379) — {language === 'fa' ? 'کش پایدار و قفل توزیع‌شده ۱۵ دقیقه‌ای' : 'Persistent append-only cache & 15m distributed lock'}</li>
              <li><strong className="text-slate-200">backend</strong> (Port 8080) — {language === 'fa' ? 'ای‌پی‌آی کامپایل‌شده گولنگ روی ایمیج کم‌حجم آلپاین' : 'Golang API compiled into lightweight Alpine container'}</li>
              <li><strong className="text-slate-200">frontend</strong> (Port 3000) — {language === 'fa' ? 'اپلیکیشن ری‌اکت سرو شده با Nginx با قابلیت پروکسی معکوس' : 'React SPA served with Nginx'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
