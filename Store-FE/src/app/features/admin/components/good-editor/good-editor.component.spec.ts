import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoodEditorComponent } from './good-editor.component';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

describe('GoodEditorComponent', () => {
  let component: GoodEditorComponent;
  let fixture: ComponentFixture<GoodEditorComponent>;
  let localStorageMock: jest.Mocked<LocalStorageService>;

  beforeEach(async () => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [GoodEditorComponent, FormsModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GoodEditorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'view');
    fixture.componentRef.setInput('item', {
      id: 1,
      name: 'Test',
      price: 10,
      imageUrl: '',
      description: '',
      fullDescription: '',
      count: 1,
      priceHistory: [],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in view mode', () => {
    expect(component['currentMode']()).toBe('view');
  });

  it('should enable edit', () => {
    component.enableEdit();
    expect(component['currentMode']()).toBe('edit');
  });

  it('should emit itemSave on onSave', () => {
    jest.spyOn(component.itemSave, 'emit');
    component.onSave();
    expect(component.itemSave.emit).toHaveBeenCalled();
  });
});
