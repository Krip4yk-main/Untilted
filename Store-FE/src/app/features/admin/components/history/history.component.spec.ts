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
});
