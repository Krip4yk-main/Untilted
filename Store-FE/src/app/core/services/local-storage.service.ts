import { Injectable } from '@angular/core';

export enum LocalStorageBuckets {
    AUTH = 'auth_user',
    TGAUTH = 'tg_auth_user',
    USER = 'user-bucket',
    GOOD_EDITOR = 'good-editor-data',
    USER_EDITOR = 'user-editor-data',
    PRICE_MODIFIER = 'price-modifier-data',
    APPLY = 'apply-form-data',
}

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    setItem<T>(key: LocalStorageBuckets, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    }

    getItem<T>(key: LocalStorageBuckets): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    }

    removeItem(key: LocalStorageBuckets): void {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage', e);
        }
    }

    clear(): void {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage', e);
        }
    }

}
