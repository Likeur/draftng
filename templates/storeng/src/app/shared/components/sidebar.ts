import { Component, inject, signal, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  host: {
    '(document:click)': 'onClickOutside($event)'
  },
  template: `
    <aside 
      [class.w-14]="state.isCollapsed()"
      [class.p-2]="state.isCollapsed()"
      [class.w-52]="!state.isCollapsed()"
      [class.p-4]="!state.isCollapsed()"
      [class.-translate-x-full]="state.isCollapsed()"
      [class.translate-x-0]="!state.isCollapsed()"
      class="fixed md:sticky left-0 top-0 bottom-0 z-50 md:z-45 h-screen bg-theme-panel border-r border-theme-border flex flex-col justify-between shrink-0 transition-all duration-200 font-sans select-none md:translate-x-0 overflow-visible">
      
      <div class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <!-- Top Branding -->
        <div class="flex items-center gap-2.5 overflow-hidden h-10 mb-6" [class.justify-center]="state.isCollapsed()">
          <!-- Shopping bag logo -->
          <svg class="shrink-0 w-6 h-6 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          @if (!state.isCollapsed()) {
            <div class="animate-fade-in shrink-0 leading-none">
              <h2 class="font-medium text-sm tracking-tight text-theme-text-main">storeNG</h2>
            </div>
          }
        </div>
        
        <!-- Navigation Section -->
        <div class="mb-5">
          <p class="text-[9px] font-medium text-theme-text-muted mb-2 px-3 overflow-hidden text-ellipsis whitespace-nowrap capitalize tracking-wider">
            {{ state.isCollapsed() ? '•••' : 'Main menu' }}
          </p>
          <nav class="space-y-0.5">
            
            <!-- Dashboard -->
            <button 
              routerLink="/dashboard"
              [class]="isActive('/dashboard') ? 'bg-theme-hover text-theme-text-main font-medium' : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: layout-dashboard -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="10" rx="1"/><rect width="7" height="5" x="3" y="14" rx="1"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Dashboard</span>
              }
            </button>

            <!-- Products -->
            <button 
              routerLink="/products"
              [class]="isActive('/products') ? 'bg-theme-hover text-theme-text-main font-medium' : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: package -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Products</span>
              }
            </button>

            <!-- Orders -->
            <button 
              routerLink="/orders"
              [class]="isActive('/orders') ? 'bg-theme-hover text-theme-text-main font-medium' : 'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: shopping-cart -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Orders</span>
              }
            </button>

            <!-- Settings (placeholder) -->
            <button 
              [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" 
              class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale"
              [class.justify-center]="state.isCollapsed()"
              [class.gap-3]="!state.isCollapsed()"
              [class.px-2]="state.isCollapsed()"
              [class.px-3]="!state.isCollapsed()">
              <!-- Lucide: settings -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap">Settings</span>
              }
            </button>

          </nav>
        </div>

        <!-- Catalog Section -->
        <div class="mb-4">
          <button (click)="toggleSection('catalog')" class="w-full flex items-center justify-between text-[9px] font-medium text-theme-text-muted hover:text-theme-text-main mb-1.5 px-3 overflow-hidden capitalize tracking-wider transition-colors cursor-pointer">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ state.isCollapsed() ? '•••' : 'Catalog' }}</span>
            @if (!state.isCollapsed()) {
              <svg class="w-3 h-3 shrink-0 transition-transform duration-200" [class.rotate-180]="isSectionOpen('catalog')" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            }
          </button>
          <div class="grid transition-[grid-template-rows,opacity] duration-200 ease-out" [class.grid-rows-[1fr]]="state.isCollapsed() || isSectionOpen('catalog')" [class.grid-rows-[0fr]]="!state.isCollapsed() && !isSectionOpen('catalog')" [class.opacity-100]="state.isCollapsed() || isSectionOpen('catalog')" [class.opacity-0]="!state.isCollapsed() && !isSectionOpen('catalog')">
            <div class="overflow-hidden">
          <nav class="space-y-0.5">
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Categories</span> }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Inventory</span> }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Collections</span> }
            </button>
          </nav>
            </div>
          </div>
        </div>

        <!-- Sales Section -->
        <div class="mb-4">
          <button (click)="toggleSection('sales')" class="w-full flex items-center justify-between text-[9px] font-medium text-theme-text-muted hover:text-theme-text-main mb-1.5 px-3 overflow-hidden capitalize tracking-wider transition-colors cursor-pointer">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ state.isCollapsed() ? '•••' : 'Sales' }}</span>
            @if (!state.isCollapsed()) {
              <svg class="w-3 h-3 shrink-0 transition-transform duration-200" [class.rotate-180]="isSectionOpen('sales')" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            }
          </button>
          <div class="grid transition-[grid-template-rows,opacity] duration-200 ease-out" [class.grid-rows-[1fr]]="state.isCollapsed() || isSectionOpen('sales')" [class.grid-rows-[0fr]]="!state.isCollapsed() && !isSectionOpen('sales')" [class.opacity-100]="state.isCollapsed() || isSectionOpen('sales')" [class.opacity-0]="!state.isCollapsed() && !isSectionOpen('sales')">
            <div class="overflow-hidden">
          <nav class="space-y-0.5">
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Shipments</span> }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              @if (!state.isCollapsed()) {
                <span class="animate-fade-in whitespace-nowrap flex-1">Returns</span>
                <span class="text-[9px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded-full font-medium shrink-0">4</span>
              }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Payments</span> }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Discounts</span> }
            </button>
          </nav>
            </div>
          </div>
        </div>

        <!-- Customers Section -->
        <div class="mb-4">
          <button (click)="toggleSection('customers')" class="w-full flex items-center justify-between text-[9px] font-medium text-theme-text-muted hover:text-theme-text-main mb-1.5 px-3 overflow-hidden capitalize tracking-wider transition-colors cursor-pointer">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ state.isCollapsed() ? '•••' : 'Customers' }}</span>
            @if (!state.isCollapsed()) {
              <svg class="w-3 h-3 shrink-0 transition-transform duration-200" [class.rotate-180]="isSectionOpen('customers')" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            }
          </button>
          <div class="grid transition-[grid-template-rows,opacity] duration-200 ease-out" [class.grid-rows-[1fr]]="state.isCollapsed() || isSectionOpen('customers')" [class.grid-rows-[0fr]]="!state.isCollapsed() && !isSectionOpen('customers')" [class.opacity-100]="state.isCollapsed() || isSectionOpen('customers')" [class.opacity-0]="!state.isCollapsed() && !isSectionOpen('customers')">
            <div class="overflow-hidden">
          <nav class="space-y-0.5">
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">All Customers</span> }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M11.562 3.266a1 1 0 0 1 .876 0l6.25 3.125a1 1 0 0 1 0 1.768L12 11.132 5.312 8.16a1 1 0 0 1 0-1.768z"/><path d="m5 9.5 7 3.5 7-3.5"/><path d="m5 14.5 7 3.5 7-3.5"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Segments</span> }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Reviews</span> }
            </button>
          </nav>
            </div>
          </div>
        </div>

        <!-- Analytics Section -->
        <div class="mb-4">
          <button (click)="toggleSection('analytics')" class="w-full flex items-center justify-between text-[9px] font-medium text-theme-text-muted hover:text-theme-text-main mb-1.5 px-3 overflow-hidden capitalize tracking-wider transition-colors cursor-pointer">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ state.isCollapsed() ? '•••' : 'Analytics' }}</span>
            @if (!state.isCollapsed()) {
              <svg class="w-3 h-3 shrink-0 transition-transform duration-200" [class.rotate-180]="isSectionOpen('analytics')" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            }
          </button>
          <div class="grid transition-[grid-template-rows,opacity] duration-200 ease-out" [class.grid-rows-[1fr]]="state.isCollapsed() || isSectionOpen('analytics')" [class.grid-rows-[0fr]]="!state.isCollapsed() && !isSectionOpen('analytics')" [class.opacity-100]="state.isCollapsed() || isSectionOpen('analytics')" [class.opacity-0]="!state.isCollapsed() && !isSectionOpen('analytics')">
            <div class="overflow-hidden">
          <nav class="space-y-0.5">
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Reports</span> }
            </button>
            <button [class]="'text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover'" class="w-full flex items-center py-2 rounded-lg text-xs transition-all cursor-pointer text-left overflow-hidden font-normal clickable-scale" [class.justify-center]="state.isCollapsed()" [class.gap-3]="!state.isCollapsed()" [class.px-2]="state.isCollapsed()" [class.px-3]="!state.isCollapsed()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              @if (!state.isCollapsed()) { <span class="animate-fade-in whitespace-nowrap">Traffic</span> }
            </button>
          </nav>
            </div>
          </div>
        </div>

      </div>

      <!-- User Options Bottom Section -->
      <div class="relative z-[120]" id="user-menu-container">
        <!-- Dropdown Menu -->
        <div 
          [class.opacity-100]="isUserDropdownOpen()"
          [class.pointer-events-auto]="isUserDropdownOpen()"
          [class.scale-100]="isUserDropdownOpen()"
          [class.translate-y-0]="isUserDropdownOpen()"
          [class.opacity-0]="!isUserDropdownOpen()"
          [class.pointer-events-none]="!isUserDropdownOpen()"
          [class.scale-95]="!isUserDropdownOpen()"
          [class.translate-y-2]="!isUserDropdownOpen()"
          class="absolute bottom-full left-0 mb-2 w-64 bg-theme-panel border border-theme-border text-theme-text-main rounded-xl p-1.5 z-[130] shadow-md transition-all duration-200 ease-out origin-bottom-left transform select-none">
          
          <!-- User Profile Header -->
          <div class="flex items-center gap-2.5 p-2.5 pb-3 border-b border-theme-border">
            <div class="profile-mesh-avatar w-8 h-8 rounded-full border border-theme-border shrink-0"></div>
            <div class="text-left overflow-hidden">
              <p class="text-xs font-medium leading-tight text-theme-text-main truncate">Alex Rivera</p>
              <p class="text-[9px] text-theme-text-muted truncate mt-0.5">admin&#64;storeng.shop</p>
            </div>
          </div>

          <!-- Appearance Options -->
          <div class="py-1">
            <div class="relative group/appearance w-full">
              <button class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-theme-text-muted hover:text-theme-text-main transition-all cursor-pointer text-left clickable-scale">
                <div class="flex items-center gap-2.5">
                  <!-- Lucide: sun -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                  <div class="flex flex-col text-left">
                    <span>Appearance</span>
                    <span class="text-[9px] text-theme-text-muted font-normal mt-0.5">{{ getActiveThemeName() }}</span>
                  </div>
                </div>
                <!-- Lucide: chevron-right -->
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-theme-text-muted"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              <!-- Flyout Menu -->
              <div class="absolute left-full bottom-0 pl-2 w-32 z-[140] opacity-0 pointer-events-none group-hover/appearance:opacity-100 group-hover/appearance:pointer-events-auto transition-all duration-150">
                <div class="bg-theme-panel border border-theme-border rounded-xl p-1.5 shadow-lg flex flex-col gap-1 text-theme-text-main animate-fade-in">
                  <button (click)="selectTheme('light')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-theme-hover transition-all clickable-scale font-medium">Light</button>
                  <button (click)="selectTheme('dark')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-theme-hover transition-all clickable-scale font-medium">Dark</button>
                  <button (click)="selectTheme('system')" class="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal cursor-pointer hover:bg-theme-hover transition-all clickable-scale font-medium">System</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px my-1 bg-theme-border"></div>

          <div class="py-1">
            <button (click)="onOption('Log Out')" class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-normal transition-all cursor-pointer text-left clickable-scale text-red-500 hover:bg-red-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>
              <span>Log Out</span>
            </button>
          </div>

        </div>

        <!-- Toggle Button -->
        <button 
          (click)="toggleUserDropdown()"
          class="w-full flex items-center bg-transparent hover:bg-theme-hover border border-transparent hover:border-theme-border rounded-xl transition-all cursor-pointer select-none clickable-scale"
          [class.justify-center]="state.isCollapsed()"
          [class.justify-between]="!state.isCollapsed()"
          [class.p-1]="state.isCollapsed()"
          [class.p-2]="!state.isCollapsed()">
          <div class="flex items-center overflow-hidden shrink-0" [class.gap-2]="!state.isCollapsed()">
            <div class="profile-mesh-avatar w-7 h-7 rounded-full border border-theme-border shrink-0"></div>
            @if (!state.isCollapsed()) {
              <div class="text-left animate-fade-in shrink-0">
                <p class="text-[10px] font-medium leading-tight text-theme-text-main truncate max-w-30">Alex Rivera</p>
                <p class="text-[8px] text-theme-text-muted font-normal truncate max-w-30">admin&#64;storeng.shop</p>
              </div>
            }
          </div>
          @if (!state.isCollapsed()) {
            <svg class="w-3.5 h-3.5 text-theme-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          }
        </button>
      </div>

    </aside>
  `
})
export class SidebarComponent {
  protected readonly state = inject(StoreService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  protected readonly isUserDropdownOpen = signal(false);
  protected readonly openSections = signal<Record<string, boolean>>({
    catalog: true,
    sales: true,
    customers: true,
    analytics: true,
  });

  protected isSectionOpen(section: string): boolean {
    return this.openSections()[section] ?? true;
  }

  protected toggleSection(section: string): void {
    if (this.state.isCollapsed()) return;
    this.openSections.update(sections => ({
      ...sections,
      [section]: !(sections[section] ?? true)
    }));
  }

  protected isActive(path: string): boolean {
    const url = this.state.currentUrl();
    if (path === '/dashboard') {
      return url === '/dashboard';
    }
    return url.startsWith(path);
  }

  protected toggleUserDropdown(): void {
    this.isUserDropdownOpen.update(d => !d);
  }

  protected getActiveThemeName(): string {
    const t = this.state.currentTheme();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  protected selectTheme(theme: 'dark' | 'light' | 'system'): void {
    this.state.selectTheme(theme);
    this.isUserDropdownOpen.set(false);
  }

  protected onOption(option: string): void {
    console.log('Selected option:', option);
    this.isUserDropdownOpen.set(false);
  }

  protected onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isUserDropdownOpen.set(false);
      if (window.innerWidth < 768 && !this.state.isCollapsed()) {
        this.state.setSidebarCollapsed(true);
      }
    }
  }
}
