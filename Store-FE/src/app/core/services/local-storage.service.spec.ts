import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);

    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();

    // Mock localStorage
    const store: Record<string, string> = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      store[key] = value;
    });
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      delete store[key];
    });
    jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      Object.keys(store).forEach((key) => delete store[key]);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get item from localStorage', () => {
    const key = 'testKey';
    const value = { a: 1 };
    service.setItem(key, value);
    expect(service.getItem(key)).toEqual(value);
  });

  it('should return null if item does not exist', () => {
    expect(service.getItem('nonExistent')).toBeNull();
  });

  it('should remove item from localStorage', () => {
    const key = 'testKey';
    service.setItem(key, 'value');
    service.removeItem(key);
    expect(service.getItem(key)).toBeNull();
  });

  it('should clear localStorage', () => {
    service.setItem('key1', 'value1');
    service.setItem('key2', 'value2');
    service.clear();
    expect(service.getItem('key1')).toBeNull();
    expect(service.getItem('key2')).toBeNull();
  });

  it('should handle JSON parse errors', () => {
    const key = 'badJson';
    localStorage.setItem(key, 'invalid-json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    expect(service.getItem(key)).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle errors in setItem', () => {
    jest.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    service.setItem('test', 'value');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    (localStorage.setItem as jest.Mock).mockRestore();
  });

  it('should handle errors in getItem', () => {
    jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('Read error');
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const result = service.getItem('test');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    (localStorage.getItem as jest.Mock).mockRestore();
  });

  it('should handle errors in removeItem', () => {
    jest.spyOn(localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('Remove error');
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    service.removeItem('test');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    (localStorage.removeItem as jest.Mock).mockRestore();
  });

  it('should handle errors in clear', () => {
    jest.spyOn(localStorage, 'clear').mockImplementation(() => {
      throw new Error('Clear error');
    });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    service.clear();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
    (localStorage.clear as jest.Mock).mockRestore();
  });
});
