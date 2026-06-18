# 🎨 Angular 22+ Templates Directory

This directory contains standalone, highly polished Angular templates designed for modern web applications. Each template is self-contained and pre-configured with modern technologies, specifically **Angular 22** and **Tailwind CSS v4**.

## 🚀 Template Checklist & Standards

To maintain high visual quality, performance, and clean code, every template contributed to this repository must follow these rules:

1.  **Zoneless & Signals:** Always use zoneless change detection (`provideExperimentalZonelessChangeDetection()`) and Angular Signals for reactive state.
2.  **Standalone Components:** No Angular Modules (NgModules). All components, directives, and pipes must be `standalone: true`.
3.  **Modern Routing & Hydration:** Setup routing with load-component lazy loading, and configure Server-Side Rendering (SSR) / Static Site Generation (SSG) with client hydration.
4.  **Tailwind CSS v4 Styling:**
    *   No legacy `tailwind.config.js`. Use CSS-first theme configuration under `@theme` inside your main styles CSS.
    *   Utilize Tailwind v4 Vite/PostCSS plugin support.
    *   Maintain curated, harmonic, HSL-based color schemes (avoid generic styling).
5.  **Clean Code Guidelines:**
    *   Structure logic into features (e.g., `features/dashboard`, `features/analytics`, `features/settings`).
    *   Keep shared UI presentation components in `shared/components` (e.g., button, card, modal).
    *   Maintain strict TypeScript rules.

## 🛠️ How to Create a New Template

To initialize a new template using Angular CLI v22 inside this directory:

```bash
# 1. Create a new Angular project configured with Tailwind styling
npx -y @angular/cli new <template-name> \
  --directory=templates/<template-name> \
  --style=tailwind \
  --routing \
  --ssr \
  --strict \
  --skip-git \
  --defaults

# 2. Navigate to the template folder
cd templates/<template-name>

# 3. Verify Tailwind CSS v4 is imported in your global stylesheet (src/styles.css):
# @import "tailwindcss";
```

## ⚙️ Development

To start a local development server for a template:

```bash
cd <template-name>
npm run dev
```

And to build the production output:

```bash
npm run build
```
