import { computed, DestroyRef, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IGood } from '../models/good.model';
import { IUser } from '../models/user.model';
import { Sale } from '../models/sale.model';
import { BucketItem } from '../models/bucket-item.model';
import { LocalStorageBuckets, LocalStorageService } from './local-storage.service';
import { ApiService } from './api.service';
import { CoreAuthService } from './core-auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly apiService: ApiService = inject(ApiService);
    private readonly coreAuthService: CoreAuthService = inject(CoreAuthService);
    private readonly destroyRef: DestroyRef = inject(DestroyRef);
    private readonly BUCKET_KEY: LocalStorageBuckets = LocalStorageBuckets.USER;

    private readonly _goods: WritableSignal<IGood[]> = signal([]);
    private readonly _users: WritableSignal<IUser[]> = signal([]);
    private readonly _sales: WritableSignal<Sale[]> = signal([]);
    private readonly _bucket: WritableSignal<BucketItem[]> = signal([]);
    private readonly loginSubs$: Observable<IUser | null> = toObservable(this.coreAuthService.user);

    readonly goods: Signal<IGood[]> = this._goods.asReadonly();
    readonly users: Signal<IUser[]> = this._users.asReadonly();
    readonly sales: Signal<Sale[]> = this._sales.asReadonly();
    readonly bucket: Signal<BucketItem[]> = this._bucket.asReadonly();
    readonly bucketCount: Signal<number> = computed(() => this._bucket()
        .reduce((sum: number, item: BucketItem) => sum + item.count, 0));

    constructor() {
        this.fetchGoods();

        const savedBucket = this.localStorageService.getItem<BucketItem[]>(this.BUCKET_KEY);
        if (savedBucket) {
            this._bucket.set(savedBucket);
        }

        const sub = this.loginSubs$.subscribe((user: IUser | null) => {
            if (user) {
                if (this._users()?.length > 0) {
                    return;
                }
                this.fetchUsers();
            } else {
                this._users.set([]);
            }
        });
        this.destroyRef.onDestroy(() => sub.unsubscribe());
    }

    addToBucket(good: IGood) {
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

    getGoodById(id: number): IGood | undefined {
        return this._goods().find((g: IGood) => g.id === id);
    }

    getUserById(id: number): IUser | undefined {
        return this._users().find((u: IUser) => u.id === id);
    }

    updateGood(updatedGood: IGood) {
        this._goods.update((goods: IGood[]) => {
            const index = goods.findIndex((g: IGood) => g.id === updatedGood.id);
            if (index !== -1) {
                const newGoods = [...goods];
                const oldGood = goods[index];
                if (oldGood.sellPrice !== updatedGood.sellPrice) {
                    updatedGood.priceHistory = [
                        ...oldGood.priceHistory,
                        {
                            id: -1,
                            goodId: updatedGood.id,
                            price: updatedGood.sellPrice,
                            createdAt: new Date().toISOString(),
                            createdBy: this.coreAuthService.user()!.username,
                            deleted: false,
                        },
                    ];
                }
                newGoods[index] = updatedGood;
                return newGoods;
            }
            return goods;
        });
    }

    addGood(good: IGood) {
        this._goods.update((goods: IGood[]) => [
            ...goods,
            { ...good, id: Math.max(0, ...goods.map((g: IGood) => g.id)) + 1 },
        ]);
    }

    deleteGood(id: number) {
        this._goods.update((goods: IGood[]) => goods.filter((g: IGood) => g.id !== id));
    }

    applyPriceModifier(multiplier: number) {
        this._goods.update((goods: IGood[]) => goods.map((g: IGood) => {
            const newPrice = Number((g.sellPrice * multiplier).toFixed(2));
            return {
                ...g,
                price: newPrice,
                priceHistory: [{
                    id: -1,
                    goodId: g.id,
                    price: newPrice,
                    createdAt: new Date().toISOString(),
                    createdBy: this.coreAuthService.user()!.username,
                    deleted: false,
                },
                ...g.priceHistory,
                ],
            };
        }));
    }

    updateUser(updatedUser: IUser) {
        this._users.update((users: IUser[]) => {
            const index = users.findIndex((u: IUser) => u.id === updatedUser.id);
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

    fetchGoods() {
        this.apiService.getGoods()
            .then((goods: IGood[]) => {
                this._goods.set(goods);
            })
            .catch(console.error);
    }

    fetchUsers() {
        this.apiService.getUsers()
            .then((users: IUser[]) => {
                this._users.set(users);
            })
            .catch(console.error);
    }

}
