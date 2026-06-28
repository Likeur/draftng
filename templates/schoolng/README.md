# Schoolng - Premium Academic Dashboard Template

**Schoolng** is a premium, high-performance academic administrator and registrar dashboard template built using the latest modern web standards: **Angular 22+** (Signals-first architecture) and **Tailwind CSS v4**.

Inspired by clean, minimalist visual aesthetics (like Vercel and Linear), it provides an immersive, responsive workspace tailored for managing classrooms, academic registries, and administrative operations.

---

## 🚀 Key Features

*   **Responsive Collapsible Sidebar & Navigation**: Features a dynamic sidebar layout with viewport responsiveness, sliding out of view on mobile, and automatic click-outside-to-close listeners.
*   **Dual Theme Engine**: High-contrast Dark Mode and White Light Mode with state persistence in `localStorage`.
*   **Semantic Color Token System**: Custom properties (`bg-theme-bg`, `bg-theme-panel`, `border-theme-border`, `text-theme-text-main`, `text-theme-text-muted`) prevent selector overrides and make dark/light transitions seamless.
*   **Staggered Entrance Animations**: Cards and charts fade and slide in progressively using `.animate-blur-slide` and staggered delay transitions.
*   **ApexCharts Integration**: Clean analytics widgets for student attendance, cohort distributions, GPA trends, and enrollment growth:
    *   **Smooth Sidebar Scaling**: The charts scale seamlessly alongside the collapsible sidebar using global CSS overrides (`width: 100% !important`) and a reactive redraw effect.
    *   **Hydration Compatible**: Delayed rendering (500ms startup delay) prevents SSR layout shifts during entrance animations.
    *   **Custom Dark Mode Tooltips**: Global overrides ensure tooltip menus match the active color theme and typography.
*   **Micro-interactions**: Subtle interactive scales on buttons and clickable items via `.clickable-scale`.

---

## 🛠️ Tech Stack & Configuration

*   **Core**: Angular 22+ (Standalone Components, Signals, new Control Flows).
*   **Styling**: Tailwind CSS v4 (configured via `@import` and `@theme` in `styles.css`).
*   **State Management**: Centralized single-point of truth `SchoolService` (`/src/app/shared/services/school.service.ts`).
*   **Charts**: `ng-apexcharts` (with reactive computed options).
*   **Icons**: Lucide SVG paths.
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
│   │   └── dashboard.ts      # Core academic overview dashboard layout
│   │       └── dashboard/    # Sub-widgets (KPIs, Activity Logs, Upcoming Events)
│   │           └── components/ # Custom ApexCharts (gpa-trend, enrollment-growth, etc.)
│   └── shared/
│       ├── components/       # Main topbar and navigation sidebar components
│       └── services/         # SchoolService containing reactive signals
└── styles.css                # Semantic styling system, custom scrollbars, animations, and tooltips
```

---

## 💻 Getting Started

### Development Server

Install dependencies and start the local development server:

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/`. The page will automatically reload as you modify source files.

### Building for Production

Compile and bundle the project assets for deployment:

```bash
npm run build
```

This compiles your project and stores static build artifacts in the `dist/` directory, optimized for loading speeds and performance.

### Run Unit Tests

Execute test suites using Vitest:

```bash
npm test
```

---

## 🤖 AI Developer Guidelines

If you are extending this template using an **AI coding assistant** (like Cursor, Gemini, or Claude), refer to the [AI_DEVELOPER_GUIDELINES.md](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/schoolng/AI_DEVELOPER_GUIDELINES.md) file at the root of the project. It provides strict step-by-step procedures, prompts, and layout templates for component additions and theme adjustments.
