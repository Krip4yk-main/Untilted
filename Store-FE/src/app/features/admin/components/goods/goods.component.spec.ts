import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoodsTabComponent } from './goods.component';
import { StorageService } from '../../../../core/services/storage.service';
import { CoreAuthService } from '../../../../core/services/core-auth.service';
import { signal } from '@angular/core';

describe('GoodsTabComponent', () => {
  let component: GoodsTabComponent;
  let fixture: ComponentFixture<GoodsTabComponent>;
  let storageService: Partial<StorageService>;
  let authService: Partial<CoreAuthService>;

  beforeEach(async () => {
    storageService = {
      goods: signal([]),
      addGood: jest.fn(),
      updateGood: jest.fn(),
      deleteGood: jest.fn(),
      applyPriceModifier: jest.fn(),
    };
    authService = {
      user: signal({ id: '1', role: 'admin', name: '', email: '', isBlocked: false }),
    };

    await TestBed.configureTestingModule({
      imports: [GoodsTabComponent],
      providers: [
        { provide: StorageService, useValue: storageService },
        { provide: CoreAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoodsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open editor in add mode', () => {
    component.openAdd();
    expect(component['isEditorOpen']()).toBe(true);
    expect(component['editorMode']()).toBe('add');
  });

  it('should call storageService.addGood on save in add mode', () => {
    component.openAdd();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockGood = { id: 0 } as any;
    component['onSave'](mockGood);
    expect(storageService.addGood).toHaveBeenCalledWith(mockGood);
  });

  it('should open editor in view mode', () => {
    const mockGood = { id: 1 } as any;
    component.openView(mockGood);
    expect(component['isEditorOpen']()).toBe(true);
    expect(component['editorMode']()).toBe('view');
    expect(component['selectedItem']()).toBe(mockGood);
  });

  it('should open editor in edit mode', () => {
    const mockGood = { id: 1 } as any;
    component.openEdit(mockGood);
    expect(component['isEditorOpen']()).toBe(true);
    expect(component['editorMode']()).toBe('edit');
    expect(component['selectedItem']()).toBe(mockGood);
  });

  it('should call storageService.updateGood on save in edit mode', () => {
    const mockGood = { id: 1 } as any;
    component.openEdit(mockGood);
    component['onSave'](mockGood);
    expect(storageService.updateGood).toHaveBeenCalledWith(mockGood);
  });

  it('should delete item if confirmed', () => {
    window.confirm = jest.fn().mockReturnValue(true);
    component.deleteItem(1);
    expect(storageService.deleteGood).toHaveBeenCalledWith(1);
  });

  it('should not delete item if not confirmed', () => {
    window.confirm = jest.fn().mockReturnValue(false);
    component.deleteItem(1);
    expect(storageService.deleteGood).not.toHaveBeenCalled();
  });

  it('should apply modifier', () => {
    component.applyModifier(1.1);
    expect(storageService.applyPriceModifier).toHaveBeenCalledWith(1.1);
  });
});
