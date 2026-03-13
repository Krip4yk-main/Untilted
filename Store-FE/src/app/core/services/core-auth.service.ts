import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { TelegramUser, User } from '../models/user.model';
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

    private readonly _isLoggedIn: WritableSignal<boolean> = signal(false);
    readonly isLoggedIn: Signal<boolean> = this._isLoggedIn.asReadonly();

    private readonly _user: WritableSignal<User | null> = signal(null);
    readonly user: Signal<User | null> = this._user.asReadonly();

    constructor() {
        this.checkStoredUser();
        window.addEventListener('storage', (event: StorageEvent) => {
            if (event.key === this.AUTH_USER_KEY || event.key === null) {
                this.checkStoredUser();
            }
        });
    }

    private checkStoredUser() {
        const storedUser = this.localStorageService.getItem<User>(this.AUTH_USER_KEY);
        if (storedUser) {
            this.login(storedUser);
        } else {
            this._isLoggedIn.set(false);
            this._user.set(null);
        }
    }

    login(userData: User) {
        this._isLoggedIn.set(true);
        this._user.set(userData);
        this.localStorageService.setItem(this.AUTH_USER_KEY, userData);
    }

    loginTg(userData: TelegramUser | null) {
        if (!userData) {
            return;
        }
        this.apiService.getUserFromTelegramData(userData)
            .then((user: User) => {
                this.login(user);
            });
    }

    logout() {
        this._isLoggedIn.set(false);
        this._user.set(null);
        this.storageService.clearBucket();
        this.localStorageService.clear();
    }

}
