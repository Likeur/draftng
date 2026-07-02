# StoreNG - Open Source E-Commerce Dashboard Template

**StoreNG** is a free, open-source e-commerce dashboard template built using the latest modern web standards: **Angular 22+** (Signals-first architecture) and **Tailwind CSS v4**.

Inspired by clean, minimalist visual aesthetics (like Vercel and Linear), it provides a responsive workspace tailored for managing products, orders, customers, and sales analytics.

---

## 🚀 Key Features

*   **Responsive Collapsible Sidebar & Navigation**: Dynamic sidebar layout with viewport responsiveness, sliding out of view on mobile, and automatic click-outside-to-close listeners. Sidebar sections (Catalog, Sales, Customers, Analytics) are collapsible with smooth transitions.
*   **Dual Theme Engine**: High-contrast Dark Mode and White Light Mode with state persistence in `localStorage`.
*   **Semantic Color Token System**: Custom properties (`bg-theme-bg`, `bg-theme-panel`, `border-theme-border`, `text-theme-text-main`, `text-theme-text-muted`) prevent selector overrides and make dark/light transitions seamless.
*   **Staggered Entrance Animations**: Cards and charts fade and slide in progressively using `.animate-blur-slide` and staggered delay transitions.
*   **Micro-interactions**: Subtle interactive scales on buttons and clickable items via `.clickable-scale`.
*   **Period-Based Data Filtering**: Reactive KPIs and charts that update based on selected period (daily, weekly, monthly, yearly) using Angular Signals and computed properties.
*   **Custom Date Pickers**: Built-from-scratch date picker components with range highlighting, min/max date constraints, and smooth animations.
*   **Interactive Charts**: 4 ApexCharts (Revenue Trends, Sales by Category, Revenue Share, Order Fulfillment) with dark mode support.

---

## 📁 Pages Included

| Page | Description |
|------|-------------|
| **Dashboard** | Overview with KPI cards, revenue trends chart, sales by category, revenue share, order fulfillment, and recent orders table |
| **Products** | Full product catalog with search, category filters, and responsive data table |
| **Orders** | Order management with card-based layout, status filters, and action buttons |
| **Customers** | Customer registry with search, status filters, and purchase history |

---

## 🛠️ Tech Stack & Configuration

*   **Core**: Angular 22+ (Standalone Components, Signals, new Control Flows).
*   **Styling**: Tailwind CSS v4 (configured via `@import` and `@theme` in `styles.css`).
*   **State Management**: Centralized single-point of truth `StoreService` (`/src/app/shared/services/store.service.ts`).
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
│   │   ├── dashboard.ts      # E-commerce dashboard with KPIs, charts, activity
│   │   ├── products.ts       # Product catalog with filters and data table
│   │   ├── orders.ts         # Order management with status filtering
│   │   └── customers.ts      # Customer registry with purchase history
│   └── shared/
│       ├── components/       # Sidebar, Topbar, and UI components (ui-select, ui-datepicker)
│       └── services/         # StoreService containing reactive signals
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
