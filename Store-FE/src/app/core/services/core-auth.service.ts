import { Injectable, signal, inject } from '@angular/core';
import { User } from '../models/user.model';
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

  readonly apiUrl = environment.apiUrl;

  private readonly _isLoggedIn = signal<boolean>(false);
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  constructor() {
    const storedUser = this.localStorageService.getItem<User>(this.AUTH_USER_KEY);
    if (storedUser) {
      this._isLoggedIn.set(true);
      this._user.set(storedUser);
    }
  }

  login(
    userData: User = {
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin',
      isBlocked: false,
      token: 'mock-token-123',
    },
  ) {
    this._isLoggedIn.set(true);
    this._user.set(userData);
    this.localStorageService.setItem(this.AUTH_USER_KEY, userData);
  }

  logout() {
    this._isLoggedIn.set(false);
    this._user.set(null);
    this.storageService.clearBucket();
    this.localStorageService.clear();
  }
}
