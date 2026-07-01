import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService, Order } from '../shared/services/store.service';

@Component({
  selector: 'app-orders',
  imports: [FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Page Header -->
      <div class="animate-blur-slide stagger-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-theme-text-main">Orders</h2>
          <p class="text-xs text-theme-text-muted mt-0.5">Track and manage customer orders — {{ state.orders().length }} orders total.</p>
        </div>
        <button
          (click)="openAddModal()"
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-xl transition-all cursor-pointer select-none clickable-scale">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Order
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="animate-blur-slide stagger-2 flex flex-col sm:flex-row gap-3">
        <div class="flex items-center gap-2 px-3 h-9 bg-theme-panel border border-theme-border rounded-xl grow">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-theme-text-muted shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search by order number or customer name..."
            class="bg-transparent border-none outline-none text-xs w-full placeholder-theme-text-muted text-theme-text-main">
        </div>
        <div class="flex gap-2 flex-wrap">
          @for (f of filters; track f) {
            <button
              (click)="activeFilter.set(f)"
              [class]="activeFilter() === f ? 'bg-sky-500 text-white border-sky-500' : 'bg-theme-panel text-theme-text-muted border-theme-border hover:text-theme-text-main'"
              class="px-3 h-9 border rounded-xl text-xs font-medium transition-all cursor-pointer select-none clickable-scale shrink-0">
              {{ f }}
            </button>
          }
        </div>
      </div>

      <!-- Orders Table -->
      <div class="animate-blur-slide stagger-3 bg-theme-panel border border-theme-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-theme-border bg-theme-hover/30">
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Order</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden sm:table-cell">Customer</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden md:table-cell">Date</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden lg:table-cell">Items</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Total</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Status</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (order of filteredOrders(); track order.id) {
                <tr class="border-b border-theme-border/50 last:border-none hover:bg-theme-hover/50 transition-colors">
                  <td class="px-5 py-3">
                    <span class="text-xs font-medium text-theme-text-main font-mono">{{ order.orderNumber }}</span>
                  </td>
                  <td class="px-5 py-3 hidden sm:table-cell">
                    <div class="flex items-center gap-2">
                      <div [class]="order.avatar" class="w-7 h-7 rounded-full shrink-0"></div>
                      <div class="min-w-0">
                        <p class="text-xs font-medium text-theme-text-main truncate max-w-[140px]">{{ order.customer }}</p>
                        <p class="text-[9px] text-theme-text-muted truncate max-w-[140px]">{{ order.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-3 text-xs text-theme-text-muted hidden md:table-cell">{{ order.date }}</td>
                  <td class="px-5 py-3 text-xs text-theme-text-muted hidden lg:table-cell">{{ order.items }} item{{ order.items > 1 ? 's' : '' }}</td>
                  <td class="px-5 py-3">
                    <span class="text-xs font-medium text-theme-text-main">{{ '$' + order.total.toFixed(2) }}</span>
                  </td>
                  <td class="px-5 py-3">
                    <span class="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      [class.bg-amber-500/10]="order.status === 'Pending'" [class.text-amber-500]="order.status === 'Pending'"
                      [class.bg-sky-500/10]="order.status === 'Processing'" [class.text-sky-500]="order.status === 'Processing'"
                      [class.bg-blue-500/10]="order.status === 'Shipped'" [class.text-blue-500]="order.status === 'Shipped'"
                      [class.bg-emerald-500/10]="order.status === 'Delivered'" [class.text-emerald-500]="order.status === 'Delivered'"
                      [class.bg-red-500/10]="order.status === 'Cancelled'" [class.text-red-500]="order.status === 'Cancelled'">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-5 py-3">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        (click)="openEditModal(order)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-all cursor-pointer clickable-scale">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                      </button>
                      <button
                        (click)="deleteOrder(order.id)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer clickable-scale">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-5 py-10 text-center text-xs text-theme-text-muted">No orders match your search.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Add/Edit Modal -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4" (click)="closeModal()">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-theme-panel border border-theme-border rounded-2xl p-6 w-full max-w-md shadow-xl animate-blur-slide" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-sm font-semibold text-theme-text-main">{{ isEditing() ? 'Edit Order' : 'New Order' }}</h3>
            <button (click)="closeModal()" class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-all cursor-pointer clickable-scale">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Customer Name</label>
                <input type="text" [(ngModel)]="form.customer" placeholder="Full name" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
              </div>
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Email</label>
                <input type="email" [(ngModel)]="form.email" placeholder="customer@email.com" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Total ($)</label>
                <input type="number" [(ngModel)]="form.total" placeholder="0.00" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
              </div>
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Items</label>
                <input type="number" [(ngModel)]="form.items" placeholder="1" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
              </div>
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Status</label>
                <select [(ngModel)]="form.status" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main outline-none focus:border-sky-500 transition-colors cursor-pointer">
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex gap-2 mt-5">
            <button (click)="closeModal()" class="flex-1 h-9 border border-theme-border rounded-xl text-xs font-medium text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-all cursor-pointer clickable-scale">Cancel</button>
            <button (click)="saveOrder()" class="flex-1 h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-medium transition-all cursor-pointer clickable-scale">
              {{ isEditing() ? 'Save Changes' : 'Create Order' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class OrdersComponent {
  protected readonly state = inject(StoreService);

  protected readonly searchQuery = signal('');
  protected readonly activeFilter = signal('All');
  protected readonly isModalOpen = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly editingId = signal<number | null>(null);

  protected readonly filters = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  protected readonly form = {
    customer: '',
    email: '',
    total: 0,
    items: 1,
    status: 'Pending' as Order['status']
  };

  protected readonly filteredOrders = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const f = this.activeFilter();
    return this.state.orders().filter(o => {
      const matchesSearch = !q || o.customer.toLowerCase().includes(q) || o.orderNumber.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
      const matchesFilter = f === 'All' || o.status === f;
      return matchesSearch && matchesFilter;
    });
  });

  protected openAddModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.form.customer = '';
    this.form.email = '';
    this.form.total = 0;
    this.form.items = 1;
    this.form.status = 'Pending';
    this.isModalOpen.set(true);
  }

  protected openEditModal(order: Order): void {
    this.isEditing.set(true);
    this.editingId.set(order.id);
    this.form.customer = order.customer;
    this.form.email = order.email;
    this.form.total = order.total;
    this.form.items = order.items;
    this.form.status = order.status;
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }

  protected saveOrder(): void {
    if (!this.form.customer.trim()) return;

    if (this.isEditing() && this.editingId() !== null) {
      this.state.orders.update(list =>
        list.map(o => o.id === this.editingId()
          ? { ...o, customer: this.form.customer, email: this.form.email, total: this.form.total, items: this.form.items, status: this.form.status }
          : o
        )
      );
    } else {
      const avatars = ['avatar-grad-1','avatar-grad-2','avatar-grad-3','avatar-grad-4','avatar-grad-5','avatar-grad-6','avatar-grad-7','avatar-grad-8','avatar-grad-9','avatar-grad-10','avatar-grad-11','avatar-grad-12'];
      const newId = Math.max(...this.state.orders().map(o => o.id)) + 1;
      const orderNum = `ORD-${1000 + newId}`;
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      this.state.orders.update(list => [{
        id: newId,
        orderNumber: orderNum,
        customer: this.form.customer,
        email: this.form.email,
        date: today,
        total: this.form.total,
        items: this.form.items,
        status: this.form.status,
        avatar: avatars[newId % avatars.length]
      }, ...list]);
    }
    this.closeModal();
  }

  protected deleteOrder(id: number): void {
    this.state.orders.update(list => list.filter(o => o.id !== id));
  }

}
