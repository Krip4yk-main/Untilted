import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { Good } from '../models/good.model';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let localStorageMock: jest.Mocked<LocalStorageService>;

  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add to bucket', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    expect(service.bucket().length).toBe(1);
    expect(service.bucket()[0].good.id).toBe(1);
    expect(service.bucket()[0].count).toBe(1);
    expect(service.bucketCount()).toBe(1);
  });

  it('should increment count when adding same item to bucket', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    service.addToBucket(good);
    expect(service.bucket().length).toBe(1);
    expect(service.bucket()[0].count).toBe(2);
    expect(service.bucketCount()).toBe(2);
  });

  it('should remove item from bucket', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    service.removeFromBucket(1);
    expect(service.bucket().length).toBe(0);
    expect(service.bucketCount()).toBe(0);
  });

  it('should increment item count in bucket', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    service.incrementFromBucket(1);
    expect(service.bucket()[0].count).toBe(2);
    expect(service.bucketCount()).toBe(2);
  });

  it('should decrement item count in bucket', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    service.addToBucket(good);
    service.decrementFromBucket(1);
    expect(service.bucket()[0].count).toBe(1);
    expect(service.bucketCount()).toBe(1);
  });

  it('should remove item when decrementing from 1', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    service.decrementFromBucket(1);
    expect(service.bucket().length).toBe(0);
    expect(service.bucketCount()).toBe(0);
  });

  it('should clear bucket', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    service.clearBucket();
    expect(service.bucket().length).toBe(0);
  });

  it('should add a good', () => {
    const initialCount = service.goods().length;
    const newGood: Good = {
      id: 0,
      name: 'New',
      price: 20,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 5,
      priceHistory: [],
    };
    service.addGood(newGood);
    expect(service.goods().length).toBe(initialCount + 1);
  });

  it('should update a good and track price history', () => {
    const good = service.goods()[0];
    const updatedGood = { ...good, price: good.price + 10 };
    service.updateGood(updatedGood);
    const result = service.getGoodById(good.id);
    expect(result?.price).toBe(updatedGood.price);
    expect(result?.priceHistory.length).toBeGreaterThan(good.priceHistory.length);
  });

  it('should not update price history if price is same in updateGood', () => {
    const good = service.goods()[0];
    const updatedGood = { ...good };
    const initialHistoryLength = good.priceHistory.length;
    service.updateGood(updatedGood);
    const result = service.getGoodById(good.id);
    expect(result?.priceHistory.length).toBe(initialHistoryLength);
  });

  it('should delete a good', () => {
    const initialCount = service.goods().length;
    const goodId = service.goods()[0].id;
    service.deleteGood(goodId);
    expect(service.goods().length).toBe(initialCount - 1);
  });

  it('should apply price modifier', () => {
    const originalPrice = service.goods()[0].price;
    service.applyPriceModifier(1.1); // +10%
    expect(service.goods()[0].price).toBeCloseTo(originalPrice * 1.1, 2);
  });

  it('should update user', () => {
    const user = service.users()[0];
    const updatedUser: User = { ...user, name: 'Updated Name' };
    service.updateUser(updatedUser);
    expect(service.getUserById(user.id)?.name).toBe('Updated Name');
  });

  it('should log a sale', () => {
    const initialSalesCount = service.sales().length;
    service.logSale({
      userId: '1',
      userName: 'Admin',
      goodId: 1,
      goodName: 'Product A',
      price: 99.99,
    });
    expect(service.sales().length).toBe(initialSalesCount + 1);
  });

  it('should save bucket to localStorage on changes', () => {
    const good: Good = {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    };
    service.addToBucket(good);
    TestBed.flushEffects();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('user-bucket', expect.any(Array));
  });

  it('should remove bucket from localStorage when cleared', () => {
    service.addToBucket({ id: 1 } as any);
    TestBed.flushEffects();
    service.clearBucket();
    TestBed.flushEffects();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-bucket');
  });

  it('should load bucket from localStorage in constructor', () => {
    localStorageMock.getItem.mockReturnValue([{ good: { id: 99 }, count: 5 }]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    });
    const newService = TestBed.inject(StorageService);
    expect(newService.bucket().length).toBe(1);
    expect(newService.bucket()[0].good.id).toBe(99);
  });

  it('should return current bucket if item not found in incrementFromBucket', () => {
    service.incrementFromBucket(999);
    expect(service.bucketCount()).toBe(0);
  });

  it('should return current bucket if item not found in decrementFromBucket', () => {
    service.decrementFromBucket(999);
    expect(service.bucketCount()).toBe(0);
  });

  it('should return current goods if good not found in updateGood', () => {
    const initialGoods = service.goods();
    service.updateGood({ id: 999 } as any);
    expect(service.goods()).toBe(initialGoods);
  });

  it('should return current users if user not found in updateUser', () => {
    const initialUsers = service.users();
    service.updateUser({ id: 'non-existing' } as any);
    expect(service.users()).toBe(initialUsers);
  });

  it('should generate correct ID for sales when some sales exist', () => {
    service.logSale({
      userId: '1',
      userName: 'U1',
      goodId: 1,
      goodName: 'G1',
      price: 10,
    });
    service.logSale({
      userId: '1',
      userName: 'U1',
      goodId: 1,
      goodName: 'G1',
      price: 10,
    });
    expect(service.sales().length).toBe(2);
    expect(service.sales()[1].id).toBe(service.sales()[0].id + 1);
  });
});
