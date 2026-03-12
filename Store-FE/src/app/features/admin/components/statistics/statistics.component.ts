import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-statistics-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.less',
})
export class StatisticsTabComponent {
  protected readonly storageService = inject(StorageService);

  protected filters = signal({
    dateFrom: '',
    dateTo: '',
    userId: '',
    goodId: '',
    priceMin: null as number | null,
    priceMax: null as number | null,
  });

  protected filteredSales = computed(() => {
    const s = this.storageService.sales();
    const f = this.filters();

    return s.filter((sale) => {
      const saleDate = new Date(sale.date);
      if (f.dateFrom && saleDate < new Date(f.dateFrom)) return false;
      if (f.dateTo && saleDate > new Date(f.dateTo)) return false;
      if (f.userId && sale.userId !== f.userId) return false;
      if (f.goodId && sale.goodId !== Number(f.goodId)) return false;
      if (f.priceMin !== null && sale.price < f.priceMin) return false;
      if (f.priceMax !== null && sale.price > f.priceMax) return false;
      return true;
    });
  });

  protected stats = computed(() => {
    const sales = this.filteredSales();
    const totalRevenue = sales.reduce((sum, s) => sum + s.price, 0);
    const totalSales = sales.length;

    // Group by item for a simple bar chart
    const byItem: Record<string, number> = {};
    sales.forEach((s) => {
      byItem[s.goodName] = (byItem[s.goodName] || 0) + 1;
    });

    const itemsChart = Object.entries(byItem).map(([name, count]) => ({
      name,
      count,
      percent: (count / totalSales) * 100,
    }));

    return { totalRevenue, totalSales, itemsChart };
  });

  updateFilter(key: string, value: string | number | null) {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }
}
