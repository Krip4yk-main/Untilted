import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../../core/services/storage.service';
import { defaultStatFilters, IStat, IStatFilters, IStatItem } from './statistics.types';
import { COPY } from '../../../../core/services/utils.service';
import { Sale } from '../../../../core/models/sale.model';

@Component({
    selector: 'app-statistics-tab',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.less',
})
export class StatisticsTabComponent {

    protected readonly storageService: StorageService = inject(StorageService);

    protected filters: WritableSignal<IStatFilters> = signal(COPY(defaultStatFilters));

    protected filteredSales: Signal<Sale[]> = computed(() => {
        const s = this.storageService.sales();
        const f = this.filters();

        return s.filter((sale: Sale) => {
            const saleDate = new Date(sale.date);
            if (f.dateFrom && saleDate < new Date(f.dateFrom)) {
                return false;
            }
            if (f.dateTo && saleDate > new Date(f.dateTo)) {
                return false;
            }
            if (f.userId && sale.userId !== f.userId) {
                return false;
            }
            if (f.goodId && sale.goodId !== Number(f.goodId)) {
                return false;
            }
            if (f.priceMin !== null && sale.price < f.priceMin) {
                return false;
            }
            if (f.priceMax !== null && sale.price > f.priceMax) {
                return false;
            }
            return true;
        });
    });

    protected stats: Signal<IStat> = computed((): IStat => {
        const sales = this.filteredSales();
        const totalRevenue = sales.reduce((sum: number, s: Sale) => sum + s.price, 0);
        const totalSales = sales.length;

        // Group by item for a simple bar chart
        const byItem: Record<string, number> = {};
        sales.forEach((s: Sale) => {
            byItem[s.goodName] = (byItem[s.goodName] || 0) + 1;
        });

        const itemsChart: IStatItem[] = Object.entries(byItem).map(([name, count]: [string, number]): IStatItem => ({
            name,
            count,
            percent: (count / totalSales) * 100,
        }));

        return { totalRevenue, totalSales, itemsChart };
    });

    updateFilter(key: string, value: string | number | null) {
        this.filters.update((f: IStatFilters): IStatFilters => ({ ...f, [key]: value }));
    }

}
