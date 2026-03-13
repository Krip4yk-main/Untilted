import { computed, effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Good } from '../models/good.model';
import { User } from '../models/user.model';
import { Sale } from '../models/sale.model';
import { BucketItem } from '../models/bucket-item.model';
import { LocalStorageBuckets, LocalStorageService } from './local-storage.service';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly apiService: ApiService = inject(ApiService);
    private readonly BUCKET_KEY: LocalStorageBuckets = LocalStorageBuckets.USER;

    private readonly _goods: WritableSignal<Good[]> = signal([]);
    private readonly _users: WritableSignal<User[]> = signal([]);

    private readonly _sales: WritableSignal<Sale[]> = signal([]);

    private readonly _bucket: WritableSignal<BucketItem[]> = signal([]);

    readonly goods: Signal<Good[]> = this._goods.asReadonly();
    readonly users: Signal<User[]> = this._users.asReadonly();
    readonly sales: Signal<Sale[]> = this._sales.asReadonly();
    readonly bucket: Signal<BucketItem[]> = this._bucket.asReadonly();
    readonly bucketCount: Signal<number> = computed(() => this._bucket()
        .reduce((sum: number, item: BucketItem) => sum + item.count, 0));

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
        this._bucket.update((current: BucketItem[]) => {
            const index = current.findIndex((bi: BucketItem) => bi.good.id === good.id);
            if (index !== -1) {
                const next = [...current];
                next[index] = { ...next[index], count: next[index].count + 1 };
                return next;
            }
            return [...current, { good, count: 1 }];
        });
    }

    removeFromBucket(id: number) {
        this._bucket.update((current: BucketItem[]) => current.filter((bi: BucketItem) => bi.good.id !== id));
    }

    incrementFromBucket(id: number) {
        this._bucket.update((current: BucketItem[]) => {
            const index = current.findIndex((bi: BucketItem) => bi.good.id === id);
            if (index !== -1) {
                const next = [...current];
                next[index] = { ...next[index], count: next[index].count + 1 };
                return next;
            }
            return current;
        });
    }

    decrementFromBucket(id: number) {
        this._bucket.update((current: BucketItem[]) => {
            const index = current.findIndex((bi: BucketItem) => bi.good.id === id);
            if (index !== -1) {
                if (current[index].count === 1) {
                    return current.filter((bi: BucketItem) => bi.good.id !== id);
                }
                const next = [...current];
                next[index] = { ...next[index], count: next[index].count - 1 };
                return next;
            }
            return current;
        });
    }

    getGoodById(id: number): Good | undefined {
        return this._goods().find((g: Good) => g.id === id);
    }

    getUserById(id: string): User | undefined {
        return this._users().find((u: User) => u.id === id);
    }

    updateGood(updatedGood: Good) {
        this._goods.update((goods: Good[]) => {
            const index = goods.findIndex((g: Good) => g.id === updatedGood.id);
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
        this._goods.update((goods: Good[]) => [
            ...goods,
            { ...good, id: Math.max(0, ...goods.map((g: Good) => g.id)) + 1 },
        ]);
    }

    deleteGood(id: number) {
        this._goods.update((goods: Good[]) => goods.filter((g: Good) => g.id !== id));
    }

    applyPriceModifier(multiplier: number) {
        this._goods.update((goods: Good[]) => goods.map((g: Good) => {
            const newPrice = Number((g.price * multiplier).toFixed(2));
            return {
                ...g,
                price: newPrice,
                priceHistory: [{ price: newPrice, date: new Date().toISOString() }, ...g.priceHistory],
            };
        }));
    }

    updateUser(updatedUser: User) {
        this._users.update((users: User[]) => {
            const index = users.findIndex((u: User) => u.id === updatedUser.id);
            if (index !== -1) {
                const newUsers = [...users];
                newUsers[index] = updatedUser;
                return newUsers;
            }
            return users;
        });
    }

    logSale(sale: Omit<Sale, 'id' | 'date'>) {
        this._sales.update((sales: Sale[]) => [
            ...sales,
            {
                ...sale,
                id: Math.max(0, ...sales.map((s: Sale) => s.id)) + 1,
                date: new Date().toISOString(),
            },
        ]);
    }

    clearBucket() {
        this._bucket.set([]);
    }

    private fetchGoods() {
        this.apiService.getGoods()
            .then((goods: Good[]) => {
                this._goods.set(goods);
            })
            .catch(console.error);
    }

    private fetchUsers() {
        this.apiService.getUsers()
            .then((users: User[]) => {
                this._users.set(users);
            })
            .catch(console.error);
    }

}
