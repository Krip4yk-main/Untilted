import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { GoodsTabComponent } from './components/goods/goods.component';
import { ManagementTabComponent } from './components/management/management.component';
import { HistoryTabComponent } from './components/history/history.component';
import { StatisticsTabComponent } from './components/statistics/statistics.component';
import { Button } from 'primeng/button';

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
        Button,
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.less',
})
export class AdminComponent {

    protected readonly authService: CoreAuthService = inject(CoreAuthService);

    protected readonly activeTab: WritableSignal<AdminTab> = signal('Goods');

    protected readonly tabs: Signal<AdminTab[]> = computed(() => {
        const user = this.authService.user();
        if (!user) {
            return [];
        }
        if (user.role === 'Admin') {
            return ['Goods', 'Management', 'Statistics', 'History'];
        }
        return [];
    });

    setTab(tab: AdminTab) {
        this.activeTab.set(tab);
    }

}
