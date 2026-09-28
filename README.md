# Gheychi (قیچی) — Production Barbershop Booking & Real-Time Schedule Platform

[![CI/CD Pipeline](https://github.com/gheychi/gheychi/actions/workflows/ci.yml/badge.svg)](https://github.com/gheychi/gheychi/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go 1.22](https://img.shields.io/badge/Go-1.22-blue.svg)](https://golang.org)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org)
[![Redis 7](https://img.shields.io/badge/Redis-7-dc382d.svg)](https://redis.io)

**Gheychi (قیچی)** is a production-grade, full-stack appointment reservation and schedule management platform designed specifically for modern barbershops, hair salons, and grooming studios.

Built with high-performance **Go (Gin)**, **PostgreSQL 16**, **Redis 7**, and **React 19**, Gheychi prevents double-booking using atomic distributed lease locks while offering an intuitive dual-portal experience for both master barbers and salon clients.

---

## Key Highlights

- **Anti-Double-Booking Distributed Locks**: Redis atomic `SETNX EX 900` (15-minute lease lock) backed by Lua scripts and PostgreSQL `SELECT ... FOR UPDATE` row locks.
- **Strict 2-Day Booking Horizon**: Customers view and reserve slots exclusively for **Today** and **Tomorrow**, maintaining razor-sharp salon capacity.
- **Smart Reusable Schedule Templates**: Barbers create daily slot intervals once (e.g., 30m, 45m, 60m) and batch-apply them across 7, 14, or 30 future dates with a single click.
- **Haversine Geolocation Discovery**: Real-time GPS and city-level geolocation distance computation with interactive recent search history and multi-tier pricing filters (Economy, Standard, Premium).
- **Business Rule Enforcement**:
  - Color-coded graphical table: **White** (Available), **Green** (Paid Confirmed), **Yellow** (Manual / Phone / Walk-in), **Sky Pulsing** (Active 15-min Lock).
  - Strict 4-photo gallery cap per salon enforced at both frontend, service layer, and PostgreSQL trigger function (`enforce_barber_images_limit`).
- **Barber Financial & Occupancy Analytics**: Real-time KPI cards (gross revenue, capacity occupancy, online vs phone ratio), peak hours breakdown, and weekly volume bar chart.
- **Verifiable Digital Booking Receipt**: Printable and shareable PDF ticket with tracking code, address, barber contact, and security QR code.
- **State Backup & JSON Sync**: 1-click database export and import to JSON for seamless migration and automated testing.
- **Bilingual (i18n)**: Native Persian (Farsi RTL) and English (LTR) with light/dark adaptive theming.

---

## System Architecture

```
[ Client / Browser ]
        │
        ▼ (Port 3000 / Nginx)
[ React 19 Frontend SPA ]
        │
        │ HTTP / REST API (Port 8080)
        ▼
[ Golang 1.22 Gin API Gateway ]
        │
        ├── [ JWT Auth Middleware & RBAC ]
        │
        ├── [ Booking Service ] ───► [ Redis 7 Distributed Lock ] (15-min TTL)
        │                                  │
        │                                  └── Atomic SETNX & Lua Release
        │
        └── [ GORM Repository ] ────► [ PostgreSQL 16 Database ]
                                           │
                                           ├── SELECT FOR UPDATE (Row Lock)
                                           ├── Haversine Geospatial Queries
                                           └── 4-Photo Limit Trigger
```

---

## Tech Stack & Clean Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | **Golang 1.22 + Gin & GORM** | Clean modular architecture (`cmd/`, `internal/domain`, `internal/repository`, `internal/service`, `internal/handler`). Minimal memory footprint, high concurrent throughput. |
| **Database** | **PostgreSQL 16** | Relational integrity, ACID compliance, `SELECT FOR UPDATE` transaction row locking, Haversine geospatial calculations. |
| **Distributed Lock** | **Redis 7 (Append-Only)** | High-throughput distributed lock with atomic `SETNX EX 900` (15-minute TTL) and Lua release scripts to eliminate double-booking during checkout. |
| **Frontend** | **React 19 + TypeScript + Vite** | Fast reactive SPA with clean component boundaries, dual Customer & Barber dashboards, strict WCAG AA contrast compliance. |
| **Styling** | **Tailwind CSS v4** | Clean utility design system, adaptive Dark/Light modes, zero-pill modern typography. |
| **DevOps** | **Docker & Docker Compose** | Multi-stage Dockerfiles for minimal production images, local orchestration for Postgres, Redis, Go backend, and React frontend. |
| **CI/CD** | **GitHub Actions** | Automated linting, Go unit/race tests, React build validation, and Docker container verification on push and pull requests. |

---

## Core Business Rules

1. **Barber Gallery Image Cap**: Barbers can upload a **maximum of 4 images** for their barbershop gallery. Enforced both at the application service layer and via a PostgreSQL `BEFORE INSERT` trigger function (`enforce_barber_images_limit`).
2. **Graphical Appointment Table Color Coding**:
   - **White**: Available empty slots (`status = 'available'`).
   - **Green**: Confirmed, paid reservations (`status = 'reserved_paid'`).
   - **Yellow**: Phone or walk-in reservations made directly by the barber (`status = 'reserved_manual'`).
   - **Sky/Pulsing**: Temporarily held slot under active 15-minute Redis lock (`status = 'pending_payment'`).
3. **Next 2-Day Booking Horizon**: Customers are strictly constrained to view and reserve slots for the **next 2 days only** (Today and Tomorrow).
4. **15-Minute Temporary Reservation Lock**:
   - When a customer clicks an available slot, it is locked in **Redis** with a **15-minute TTL (900 seconds)** using atomic `SETNX`.
   - The PostgreSQL row is updated in a transaction with `SELECT ... FOR UPDATE`.
   - If payment is completed within 15 minutes, the slot transitions to **Green** (`reserved_paid`).
   - If payment is **not** completed within 15 minutes, the lock expires, releasing the slot back to available (**White**), and a prominent red warning alert is displayed.
5. **Reusable Schedule Templates**:
   - The barber defines a daily slot pattern once (e.g., 09:00, 09:30, 10:00...).
   - The pattern is saved as a reusable **Schedule Template**.
   - The template can be batch-applied to future dates (e.g., next 7, 14, or 30 days) with a single click, eliminating manual daily slot creation.

---

## Directory Layout

```
.
├── backend/
│   ├── cmd/
│   │   └── api/
│   │       └── main.go               # Go entry point, router, and graceful shutdown
│   ├── internal/
│   │   ├── config/config.go          # Environment configuration loader
│   │   ├── domain/errors.go          # Domain error definitions
│   │   ├── entity/models.go          # GORM database entities & enums
│   │   ├── repository/
│   │   │   ├── postgres/postgres.go  # Haversine queries, transactions, CRUD
│   │   │   └── redis/lock_repo.go    # 15-minute atomic distributed lock & Lua scripts
│   │   ├── service/
│   │   │   ├── auth_service.go       # JWT auth & bcrypt password hashing
│   │   │   ├── barber_service.go     # Shop profiles, 4-photo cap, templates
│   │   │   └── booking_service.go    # Concurrency control & 2-day booking limit
│   │   ├── handler/handlers.go       # Gin REST HTTP handlers & DTO validation
│   │   └── middleware/middleware.go  # JWT token validation & RBAC guards
│   ├── pkg/
│   │   └── jwt/jwt.go                # Token pair generation (Access & Refresh)
│   ├── tests/
│   │   └── booking_service_test.go   # Unit and concurrency race tests
│   ├── Dockerfile                    # Multi-stage Go build (scratch container)
│   ├── go.mod
│   └── .env.example
├── migrations/
│   ├── 000001_init_schema.up.sql     # PostgreSQL tables, enums, triggers, indexes
│   ├── 000001_init_schema.down.sql   # Rollback script
│   └── seed.sql                      # Demo barbers, templates, reviews, and slots
├── nginx/
│   └── frontend.conf                 # Nginx SPA & API reverse proxy configuration
├── src/                              # React 19 Frontend Web Application
│   ├── components/
│   │   ├── Navbar.tsx                # Strict Top Bar with data sync & theme switcher
│   │   ├── CustomerView/
│   │   │   ├── NearbyBarbers.tsx     # Geolocation Haversine discovery, recent searches & price tiers
│   │   │   ├── BarberProfileModal.tsx# 2-day booking table & verified review system
│   │   │   ├── BookingReceiptModal.tsx# Verifiable printable PDF ticket with QR code
│   │   │   ├── AddReviewModal.tsx    # Interactive 5-star customer review submission
│   │   │   └── PaymentDrawer.tsx     # 15-min countdown timer & checkout simulation
│   │   ├── BarberView/
│   │   │   ├── BarberDashboard.tsx   # Graphical table, templates, and 4-image gallery
│   │   │   └── BarberAnalyticsTab.tsx# Financial revenue KPIs & peak hours breakdown
│   │   ├── common/
│   │   │   └── DataSyncModal.tsx     # Full JSON state export, import & factory reset
│   │   └── ArchitectureView.tsx      # Interactive architecture & API explorer
│   ├── store/AppContext.tsx          # Central state & Redis lock simulation
│   ├── utils/geo.ts                  # Haversine distance math & city GPS presets
│   ├── types.ts                      # TypeScript definitions
│   ├── mockData.ts                   # Initial demo dataset
│   ├── App.tsx                       # Root view router
│   └── main.tsx                      # Vite React entry point
├── .github/workflows/ci.yml          # GitHub Actions CI pipeline
├── docker-compose.yml                # Full stack container definition
├── CONTRIBUTING.md                   # Open-source contribution guidelines
├── LICENSE                           # MIT License
└── README.md
```

---

## Redis Locking Mechanism

### Key Pattern
`gheychi:lock:slot:<slot_uuid>`

### Acquisition (Atomic `SETNX EX`)
```go
// 15-minute lease:
success, err := redisClient.SetNX(ctx, "gheychi:lock:slot:" + slotID, customerID, 15 * time.Minute).Result()
```
- If `success == true`: Customer acquires exclusive 15-minute lock.
- If `success == false`: Returns `409 Conflict` (slot currently held by another user).

### Atomic Safe Release (Lua Script)
```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```
Ensures that a customer's slow request cannot accidentally delete another user's lock if the 15-minute lease has expired.

---

## Quickstart & Installation

### Option A: Running with Docker Compose (Recommended)

Start the entire production stack (PostgreSQL, Redis, Go Backend, and React Frontend):

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080/api/v1`
- **PostgreSQL**: `localhost:5432` (`gheychi_db`)
- **Redis**: `localhost:6379`

Seed data (demo barbers in Tehran Jordan, Valiasr, Saadi, and Zafaranieh, reusable schedule templates, reviews, and slots) is loaded automatically on database initialization.

### Option B: Local Development

#### 1. Start Backend
```bash
cd backend
cp .env.example .env
go mod download
go run ./cmd/api
```

#### 2. Start Frontend
```bash
npm install
npm run dev
```

---

## Running Tests

### Go Backend Unit & Concurrency Race Tests:
```bash
cd backend
go test -v -race ./tests/...
```

### Frontend TypeScript Verification & Lint:
```bash
npm run lint
```

---

## Contributing

We welcome community contributions, bug fixes, and feature proposals! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for our pull request process, coding guidelines, and development setup.

---

## License

This project is licensed under the [MIT License](./LICENSE) — free for personal, commercial, and educational use.
