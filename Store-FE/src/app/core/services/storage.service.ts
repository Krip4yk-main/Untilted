import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Good } from '../models/good.model';
import { User } from '../models/user.model';
import { Sale } from '../models/sale.model';
import { BucketItem } from '../models/bucket-item.model';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly BUCKET_KEY = 'user-bucket';

  private readonly _goods = signal<Good[]>([]);
  private readonly _users = signal<User[]>([]);

  private readonly _sales = signal<Sale[]>([]);

  private readonly _bucket = signal<BucketItem[]>([]);

  readonly goods = this._goods.asReadonly();
  readonly users = this._users.asReadonly();
  readonly sales = this._sales.asReadonly();
  readonly bucket = this._bucket.asReadonly();
  readonly bucketCount = computed(() => this._bucket().reduce((sum, item) => sum + item.count, 0));

  constructor() {
    this.fetchGoods();
    this.fetchUsers();

    const savedBucket = this.localStorageService.getItem<BucketItem[]>(this.BUCKET_KEY);
    if (savedBucket) {
      this._bucket.set(savedBucket);
    }

    effect(() => {
      const currentBucket = this._bucket();
      if (currentBucket.length > 0) {
        this.localStorageService.setItem(this.BUCKET_KEY, currentBucket);
      } else {
        this.localStorageService.removeItem(this.BUCKET_KEY);
      }
    });
  }

  addToBucket(good: Good) {
    this._bucket.update((current) => {
      const index = current.findIndex((bi) => bi.good.id === good.id);
      if (index !== -1) {
        const next = [...current];
        next[index] = { ...next[index], count: next[index].count + 1 };
        return next;
      }
      return [...current, { good, count: 1 }];
    });
  }

  removeFromBucket(id: number) {
    this._bucket.update((current) => current.filter((bi) => bi.good.id !== id));
  }

  incrementFromBucket(id: number) {
    this._bucket.update((current) => {
      const index = current.findIndex((bi) => bi.good.id === id);
      if (index !== -1) {
        const next = [...current];
        next[index] = { ...next[index], count: next[index].count + 1 };
        return next;
      }
      return current;
    });
  }

  decrementFromBucket(id: number) {
    this._bucket.update((current) => {
      const index = current.findIndex((bi) => bi.good.id === id);
      if (index !== -1) {
        if (current[index].count === 1) {
          return current.filter((bi) => bi.good.id !== id);
        }
        const next = [...current];
        next[index] = { ...next[index], count: next[index].count - 1 };
        return next;
      }
      return current;
    });
  }

  getGoodById(id: number): Good | undefined {
    return this._goods().find((g) => g.id === id);
  }

  getUserById(id: string): User | undefined {
    return this._users().find((u) => u.id === id);
  }

  updateGood(updatedGood: Good) {
    this._goods.update((goods) => {
      const index = goods.findIndex((g) => g.id === updatedGood.id);
      if (index !== -1) {
        const newGoods = [...goods];
        const oldGood = goods[index];
        if (oldGood.price !== updatedGood.price) {
          updatedGood.priceHistory = [
            { price: updatedGood.price, date: new Date().toISOString() },
            ...oldGood.priceHistory,
          ];
        }
        newGoods[index] = updatedGood;
        return newGoods;
      }
      return goods;
    });
  }

  addGood(good: Good) {
    this._goods.update((goods) => [
      ...goods,
      { ...good, id: Math.max(0, ...goods.map((g) => g.id)) + 1 },
    ]);
  }

  deleteGood(id: number) {
    this._goods.update((goods) => goods.filter((g) => g.id !== id));
  }

  applyPriceModifier(multiplier: number) {
    this._goods.update((goods) =>
      goods.map((g) => {
        const newPrice = Number((g.price * multiplier).toFixed(2));
        return {
          ...g,
          price: newPrice,
          priceHistory: [{ price: newPrice, date: new Date().toISOString() }, ...g.priceHistory],
        };
      }),
    );
  }

  updateUser(updatedUser: User) {
    this._users.update((users) => {
      const index = users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        const newUsers = [...users];
        newUsers[index] = updatedUser;
        return newUsers;
      }
      return users;
    });
  }

  logSale(sale: Omit<Sale, 'id' | 'date'>) {
    this._sales.update((sales) => [
      ...sales,
      {
        ...sale,
        id: Math.max(0, ...sales.map((s) => s.id)) + 1,
        date: new Date().toISOString(),
      },
    ]);
  }

  clearBucket() {
    this._bucket.set([]);
  }

  private fetchGoods() {
    this.http.get<Good[]>(`${this.apiUrl}/api/goods`).subscribe((goods) => {
      this._goods.set(goods);
    });
  }

  private fetchUsers() {
    this.http.get<User[]>(`${this.apiUrl}/api/users`).subscribe((users) => {
      this._users.set(users);
    });
  }
}
