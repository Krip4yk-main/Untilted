import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreItemDetailsComponent } from './store-item-details.component';
import { StorageService } from '../../core/services/storage.service';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { signal } from '@angular/core';

describe('StoreItemDetailsComponent', () => {
  let component: StoreItemDetailsComponent;
  let fixture: ComponentFixture<StoreItemDetailsComponent>;
  let storageService: Partial<StorageService>;
  let authService: Partial<CoreAuthService>;

  beforeEach(async () => {
    storageService = {
      getGoodById: jest.fn().mockReturnValue(null),
      addToBucket: jest.fn(),
    };
    authService = {
      user: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [StoreItemDetailsComponent],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: CoreAuthService, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addToBucket with good when addToBucket called', () => {
    component.addToBucket();
    expect(storageService.addToBucket).toHaveBeenCalled();
  });
});
