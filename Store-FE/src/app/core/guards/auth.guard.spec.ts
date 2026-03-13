import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { CoreAuthService } from '../services/core-auth.service';
import { authGuard } from './auth.guard';
import { signal } from '@angular/core';

describe('authGuard', () => {
    let authService: Partial<CoreAuthService>;
    let router: Partial<Router>;
    const isLoggedInSignal = signal(false);

    beforeEach(() => {
        authService = {
            isLoggedIn: isLoggedInSignal,
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

    it('should allow activation if logged in', () => {
        isLoggedInSignal.set(true);
        const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
        expect(result).toBe(true);
    });

    it('should redirect if not logged in', () => {
        isLoggedInSignal.set(false);
        const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
        expect(router.createUrlTree).toHaveBeenCalledWith(['/not-found']);
        expect(result).not.toBe(true);
    });
});
