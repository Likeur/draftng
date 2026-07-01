import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreService, Product } from '../shared/services/store.service';

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Page Header -->
      <div class="animate-blur-slide stagger-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-theme-text-main">Products</h2>
          <p class="text-xs text-theme-text-muted mt-0.5">Manage your product catalog — {{ state.products().length }} items total.</p>
        </div>
        <button
          (click)="openAddModal()"
          class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium rounded-xl transition-all cursor-pointer select-none clickable-scale">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Product
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
            placeholder="Search products by name, SKU or category..."
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

      <!-- Products Table -->
      <div class="animate-blur-slide stagger-3 bg-theme-panel border border-theme-border rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-theme-border bg-theme-hover/30">
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Product</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden md:table-cell">Category</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Price</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden sm:table-cell">Stock</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider hidden lg:table-cell">Sold</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider">Status</th>
                <th class="px-5 py-3 text-[9px] font-medium text-theme-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of filteredProducts(); track product.id) {
                <tr class="border-b border-theme-border/50 last:border-none hover:bg-theme-hover/50 transition-colors">
                  <td class="px-5 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-theme-border bg-theme-hover">
                        <img
                          [src]="product.photo"
                          [alt]="product.name"
                          class="w-full h-full object-cover"
                          loading="lazy"
                          (error)="onImgError($event, product.image)">
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-medium text-theme-text-main truncate max-w-[180px]">{{ product.name }}</p>
                        <p class="text-[9px] text-theme-text-muted font-mono">{{ product.sku }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-3 text-xs text-theme-text-muted hidden md:table-cell">{{ product.category }}</td>
                  <td class="px-5 py-3 text-xs font-medium text-theme-text-main">{{ '$' + product.price.toFixed(2) }}</td>
                  <td class="px-5 py-3 hidden sm:table-cell">
                    <span class="text-xs font-medium"
                      [class.text-rose-500]="product.stock === 0"
                      [class.text-amber-500]="product.stock > 0 && product.stock <= 20"
                      [class.text-theme-text-main]="product.stock > 20">
                      {{ product.stock === 0 ? '—' : product.stock }}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-xs text-theme-text-muted hidden lg:table-cell">{{ product.sold.toLocaleString() }}</td>
                  <td class="px-5 py-3">
                    <span class="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      [class.bg-emerald-500/10]="product.status === 'Active'" [class.text-emerald-500]="product.status === 'Active'"
                      [class.bg-zinc-500/10]="product.status === 'Draft'" [class.text-theme-text-muted]="product.status === 'Draft'"
                      [class.bg-rose-500/10]="product.status === 'Out of Stock'" [class.text-rose-500]="product.status === 'Out of Stock'">
                      {{ product.status }}
                    </span>
                  </td>
                  <td class="px-5 py-3">
                    <div class="flex items-center justify-end gap-1">
                      <button
                        (click)="openEditModal(product)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-all cursor-pointer clickable-scale">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                      </button>
                      <button
                        (click)="deleteProduct(product.id)"
                        class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer clickable-scale">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-5 py-10 text-center text-xs text-theme-text-muted">No products match your search.</td>
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
            <h3 class="text-sm font-semibold text-theme-text-main">{{ isEditing() ? 'Edit Product' : 'Add Product' }}</h3>
            <button (click)="closeModal()" class="w-7 h-7 flex items-center justify-center rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-all cursor-pointer clickable-scale">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Product Name</label>
              <input type="text" [(ngModel)]="form.name" placeholder="e.g. Wireless Headphones Pro" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Category</label>
                <select [(ngModel)]="form.category" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main outline-none focus:border-sky-500 transition-colors cursor-pointer">
                  <option value="">Select...</option>
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Home & Kitchen</option>
                  <option>Sports</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Status</label>
                <select [(ngModel)]="form.status" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main outline-none focus:border-sky-500 transition-colors cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Price ($)</label>
                <input type="number" [(ngModel)]="form.price" placeholder="0.00" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
              </div>
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">Stock</label>
                <input type="number" [(ngModel)]="form.stock" placeholder="0" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
              </div>
              <div>
                <label class="block text-[10px] font-medium text-theme-text-muted mb-1">SKU</label>
                <input type="text" [(ngModel)]="form.sku" placeholder="XX-000-000" class="w-full px-3 h-9 bg-theme-bg border border-theme-border rounded-xl text-xs text-theme-text-main placeholder-theme-text-muted outline-none focus:border-sky-500 transition-colors">
              </div>
            </div>
          </div>

          <div class="flex gap-2 mt-5">
            <button (click)="closeModal()" class="flex-1 h-9 border border-theme-border rounded-xl text-xs font-medium text-theme-text-muted hover:text-theme-text-main hover:bg-theme-hover transition-all cursor-pointer clickable-scale">Cancel</button>
            <button (click)="saveProduct()" class="flex-1 h-9 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-medium transition-all cursor-pointer clickable-scale">
              {{ isEditing() ? 'Save Changes' : 'Add Product' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductsComponent {
  protected readonly state = inject(StoreService);

  protected readonly searchQuery = signal('');
  protected readonly activeFilter = signal('All');
  protected readonly isModalOpen = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly editingId = signal<number | null>(null);

  protected readonly filters = ['All', 'Active', 'Draft', 'Out of Stock'];

  protected readonly form = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    sku: '',
    status: 'Active' as Product['status']
  };

  protected readonly filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const f = this.activeFilter();
    return this.state.products().filter(p => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchesFilter = f === 'All' || p.status === f;
      return matchesSearch && matchesFilter;
    });
  });

  protected openAddModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.form.name = '';
    this.form.category = '';
    this.form.price = 0;
    this.form.stock = 0;
    this.form.sku = '';
    this.form.status = 'Active';
    this.isModalOpen.set(true);
  }

  protected openEditModal(product: Product): void {
    this.isEditing.set(true);
    this.editingId.set(product.id);
    this.form.name = product.name;
    this.form.category = product.category;
    this.form.price = product.price;
    this.form.stock = product.stock;
    this.form.sku = product.sku;
    this.form.status = product.status;
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }

  protected saveProduct(): void {
    if (!this.form.name.trim()) return;

    if (this.isEditing() && this.editingId() !== null) {
      this.state.products.update(list =>
        list.map(p => p.id === this.editingId()
          ? { ...p, name: this.form.name, category: this.form.category, price: this.form.price, stock: this.form.stock, sku: this.form.sku, status: this.form.status }
          : p
        )
      );
    } else {
      const avatars = ['avatar-grad-1','avatar-grad-2','avatar-grad-3','avatar-grad-4','avatar-grad-5','avatar-grad-6','avatar-grad-7','avatar-grad-8','avatar-grad-9','avatar-grad-10','avatar-grad-11','avatar-grad-12'];
      const newId = Math.max(...this.state.products().map(p => p.id)) + 1;
      this.state.products.update(list => [{
        id: newId,
        name: this.form.name,
        category: this.form.category,
        price: this.form.price,
        stock: this.form.stock,
        sold: 0,
        status: this.form.status,
        sku: this.form.sku,
        image: avatars[newId % avatars.length],
        photo: ''
      }, ...list]);
    }
    this.closeModal();
  }

  protected deleteProduct(id: number): void {
    this.state.products.update(list => list.filter(p => p.id !== id));
  }

  protected onImgError(event: Event, fallbackClass: string): void {
    const img = event.target as HTMLImageElement;
    const parent = img.parentElement;
    if (parent) {
      parent.classList.add(...fallbackClass.split(' '));
      img.style.display = 'none';
    }
  }
}
