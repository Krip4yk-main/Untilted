import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditorComponent } from './user-editor.component';
import { StorageService } from '../../../../core/services/storage.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

describe('UserEditorComponent', () => {
  let component: UserEditorComponent;
  let fixture: ComponentFixture<UserEditorComponent>;
  let storageService: Partial<StorageService>;
  let localStorageMock: jest.Mocked<LocalStorageService>;

  beforeEach(async () => {
    storageService = {
      sales: signal([]),
    };
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [UserEditorComponent, FormsModule],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: LocalStorageService, useValue: localStorageMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditorComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'view');
    fixture.componentRef.setInput('user', {
      id: '1',
      name: 'Test',
      role: 'client',
      email: '',
      isBlocked: false,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load draft for modify mode', () => {
    localStorageMock.getItem.mockReturnValue({ id: '1', name: 'Draft' });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [UserEditorComponent, FormsModule],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: LocalStorageService, useValue: localStorageMock },
      ],
    });
    const newFixture = TestBed.createComponent(UserEditorComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.componentRef.setInput('mode', 'modify');
    newFixture.componentRef.setInput('user', { id: '1', name: 'Real' } as any);
    newFixture.detectChanges();
    expect(newComponent['formData']().name).toBe('Draft');
  });

  it('should enable modify', () => {
    component.enableModify();
    expect(component['currentMode']()).toBe('modify');
  });

  it('should save to localStorage onDataChange if in modify mode', () => {
    component.enableModify();
    component.onDataChange();
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should NOT save to localStorage onDataChange if in view mode', () => {
    // Mode is already view by default in beforeEach
    component.onDataChange();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('should emit userSave and clear draft on save', () => {
    jest.spyOn(component.userSave, 'emit');
    component.onSave();
    expect(component.userSave.emit).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });

  it('should emit modalClose and clear draft on close', () => {
    jest.spyOn(component.modalClose, 'emit');
    component.onClose();
    expect(component.modalClose.emit).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });

  it('should compute user sales correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (storageService.sales as any).set([
      { userId: '1', goodName: 'A' },
      { userId: '2', goodName: 'B' },
      { userId: '1', goodName: 'C' },
    ]);
    expect(component['userSales']().length).toBe(2);
  });
});
