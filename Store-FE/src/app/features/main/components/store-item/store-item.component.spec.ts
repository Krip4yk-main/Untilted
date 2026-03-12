import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreItemComponent } from './store-item.component';
import { StorageService } from '../../../../core/services/storage.service';
import { provideRouter } from '@angular/router';
import { Good } from '../../../../core/models/good.model';

describe('StoreItemComponent', () => {
  let component: StoreItemComponent;
  let fixture: ComponentFixture<StoreItemComponent>;
  let storageService: Partial<StorageService>;
  const mockGood: Good = {
    id: 1,
    name: 'Test Good',
    price: 100,
    imageUrl: 'test.jpg',
    description: 'Test description',
    fullDescription: 'Full description',
    count: 10,
    priceHistory: [],
  };

  beforeEach(async () => {
    storageService = {
      addToBucket: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [StoreItemComponent],
      providers: [{ provide: StorageService, useValue: storageService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('good', mockGood);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display good information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Good');
    expect(compiled.textContent).toContain('$100.00');
  });

  it('should call addToBucket when button clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(storageService.addToBucket).toHaveBeenCalledWith(mockGood);
  });
});
