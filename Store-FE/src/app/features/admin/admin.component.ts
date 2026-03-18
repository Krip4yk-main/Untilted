import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { GoodsTabComponent } from './components/goods/goods.component';
import { ManagementTabComponent } from './components/management/management.component';
import { HistoryTabComponent } from './components/history/history.component';
import { StatisticsTabComponent } from './components/statistics/statistics.component';
import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { LangPipe } from '../../core/pipes/lang-pipe';

export type TAdminTab = 'goods' | 'management' | 'statistics' | 'history';

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
        ButtonGroup,
        LangPipe,
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.less',
})
export class AdminComponent {

    protected readonly authService: CoreAuthService = inject(CoreAuthService);

    protected readonly activeTab: WritableSignal<TAdminTab> = signal('goods');

    protected readonly tabs: Signal<TAdminTab[]> = computed(() => {
        const user = this.authService.user();
        if (!user) {
            return [];
        }
        if (user.role === 'Admin') {
            return ['goods', 'management', 'statistics', 'history'];
        }
        return [];
    });

    setTab(tab: TAdminTab) {
        this.activeTab.set(tab);
    }

}
