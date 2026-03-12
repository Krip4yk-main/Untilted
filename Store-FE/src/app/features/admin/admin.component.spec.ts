import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { signal } from '@angular/core';
import { StorageService } from '../../core/services/storage.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let authService: Partial<CoreAuthService>;
  let storageService: Partial<StorageService>;

  beforeEach(async () => {
    authService = {
      user: signal({ id: '1', role: 'admin', name: 'Admin', email: '', isBlocked: false }),
    };
    storageService = {
      goods: signal([]),
      users: signal([]),
      sales: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        { provide: CoreAuthService, useValue: authService },
        { provide: StorageService, useValue: storageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 tabs for admin', () => {
    expect(component['tabs']()).toEqual(['Goods', 'Management', 'Statistics', 'History']);
  });

  it('should have 1 tab for manager', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authService.user as any).set({
      id: '2',
      role: 'manager',
      name: 'Manager',
      email: '',
      isBlocked: false,
    });
    fixture.detectChanges();
    expect(component['tabs']()).toEqual(['Goods']);
  });
});
