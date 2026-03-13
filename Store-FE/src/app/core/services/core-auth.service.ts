import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ITelegramUser, IUser } from '../models/user.model';
import { LocalStorageBuckets, LocalStorageService } from './local-storage.service';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class CoreAuthService {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly storageService: StorageService = inject(StorageService);
    private readonly apiService: ApiService = inject(ApiService);
    private readonly router: Router = inject(Router);

    private readonly AUTH_USER_KEY: LocalStorageBuckets = LocalStorageBuckets.AUTH;
    private readonly TG_AUTH_USER_KEY: LocalStorageBuckets = LocalStorageBuckets.TG_AUTH;

    private readonly _isLoggedIn: WritableSignal<boolean> = signal(false);
    readonly isLoggedIn: Signal<boolean> = this._isLoggedIn.asReadonly();

    private readonly _user: WritableSignal<IUser | null> = signal(null);
    readonly user: Signal<IUser | null> = this._user.asReadonly();

    private readonly _tgUser: WritableSignal<ITelegramUser | null> = signal(null);
    readonly tgUser: Signal<ITelegramUser | null> = this._tgUser.asReadonly();

    constructor() {
        this.checkStoredUser();
        this.checkStoredTgUser();
        window.addEventListener('storage', (event: StorageEvent) => {
            if (event.key === this.AUTH_USER_KEY || event.key === null) {
                this.checkStoredUser();
                this.checkStoredTgUser();
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

    private checkStoredTgUser() {
        const storedUser = this.localStorageService.getItem<ITelegramUser>(this.TG_AUTH_USER_KEY);
        if (storedUser) {
            this.loginTg(storedUser, true);
        } else {
            this._isLoggedIn.set(false);
            this._user.set(null);
        }
    }

    login(userData: IUser) {
        this._isLoggedIn.set(true);
        this._user.set(userData);
        this.localStorageService.setItem(this.AUTH_USER_KEY, userData);
        if (userData.role === 'Admin') {
            this.storageService.fetchUsers();
        }
    }

    async loginTg(userData: ITelegramUser | null, isNewToken?: boolean) {
        if (!userData) {
            this._tgUser.set(null);
            this._user.set(null);
            this.localStorageService.removeItem(this.AUTH_USER_KEY);
            this.localStorageService.removeItem(this.TG_AUTH_USER_KEY);
            return;
        }
        if (!isNewToken) {
            await this.apiService.getToken(userData)
                .then((token: string) => {
                    userData!.id_token = token;
                    this._tgUser.set(userData);
                    this.localStorageService.setItem(this.TG_AUTH_USER_KEY, userData);
                })
                .catch((error: any) => {
                    this._tgUser.set(null);
                    this._user.set(null);
                    this.localStorageService.removeItem(this.AUTH_USER_KEY);
                    this.localStorageService.removeItem(this.TG_AUTH_USER_KEY);
                    userData = null;
                    console.error('Error fetching user from Telegram:', error);
                });
        }
        if (!userData) {
            return;
        }
        this.apiService.getUserFromTelegramData(userData)
            .then((user: IUser) => {
                this.login(user);
                this.router.navigate(['/'])
                    .then();
            })
            .catch((error: any) => {
                this._tgUser.set(null);
                this._user.set(null);
                this.localStorageService.removeItem(this.AUTH_USER_KEY);
                this.localStorageService.removeItem(this.TG_AUTH_USER_KEY);
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
