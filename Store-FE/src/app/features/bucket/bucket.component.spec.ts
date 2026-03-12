import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BucketComponent } from './bucket.component';
import { StorageService } from '../../core/services/storage.service';
import { signal } from '@angular/core';

describe('BucketComponent', () => {
  let component: BucketComponent;
  let fixture: ComponentFixture<BucketComponent>;
  let storageService: Partial<StorageService>;

  beforeEach(async () => {
    storageService = {
      bucket: signal([]),
      bucketCount: signal(0),
      clearBucket: jest.fn(),
      removeFromBucket: jest.fn(),
      incrementFromBucket: jest.fn(),
      decrementFromBucket: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BucketComponent],
      providers: [{ provide: StorageService, useValue: storageService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show total 0 for empty bucket', () => {
    expect(component.getTotal()).toBe(0);
  });

  it('should calculate total correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (storageService.bucket as any).set([
      { good: { price: 10 }, count: 2 },
      { good: { price: 20 }, count: 1 },
    ]);
    expect(component.getTotal()).toBe(40);
  });

  it('should call removeFromBucket onRemove', () => {
    component.onRemove(1);
    expect(storageService.removeFromBucket).toHaveBeenCalledWith(1);
  });

  it('should call incrementFromBucket onIncrement', () => {
    component.onIncrement(1);
    expect(storageService.incrementFromBucket).toHaveBeenCalledWith(1);
  });

  it('should call decrementFromBucket onDecrement', () => {
    component.onDecrement(1);
    expect(storageService.decrementFromBucket).toHaveBeenCalledWith(1);
  });

  it('should call clearBucket onClear', () => {
    component.onClear();
    expect(storageService.clearBucket).toHaveBeenCalled();
  });

  it('should clear bucket and close apply form on submit order', () => {
    component.onSubmitOrder({
      firstName: '',
      lastName: '',
      address: { country: '', city: '' },
      phone: '',
      email: '',
    });
    expect(storageService.clearBucket).toHaveBeenCalled();
    expect(component['isApplying']()).toBe(false);
  });
});
