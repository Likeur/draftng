import { Component, signal, input, output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  template: `
    <div class="relative inline-block w-full text-left" id="dropdown-container">
      @if (label()) {
        <label class="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{{ label() }}</label>
      }
      
      <!-- Trigger Button -->
      <button 
        type="button"
        (click)="toggleOpen()" 
        class="w-full flex items-center justify-between px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer select-none">
        <span>{{ selected() || 'Select option' }}</span>
        <svg class="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" [class.rotate-180]="isOpen()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div class="absolute left-0 mt-1.5 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden z-50 py-1">
          @for (option of options(); track option) {
            <button 
              type="button"
              (click)="selectOption(option)" 
              [class.bg-zinc-100]="selected() === option"
              [class.dark:bg-zinc-800]="selected() === option"
              class="w-full text-left px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer">
              {{ option }}
            </button>
          }
        </div>
      }
    </div>
  `
})
export class DropdownComponent {
  public readonly label = input<string>('');
  public readonly options = input<string[]>([]);
  public readonly selected = input<string>('');
  public readonly selectionChange = output<string>();

  protected readonly isOpen = signal(false);

  constructor(private elementRef: ElementRef) {}

  protected toggleOpen(): void {
    this.isOpen.update(o => !o);
  }

  protected selectOption(option: string): void {
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  protected onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
