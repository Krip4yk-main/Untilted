import { TestBed } from '@angular/core/testing';
import { CoreAuthService } from './core-auth.service';
import { LocalStorageService } from './local-storage.service';
import { StorageService } from './storage.service';
import { User } from '../models/user.model';

describe('CoreAuthService', () => {
  let service: CoreAuthService;
  let localStorageServiceSpy: jest.Mocked<LocalStorageService>;
  let storageServiceSpy: jest.Mocked<StorageService>;

  beforeEach(() => {
    localStorageServiceSpy = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as any;

    storageServiceSpy = {
      clearBucket: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        CoreAuthService,
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
  });

  it('should be created', () => {
    service = TestBed.inject(CoreAuthService);
    expect(service).toBeTruthy();
  });

  it('should start with logged out status if no user in localStorage', () => {
    localStorageServiceSpy.getItem.mockReturnValue(null);
    service = TestBed.inject(CoreAuthService);
    expect(service.isLoggedIn()).toBe(false);
    expect(service.user()).toBe(null);
  });

  it('should start with logged in status if user in localStorage', () => {
    const mockUser: User = {
      id: '1',
      name: 'Test',
      email: 'test@test.com',
      role: 'client',
      isBlocked: false,
      token: 'test-token',
    };
    localStorageServiceSpy.getItem.mockReturnValue(mockUser);
    service = TestBed.inject(CoreAuthService);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()).toEqual(mockUser);
  });

  it('should login and save to localStorage', () => {
    service = TestBed.inject(CoreAuthService);
    service.login();
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()).not.toBe(null);
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith(
      'auth_user',
      expect.any(Object),
    );
  });

  it('should logout and clear bucket and localStorage', () => {
    service = TestBed.inject(CoreAuthService);
    service.login();
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.user()).toBe(null);
    expect(storageServiceSpy.clearBucket).toHaveBeenCalled();
    expect(localStorageServiceSpy.clear).toHaveBeenCalled();
  });
});
