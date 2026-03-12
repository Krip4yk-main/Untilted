import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { GoodsTabComponent } from './components/goods/goods.component';
import { ManagementTabComponent } from './components/management/management.component';
import { HistoryTabComponent } from './components/history/history.component';
import { StatisticsTabComponent } from './components/statistics/statistics.component';

type AdminTab = 'Goods' | 'Management' | 'History' | 'Statistics';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    GoodsTabComponent,
    ManagementTabComponent,
    HistoryTabComponent,
    StatisticsTabComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.less',
})
export class AdminComponent {
  protected readonly authService = inject(CoreAuthService);
  protected readonly activeTab = signal<AdminTab>('Goods');

  protected readonly tabs = computed<AdminTab[]>(() => {
    const user = this.authService.user();
    if (!user) return [];
    if (user.role === 'admin') {
      return ['Goods', 'Management', 'Statistics', 'History'];
    }
    if (user.role === 'manager') {
      return ['Goods'];
    }
    return [];
  });

  setTab(tab: AdminTab) {
    this.activeTab.set(tab);
  }
}
