---
title: "Tailwind CSS v4 Integration with Angular 22: A Modern Approach"
description: "Discover how to integrate Tailwind CSS v4's new Oxide compiler with Angular 22 for lightning-fast styling and improved developer experience."
date: 2026-06-23
tags: ["Tailwind CSS", "Angular", "Styling", "Performance"]
author: "likeur"
---

Tailwind CSS v4 is the biggest rewrite in the framework's history. With a new Rust-based compiler called **Oxide**, CSS-first configuration, and zero-JavaScript setup, it pairs perfectly with Angular 22's [zoneless architecture](/blog/angular-22-zoneless-guide) to deliver a blazing-fast developer experience.

In this guide, you'll learn how to set up Tailwind v4 with Angular 22, use it effectively in standalone components, and apply advanced patterns that keep your bundle small and your components clean.

## What's New in Tailwind CSS v4?

### The Oxide Compiler

Tailwind v4's engine — codenamed **Oxide** — is written in Rust. It replaces the old JavaScript-based PostCSS pipeline with a compiled binary that delivers:

- **10x faster full builds** — from ~300ms to ~30ms on a medium project
- **Instant hot module replacement** — changes appear in under 5ms
- **Smaller output** — improved tree-shaking removes every unused utility
- **Native CSS nesting** — no PostCSS plugin required

### CSS-First Configuration

The biggest workflow change: **no more `tailwind.config.js`**. All configuration now lives in your CSS file using the `@theme` directive:

```css
/* styles.css */
@import "tailwindcss";

@theme {
  --color-brand: #6366f1;
  --color-brand-dark: #4f46e5;
  --font-display: 'Outfit', sans-serif;
  --radius-card: 1rem;
}
```

This means your IDE can auto-complete theme values, and you can use them as utilities immediately: `bg-brand`, `text-brand-dark`, `font-display`, `rounded-card`.

### Other Notable Changes

- **No `content` config needed** — Oxide automatically detects template files
- **Native cascade layers** — `@layer` is built in, no more specificity hacks
- **3D transforms** — `rotate-x-12`, `rotate-y-45`, `perspective-distant`
- **Container queries** — `@min-md:flex-row` without plugins
- **Simplified dark mode** — `dark:` uses `prefers-color-scheme` by default

## Setting Up Tailwind v4 with Angular 22

### Step 1: Install Dependencies

```bash
npm install tailwindcss@latest @tailwindcss/vite
```

> **Why `@tailwindcss/vite`?** Angular 22 uses Vite under the hood (via the Application Builder). The Vite plugin gives you the fastest HMR and build times.

### Step 2: Configure the Vite Plugin

In your `angular.json`, add the Vite plugin to your build options. Alternatively, if you're using a custom builder, update your Vite config:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

If you're using the Angular CLI directly, add the provider in your `app.config.ts`:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideVitePlugins } from '@analogjs/vite-plugin-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... your other providers
  ],
};
```

### Step 3: Create Your Global Styles

Create a `styles.css` file and import it in your `angular.json`:

```css
/* src/styles.css */
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-secondary: #10b981;
  --color-accent: #f59e0b;
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-display: 'Outfit', system-ui, sans-serif;
}
```

Add to `angular.json`:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["src/styles.css"]
          }
        }
      }
    }
  }
}
```

### Step 4: Verify the Setup

Add a Tailwind class to any component template:

```typescript
@Component({
  selector: 'app-root',
  template: `<h1 class="text-3xl font-bold text-primary">Hello Tailwind v4</h1>`,
  standalone: true
})
export class AppComponent {}
```

Run `npm start` — you should see your styled heading. That's it. No config file, no PostCSS plugin, no `content` array.

## Using Tailwind v4 in Angular Components

### Basic Utility Classes

```typescript
@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="bg-white rounded-xl shadow-lg p-6 max-w-sm">
      <h2 class="text-xl font-bold text-gray-900">{{ title() }}</h2>
      <p class="text-gray-600 mt-2 leading-relaxed">{{ description() }}</p>
      <button class="mt-4 px-4 py-2 bg-primary text-white rounded-lg
                     hover:bg-primary-dark transition-colors font-semibold">
        Learn more
      </button>
    </div>
  `
})
export class CardComponent {
  title = input.required<string>();
  description = input.required<string>();
}
```

### Dynamic Classes with Signals

One of the most powerful patterns in Angular 22 is combining [Signals](/blog/angular-signals-tutorial) with computed classes:

```typescript
import { Component, signal, computed, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [class]="classes()" [disabled]="disabled()">
      {{ label() }}
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input.required<string>();
  disabled = signal(false);

  private base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2';

  classes = computed(() => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary/50',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400/50',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300/50'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const disabledStyles = this.disabled()
      ? ' opacity-50 cursor-not-allowed'
      : ' cursor-pointer';

    return `${this.base} ${variants[this.variant()]} ${sizes[this.size()]}${disabledStyles}`;
  });
}
```

### Conditional Classes with Class Variance

For more complex conditional styling, create a helper function:

```typescript
// utils/class-variance.ts
type ClassDict = Record<string, string>;

export function cv(
  base: string,
  variants: ClassDict,
  selected: Record<string, string>
): string {
  const classes = Object.entries(selected)
    .map(([key, value]) => variants[`${key}-${value}`] || '');
  return [base, ...classes].filter(Boolean).join(' ');
}
```

```typescript
@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span [class]="classes()">{{ label() }}</span>`
})
export class BadgeComponent {
  variant = input<'success' | 'warning' | 'danger'>('success');
  label = input.required<string>();

  classes = computed(() =>
    cv('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', {
      'variant-success': 'bg-green-100 text-green-800',
      'variant-warning': 'bg-yellow-100 text-yellow-800',
      'variant-danger': 'bg-red-100 text-red-800',
    }, { variant: this.variant() })
  );
}
```

## Advanced Patterns

### Theme System with CSS Variables

Tailwind v4's `@theme` directive generates CSS custom properties. You can override them at runtime:

```css
/* styles.css */
@theme {
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
}
```

```typescript
@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <div [style.--color-primary]="currentTheme().primary">
      <div class="bg-primary text-white p-6 rounded-xl">
        <h3 class="text-lg font-bold">Themed Content</h3>
        <p class="opacity-90">The background uses the current theme.</p>
      </div>
    </div>
  `
})
export class ThemeSwitcherComponent {
  themes = {
    indigo: { primary: '#6366f1' },
    emerald: { primary: '#10b981' },
    rose: { primary: '#f43f5e' }
  };

  currentTheme = signal(this.themes.indigo);
}
```

### Responsive Grids with Container Queries

Tailwind v4 includes container queries out of the box — no plugin needed:

```typescript
@Component({
  selector: 'app-product-grid',
  standalone: true,
  template: `
    <div class="@container">
      <div class="grid grid-cols-1 @min-sm:grid-cols-2 @min-lg:grid-cols-3 gap-4">
        @for (product of products(); track product.id) {
          <div class="bg-white rounded-lg p-4 shadow">
            <img [src]="product.image" [alt]="product.name"
                 class="w-full h-48 object-cover rounded" />
            <h3 class="mt-2 font-semibold text-gray-900">{{ product.name }}</h3>
            <p class="text-gray-600">\${{ product.price }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductGridComponent {
  products = signal<Product[]>([]);
}
```

### Dark Mode with Signals

Combine Tailwind's `dark:` variant with a signal-based theme toggle:

```typescript
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button (click)="toggle()" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
      {{ isDark() ? '☀️' : '🌙' }}
    </button>
  `
})
export class ThemeToggleComponent {
  isDark = signal(false);

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDark());
    });
  }

  toggle() {
    this.isDark.update(d => !d);
  }
}
```

### Animations with Tailwind v4

Tailwind v4 includes animation utilities. Combine with Angular's `animate()` for smooth transitions:

```typescript
@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center
                  bg-black/50 animate-in fade-in duration-200">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md
                    animate-in zoom-in-95 duration-200">
          <h2 class="text-xl font-bold mb-4">{{ title() }}</h2>
          <ng-content />
          <button (click)="close()"
                  class="mt-4 px-4 py-2 bg-gray-200 rounded-lg
                         hover:bg-gray-300 transition-colors">
            Close
          </button>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  isOpen = signal(false);
  title = input.required<string>();

  open() { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }
}
```

## Performance Optimization

### How Tailwind v4 Purges Styles

Oxide scans your source files at build time and only includes utilities you actually use. A typical project ships **under 15 KB** of CSS (gzipped) — compared to 300+ KB if all utilities were included.

### Safelisting Dynamic Classes

If you construct class names dynamically (e.g., from API data), Oxide can't detect them. Use the `@source` directive:

```css
/* styles.css */
@source inline("bg-red-500 bg-green-500 bg-blue-500 text-white text-black");
```

Or better, use a lookup object so the full class names appear in your source:

```typescript
// Good — full class names are visible to the scanner
const colorClasses = {
  red: 'bg-red-500 text-white',
  green: 'bg-green-500 text-white',
  blue: 'bg-blue-500 text-white'
};

// Bad — Tailwind can't see these, they'll be purged
const color = 'red';
const className = `bg-${color}-500`; // Don't do this
```

### Build Performance

With the Vite plugin, Tailwind v4 compiles in parallel with your TypeScript. On a project with 200+ components:

| Metric | Tailwind v3 | Tailwind v4 |
|--------|------------|------------|
| Cold build | 2.4s | 0.8s |
| HMR | 180ms | 8ms |
| CSS output (gzipped) | 18 KB | 12 KB |

## Migration from Tailwind v3

### Key Breaking Changes

1. **No `tailwind.config.js`** — move config to `@theme` in CSS
2. **No `content` array** — Oxide auto-detects
3. **Renamed utilities** — `bg-opacity-*` → `bg-*/*` (e.g., `bg-red-500/50`)
4. **No PostCSS plugin** — use `@tailwindcss/vite` or `@tailwindcss/postcss`
5. **Default border color** — changed from `gray-200` to `currentColor`

### Migration Steps

1. **Install v4**: `npm install tailwindcss@latest @tailwindcss/vite`
2. **Replace config**: Move `theme.extend` values to `@theme` in CSS
3. **Update imports**: Replace `@tailwind base/components/utilities` with `@import "tailwindcss"`
4. **Fix renamed utilities**: Search and replace old class names
5. **Test thoroughly**: Run your app and check for visual regressions

> **Tip**: Tailwind provides an [official upgrade tool](https://tailwindcss.com/docs/upgrade-guide): `npx @tailwindcss/upgrade`

## Best Practices for Angular + Tailwind

### 1. Keep Templates Readable

```typescript
// Good — readable, multi-line
template: `
  <div class="flex items-center gap-3 p-4
              bg-white rounded-lg shadow-sm
              hover:shadow-md transition-shadow">
    <img [src]="avatar()" class="w-10 h-10 rounded-full" />
    <div>
      <p class="font-semibold text-gray-900">{{ name() }}</p>
      <p class="text-sm text-gray-500">{{ role() }}</p>
    </div>
  </div>
`

// Avoid — one massive line
template: `<div class="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"><img [src]="avatar()" class="w-10 h-10 rounded-full" /><div><p class="font-semibold text-gray-900">{{ name() }}</p><p class="text-sm text-gray-500">{{ role() }}</p></div></div>`
```

### 2. Use `@apply` Sparingly

`@apply` is useful for reusable component styles, but don't overuse it — utility classes in templates are more maintainable:

```css
/* Good — for truly reusable patterns */
.btn-base {
  @apply inline-flex items-center justify-center font-semibold
         rounded-lg transition-colors px-4 py-2;
}
```

### 3. Leverage Angular's `@if` and `@for`

Angular 22's new control flow syntax pairs beautifully with Tailwind:

```typescript
template: `
  @if (loading()) {
    <div class="animate-pulse space-y-3">
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  } @else {
    <div class="space-y-3">
      @for (item of items(); track item.id) {
        <div class="p-3 bg-white rounded-lg border border-gray-100">
          {{ item.text }}
        </div>
      }
    </div>
  }
`
```

## Conclusion

Tailwind CSS v4 with Angular 22 is a performance powerhouse. The Oxide compiler delivers 10x faster builds, the CSS-first configuration eliminates an entire config file, and the utility-first approach keeps your components clean and your bundle tiny.

By combining Tailwind v4 with [Angular's zoneless architecture](/blog/angular-22-zoneless-guide) and [Signals-based reactivity](/blog/angular-signals-tutorial), you get a modern stack that's fast at build time, fast at runtime, and delightful to develop with.

Start by installing the Vite plugin, set up your `@theme`, and begin using utilities in your templates. The migration from v3 is straightforward with the official upgrade tool, and the performance gains are immediate.
