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
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });

  it('should load draft for edit mode', () => {
    localStorageMock.getItem.mockReturnValue({ id: 1, name: 'Draft' });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [GoodEditorComponent, FormsModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    });
    const newFixture = TestBed.createComponent(GoodEditorComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.componentRef.setInput('mode', 'edit');
    newFixture.componentRef.setInput('item', { id: 1, name: 'Real' } as any);
    newFixture.detectChanges();
    expect(newComponent['formData']().name).toBe('Draft');
  });

  it('should load draft for add mode', () => {
    localStorageMock.getItem.mockReturnValue({ name: 'Draft' });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [GoodEditorComponent, FormsModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    });
    const newFixture = TestBed.createComponent(GoodEditorComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.componentRef.setInput('mode', 'add');
    newFixture.componentRef.setInput('item', null);
    newFixture.detectChanges();
    expect(newComponent['formData']().name).toBe('Draft');
  });

  it('should handle add mode without draft', () => {
    localStorageMock.getItem.mockReturnValue(null);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [GoodEditorComponent, FormsModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    });
    const newFixture = TestBed.createComponent(GoodEditorComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.componentRef.setInput('mode', 'add');
    newFixture.componentRef.setInput('item', null);
    newFixture.detectChanges();
    expect(newComponent['formData']().name).toBe('');
  });

  it('should save to localStorage onDataChange if in edit/add mode', () => {
    component.enableEdit();
    component.onDataChange();
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should NOT save to localStorage onDataChange if in view mode', () => {
    // Mode is already view by default in beforeEach
    component.onDataChange();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should close modal and clear draft', () => {
    jest.spyOn(component.modalClose, 'emit');
    component.onClose();
    expect(component.modalClose.emit).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });
});
