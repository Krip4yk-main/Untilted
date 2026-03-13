import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: Partial<CoreAuthService>;
    let router: Partial<Router>;
    let route: Partial<ActivatedRoute>;

    beforeEach(async() => {
        authService = {
            login: jest.fn(),
            isLoggedIn: jest.fn().mockReturnValue(false),
        };
        router = {
            navigate: jest.fn(),
        };
        route = {
            queryParams: of({}),
        };

        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: CoreAuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: route },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should login and navigate', () => {
        component.login();
        expect(authService.login).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should open telegram login window', () => {
        const spy = jest.spyOn(window, 'open').mockImplementation();
        component.loginWithTelegram();
        expect(spy).toHaveBeenCalledWith(
            expect.stringContaining('oauth.telegram.org/auth?bot_id=6295405165'),
            'TelegramLogin',
            expect.any(String),
        );
        spy.mockRestore();
    });

    it('should handle telegram login query params', () => {
        // Re-create component with params
        TestBed.resetTestingModule();
        route = {
            queryParams: of({
                id: '123',
                hash: 'abc',
                first_name: 'John',
                last_name: 'Doe',
                username: 'johndoe',
            }),
        };
        authService.isLoggedIn = jest.fn().mockReturnValue(false);

        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: CoreAuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: route },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(authService.login).toHaveBeenCalledWith({
            id: '123',
            name: 'John Doe',
            email: 'johndoe@telegram.com',
            role: 'client',
            isBlocked: false,
            token: 'abc:AAEuo5oky6ZYa3ajAlq2jRFMgDbpMoz9Hm0',
        });
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should close window if it is a popup', () => {
        TestBed.resetTestingModule();
        route = {
            queryParams: of({
                id: '123',
                hash: 'abc',
            }),
        };
        authService.isLoggedIn = jest.fn().mockReturnValue(false);

        // Mock window.opener and window.close
        const originalOpener = window.opener;
        const originalClose = window.close;
        Object.defineProperty(window, 'opener', { value: {}, writable: true });
        window.close = jest.fn();

        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: CoreAuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: route },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(window.close).toHaveBeenCalled();

        // Restore
        Object.defineProperty(window, 'opener', { value: originalOpener, writable: true });
        window.close = originalClose;
    });

    it('should redirect if already logged in', () => {
        TestBed.resetTestingModule();
        authService.isLoggedIn = jest.fn().mockReturnValue(true);

        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: CoreAuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: route },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle telegram login query params with minimal data', () => {
        TestBed.resetTestingModule();
        route = {
            queryParams: of({
                id: '123',
                hash: 'abc',
            }),
        };

        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: CoreAuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: route },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(authService.login).toHaveBeenCalledWith({
            id: '123',
            name: 'Telegram User',
            email: '123@telegram.com',
            role: 'client',
            isBlocked: false,
            token: 'abc:AAEuo5oky6ZYa3ajAlq2jRFMgDbpMoz9Hm0',
        });
        expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
});
