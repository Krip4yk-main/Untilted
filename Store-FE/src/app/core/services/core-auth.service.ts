import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { IUser, TelegramUser } from '../models/user.model';
import { LocalStorageBuckets, LocalStorageService } from './local-storage.service';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class CoreAuthService {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly storageService: StorageService = inject(StorageService);
    private readonly apiService: ApiService = inject(ApiService);

    private readonly AUTH_USER_KEY: LocalStorageBuckets = LocalStorageBuckets.AUTH;
    private readonly AUTH_TG_USER_KEY: LocalStorageBuckets = LocalStorageBuckets.TGAUTH;

    private readonly _isLoggedIn: WritableSignal<boolean> = signal(false);
    readonly isLoggedIn: Signal<boolean> = this._isLoggedIn.asReadonly();

    private readonly _user: WritableSignal<IUser | null> = signal(null);
    readonly user: Signal<IUser | null> = this._user.asReadonly();

    private readonly _tgUser: WritableSignal<TelegramUser | null> = signal(null);
    readonly tgUser: Signal<TelegramUser | null> = this._tgUser.asReadonly();

    constructor() {
        this.checkStoredUser();
        window.addEventListener('storage', (event: StorageEvent) => {
            if (event.key === this.AUTH_USER_KEY || event.key === null) {
                this.checkStoredUser();
            }
        });
    }

    private checkStoredUser() {
        const storedUser = this.localStorageService.getItem<IUser>(this.AUTH_USER_KEY);
        if (storedUser) {
            this.login(storedUser);
        } else {
            this._isLoggedIn.set(false);
            this._user.set(null);
        }
    }

    login(userData: IUser) {
        this._isLoggedIn.set(true);
        this._user.set(userData);
        this.localStorageService.setItem(this.AUTH_USER_KEY, userData);
    }

    loginTg(userData: TelegramUser | null) {
        if (!userData) {
            this.localStorageService.removeItem(this.AUTH_TG_USER_KEY);
            return;
        }
        this.apiService.getUserFromTelegramData(userData)
            .then((user: IUser) => {
                this.login(user);
                this.localStorageService.setItem(this.AUTH_TG_USER_KEY, userData);
            })
            .catch((error: any) => {
                this.localStorageService.removeItem(this.AUTH_TG_USER_KEY);
                console.error('Error fetching user from Telegram:', error);
            });
    }

    logout() {
        this._isLoggedIn.set(false);
        this._user.set(null);
        this.storageService.clearBucket();
        this.localStorageService.clear();
    }

}
