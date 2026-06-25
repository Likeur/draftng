---
title: "Mastering Angular Signals: A Complete Tutorial for Modern Reactivity"
description: "Deep dive into Angular Signals - the new reactive primitive that's changing how we manage state in Angular applications. Learn patterns, best practices, and real-world examples."
date: 2026-06-23
tags: ["Angular", "Signals", "Reactivity", "State Management"]
author: "likeur"
---

Angular Signals are the most important addition to the framework since standalone components. They replace the messy mix of `EventEmitter`, `BehaviorSubject`, and `ChangeDetectorRef` with a single, unified reactivity system that's fast, predictable, and a joy to work with.

Whether you're building a small widget or a large-scale dashboard, this tutorial will take you from zero to expert with practical, real-world examples. By the end, you'll understand every signal primitive, know when to use each one, and be ready to build [zoneless Angular apps](/blog/angular-22-zoneless-guide) with confidence.

## Why Signals?

Before Signals, Angular developers juggled multiple state management approaches:

- **`@Input()` / `@Output()`** for parent-child communication
- **Services with `BehaviorSubject`** for shared state
- **RxJS `Observable`** for async data streams
- **`ChangeDetectorRef.markForCheck()`** for manual change detection
- **NgRx** for global state

Each of these has its place, but combining them leads to boilerplate-heavy code and subtle bugs. Signals unify all of these into a single, coherent system:

- **Simple state** → `signal()`
- **Derived state** → `computed()`
- **Side effects** → `effect()`
- **Component inputs** → `input()`
- **Component outputs** → `output()`
- **RxJS interop** → `toSignal()` / `toObservable()`

## Core Concepts

### Writable Signals

A signal is a wrapper around a value. You create one with `signal()` and read it by calling it like a function:

```typescript
import { signal } from '@angular/core';

const count = signal(0);
const name = signal('Alice');
const isActive = signal(true);

// Read
console.log(count());   // 0
console.log(name());    // "Alice"

// Write — replace the value
count.set(10);
name.set('Bob');

// Write — update based on current value
count.update(c => c + 1);       // 11
isActive.update(a => !a);       // false
```

### Computed Signals

`computed()` creates a read-only signal that automatically derives its value from other signals. It's lazy (only computes when read) and memoized (caches the result until a dependency changes):

```typescript
import { signal, computed } from '@angular/core';

const price = signal(29.99);
const quantity = signal(3);
const taxRate = signal(0.08);

const subtotal = computed(() => price() * quantity());
const tax = computed(() => subtotal() * taxRate());
const total = computed(() => subtotal() + tax());

console.log(subtotal()); // 89.97
console.log(total());    // 97.17

// Change a dependency
quantity.set(5);
console.log(total());    // 161.94 — automatically recalculated
```

> **Key insight**: Computed signals only recalculate when a dependency changes **and** someone reads the result. If nobody reads `total()`, it never recomputes — even if `quantity` changes.

### Effects

`effect()` runs a callback whenever its signal dependencies change. Use effects for **side effects** — not for computing values:

```typescript
import { signal, effect } from '@angular/core';

const cart = signal<string[]>([]);

effect(() => {
  console.log('Cart updated:', cart());
  localStorage.setItem('cart', JSON.stringify(cart()));
});

cart.set(['Apple', 'Banana']);
// Console: "Cart updated: ["Apple","Banana"]"
// localStorage is updated

cart.update(items => [...items, 'Cherry']);
// Console: "Cart updated: ["Apple","Banana","Cherry"]"
// localStorage is updated
```

> **Golden rule**: Never use `effect()` to set another signal. That creates write cycles and makes your code harder to reason about. Use `computed()` for derived state instead.

## Signals in Components

### Basic Component State

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="flex items-center gap-4">
      <button (click)="decrement()"
              class="w-10 h-10 rounded-full bg-gray-200 text-xl">
        −
      </button>
      <span class="text-2xl font-bold w-12 text-center">
        {{ count() }}
      </span>
      <button (click)="increment()"
              class="w-10 h-10 rounded-full bg-gray-200 text-xl">
        +
      </button>
    </div>
    <p class="mt-2 text-gray-600">{{ parity() }}</p>
  `
})
export class CounterComponent {
  count = signal(0);
  parity = computed(() =>
    this.count() % 2 === 0 ? 'Even number' : 'Odd number'
  );

  increment() {
    this.count.update(c => c + 1);
  }

  decrement() {
    this.count.update(c => c - 1);
  }
}
```

### Input Signals

Angular 17+ replaced `@Input()` with `input()` — a signal-based alternative that works seamlessly with `computed()`:

```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="p-4 border rounded-lg">
      <h3 class="font-bold text-lg">{{ name() }}</h3>
      <p class="text-gray-600">{{ email() }}</p>
      <span class="text-sm px-2 py-0.5 rounded"
            [class]="roleBadge()">
        {{ role() }}
      </span>
    </div>
  `
})
export class UserCardComponent {
  name = input.required<string>();
  email = input.required<string>();
  role = input<'admin' | 'user' | 'guest'>('user');

  roleBadge = computed(() => {
    const badges = {
      admin: 'bg-red-100 text-red-700',
      user: 'bg-blue-100 text-blue-700',
      guest: 'bg-gray-100 text-gray-700'
    };
    return badges[this.role()];
  });
}
```

### Output Signals

The `output()` function replaces `@Output()` and `EventEmitter`:

```typescript
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <input
      type="text"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Search..."
      class="border rounded-lg px-4 py-2 w-full"
    />
  `
})
export class SearchComponent {
  query = signal('');
  searchChange = output<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.searchChange.emit(value);
  }
}
```

### ViewChild and ContentChild Signals

Angular 22 also provides signal-based queries:

```typescript
import { Component, viewChild, signal, effect } from '@angular/core';
import { CanvasComponent } from './canvas.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CanvasComponent],
  template: `<canvas-component #canvas />`
})
export class EditorComponent {
  canvas = viewChild.required(CanvasComponent);
  isReady = signal(false);

  constructor() {
    effect(() => {
      if (this.canvas()) {
        this.canvas().initialize();
        this.isReady.set(true);
      }
    });
  }
}
```

## Advanced Patterns

### Pattern 1: Signal-Based Store

Create a lightweight store using signals — no NgRx required:

```typescript
import { signal, computed, Injectable } from '@angular/core';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoStore {
  private todos = signal<Todo[]>([]);
  private filter = signal<'all' | 'active' | 'done'>('all');

  // Public read-only signals
  filteredTodos = computed(() => {
    const f = this.filter();
    return this.todos().filter(t =>
      f === 'all' ? true : f === 'active' ? !t.done : t.done
    );
  });

  remainingCount = computed(() =>
    this.todos().filter(t => !t.done).length
  );

  completedCount = computed(() =>
    this.todos().filter(t => t.done).length
  );

  totalCount = computed(() => this.todos().length);

  // Actions
  addTodo(text: string) {
    this.todos.update(list => [
      ...list,
      { id: Date.now(), text, done: false }
    ]);
  }

  toggleTodo(id: number) {
    this.todos.update(list =>
      list.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }

  removeTodo(id: number) {
    this.todos.update(list => list.filter(t => t.id !== id));
  }

  setFilter(filter: 'all' | 'active' | 'done') {
    this.filter.set(filter);
  }
}
```

Using the store in a component:

```typescript
@Component({
  selector: 'app-todo-list',
  standalone: true,
  template: `
    <div class="max-w-md mx-auto p-4">
      <input
        #newTodo
        (keyup.enter)="add(newTodo.value); newTodo.value = ''"
        placeholder="What needs to be done?"
        class="w-full border rounded-lg px-4 py-2 mb-4"
      />

      <div class="flex gap-2 mb-4">
        @for (f of filters; track f) {
          <button
            (click)="store.setFilter(f)"
            [class.font-bold]="store.filter() === f"
            class="px-3 py-1 rounded"
          >
            {{ f }}
          </button>
        }
      </div>

      <ul class="space-y-2">
        @for (todo of store.filteredTodos(); track todo.id) {
          <li class="flex items-center gap-2 p-2 border rounded">
            <input type="checkbox"
                   [checked]="todo.done"
                   (change)="store.toggleTodo(todo.id)" />
            <span [class.line-through]="todo.done">
              {{ todo.text }}
            </span>
            <button (click)="store.removeTodo(todo.id)"
                    class="ml-auto text-red-500">
              ✕
            </button>
          </li>
        }
      </ul>

      <p class="mt-4 text-sm text-gray-600">
        {{ store.remainingCount() }} of {{ store.totalCount() }} remaining
      </p>
    </div>
  `
})
export class TodoListComponent {
  store = inject(TodoStore);
  filters = ['all', 'active', 'done'] as const;

  add(text: string) {
    if (text.trim()) {
      this.store.addTodo(text.trim());
    }
  }
}
```

### Pattern 2: RxJS Interop

Use `toSignal()` to convert observables to signals, and `toObservable()` for the reverse:

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    @if (user(); as u) {
      <div class="p-6 rounded-lg bg-white shadow">
        <h2 class="text-xl font-bold">{{ u.name }}</h2>
        <p class="text-gray-600">{{ u.email }}</p>
      </div>
    } @else if (loading()) {
      <div class="animate-pulse p-6 rounded-lg bg-gray-100">
        <div class="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    } @else if (error()) {
      <p class="text-red-500">Failed to load user.</p>
    }
  `
})
export class UserProfileComponent {
  private http = inject(HttpClient);

  private userResponse = toSignal(
    this.http.get<User>('/api/user/1').pipe(
      catchError(() => of(null))
    ),
    { initialValue: undefined as User | null | undefined }
  );

  user = computed(() =>
    this.userResponse() && this.userResponse() !== null
      ? this.userResponse() : null
  );

  loading = computed(() => this.userResponse() === undefined);
  error = computed(() => this.userResponse() === null);
}
```

### Pattern 3: Debounced Search with Signals

Combine signals with RxJS for debounced search:

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Subject, debounceTime, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <input
      type="text"
      [value]="query()"
      (input)="onInput($event)"
      placeholder="Search users..."
      class="border rounded-lg px-4 py-2 w-full mb-4"
    />

    @if (results(); as list) {
      <ul class="space-y-1">
        @for (user of list; track user.id) {
          <li class="p-2 hover:bg-gray-100 rounded cursor-pointer">
            {{ user.name }}
          </li>
        }
      </ul>
    }
  `
})
export class SearchComponent {
  private http = inject(HttpClient);
  query = signal('');

  private searchSubject = new Subject<string>();

  results = toSignal(
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(term =>
        term.length > 1
          ? this.http.get<User[]>(`/api/users?q=${term}`)
          : of([])
      )
    ),
    { initialValue: [] as User[] }
  );

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.searchSubject.next(value);
  }
}
```

### Pattern 4: Linked Signals

Angular 22 introduces `linkedSignal()` — a writable signal that resets based on another signal's value:

```typescript
import { Component, signal, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-user-editor',
  standalone: true,
  template: `...`
})
export class UserEditorComponent {
  selectedUserId = signal<number | null>(null);

  // linkedSignal automatically resets when selectedUserId changes
  draftName = linkedSignal({
    source: this.selectedUserId,
    computation: (id) => {
      // When user changes, reset the draft
      return id ? this.fetchUserName(id) : '';
    }
  });

  private fetchUserName(id: number): string {
    // Fetch from store/service
    return 'John Doe';
  }
}
```

### Pattern 5: Resource API

Angular 22's `resource()` API provides a signal-based way to fetch async data:

```typescript
import { Component, resource, signal } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  template: `
    @if (product.isLoading()) {
      <p>Loading...</p>
    } @else if (product.value(); as p) {
      <div>
        <h2>{{ p.name }}</h2>
        <p>\${{ p.price }}</p>
      </div>
    } @else if (product.error()) {
      <p>Failed to load product.</p>
    }
  `
})
export class ProductDetailComponent {
  productId = signal(1);

  product = resource({
    params: () => ({ id: this.productId() }),
    loader: ({ params }) =>
      fetch(`/api/products/${params.id}`).then(r => r.json())
  });
}
```

## Signals vs RxJS: When to Use What

| Use Case | Recommended Approach |
|----------|---------------------|
| Local component state | `signal()` |
| Derived/computed values | `computed()` |
| Side effects (logging, persistence) | `effect()` |
| Simple async (one-time fetch) | `toSignal()` or `resource()` |
| Debounced search | RxJS + `toSignal()` |
| WebSocket streams | RxJS + `toSignal()` |
| Complex event composition | RxJS |
| Global state (small/medium app) | Signal-based store |
| Global state (large app) | NgRx with Signals |

### Combining Both Worlds

```typescript
import { Component, signal, computed, toSignal } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-live-clock',
  standalone: true,
  template: `
    <div class="text-center">
      <p class="text-4xl font-bold tabular-nums">{{ time() }}</p>
      <p class="text-gray-500">{{ greeting() }}</p>
    </div>
  `
})
export class LiveClockComponent {
  name = signal('Friend');

  // RxJS stream → Signal
  time = toSignal(
    interval(1000).pipe(
      map(() => new Date().toLocaleTimeString())
    ),
    { initialValue: '00:00:00' }
  );

  // Derived from both signal and toSignal
  greeting = computed(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' :
                     hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${this.name()}!`;
  });
}
```

## Testing Signals

### Testing Component State

```typescript
import { TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  it('should start at 0', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;

    expect(component.count()).toBe(0);
  });

  it('should increment', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;

    component.increment();
    expect(component.count()).toBe(1);

    component.increment();
    expect(component.count()).toBe(2);
  });

  it('should compute parity correctly', () => {
    const fixture = TestBed.createComponent(CounterComponent);
    const component = fixture.componentInstance;

    expect(component.parity()).toBe('Even number');

    component.increment();
    expect(component.parity()).toBe('Odd number');
  });
});
```

### Testing Effects

Use `TestBed.flushEffects()` to synchronously run pending effects:

```typescript
it('should persist cart to localStorage', () => {
  const fixture = TestBed.createComponent(CartComponent);
  const component = fixture.componentInstance;

  component.cart.set(['Apple']);
  TestBed.flushEffects();

  expect(localStorage.getItem('cart')).toBe('["Apple"]');
});
```

## Best Practices

### 1. Always Use `computed()` for Derived State

```typescript
// Good
filtered = computed(() =>
  this.items().filter(i => i.active)
);

// Bad — manual sync with effect
filtered = signal<Item[]>([]);
constructor() {
  effect(() => {
    this.filtered.set(this.items().filter(i => i.active));
  });
}
```

### 2. Keep Signals Granular

```typescript
// Good — independent signals
user = signal<User | null>(null);
posts = signal<Post[]>([]);
isLoading = signal(false);

// Bad — one mega-signal
state = signal({
  user: null as User | null,
  posts: [] as Post[],
  isLoading: false
});
```

Granular signals mean fewer unnecessary recomputations.

### 3. Use `linkedSignal()` for Dependent Writable State

```typescript
// Good — draft resets when source changes
selectedId = signal<number | null>(null);
draft = linkedSignal({
  source: this.selectedId,
  computation: (id) => id ? this.loadDraft(id) : null
});

// Bad — manual effect sync
draft = signal(null);
constructor() {
  effect(() => {
    const id = this.selectedId();
    this.draft.set(id ? this.loadDraft(id) : null);
  });
}
```

### 4. Use `track` in `@for` Loops

```typescript
// Good — efficient DOM updates
@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
}

// Bad — Angular can't optimize DOM updates
@for (item of items(); track $index) {
  <li>{{ item.name }}</li>
}
```

### 5. Inject Services with `inject()`

```typescript
// Good
export class MyComponent {
  store = inject(TodoStore);
  http = inject(HttpClient);
}

// Bad — constructor injection is verbose
export class MyComponent {
  constructor(
    private store: TodoStore,
    private http: HttpClient
  ) {}
}
```

## Common Pitfalls

### Pitfall 1: Reading Signals Too Early

```typescript
// Bad — reading signal before it's set
const data = signal<Data | null>(null);
const processed = computed(() => data()!.items);
// Error if data() is null when processed() is first read

// Good — handle null case
const processed = computed(() => data()?.items ?? []);
```

### Pitfall 2: Creating Signals Outside Injection Context

```typescript
// Bad — effect() requires injection context
const count = signal(0);
effect(() => console.log(count())); // Error!

// Good — inside a component or with explicit injector
const injector = inject(Injector);
effect(() => console.log(count()), { injector });
```

### Pitfall 3: Mutating Signal Values In-Place

```typescript
// Bad — mutation isn't detected
const items = signal<Item[]>([]);
items().push(newItem); // Signal doesn't know it changed

// Good — create a new array
items.update(list => [...list, newItem]);
```

## Conclusion

Angular Signals are the future of reactivity in Angular. They're simpler than RxJS for most use cases, faster than Zone.js-based change detection, and integrate seamlessly with Angular 22's [zoneless architecture](/blog/angular-22-zoneless-guide).

The key takeaways:

- **`signal()`** for writable state
- **`computed()`** for derived state (never use `effect()` for this)
- **`effect()`** for side effects only
- **`input()` / `output()`** for component communication
- **`toSignal()`** for RxJS interop
- **`linkedSignal()`** for dependent writable state
- **`resource()`** for async data fetching

Start by converting your component state from plain properties to signals, then gradually adopt `input()`, `computed()`, and the store pattern. Your code will be more predictable, more testable, and significantly faster.

For the full performance stack, pair Signals with [Tailwind CSS v4](/blog/tailwind-v4-integration) for minimal CSS overhead and zoneless Angular for maximum runtime performance.
