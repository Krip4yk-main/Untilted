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
});
