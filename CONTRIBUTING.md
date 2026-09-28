# Contributing to Gheychi (قیچی)

Thank you for your interest in contributing to **Gheychi**! Gheychi is an open-source, production-grade appointment scheduling and real-time barbershop slot reservation platform built with Go, PostgreSQL, Redis, and React.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment for everyone. Please be respectful and constructive in all issues, pull requests, and discussions.

---

## Development Setup

### Prerequisites

- **Go 1.22+**
- **Node.js 20+** and **npm**
- **Docker** and **Docker Compose**
- **PostgreSQL 16+** and **Redis 7+** (or run via Docker Compose)

### Running Locally with Docker Compose

The fastest way to get the entire stack running:

```bash
# Clone the repository
git clone https://github.com/your-username/gheychi.git
cd gheychi

# Start Postgres, Redis, Go backend, and React frontend
docker compose up --build
```

Access points:
- **Frontend SPA**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080/api/v1`
- **PostgreSQL**: `localhost:5432` (`gheychi_db`)
- **Redis**: `localhost:6379`

### Running Services Independently

#### 1. Backend (Go)
```bash
cd backend
cp .env.example .env
go mod download
go run ./cmd/api
```

Run tests with race detection:
```bash
go test -v -race ./...
```

#### 2. Frontend (React 19 + TypeScript + Vite)
```bash
npm install
npm run dev
```

Run lint and type checking:
```bash
npm run lint
```

---

## Architectural Guidelines

### Backend (Clean Architecture)

- **Domain Layer** (`internal/domain`): Domain interfaces, core domain models, business error constants.
- **Repository Layer** (`internal/repository`): Direct database interactions, SQL queries, Redis lock mechanisms.
- **Service Layer** (`internal/service`): Business logic, orchestration, validation rules.
- **Handler Layer** (`internal/handler`): HTTP REST controllers, request deserialization, status codes.

### Distributed Locking Rules

- Slot temporary reservations MUST use Redis `SETNX` with a **15-minute lease (900 seconds)** (`gheychi:lock:slot:<uuid>`).
- Lock releases MUST use atomic Lua scripts to prevent releasing expired locks owned by subsequent processes.
- Database slot rows MUST be locked using `SELECT ... FOR UPDATE` during state transitions.

### Frontend Principles

- **React 19 & Functional Components**: Hooks, custom contexts, strict TypeScript interfaces.
- **Bilingual Internationalization (i18n)**: Every text string must be available in both Persian (Farsi RTL) and English (LTR).
- **Accessibility & Contrast**: Follow WCAG AA guidelines with accessible touch targets (minimum 44px on mobile) and clear keyboard navigation.
- **Anti-AI Slop**: No generic placeholder banners or fake telemetry graphs. Every metric and chart must compute from authentic domain state.

---

## Pull Request Workflow

1. **Fork** the repository and create a new feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit** your changes following conventional commits:
   - `feat: add barber analytics revenue breakdown`
   - `fix: prevent duplicate slot creation on template apply`
   - `docs: update docker compose instructions`
3. **Verify** your changes locally:
   ```bash
   # Frontend check
   npm run lint
   npm run build

   # Backend check
   cd backend && go test -v -race ./...
   ```
4. **Push** to your fork and submit a **Pull Request** to the `main` branch.
5. Ensure all CI/CD GitHub Actions checks pass.

---

## License

By contributing to Gheychi, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
