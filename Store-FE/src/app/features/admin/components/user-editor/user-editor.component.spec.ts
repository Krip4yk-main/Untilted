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
});
