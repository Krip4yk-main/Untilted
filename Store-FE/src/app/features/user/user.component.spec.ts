import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { signal } from '@angular/core';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let authService: Partial<CoreAuthService>;

  beforeEach(async () => {
    authService = {
      isLoggedIn: signal(true),
      user: signal({
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'client',
        isBlocked: false,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [{ provide: CoreAuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test User');
  });
});
