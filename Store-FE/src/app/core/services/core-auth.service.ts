import { Injectable, signal, inject } from '@angular/core';
import { TelegramUser, User, UserTg } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CoreAuthService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly storageService = inject(StorageService);
  private readonly AUTH_USER_KEY = 'auth_user';
  private readonly AUTH_USER_KEY_TG = 'auth_user_tg';

  readonly apiUrl = environment.apiUrl;

  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly _isLoggedInTg = signal<boolean>(false);
  readonly isLoggedInTg = this._isLoggedInTg.asReadonly();

  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  private readonly _userTg = signal<TelegramUser | null>(null);
  readonly userTg = this._userTg.asReadonly();

  constructor() {
    this.checkStoredUser();
    window.addEventListener('storage', (event) => {
      if (event.key === this.AUTH_USER_KEY || event.key === null) {
        this.checkStoredUser();
      }
    });
  }

  private checkStoredUser() {
    this.checkStoredUserTg();
    const storedUser = this.localStorageService.getItem<User>(this.AUTH_USER_KEY);
    if (storedUser) {
      this.login(storedUser);
    } else {
      this._isLoggedIn.set(false);
      this._user.set(null);
    }
  }

  private checkStoredUserTg() {
    const storedUser = this.localStorageService.getItem<TelegramUser>(this.AUTH_USER_KEY_TG);
    this.loginTg(storedUser);
  }

  login(userData: User) {
    this._isLoggedIn.set(true);
    this._user.set(userData);
    this.localStorageService.setItem(this.AUTH_USER_KEY, userData);
  }

  loginTg(userData: TelegramUser | null) {
    this._userTg.set(userData);
    this._isLoggedInTg.set(userData !== null);
    console.log(userData, `Tg logged in:`, this.isLoggedInTg(), userData !== null);
    this.localStorageService.setItem(this.AUTH_USER_KEY_TG, userData);
  }

  logout() {
    this._isLoggedIn.set(false);
    this._user.set(null);
    this.storageService.clearBucket();
    this.localStorageService.clear();
  }
}
