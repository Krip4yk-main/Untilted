import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryTabComponent } from './history.component';
import { StorageService } from '../../../../core/services/storage.service';
import { signal } from '@angular/core';

describe('HistoryTabComponent', () => {
  let component: HistoryTabComponent;
  let fixture: ComponentFixture<HistoryTabComponent>;
  let storageService: Partial<StorageService>;

  beforeEach(async () => {
    storageService = {
      sales: signal([]),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HistoryTabComponent],
      providers: [{ provide: StorageService, useValue: storageService }],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open user modal for known user', () => {
    const mockUser = { id: '1', name: 'Test' } as any;
    (storageService.getUserById as jest.Mock).mockReturnValue(mockUser);
    component.openUserModal('1');
    expect(component['selectedUser']()).toBe(mockUser);
    expect(component['isUserEditorOpen']()).toBe(true);
  });

  it('should not open user modal for unknown user', () => {
    component.openUserModal('unknown');
    expect(component['isUserEditorOpen']()).toBe(false);
  });

  it('should not open user modal if user not found', () => {
    (storageService.getUserById as jest.Mock).mockReturnValue(null);
    component.openUserModal('non-existent');
    expect(component['isUserEditorOpen']()).toBe(false);
  });

  it('should update user and close modal on save', () => {
    const mockUser = { id: '1' } as any;
    component.onSaveUser(mockUser);
    expect(storageService.updateUser).toHaveBeenCalledWith(mockUser);
    expect(component['isUserEditorOpen']()).toBe(false);
  });
});
