---
name: "Clinicng"
status: "Active"
category: "Medical & Healthcare"
desc: "A free, open-source medical clinic dashboard template built with Angular 22+ and Tailwind CSS v4, featuring interactive charts, appointment calendars, and patient management."
fullDesc: "Clinicng is a clean, modern, and fully responsive medical clinic dashboard template built with Angular 22+ and Tailwind CSS v4. Inspired by minimalist Vercel-like aesthetics, it delivers a polished workspace for managing patients, scheduling appointments (with dual card/calendar views), tracking clinical KPIs with interactive ApexCharts, and monitoring daily activity — all powered by a Signals-first reactive architecture with zoneless change detection."
tech: ["Angular 22+", "Tailwind v4", "Signals", "ApexCharts", "Dark Mode", "Zoneless"]
github: "https://github.com/Likeur/draftng/tree/main/templates/clinicng"
demo: "https://clinicng.vercel.app/dashboard"
image: "/project/clinicng.webp"
date: "29 Jun 2026"
price: "Free"
---

<div class="space-y-4">
	<h2 class="font-bold text-2xl text-zinc-200" style="font-family: var(--font-display)">Complete Clinical Dashboard</h2>
	<ul class="space-y-3 text-zinc-400">
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">KPI Overview Dashboard:</strong> Real-time metrics for total patients, today's appointments, monthly revenue, and patient satisfaction — each with trend indicators and interactive ApexCharts (Area, Bar, Donut, RadialBar).</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Patient Registry:</strong> Full patient database with search, status filters (Active, Critical, Inactive), responsive data table with hidden columns on mobile, and pagination controls.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Dual-View Appointments:</strong> Toggle between a card-based list view and a weekly calendar grid. The calendar displays appointments positioned by day and hourly time slots (8 AM – 5 PM), color-coded by type.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Activity Log & Today's Schedule:</strong> Live-updated recent activity feed and a today's appointments table with patient names, doctors, types, and status badges.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">4 Interactive ApexCharts:</strong> Patient Visits (Area), Revenue Breakdown (Bar), Department Load (Donut), and Patient Satisfaction (RadialBar) — all with hover tooltips, animations, and dark/light mode adaptation.</span>
		</li>
	</ul>
</div>

<div class="space-y-4">
	<h2 class="font-bold text-2xl text-zinc-200" style="font-family: var(--font-display)">Sleek & Customizable Design System</h2>
	<ul class="space-y-3 text-zinc-400">
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Dual Theme Engine:</strong> High-contrast Dark Mode and clean Light Mode with persistent state via `localStorage`, toggled directly on the document root for full compatibility.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Semantic Theme Tokens:</strong> Custom CSS variables (`bg-theme-panel`, `border-theme-border`, `text-theme-text-main`) prevent selector conflicts and make dark/light transitions seamless across all components including ApexCharts.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Staggered Animations:</strong> Smooth blurry slide-in entrance animations on cards, charts, and tables using `.animate-blur-slide` with synchronized stagger timing per row.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Fully Responsive Layout:</strong> Optimized for mobile, tablet, and desktop. Mobile sidebar auto-closes on navigation, tables progressively hide columns, and CTAs adapt to full-width on small screens.</span>
		</li>
	</ul>
</div>

<div class="space-y-4">
	<h2 class="font-bold text-2xl text-zinc-200" style="font-family: var(--font-display)">Modern & High-Performance Architecture</h2>
	<ul class="space-y-3 text-zinc-400">
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Angular Standalone Components:</strong> Clean, structured components following modern Angular 22+ best practices without NgModules, using inline templates and signals.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Signals-First Reactivity:</strong> Centralized state management in `ClinicService` using Angular Signals for high-performance, zoneless change detection.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">Smooth Chart Resizing:</strong> Reactive handling of chart dimensions during sidebar collapses via CSS scaling and delayed window resize dispatches for crisp ApexCharts redraws.</span>
		</li>
		<li class="flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200 mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
			<span><strong class="text-zinc-200">AI-friendly Developer Guidelines:</strong> Dedicated `AI_DEVELOPER_GUIDELINES.md` with architecture specs, design system rules, step-by-step extension procedures, and ready-to-paste prompts for LLM-assisted development.</span>
		</li>
	</ul>
</div>

<div class="space-y-4">
	<h2 class="font-bold text-2xl text-zinc-200" style="font-family: var(--font-display)">What's Included</h2>
	<ul class="space-y-2 text-zinc-400">
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200"><polyline points="20 6 9 17 4 12"/></svg>
			Full source code (Angular 22+ / Tailwind CSS v4)
		</li>
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200"><polyline points="20 6 9 17 4 12"/></svg>
			3 feature pages (Dashboard, Patients, Appointments)
		</li>
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200"><polyline points="20 6 9 17 4 12"/></svg>
			4 interactive ApexCharts with dark mode support
		</li>
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200"><polyline points="20 6 9 17 4 12"/></svg>
			Centralized Mock Database Service (ClinicService)
		</li>
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200"><polyline points="20 6 9 17 4 12"/></svg>
			Dedicated AI developer extension rules (AI_DEVELOPER_GUIDELINES.md)
		</li>
		<li class="flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-200"><polyline points="20 6 9 17 4 12"/></svg>
			MIT Free Open-Source License
		</li>
	</ul>
</div>
