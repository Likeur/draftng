import { Component, input, model, output, signal, computed, ElementRef, inject, HostListener, NgZone, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ui-select',
  template: `
    <div [class]="wrapperClass()">
      <button
        #trigger
        type="button"
        (click)="toggle()"
        class="flex items-center justify-between gap-2 w-full px-3 bg-theme-panel border border-theme-border rounded-xl text-xs text-theme-text-main hover:border-sky-500/50 transition-colors cursor-pointer select-none outline-none focus:border-sky-500"
        [class.border-sky-500]="open()"
        [style.height]="height()">
        <span [class.text-theme-text-muted]="!selectedLabel()">{{ selectedLabel() || placeholder() }}</span>
        <svg
          class="w-3 h-3 text-theme-text-muted shrink-0 transition-transform duration-150"
          [class.rotate-180]="open()"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      @if (open()) {
        <div
          class="fixed z-[9999] bg-theme-panel border border-theme-border rounded-xl shadow-xl overflow-hidden py-1"
          [style.top.px]="dropRect().top"
          [style.left.px]="dropRect().left"
          [style.width.px]="dropRect().width">
          @for (opt of options(); track opt.value) {
            <button
              type="button"
              (click)="select(opt)"
              class="w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer"
              [class.text-theme-text-main]="value() === opt.value"
              [class.font-medium]="value() === opt.value"
              [class.bg-sky-500/8]="value() === opt.value"
              [class.text-theme-text-muted]="value() !== opt.value"
              [class.hover:bg-theme-hover]="value() !== opt.value">
              <div class="flex items-center justify-between">
                <span>{{ opt.label }}</span>
                @if (value() === opt.value) {
                  <svg class="w-3 h-3 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                }
              </div>
            </button>
          }
        </div>
      }
    </div>
  `
})
export class UiSelectComponent {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input('Select...');
  readonly height = input('36px');
  readonly wrapperClass = input('');
  readonly dropUp = input(false);
  readonly value = model('');

  readonly changed = output<string>();
  readonly open = signal(false);

  private triggerRect = signal<DOMRect | null>(null);

  readonly dropRect = computed(() => {
    const r = this.triggerRect();
    if (!r) return { top: 0, left: 0, width: 0 };
    const GAP = 6;
    return { top: r.bottom + GAP, left: r.left, width: r.width };
  });

  get selectedLabel(): () => string {
    return () => this.options().find(o => o.value === this.value())?.label ?? '';
  }

  toggle(): void {
    if (!this.open()) {
      const btn = this.el.nativeElement.querySelector('button');
      if (btn) this.triggerRect.set(btn.getBoundingClientRect());
    }
    this.open.update(v => !v);
  }

  select(opt: SelectOption): void {
    this.value.set(opt.value);
    this.changed.emit(opt.value);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.open.set(false);
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScroll(): void {
    if (this.open()) {
      const btn = this.el.nativeElement.querySelector('button');
      if (btn) this.triggerRect.set(btn.getBoundingClientRect());
    }
  }
}
