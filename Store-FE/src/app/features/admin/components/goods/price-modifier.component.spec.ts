import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceModifierComponent } from './price-modifier.component';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

describe('PriceModifierComponent', () => {
  let component: PriceModifierComponent;
  let fixture: ComponentFixture<PriceModifierComponent>;
  let localStorageMock: jest.Mocked<LocalStorageService>;

  beforeEach(async () => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [PriceModifierComponent, FormsModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirmation on confirm', () => {
    component.confirm();
    expect(component['showConfirmation']()).toBe(true);
  });

  it('should emit applyModifier and modalClose on apply', () => {
    jest.spyOn(component.applyModifier, 'emit');
    jest.spyOn(component.modalClose, 'emit');
    component.apply();
    expect(component.applyModifier.emit).toHaveBeenCalledWith(1.0);
    expect(component.modalClose.emit).toHaveBeenCalled();
  });
});
