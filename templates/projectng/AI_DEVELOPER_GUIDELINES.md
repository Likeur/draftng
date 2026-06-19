# AI-Driven Customization & Extension Guidelines

This guide is designed for **AI coding assistants** and developers using AI to customize, extend, and manage the `projectng` workspace template. It contains design specifications, architecture paradigms, writing tone, and step-by-step procedures for extending functionality.

---

## 1. Core Architecture & Specifications (Specs)

### Framework & Language Stack
*   **Framework:** Angular 22+ (Signals-first architecture).
*   **Routing:** Standard Angular Router (`RouterModule`/`RouterOutlet`) using lazy-loaded standalone component routes.
*   **Styling:** Tailwind CSS v4 (configured inside [styles.css](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/styles.css) via `@import "tailwindcss"` and `@theme`).
*   **State Management:** A shared, single-instance [WorkspaceService](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/app/shared/services/workspace.service.ts) stores all reactive Signals (tasks, active search queries, theme state, sidebar collapse states). 

### Navigation Flow (Critical for AI Agents)
The layout is handled using a standard router-outlet architecture:
1.  **Rendering Switch:** The root shell in [app.html](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/app/app.html) renders the active view dynamically inside `<router-outlet></router-outlet>`.
2.  **Navigation Links:** The [SidebarComponent](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/app/shared/components/sidebar.ts) uses `routerLink` to route between page views. Buttons check active routing state dynamically using a helper: `isActive('/path')`.
3.  **Nested Routing:** Sub-views (such as the Projects Timeline and Projects List views) are configured as child routes under `/projects` in [app.routes.ts](file:///Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/app/app.routes.ts) and render inside a nested `<router-outlet>` inside `ProjectsComponent`.

---

## 2. Design System & Aesthetics

### Visual Identity
*   **Theme Foundation:** The interface is dark-mode first for a premium, sleek software experience (styled like Linear or Vercel).
*   **Borders:** Use `--color-zinc-850` (or `border-zinc-850`) for a subtle, high-contrast dark-mode border instead of generic dark grey.
*   **Colors & Gradients:**
    *   **Light Mode Background:** Claude warm light paper page background (`--color-zinc-50: #fbfaf7`).
    *   **Gradients:** Avatar gradients (`.avatar-grad-1` through `.avatar-grad-5`) are custom CSS linear gradients mapped in `styles.css`.
*   **Typography:** Default font is Geist/Geist Mono for clean sans-serif/monospace layouts.

### Motion & Micro-interactions
*   **Entrance Animations:** Use `.animate-blur-slide` combined with staggered delays (`.stagger-1`, `.stagger-2`, up to `.stagger-8`) for card/grid entrances to create high-end visual flow.
*   **Click Feedbacks:** Buttons and interactive cards must include the class `.clickable-scale` for micro-interaction scaling on press.

---

## 3. Language & Tone Guidelines

Maintain the existing tone: **clean, professional, and developer-focused**.
*   **No Placeholders:** Avoid dummy text like "Lorem Ipsum". Use realistic technical examples (e.g. *"Design Tokens Refactoring"*, *"OAuth endpoint authorization"*, *"Compile design tokens"*).
*   **Microcopy:** Keeps labels concise and descriptive. Heading descriptions should explain what the page is for under 15 words.

---

## 4. How to Add a New Page (Step-by-Step for AI)

To add a new view called **"Analytics"** mapped to `/analytics`:

### Step 1: Create the Feature Component
Create the file `src/app/features/analytics.ts`:
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../shared/services/workspace.service';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 class="font-display font-extrabold text-md tracking-tight select-none">Analytics Dashboard</h2>
          <p class="text-xs text-zinc-400 mt-1">Track workspace performance metrics, API latency status, and usage trends.</p>
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
  private readonly state = inject(WorkspaceService);
  protected readonly isDark = this.state.isDark;
}
```

### Step 2: Register in `app.routes.ts`
Modify `/Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/app/app.routes.ts`:
Add a route object inside the `routes` array:
```typescript
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics').then(m => m.AnalyticsComponent)
  },
```

### Step 3: Add Navigation Item in `sidebar.ts`
Modify `/Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/app/shared/components/sidebar.ts`:
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
To update colors, modify `/Users/simba/Documents/Digitalproduct/draftNG/templates/projectng/src/styles.css` inside `@theme` or `@layer base`:
*   Modify `:root` variables to configure Light Mode.
*   Modify `.dark` variables to configure Dark Mode.

Example - Changing accent theme:
```css
@theme {
  --color-primary-500: #3b82f6; /* Configure primary focus colors */
}
```

### Applying Themes Dynamically
Theme switching is managed entirely inside `WorkspaceService`. The HTML class `dark` is appended to the root container dynamically based on `state.isDark()` signal:
`[class]="state.isDark() ? 'bg-zinc-950 text-zinc-50 dark' : 'bg-zinc-50/65 text-zinc-900'"`

---

## 6. Prompt Templates for AI Agents

Copy and paste the following prompt when instructing an AI to edit this workspace:

> **System Prompt for AI Tasks:**
> You are working in a modern standalone Angular project configured with Tailwind CSS v4.
> 1. Use Standalone Angular components, signals, and modern control flows (`@if`, `@for`).
> 2. The routing uses Angular Router (`app.routes.ts`) with lazy-loaded components.
> 3. Global reactive signals (theme, tasks, search, sidebar state) are stored in `WorkspaceService`. Inject this service in components to avoid prop drilling.
> 4. To add a new view:
>    - Create the standalone component in `src/app/features/` with inline templates and inject `WorkspaceService`.
>    - Register the lazy-loaded route in `app.routes.ts`.
>    - Add the navigation button with a matching `routerLink` inside `sidebar.ts` and set its active state style check via `isActive('/path')`.
> 5. For sub-views (like Projects List and Timeline), use nested child routes configured under the parent route path in `app.routes.ts`. Renders inside `<router-outlet>` of the parent component. Child components can access the parent filtered parameters by injecting the parent component class.
> 6. Keep styling consistent: Use `bg-zinc-900 border-zinc-850 text-zinc-50` for dark panels, and `bg-white border-zinc-200 text-zinc-900` for light panels.
> 7. Incorporate animations: card containers should use `.animate-blur-slide` and `.stagger-*` animation classes for smooth staggered page entry.
> 8. All buttons should have `.clickable-scale` for interactive click scaling.
