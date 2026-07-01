import { Component, input, model, output, signal, computed, ElementRef, inject, HostListener } from '@angular/core';

@Component({
  selector: 'ui-datepicker',
  template: `
    <div class="relative" [class]="wrapperClass()">
      <button
        type="button"
        (click)="toggle()"
        class="flex items-center gap-2 w-full px-3 bg-theme-panel border border-theme-border rounded-xl text-xs hover:border-sky-500/50 transition-colors cursor-pointer select-none outline-none focus:border-sky-500"
        [class.border-sky-500]="open()"
        [style.height]="height()">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0">
          <path d="M8 2v4"/><path d="M16 2v4"/>
          <rect width="18" height="18" x="3" y="4" rx="2"/>
          <path d="M3 10h18"/>
        </svg>
        <span [class.text-theme-text-muted]="!value()" [class.text-theme-text-main]="!!value()">
          {{ displayValue() }}
        </span>
      </button>

      @if (open()) {
        <div
          class="absolute z-[200] mt-1.5 bg-theme-panel border border-theme-border rounded-xl shadow-xl overflow-hidden p-3 w-64"
          [class.right-0]="alignRight()"
          [class.bottom-full]="dropUp()"
          [class.mb-1.5]="dropUp()">

          <!-- Month/Year nav -->
          <div class="flex items-center justify-between mb-3">
            <button type="button" (click)="prevMonth()" class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <span class="text-xs font-medium text-theme-text-main select-none">{{ monthYearLabel() }}</span>
            <button type="button" (click)="nextMonth()" class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Day labels -->
          <div class="grid grid-cols-7 mb-1">
            @for (d of dayLabels; track d) {
              <div class="text-center text-[9px] font-medium text-theme-text-muted py-1">{{ d }}</div>
            }
          </div>

          <!-- Days grid -->
          <div class="grid grid-cols-7 gap-y-0.5">
            @for (cell of calendarCells(); track $index) {
              @if (cell === 0) {
                <div></div>
              } @else {
                <button
                  type="button"
                  (click)="selectDay(cell)"
                  class="h-7 w-full flex items-center justify-center rounded-lg text-xs transition-colors"
                  [disabled]="isDisabled(cell)"
                  [class.cursor-pointer]="!isDisabled(cell)"
                  [class.cursor-not-allowed]="isDisabled(cell)"
                  [class.opacity-30]="isDisabled(cell)"
                  [class.bg-sky-500]="isSelected(cell) || isRangeEdge(cell)"
                  [class.bg-sky-500\/10]="isInRange(cell) && !isSelected(cell) && !isRangeEdge(cell)"
                  [class.text-white]="isSelected(cell) || isRangeEdge(cell)"
                  [class.font-semibold]="isSelected(cell) || isRangeEdge(cell)"
                  [class.text-theme-text-main]="!isSelected(cell) && !isRangeEdge(cell) && !isToday(cell) && !isDisabled(cell)"
                  [class.text-theme-text-muted]="isDisabled(cell)"
                  [class.text-sky-500]="isToday(cell) && !isSelected(cell) && !isRangeEdge(cell) && !isDisabled(cell)"
                  [class.font-medium]="isToday(cell)"
                  [class.hover:bg-theme-hover]="!isSelected(cell) && !isRangeEdge(cell) && !isDisabled(cell)">
                  {{ cell }}
                </button>
              }
            }
          </div>

          <!-- Quick shortcuts -->
          <div class="mt-3 pt-3 border-t border-theme-border flex flex-wrap gap-1">
            @for (s of shortcuts; track s.label) {
              <button type="button" (click)="applyShortcut(s.days)"
                class="px-2 py-1 rounded-lg text-[10px] text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover border border-theme-border transition-colors cursor-pointer">
                {{ s.label }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class UiDatepickerComponent {
  private readonly el = inject(ElementRef);

  readonly placeholder = input('Pick a date');
  readonly height = input('36px');
  readonly wrapperClass = input('');
  readonly alignRight = input(false);
  readonly dropUp = input(false);
  readonly minDate = input('');
  readonly rangeStart = input('');
  readonly rangeEnd = input('');
  readonly value = model('');

  readonly changed = output<string>();
  readonly open = signal(false);

  readonly dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  readonly shortcuts = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: -1 },
    { label: '7 days ago', days: -7 },
    { label: '30 days ago', days: -30 },
  ];

  private viewYear = signal(new Date().getFullYear());
  private viewMonth = signal(new Date().getMonth());

  readonly monthYearLabel = computed(() => {
    const d = new Date(this.viewYear(), this.viewMonth(), 1);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  readonly displayValue = computed(() => {
    const v = this.value();
    if (!v) return this.placeholder();
    const [y, m, d] = v.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });

  readonly calendarCells = computed(() => {
    const year = this.viewYear();
    const month = this.viewMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: number[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(0);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  });

  isSelected(day: number): boolean {
    const v = this.value();
    if (!v) return false;
    const [y, m, d] = v.split('-').map(Number);
    return y === this.viewYear() && m - 1 === this.viewMonth() && d === day;
  }

  isToday(day: number): boolean {
    const t = new Date();
    return t.getFullYear() === this.viewYear() && t.getMonth() === this.viewMonth() && t.getDate() === day;
  }

  isDisabled(day: number): boolean {
    const min = this.minDate();
    if (!min) return false;
    return this.toTimestamp(this.formatValue(day)) < this.toTimestamp(min);
  }

  isInRange(day: number): boolean {
    const start = this.rangeStart();
    const end = this.rangeEnd();
    if (!start || !end) return false;
    const current = this.toTimestamp(this.formatValue(day));
    return current > this.toTimestamp(start) && current < this.toTimestamp(end);
  }

  isRangeEdge(day: number): boolean {
    const value = this.formatValue(day);
    return !!this.rangeStart() && !!this.rangeEnd() && (value === this.rangeStart() || value === this.rangeEnd());
  }

  toggle(): void { this.open.update(v => !v); }

  prevMonth(): void {
    if (this.viewMonth() === 0) {
      this.viewMonth.set(11);
      this.viewYear.update(y => y - 1);
    } else {
      this.viewMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.viewMonth() === 11) {
      this.viewMonth.set(0);
      this.viewYear.update(y => y + 1);
    } else {
      this.viewMonth.update(m => m + 1);
    }
  }

  selectDay(day: number): void {
    if (this.isDisabled(day)) return;
    const val = this.formatValue(day);
    this.value.set(val);
    this.changed.emit(val);
    this.open.set(false);
  }

  applyShortcut(days: number): void {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const val = `${y}-${m}-${d}`;
    if (this.minDate() && this.toTimestamp(val) < this.toTimestamp(this.minDate())) return;
    this.viewYear.set(date.getFullYear());
    this.viewMonth.set(date.getMonth());
    this.value.set(val);
    this.changed.emit(val);
    this.open.set(false);
  }

  private formatValue(day: number): string {
    const y = this.viewYear();
    const m = String(this.viewMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private toTimestamp(value: string): number {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d).getTime();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.open.set(false);
    }
  }
}
