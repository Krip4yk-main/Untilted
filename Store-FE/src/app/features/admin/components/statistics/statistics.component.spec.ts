import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsTabComponent } from './statistics.component';
import { StorageService } from '../../../../core/services/storage.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('StatisticsTabComponent', () => {
    let component: StatisticsTabComponent;
    let fixture: ComponentFixture<StatisticsTabComponent>;
    let storageService: Partial<StorageService>;

    beforeEach(async() => {
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

    it('should update filter', () => {
        component.updateFilter('userId', '123');
        expect(component['filters']().userId).toBe('123');
    });

    it('should filter by date range', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        (storageService.sales as any).set([
            { id: 1, price: 10, date: yesterday.toISOString(), userId: '1', goodId: 1 },
            { id: 2, price: 20, date: today.toISOString(), userId: '1', goodId: 1 },
            { id: 3, price: 30, date: tomorrow.toISOString(), userId: '1', goodId: 1 },
        ]);

        component.updateFilter('dateFrom', today.toISOString());
        expect(component['filteredSales']().length).toBe(2);

        component.updateFilter('dateTo', today.toISOString());
        expect(component['filteredSales']().length).toBe(1);
        expect(component['filteredSales']()[0].id).toBe(2);
    });

    it('should filter by user, good and price range', () => {
        (storageService.sales as any).set([
            { id: 1, userId: '1', goodId: 1, price: 10, date: new Date().toISOString() },
            { id: 2, userId: '2', goodId: 1, price: 20, date: new Date().toISOString() },
            { id: 3, userId: '1', goodId: 2, price: 30, date: new Date().toISOString() },
            { id: 4, userId: '1', goodId: 1, price: 40, date: new Date().toISOString() },
        ]);

        component.updateFilter('userId', '1');
        expect(component['filteredSales']().length).toBe(3);

        component.updateFilter('goodId', '1');
        expect(component['filteredSales']().length).toBe(2);

        component.updateFilter('priceMin', 15);
        expect(component['filteredSales']().length).toBe(1);
        expect(component['filteredSales']()[0].id).toBe(4);

        component.updateFilter('priceMax', 35);
        expect(component['filteredSales']().length).toBe(0);
    });

    it('should handle zero sales in stats', () => {
        (storageService.sales as any).set([]);
        expect(component['stats']().totalSales).toBe(0);
        expect(component['stats']().itemsChart.length).toBe(0);
    });
});
