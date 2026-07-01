# AI-Driven Customization & Extension Guidelines

This guide is designed for **AI coding assistants** and developers using AI to customize, extend, and manage the `clinicng` workspace template. It contains design specifications, architecture paradigms, writing tone, and step-by-step procedures for extending functionality.

---

## 1. Core Architecture & Specifications

### Framework & Language Stack
*   **Framework:** Angular 22+ (Signals-first architecture, zoneless change detection).
*   **Routing:** Standard Angular Router (`RouterModule`/`RouterOutlet`) using lazy-loaded standalone component routes.
*   **Styling:** Tailwind CSS v4 (configured inside `src/styles.css` via `@import "tailwindcss"` and `@theme`).
*   **State Management:** A shared, single-instance `ClinicService` (`src/app/shared/services/clinic.service.ts`) stores all reactive Signals (patients, appointments, activity logs, theme state, sidebar collapse states, search queries).
*   **Charts:** `ng-apexcharts` for interactive data visualizations (Area, Bar, Donut, RadialBar).
*   **SSR:** Server-side rendering configured with `RenderMode.Client` to avoid ApexCharts hydration issues.

### Navigation Flow (Critical for AI Agents)
The layout is handled using a standard router-outlet architecture:
1.  **Rendering Switch:** The root shell in `app.html` renders the active view dynamically inside `<router-outlet></router-outlet>`.
2.  **Navigation Links:** The `SidebarComponent` uses `routerLink` to route between page views. Buttons check active routing state dynamically using a helper: `isActive('/path')`.
3.  **Mobile Behavior:** On viewports `< 768px`, the sidebar is always collapsed by default. It auto-closes on navigation (`NavigationEnd`) and when clicking outside (`onClickOutside`). The resize listener only collapses when transitioning from desktop (≥768px) to mobile (<768px), preventing false triggers.

---

## 2. Design System & Aesthetics

### Visual Identity
*   **Theme Foundation:** Clean medical-themed interface with both light and dark modes. Light mode is the default.
*   **Semantic Tokens:** Avoid hardcoded utility color classes (like `bg-white dark:bg-zinc-950`). Use semantic custom properties defined in `src/styles.css`:
    *   `bg-theme-bg`: Page backgrounds (`#fafafa` light / `#09090b` dark).
    *   `bg-theme-panel`: Card and panel backgrounds (`#ffffff` light / `#18181b` dark).
    *   `bg-theme-nested`: Nested panel backgrounds (`#ffffff` light / `#1f1f23` dark).
    *   `border-theme-border`: Card and component borders (`#eaeaea` light / `#27272a` dark).
    *   `bg-theme-hover`: Hover and active states (`#f4f4f5` light / `#27272a` dark).
    *   `text-theme-text-main`: Primary content text (`#09090b` light / `#fafafa` dark).
    *   `text-theme-text-muted`: Secondary labels and descriptions (`#71717a` light / `#a1a1aa` dark).
*   **Accent Color:** Emerald (`emerald-500`) is the primary accent for CTAs, active states, and positive indicators.
*   **Borders:** All component borders should be subtle, thin, and map to `border-theme-border` for maximum design cohesion.
*   **Typography:** Default font is Geist/Geist Mono for clean sans-serif/monospace layouts.

### Color Coding Conventions
*   **Appointment Types:** Blue (Consultation), Amber (Follow-up), Rose (Emergency), Violet (Lab Test).
*   **Patient Status:** Emerald (Active), Rose (Critical), Zinc (Inactive).
*   **Appointment Status:** Emerald (Scheduled), Blue (In Progress), Green (Completed), Red (Cancelled).

### Avatar System
Use the predefined gradient classes `avatar-grad-1` through `avatar-grad-5` for patient/staff avatars. Display initials inside circular containers.

### Motion & Micro-interactions
*   **Entrance Animations:** Use `.animate-blur-slide` combined with staggered delays (`.stagger-1` through `.stagger-8`) for card/grid entrances. Cards within the same grid row should share the same stagger class to animate together and avoid visual glitches.
*   **Click Feedbacks:** Buttons and interactive cards must include the class `.clickable-scale` for micro-interaction scaling on press.

---

## 3. Language & Tone Guidelines

Maintain the existing tone: **clean, professional, and medical-focused**.
*   **No Placeholders:** Avoid dummy text like "Lorem Ipsum". Use realistic medical examples (e.g. *"Dr. Sarah Chen"*, *"Cardiology Consultation"*, *"Patient #1042"*, *"Blood panel batch #B-2847"*).
*   **Microcopy:** Keep labels concise and descriptive. Heading descriptions should explain what the page is for in under 15 words.

---

## 4. How to Add a New Page (Step-by-Step for AI)

To add a new view called **"Reports"** mapped to `/reports`:

### Step 1: Create the Feature Component
Create the file `src/app/features/reports.ts`:
```typescript
import { Component, inject } from '@angular/core';
import { ClinicService } from '../shared/services/clinic.service';

@Component({
  selector: 'app-reports',
  imports: [],
  template: `
    <div class="space-y-6">
      <div class="animate-blur-slide stagger-1">
        <h2 class="text-lg font-semibold text-theme-text-main">Reports</h2>
        <p class="text-xs text-theme-text-muted mt-0.5">Generate and review clinical reports.</p>
      </div>

      <div class="animate-blur-slide stagger-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-theme-panel border border-theme-border rounded-xl p-5">
          <h3 class="text-xs font-semibold text-theme-text-main mb-2">Monthly Summary</h3>
          <p class="text-[10px] text-theme-text-muted">Overview of patient visits and revenue.</p>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent {
  protected readonly state = inject(ClinicService);
}
```

### Step 2: Register in `app.routes.ts`
Add a route object inside the `routes` array:
```typescript
{
  path: 'reports',
  loadComponent: () => import('./features/reports').then(m => m.ReportsComponent)
},
```

### Step 3: Add Navigation Item in `sidebar.ts`
Add a new navigation button inside the `<nav>` element:
```html
<button
  routerLink="/reports"
  [class]="isActive('/reports') ? 'bg-theme-hover text-theme-text-main font-medium' : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'"
  class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
  [class.justify-center]="state.isCollapsed()"
  [class.gap-3]="!state.isCollapsed()"
  [class.px-2]="state.isCollapsed()"
  [class.px-3]="!state.isCollapsed()">
  <!-- Lucide: file-text -->
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13H8"/><path d="M16 17H8"/><path d="M16 13h-2"/></svg>
  @if (!state.isCollapsed()) {
    <span class="animate-fade-in whitespace-nowrap">Reports</span>
  }
</button>
```

---

## 5. Modifying & Extending Themes

### Tailwind CSS v4 Theme Variables
To update colors, modify `src/styles.css` inside `@theme` or `@layer base`:
*   Modify `:root` variables to configure Light Mode.
*   Modify `.dark` variables to configure Dark Mode.

Example - Semantic mapping:
```css
:root {
  --theme-bg: #fafafa;
  --theme-panel: #ffffff;
  --theme-nested: #ffffff;
  --theme-border: #eaeaea;
  --theme-hover: #f4f4f5;
  --theme-text-main: #09090b;
  --theme-text-muted: #71717a;
}
.dark {
  --theme-bg: #09090b;
  --theme-panel: #18181b;
  --theme-nested: #1f1f23;
  --theme-border: #27272a;
  --theme-hover: #27272a;
  --theme-text-main: #fafafa;
  --theme-text-muted: #a1a1aa;
}
```

### Applying Themes Dynamically
Theme switching is managed entirely inside `ClinicService`. The HTML class `dark` is appended directly to the root `<html>` element (`document.documentElement.classList`) to ensure body-appended components (like ApexCharts tooltips or dropdown menus) correctly inherit dark mode context.

---

## 6. ApexCharts Integration Guidelines

The dashboard uses 4 interactive ApexCharts: **Area** (Patient Visits), **Bar** (Revenue), **Donut** (Department Load), and **RadialBar** (Satisfaction Score).

### Preventing Hydration & Animation Glitches
*   **Delayed Rendering:** ApexCharts requires browser globals and should never render during SSR. Initialize `isBrowser` to `false` and set it to `true` inside a `300ms` `setTimeout` delay in the constructor:
    ```typescript
    protected readonly isBrowser = signal(false);

    constructor() {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.isBrowser.set(true), 300);
      }
    }
    ```
*   **Guard in Template:** Always wrap `<apx-chart>` in `@if (isBrowser()) { ... }` with a loading placeholder in the `@else` block.

### Smooth Sidebar Transition Resizing
*   **CSS Scaling Overrides:** The global rule `.apexcharts-canvas, .apexcharts-canvas svg { width: 100% !important; }` in `styles.css` lets the SVG layout scale smoothly during sidebar transitions.
*   **End-of-Transition Redraw:** Add an Angular Signals `effect()` that listens to `state.isCollapsed()`. Skip the initial run, then dispatch a window `resize` event at `220ms` delay to force a crisp redraw after the sidebar finishes animating:
    ```typescript
    constructor() {
      let isInitial = true;
      effect(() => {
        this.state.isCollapsed();
        if (isInitial) { isInitial = false; return; }
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => window.dispatchEvent(new Event('resize')), 220);
        }
      });
    }
    ```

### Layout Stability
*   **Min-Height:** Chart card containers should have a fixed `min-h-[290px]` or `min-h-[300px]` to prevent layout shift when charts load.
*   **Same Stagger:** Cards within the same grid row must share the same `.stagger-*` class to animate together.

---

## 7. Mobile Responsiveness Guidelines

### Sidebar Behavior
*   Default state is `signal(true)` (collapsed) — sidebar starts closed on SSR and mobile.
*   On desktop (≥768px), respects `localStorage` saved preference.
*   Resize listener only triggers collapse on **desktop → mobile transition** (not on every resize while mobile).
*   Auto-closes on `NavigationEnd` events when on mobile.
*   Click-outside closes both the sidebar and user dropdown on mobile.

### Table Responsiveness
*   Use `hidden sm:table-cell` or `hidden md:table-cell` to progressively hide less-important columns on smaller viewports.
*   Reduce cell padding on mobile: `px-3 sm:px-5`.
*   Truncate long text with `truncate` and `min-w-0` on the parent.

### Button Placement
*   CTA buttons (Add Patient, New Appointment) should be `w-full sm:w-auto` to span full width on mobile.
*   Button groups with toggles should use `w-full sm:w-auto` on the container and `flex-1 sm:flex-none` on the CTA.

---

## 8. Prompt Templates for AI Agents

Copy and paste the following prompt when instructing an AI to edit this workspace:

> **System Prompt for AI Tasks:**
> You are working in a modern standalone Angular project configured with Tailwind CSS v4.
> 1. Use Standalone Angular components, signals, and modern control flows (`@if`, `@for`).
> 2. The routing uses Angular Router (`app.routes.ts`) with lazy-loaded components.
> 3. Global reactive signals (theme, patients, appointments, sidebar state, search) are stored in `ClinicService`. Inject this service in components to avoid prop drilling.
> 4. To add a new view:
>    - Create the standalone component in `src/app/features/` with inline templates and inject `ClinicService`.
>    - Register the lazy-loaded route in `app.routes.ts`.
>    - Add the navigation button with a matching `routerLink` inside `sidebar.ts` and set its active state style check via `isActive('/path')`.
> 5. Keep styling consistent: Use semantic tokens (`bg-theme-panel`, `border-theme-border`, `text-theme-text-main`, `bg-theme-hover`) to support seamless light/dark mode transitions rather than hardcoding static color classes.
> 6. Incorporate animations: card containers should use `.animate-blur-slide` and `.stagger-*` animation classes for smooth staggered page entry. Cards in the same row must share the same stagger class.
> 7. Make charts responsive and stable:
>    - Use delayed initialization (300ms delay for `isBrowser = true`) to prevent hydration layout glitches during entry animations.
>    - Listen to `state.isCollapsed` and trigger window resize events at `220ms` to update ApexCharts dimensions after the sidebar finishes collapsing.
>    - Apply `min-h-[290px]` on chart card containers to prevent layout shift.
> 8. All buttons should have `.clickable-scale` for interactive click scaling.
> 9. For mobile: hide less-important table columns with `hidden sm:table-cell`, use `w-full sm:w-auto` for CTA buttons, and ensure the sidebar auto-closes on navigation.
