import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { StorageService } from '../../core/services/storage.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let storageService: Partial<StorageService>;

  beforeEach(async () => {
    storageService = {
      goods: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [{ provide: StorageService, useValue: storageService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
