import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { CoreAuthService } from '../services/core-auth.service';
import { roleGuard } from './role.guard';
import { signal } from '@angular/core';
import { User } from '../models/user.model';

describe('roleGuard', () => {
    let authService: Partial<CoreAuthService>;
    let router: Partial<Router>;
    const userSignal = signal<User | null>(null);

    beforeEach(() => {
        authService = {
            user: userSignal,
        };
        router = {
            createUrlTree: jest.fn().mockReturnValue({} as UrlTree),
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: CoreAuthService, useValue: authService },
                { provide: Router, useValue: router },
            ],
        });
    });

    it('should allow activation if user has allowed role', () => {
        userSignal.set({ id: '1', role: 'admin', email: '', name: '', isBlocked: false });
        const guard = roleGuard(['admin', 'manager']);

        const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
        expect(result).toBe(true);
    });

    it('should redirect if user has no allowed role', () => {
        userSignal.set({ id: '2', role: 'client', email: '', name: '', isBlocked: false });
        const guard = roleGuard(['admin', 'manager']);

        const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
        expect(router.createUrlTree).toHaveBeenCalledWith(['/not-found']);
        expect(result).not.toBe(true);
    });

    it('should redirect if no user is logged in', () => {
        userSignal.set(null);
        const guard = roleGuard(['admin']);

        const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
        expect(router.createUrlTree).toHaveBeenCalledWith(['/not-found']);
        expect(result).not.toBe(true);
    });
});
