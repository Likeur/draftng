# ClinicNG - Open Source Medical Dashboard Template

**ClinicNG** is a free, open-source medical clinic dashboard template built using the latest modern web standards: **Angular 22+** (Signals-first architecture) and **Tailwind CSS v4**.

Inspired by clean, minimalist visual aesthetics (like Vercel and Linear), it provides a responsive workspace tailored for managing patients, appointments, and clinical operations.

---

## 🚀 Key Features

*   **Responsive Collapsible Sidebar & Navigation**: Dynamic sidebar layout with viewport responsiveness, sliding out of view on mobile, and automatic click-outside-to-close listeners.
*   **Dual Theme Engine**: High-contrast Dark Mode and White Light Mode with state persistence in `localStorage`.
*   **Semantic Color Token System**: Custom properties (`bg-theme-bg`, `bg-theme-panel`, `border-theme-border`, `text-theme-text-main`, `text-theme-text-muted`) prevent selector overrides and make dark/light transitions seamless.
*   **Staggered Entrance Animations**: Cards and charts fade and slide in progressively using `.animate-blur-slide` and staggered delay transitions.
*   **Micro-interactions**: Subtle interactive scales on buttons and clickable items via `.clickable-scale`.
*   **Reactive Filters**: Computed signal-based filtering on Patients and Appointments pages.

---

## 📁 Pages Included

| Page | Description |
|------|-------------|
| **Dashboard** | Overview with KPI cards, weekly patient visits chart, recent activity log, and today's appointments table |
| **Patients** | Full patient registry with search, status filters (Active/Critical/Inactive), and responsive data table |
| **Appointments** | Appointment planning with card-based layout, type filters, status counters, and action buttons |

---

## 🛠️ Tech Stack & Configuration

*   **Core**: Angular 22+ (Standalone Components, Signals, new Control Flows).
*   **Styling**: Tailwind CSS v4 (configured via `@import` and `@theme` in `styles.css`).
*   **State Management**: Centralized single-point of truth `ClinicService` (`/src/app/shared/services/clinic.service.ts`).
*   **Icons**: Lucide SVG paths (inline).
*   **Typography**: Geist & Geist Mono fonts.

---

## 📁 Directory Structure

```text
src/
├── app/
│   ├── app.html              # Main application shell wrapper
│   ├── app.routes.ts         # Lazy-loaded feature routing configurations
│   ├── app.ts                # App bootstrapper
│   ├── features/
│   │   ├── dashboard.ts      # Medical dashboard with KPIs, charts, activity
│   │   ├── patients.ts       # Patient list with filters and data table
│   │   └── appointments.ts   # Appointment cards with type/status filtering
│   └── shared/
│       ├── components/       # Sidebar and Topbar navigation components
│       └── services/         # ClinicService containing reactive signals
└── styles.css                # Semantic styling system, animations, and scrollbars
```

---

## 💻 Getting Started

### Development Server

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Navigate to `http://localhost:4200/`. The page will automatically reload as you modify source files.

### Building for Production

Compile and bundle the project assets for deployment:

```bash
npm run build
```

This compiles your project and stores static build artifacts in the `dist/` directory.

---

## 📄 License

This project is open-source and licensed under the [MIT License](../../LICENSE).
