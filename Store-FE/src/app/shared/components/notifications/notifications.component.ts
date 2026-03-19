import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INotification, NotificationService } from '../../../core/services/notification.service';
import { Button } from 'primeng/button';
import { LangPipe } from '../../../core/pipes/lang-pipe';

@Component({
    selector: 'app-notifications',
    imports: [CommonModule, Button, LangPipe],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {

    protected readonly notificationService: NotificationService = inject(NotificationService);

    constructor() {
        effect(() => {
            const current: INotification[] = this.notificationService.notifications();
            current.forEach((n: INotification) => {
                this.setupDismissTimer(n.id);
            });
        });
    }

    private timers: Map<number, number> = new Map<number, number>();

    private setupDismissTimer(id: number) {
        if (!this.timers.has(id)) {
            const timer = setTimeout(() => {
                this.notificationService.dismiss(id);
                this.timers.delete(id);
            }, 3000);
            this.timers.set(id, timer);
        }
    }

    close(id: number) {
        if (this.timers.has(id)) {
            clearTimeout(this.timers.get(id));
            this.timers.delete(id);
        }
        this.notificationService.dismiss(id);
    }

}
