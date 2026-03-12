import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementTabComponent } from './management.component';
import { StorageService } from '../../../../core/services/storage.service';
import { signal } from '@angular/core';

describe('ManagementTabComponent', () => {
  let component: ManagementTabComponent;
  let fixture: ComponentFixture<ManagementTabComponent>;
  let storageService: Partial<StorageService>;

  beforeEach(async () => {
    storageService = {
      users: signal([]),
      updateUser: jest.fn(),
      sales: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [ManagementTabComponent],
      providers: [{ provide: StorageService, useValue: storageService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open view', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = { id: '1' } as any;
    component.openView(user);
    expect(component['isEditorOpen']()).toBe(true);
    expect(component['editorMode']()).toBe('view');
  });

  it('should open modify', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = { id: '1' } as any;
    component.openModify(user);
    expect(component['isEditorOpen']()).toBe(true);
    expect(component['editorMode']()).toBe('modify');
  });

  it('should call storageService.updateUser on save', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = { id: '1' } as any;
    component.onSave(user);
    expect(storageService.updateUser).toHaveBeenCalledWith(user);
    expect(component['isEditorOpen']()).toBe(false);
  });
});
