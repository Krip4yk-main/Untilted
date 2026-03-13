import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CoreAuthService } from '../../../core/services/core-auth.service';
import { StorageService } from '../../../core/services/storage.service';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let authService: Partial<CoreAuthService>;
    let storageService: Partial<StorageService>;

    beforeEach(async() => {
        authService = {
            isLoggedIn: signal(false),
            user: signal(null),
        };
        storageService = {
            bucketCount: signal(0),
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                { provide: CoreAuthService, useValue: authService },
                { provide: StorageService, useValue: storageService },
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show Store link', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Store');
    });

    it('should show user icon with Login title when not logged in', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const userLink = compiled.querySelector('a[title="Login"]');
        expect(userLink).toBeTruthy();
        expect(compiled.textContent).not.toContain('Login');
    });

    it('should show user icon with User Info title when logged in', () => {
        (authService.isLoggedIn as any).set(true);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const userLink = compiled.querySelector('a[title="User Info"]');
        expect(userLink).toBeTruthy();
    });
});
