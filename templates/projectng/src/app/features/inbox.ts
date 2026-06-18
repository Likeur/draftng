import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface InboxItem {
  id: number;
  sender: string;
  senderInitials: string;
  senderGrad: string;
  action: string;
  taskTitle: string;
  details: string;
  timestamp: string;
  isUnread: boolean;
}

interface MessageReply {
  sender: string;
  senderInitials: string;
  senderGrad: string;
  details: string;
  timestamp: string;
}

@Component({
  selector: 'app-inbox',
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-blur-slide font-sans">
      
      <!-- Header Actions -->
      <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 class="font-display font-extrabold text-md tracking-tight select-none">
            Inbox Console
          </h2>
          <p class="text-xs text-zinc-400 mt-1">Review team comments, issue mentions, and code review alerts.</p>
        </div>

        <!-- Filter tabs (only show when not viewing a thread) -->
        @if (!selectedItem()) {
          <div [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-zinc-100 border-zinc-200'" class="p-1 rounded-xl border flex items-center select-none shrink-0">
            <button 
              (click)="inboxFilter.set('unread')" 
              [class]="inboxFilter() === 'unread' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
              Unread
            </button>
            <button 
              (click)="inboxFilter.set('all')" 
              [class]="inboxFilter() === 'all' ? (isDark() ? 'bg-zinc-800 text-zinc-50 font-bold' : 'bg-white text-zinc-950 font-bold shadow-sm') : 'text-zinc-400 hover:text-zinc-650'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all clickable-scale">
              All Messages
            </button>
          </div>
        }
      </section>

      @if (selectedItem()) {
        <!-- Detailed Conversation Thread View -->
        <div class="space-y-4 animate-blur-slide">
          <div class="flex items-center gap-3">
            <button 
              (click)="selectedItem.set(null)" 
              [class]="isDark() ? 'text-zinc-400 hover:text-zinc-50' : 'text-zinc-650 hover:text-zinc-950'" 
              class="flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer select-none clickable-scale">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Inbox
            </button>
          </div>

          <!-- Main thread panel (Subtle dark borders, flat, shadow-free) -->
          <div [class]="isDark() ? 'bg-zinc-900 border-zinc-850 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'" class="border rounded-2xl p-6 space-y-6">
            
            <div class="flex items-start justify-between border-b pb-4" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
              <div>
                <span class="text-[9px] bg-teal-500/10 text-teal-500 border border-teal-500/20 px-2 py-0.5 rounded-full font-bold select-none">
                  #{{ selectedItem()!.taskTitle }}
                </span>
                <h3 class="font-display font-extrabold text-sm text-zinc-900 dark:text-zinc-50 mt-2">
                  Conversation with {{ selectedItem()!.sender }}
                </h3>
              </div>
              <span class="text-[9px] text-zinc-400 font-semibold pt-1">{{ selectedItem()!.timestamp }}</span>
            </div>

            <!-- Messages Stream -->
            <div class="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              @for (reply of conversationThreads()[selectedItem()!.id] || []; track reply.timestamp) {
                <div class="flex gap-3.5" [class.justify-end]="reply.sender === 'jacksimba218269'">
                  @if (reply.sender !== 'jacksimba218269') {
                    <div [class]="reply.senderGrad" class="w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-[9px] text-white shrink-0 select-none">
                      {{ reply.senderInitials }}
                    </div>
                  }

                  <div class="flex flex-col space-y-1 max-w-[80%]">
                    <div class="flex items-baseline gap-2" [class.justify-end]="reply.sender === 'jacksimba218269'">
                      <span class="text-[10px] font-bold text-zinc-800 dark:text-zinc-250">{{ reply.sender === 'jacksimba218269' ? 'Me' : reply.sender }}</span>
                      <span class="text-[8px] text-zinc-400 font-semibold">{{ reply.timestamp }}</span>
                    </div>
                    <div 
                      [class]="reply.sender === 'jacksimba218269' ? (isDark() ? 'bg-teal-500/10 text-teal-200 border-teal-500/20' : 'bg-teal-50 text-teal-950 border-teal-100') : (isDark() ? 'bg-zinc-950 text-zinc-250 border-zinc-850' : 'bg-zinc-50 text-zinc-850 border-zinc-100')" 
                      class="p-3 rounded-xl border text-xs leading-relaxed font-semibold">
                      {{ reply.details }}
                    </div>
                  </div>

                  @if (reply.sender === 'jacksimba218269') {
                    <div [class]="reply.senderGrad" class="w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-[9px] text-white shrink-0 select-none">
                      {{ reply.senderInitials }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Reply Box -->
            <div class="pt-4 border-t" [class]="isDark() ? 'border-zinc-800' : 'border-zinc-100'">
              <div class="flex gap-3">
                <input 
                  #replyInput
                  type="text" 
                  placeholder="Type a reply and press Enter..." 
                  (keyup.enter)="sendReply(selectedItem()!.id, replyInput.value); replyInput.value = ''"
                  [class]="isDark() ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400'"
                  class="flex-grow px-3 py-2 text-xs rounded-xl border outline-none font-semibold">
                <button 
                  (click)="sendReply(selectedItem()!.id, replyInput.value); replyInput.value = ''"
                  class="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold text-xs transition-colors cursor-pointer select-none clickable-scale">
                  Send
                </button>
              </div>
            </div>

          </div>
        </div>
      } @else {
        <!-- Inbox Items List (Flat layout, shadow-free, subtle dark borders) -->
        <section [class]="isDark() ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'" class="border rounded-2xl overflow-hidden divide-y" [class.divide-zinc-850]="isDark()" [class.divide-zinc-100]="!isDark()">
          @for (item of filteredItems(); track item.id; let idx = $index) {
            
            <div 
              (click)="selectConversation(item)"
              [class.bg-teal-500/[0.02]]="item.isUnread" 
              class="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-zinc-100/10 dark:hover:bg-zinc-800/10 cursor-pointer animate-blur-slide"
              [style.animation-delay]="(idx * 60) + 'ms'">
              
              <div class="flex items-start gap-3.5">
                <!-- Avatar with gradient -->
                <div 
                  [class]="item.senderGrad" 
                  class="w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-[9px] text-white shrink-0 select-none">
                  {{ item.senderInitials }}
                </div>
                
                <div class="space-y-1">
                  <p class="text-xs">
                    <span class="font-bold text-zinc-900 dark:text-zinc-50">{{ item.sender }}</span>
                    <span class="text-zinc-400 font-medium ml-1.5">{{ item.action }}</span>
                    <span class="font-bold text-teal-500 ml-1.5 select-all cursor-pointer">#{{ item.taskTitle }}</span>
                  </p>
                  <p class="text-xs text-zinc-500 leading-relaxed max-w-2xl font-semibold">
                    "{{ item.details }}"
                  </p>
                  <span class="text-[9px] text-zinc-400 block font-semibold pt-1">{{ item.timestamp }}</span>
                </div>
              </div>

              <!-- Action controls -->
              <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                @if (item.isUnread) {
                  <button 
                    (click)="$event.stopPropagation(); markAsRead(item.id)"
                    [class]="isDark() ? 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200' : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-250 text-zinc-855'"
                    class="px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer select-none clickable-scale">
                    Mark Read
                  </button>
                }
                <button 
                  (click)="$event.stopPropagation(); archiveItem(item.id)"
                  [class]="isDark() ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'"
                  class="p-1.5 rounded-lg cursor-pointer transition-colors clickable-scale select-none">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
              </div>

            </div>

          } @empty {
            <div class="p-12 text-center flex flex-col items-center justify-center gap-2 text-zinc-500 font-semibold text-xs select-none">
              <svg class="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Your inbox is completely clean.</p>
            </div>
          }
        </section>
      }

    </div>
  `
})
export class InboxComponent {
  public readonly isDark = input<boolean>(false);

  protected readonly inboxFilter = signal<'unread' | 'all'>('unread');
  protected readonly selectedItem = signal<InboxItem | null>(null);

  // Roster notifications items list
  protected readonly inboxItems = signal<InboxItem[]>([
    {
      id: 1,
      sender: 'Lisa Nguyen',
      senderInitials: 'LN',
      senderGrad: 'avatar-grad-1',
      action: 'replied on task',
      taskTitle: 'Design Tokens Refactoring',
      details: 'Audit is completed. Can you review if the styles compiled correctly on Tailwind css v4?',
      timestamp: '15 minutes ago',
      isUnread: true
    },
    {
      id: 2,
      sender: 'Daniel Kojo',
      senderInitials: 'DK',
      senderGrad: 'avatar-grad-4',
      action: 'assigned a task to you',
      taskTitle: 'Core API Auth integrations',
      details: 'Need assistance setting up browser hydration tests for oauth routes.',
      timestamp: '2 hours ago',
      isUnread: true
    },
    {
      id: 3,
      sender: 'Alexandre Naudin',
      senderInitials: 'AN',
      senderGrad: 'avatar-grad-3',
      action: 'completed cycles milestones on',
      taskTitle: 'System Migration to Angular 22',
      details: 'SSR output location bundles resolved completely.',
      timestamp: 'Yesterday',
      isUnread: true
    },
    {
      id: 4,
      sender: 'Lisa Nguyen',
      senderInitials: 'LN',
      senderGrad: 'avatar-grad-1',
      action: 'closed the thread on',
      taskTitle: 'E2E Testing Pipeline',
      details: 'Closing this since builds are now passing on the staging workspace checks.',
      timestamp: '3 days ago',
      isUnread: false
    }
  ]);

  // Thread replies
  protected readonly conversationThreads = signal<Record<number, MessageReply[]>>({
    1: [
      { sender: 'Lisa Nguyen', senderInitials: 'LN', senderGrad: 'avatar-grad-1', details: 'Audit is completed. Can you review if the styles compiled correctly on Tailwind css v4?', timestamp: '15 minutes ago' },
      { sender: 'jacksimba218269', senderInitials: 'JS', senderGrad: 'avatar-grad-3', details: 'Yes, looking into it now. Let me run the build task checks.', timestamp: '10 minutes ago' },
      { sender: 'Lisa Nguyen', senderInitials: 'LN', senderGrad: 'avatar-grad-1', details: 'Thanks! Let me know if you run into any compilation warnings.', timestamp: '8 minutes ago' }
    ],
    2: [
      { sender: 'Daniel Kojo', senderInitials: 'DK', senderGrad: 'avatar-grad-4', details: 'Need assistance setting up browser hydration tests for oauth routes.', timestamp: '2 hours ago' },
      { sender: 'jacksimba218269', senderInitials: 'JS', senderGrad: 'avatar-grad-3', details: 'Let me finish checking Lisa\'s design token edits, then I will jump onto your branch.', timestamp: '1 hour ago' }
    ],
    3: [
      { sender: 'Alexandre Naudin', senderInitials: 'AN', senderGrad: 'avatar-grad-3', details: 'SSR output location bundles resolved completely.', timestamp: 'Yesterday' }
    ],
    4: [
      { sender: 'Lisa Nguyen', senderInitials: 'LN', senderGrad: 'avatar-grad-1', details: 'Closing this since builds are now passing on the staging workspace checks.', timestamp: '3 days ago' }
    ]
  });

  protected readonly filteredItems = computed(() => {
    const filter = this.inboxFilter();
    return this.inboxItems().filter(item => filter === 'all' || item.isUnread);
  });

  protected selectConversation(item: InboxItem): void {
    this.selectedItem.set(item);
    this.markAsRead(item.id);
  }

  protected markAsRead(id: number): void {
    this.inboxItems.update(list => 
      list.map(item => item.id === id ? { ...item, isUnread: false } : item)
    );
  }

  protected archiveItem(id: number): void {
    this.inboxItems.update(list => list.filter(item => item.id !== id));
    if (this.selectedItem()?.id === id) {
      this.selectedItem.set(null);
    }
  }

  protected sendReply(id: number, text: string): void {
    if (!text.trim()) return;
    this.conversationThreads.update(threads => {
      const current = threads[id] || [];
      const newReply: MessageReply = {
        sender: 'jacksimba218269',
        senderInitials: 'JS',
        senderGrad: 'avatar-grad-3',
        details: text.trim(),
        timestamp: 'Just now'
      };
      return {
        ...threads,
        [id]: [...current, newReply]
      };
    });
  }
}
