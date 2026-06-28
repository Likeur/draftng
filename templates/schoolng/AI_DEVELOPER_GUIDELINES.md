# AI-Driven Customization & Extension Guidelines

This guide is designed for **AI coding assistants** and developers using AI to customize, extend, and manage the `schoolng` workspace template. It contains design specifications, architecture paradigms, writing tone, and step-by-step procedures for extending functionality.

---

## 1. Core Architecture & Specifications (Specs)

### Framework & Language Stack
*   **Framework:** Angular 22+ (Signals-first architecture).
*   **Routing:** Standard Angular Router (`RouterModule`/`RouterOutlet`) using lazy-loaded standalone component routes.
*   **Styling:** Tailwind CSS v4 (configured inside [styles.css](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/schoolng/src/styles.css) via `@import "tailwindcss"` and `@theme`).
*   **State Management:** A shared, single-instance `SchoolService` stores all reactive Signals (student/teacher registries, active class/term, search queries, theme state, sidebar collapse states). 

### Navigation Flow (Critical for AI Agents)
The layout is handled using a standard router-outlet architecture:
1.  **Rendering Switch:** The root shell in `app.html` renders the active view dynamically inside `<router-outlet></router-outlet>`.
2.  **Navigation Links:** The `SidebarComponent` uses `routerLink` to route between page views. Buttons check active routing state dynamically using a helper: `isActive('/path')`.
3.  **Nested Routing:** Sub-views (such as Class Schedule, Roster, or Grades) are configured as child routes under `/classes` in `app.routes.ts` and render inside a nested `<router-outlet>` inside `ClassesComponent`.

---

## 2. Design System & Aesthetics

### Visual Identity
*   **Theme Foundation:** The interface is dark-mode first for a premium, sleek software experience (styled like Vercel).
*   **Semantic Tokens:** Avoid hardcoded utility color classes (like `bg-white dark:bg-zinc-950`). Use semantic custom properties defined in [styles.css](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/schoolng/src/styles.css):
    *   `bg-theme-bg`: Page backgrounds (`#fafafa` in light mode, `#09090b` in dark mode).
    *   `bg-theme-panel`: Card and panel backgrounds (`#ffffff` in light mode, `#18181b` in dark mode).
    *   `border-theme-border`: Card and component borders (`#eaeaea` in light mode, `#27272a` in dark mode).
    *   `text-theme-text-main`: Primary content text (`#09090b` in light mode, `#fafafa` in dark mode).
    *   `text-theme-text-muted`: Secondary labels and descriptions (`#71717a` in light mode, `#a1a1aa` in dark mode).
*   **Borders:** All component borders should be subtle, thin, and map to `border-theme-border` for maximum design cohesion.
*   **Typography:** Default font is Geist/Geist Mono for clean sans-serif/monospace layouts.

### Motion & Micro-interactions
*   **Entrance Animations:** Use `.animate-blur-slide` combined with staggered delays (`.stagger-1`, `.stagger-2`, up to `.stagger-8`) for card/grid entrances to create high-end visual flow.
*   **Click Feedbacks:** Buttons and interactive cards must include the class `.clickable-scale` for micro-interaction scaling on press.

---

## 3. Language & Tone Guidelines

Maintain the existing tone: **clean, professional, and developer-focused**.
*   **No Placeholders:** Avoid dummy text like "Lorem Ipsum". Use realistic academic examples (e.g. *"AP Calculus BC"*, *"Dr. Elizabeth Vance"*, *"Midterm Grade Input"*, *"Biology Lab B"*).
*   **Microcopy:** Keeps labels concise and descriptive. Heading descriptions should explain what the page is for under 15 words.

---

## 4. How to Add a New Page (Step-by-Step for AI)

To add a new view called **"Analytics"** mapped to `/analytics`:

### Step 1: Create the Feature Component
Create the file `src/app/features/analytics.ts`:
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolService } from '../shared/services/school.service';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 class="font-display font-extrabold text-md tracking-tight select-none">School Analytics</h2>
          <p class="text-xs text-zinc-400 mt-1">Track average grade point averages, class occupancy metrics, and attendance trends.</p>
        </div>
      </section>
      <!-- Page Content Grid -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-blur-slide stagger-1">
        <div [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" class="p-6 rounded-2xl border">
          <h3 class="font-bold text-xs mb-2">Metrics</h3>
          <p class="text-xs text-zinc-400">Visualization data goes here.</p>
        </div>
      </section>
    </div>
  `
})
export class AnalyticsComponent {
  private readonly state = inject(SchoolService);
  protected readonly isDark = this.state.isDark;
}
```

### Step 2: Register in `app.routes.ts`
Modify `src/app/app.routes.ts`:
Add a route object inside the `routes` array:
```typescript
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics').then(m => m.AnalyticsComponent)
  },
```

### Step 3: Add Navigation Item in `sidebar.ts`
Modify `src/app/shared/components/sidebar.ts`:
```html
            <!-- Analytics Link -->
            <button 
              routerLink="/analytics"
              [class]="isActive('/analytics') ? (state.isDark() ? 'bg-zinc-800/60 text-zinc-50 font-bold' : 'bg-zinc-200 text-zinc-900 font-bold') : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              
              <!-- Heroicons Chart Bar SVG -->
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 3 18.375v-5.25ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125v-9.75ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Analytics</span>
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
  --theme-border: #eaeaea;
  --theme-text-main: #09090b;
  --theme-text-muted: #71717a;
}
.dark {
  --theme-bg: #09090b;
  --theme-panel: #18181b;
  --theme-border: #27272a;
  --theme-text-main: #fafafa;
  --theme-text-muted: #a1a1aa;
}
```

### Applying Themes Dynamically
Theme switching is managed entirely inside `SchoolService`. The HTML class `dark` is appended directly to the root `<html>` element (`document.documentElement.classList`) to ensure body-appended components (like ApexCharts tooltips or dropdown menus) correctly inherit dark mode context.

---

## 6. ApexCharts Integration Guidelines

When implementing or extending charts using `ng-apexcharts` on the dashboard:

### Preventing Hydration & Animation Glitches
*   **Delayed Rendering:** ApexCharts requires browser globals and should never render during SSR. Initialize `isBrowser` to `false` and set it to `true` inside a `500ms` `setTimeout` delay in the constructor. This ensures the card's slide-in entry animation (`animate-blur-slide`) completes cleanly before the chart is compiled and inserted, preventing layout jumps.
    ```typescript
    protected readonly isBrowser = signal(false);
    
    constructor() {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.isBrowser.set(true), 500);
      }
    }
    ```

### Smooth Sidebar Transition Resizing
*   **CSS Scaling Overrides:** Ensure `.apexcharts-canvas, .apexcharts-canvas svg` have `width: 100% !important` defined globally in `styles.css`. This lets the SVG layout scale smoothly with the CSS transitions of the grid cards during sidebar collapses/expands.
*   **End-of-Transition Redraw:** Add an Angular Signals `effect()` in the constructor that listens to `state.isCollapsed()`. Skip the initial run (to avoid disrupting page load), and dispatch a single window `resize` event at a `220ms` delay (immediately following the sidebar transition completion) to force a crisp redraw.
    ```typescript
    constructor() {
      let isInitial = true;
      effect(() => {
        this.state.isCollapsed();
        if (isInitial) {
          isInitial = false;
          return;
        }
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 220);
        }
      });
    }
    ```

### Height and Layout Alignment
*   **Card Height Synchronization:** Always set `h-full flex flex-col justify-between` on the main card container `div` of chart components. This ensures all cards in a grid row align perfectly in height, regardless of their content or action button volumes.
*   **Chart Centering:** Always wrap `<apx-chart>` in a `w-full overflow-hidden flex-1 flex items-center justify-center` wrapper `div` to expand and center the chart canvas vertically inside the aligned cards.

---

## 7. Prompt Templates for AI Agents

Copy and paste the following prompt when instructing an AI to edit this workspace:

> **System Prompt for AI Tasks:**
> You are working in a modern standalone Angular project configured with Tailwind CSS v4.
> 1. Use Standalone Angular components, signals, and modern control flows (`@if`, `@for`).
> 2. The routing uses Angular Router (`app.routes.ts`) with lazy-loaded components.
> 3. Global reactive signals (theme, students, classes, search, sidebar state) are stored in `SchoolService`. Inject this service in components to avoid prop drilling.
> 4. To add a new view:
>    - Create the standalone component in `src/app/features/` with inline templates and inject `SchoolService`.
>    - Register the lazy-loaded route in `app.routes.ts`.
>    - Add the navigation button with a matching `routerLink` inside `sidebar.ts` and set its active state style check via `isActive('/path')`.
> 5. For sub-views (like Grades and Timelines), use nested child routes configured under the parent route path in `app.routes.ts`. Renders inside `<router-outlet>` of the parent component. Child components can access the parent filtered parameters by injecting the parent component class.
> 6. Keep styling consistent: Use semantic tokens (`bg-theme-panel`, `border-theme-border`, `text-theme-text-main`) to support seamless light/dark mode transitions rather than hardcoding static zinc classes.
> 7. Incorporate animations: card containers should use `.animate-blur-slide` and `.stagger-*` animation classes for smooth staggered page entry.
> 8. Make charts responsive and stable:
>    - Use delayed initialization (500ms delay for `isBrowser = true`) to prevent hydration layout glitches during entry animations.
>    - Listen to `state.isCollapsed` and trigger window resize events at `220ms` to update ApexCharts dimensions after the sidebar finishes collapsing.
>    - Apply `h-full flex flex-col justify-between` on chart card containers to align grid heights.
> 9. All buttons should have `.clickable-scale` for interactive click scaling.
