import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsTabComponent } from './statistics.component';
import { StorageService } from '../../../../core/services/storage.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('StatisticsTabComponent', () => {
  let component: StatisticsTabComponent;
  let fixture: ComponentFixture<StatisticsTabComponent>;
  let storageService: Partial<StorageService>;

  beforeEach(async () => {
    storageService = {
      sales: signal([]),
      users: signal([]),
      goods: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [StatisticsTabComponent, FormsModule],
      providers: [{ provide: StorageService, useValue: storageService }],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute stats correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (storageService.sales as any).set([
      { id: 1, goodName: 'A', price: 10, date: new Date().toISOString() },
      { id: 2, goodName: 'B', price: 20, date: new Date().toISOString() },
      { id: 3, goodName: 'A', price: 10, date: new Date().toISOString() },
    ]);
    fixture.detectChanges();
    expect(component['stats']().totalRevenue).toBe(40);
    expect(component['stats']().totalSales).toBe(3);
    expect(component['stats']().itemsChart.find((i) => i.name === 'A')?.count).toBe(2);
  });
});
