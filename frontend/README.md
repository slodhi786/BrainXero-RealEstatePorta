# Real Estate Portal — Frontend (React + Vite + TypeScript)

This is the web frontend for the Real Estate Portal. It implements user authentication, property browsing with server‑side pagination/filters/sorting, property detail pages, and favorites with optimistic UI updates.

> **Monorepo:** This folder lives under `/frontend` in `BrainXero-RealEstatePorta`. The backend is in `/backend`.

---

## Features

- **Auth:** Register, Login (JWT), persisted session in `localStorage` and axios `Authorization` header.
- **Lists:** Server‑side pagination, sorting, and filters (search, city, type, price, beds, baths).
- **Details:** Property detail page with gallery and Google Maps link.
- **Favorites:** Add/remove favorites with optimistic UI and rollback on failure.
- **State:** Lightweight global state with **Zustand** (vanilla store + Context Provider), DI via `Services`.
- **Styling:** TailwindCSS, Lucide icons.
- **Type‑safe:** Full TypeScript types for DTOs and API responses.

---

## Tech Stack

- React 18, Vite, TypeScript
- React Router
- Zustand (vanilla store + context pattern)
- Axios
- TailwindCSS
- Lucide React
- ESLint + Prettier

---

## Prerequisites

- Node.js **18+** (or 20+)
- **npm** (recommended) or npm/yarn
- Backend API running (see `/backend` README)

---

## Setup

### 1) Install dependencies
```bash
cd frontend
npm install
# or: npm install / yarn
```

### 2) Environment
Create `.env` in `/frontend`:

```bash
# API base URL (Backend)
# Must be https
VITE_API_URL=https://localhost:7047/api
```
> Adjust to match your backend port/host and CORS settings.

### 3) Run
```bash
npm dev
# or: npm run dev / yarn dev
```
Open `http://localhost:5173` (default Vite dev port).

### 4) Build & Preview
```bash
npm build
npm preview
```

---

## Scripts
Common package scripts (see `package.json`):
```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --check .",
  "format:write": "prettier --write ."
}
```

---

## Project Structure

```
frontend/
  ├─ src/
  │  ├─ components/
  │  │  └─ common/
  │  ├─ pages/
  │  │  ├─ HomePage.tsx
  │  │  └─ PropertyDetailPage.tsx
  │  ├─ store/
  │  │  ├─ user/
  │  │  │  ├─ user.store.ts
  │  │  │  ├─ user-store.context.ts
  │  │  │  └─ user-store.provider.tsx
  │  │  └─ property/
  │  │     ├─ property.store.ts
  │  │     ├─ property-store.context.ts
  │  │     └─ property-store.provider.tsx
  │  ├─ services/
  │  │  ├─ api.service.ts       # axios instance + setAuthToken
  │  │  ├─ auth.service.ts      # returns ApiResponse<T>
  │  │  └─ property.service.ts  # returns ApiResponse<T>
  │  ├─ types/
  │  ├─ utils/
  │  │  └─ api.ts               # isOk(statusCode) helper
  │  ├─ App.tsx
  │  └─ main.tsx
  └─ index.html
```

---

## State & DI Pattern (Zustand)

- Stores are **vanilla** Zustand stores created via factory functions that receive `Services` (DI).
- Each store is exposed through a **Context Provider** (`*.provider.tsx`) and a **hook** (`use-*.ts`) to match the app’s pattern.
- Example usage:
```ts
// get actions/state
const loading = usePropertyStore(s => s.loading);
const fetchList = usePropertyStore(s => s.fetchList);
```

---

## API Contracts (Consuming)

All API endpoints return a wrapper:
```ts
type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  traceId?: string;
};
```

The frontend treats **2xx** codes as success:
```ts
isOk = (code?: number) => !!code && code >= 200 && code < 300;
```

- **Auth**
  - `POST /auth/register` → `ApiResponse<AuthResponse | null>`
  - `POST /auth/login` → `ApiResponse<AuthResponse>`
- **Properties**
  - `GET /property/list` → `ApiResponse<PagedResult<PropertyDto>>`
  - `GET /property/{id}` → `ApiResponse<PropertyDto>`
- **Favorites**
  - `POST /favorite/add/{id}` → `ApiResponse<unknown>`
  - `DELETE /favorite/remove/{id}` → `ApiResponse<boolean>`

> On `401` responses, an axios interceptor clears auth and navigates to `/login`.

---

## Routes

- `/` — Listings with server‑side pagination, filters, sorting
- `/property/:id` — Property details page
- `/login`, `/register` — Auth pages

---

## Notes for Reviewers

- **Optimistic UI:** The favorites button updates instantly and rolls back on API failure.
- **Error handling:** Store sets `message`/`traceId` for surfaceable errors. Validation errors from backend are available via `errors` in `ApiResponse`.
- **Type‑safety:** DTOs and API responses are strongly typed; axios services unwrap to `ApiResponse<T>`.

---

## License

MIT (see repository license file).
