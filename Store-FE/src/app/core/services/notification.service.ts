export type NotificationSeverity = 'normal' | 'success' | 'error';

export interface INotification {
    id: number;
    message: string;
    severity: NotificationSeverity;
}

import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

    private lastId: number = 0;
    private queue: INotification[] = [];
    private activeNotifications: WritableSignal<INotification[]> = signal([]);

    get notifications() {
        return this.activeNotifications.asReadonly();
    }

    show(message: string, severity: NotificationSeverity = 'normal') {
        const id = ++this.lastId;
        const notification: INotification = { id, message, severity };

        if (this.activeNotifications().length < 3) {
            this.activeNotifications.update((n: INotification[]) => [...n, notification]);
        } else {
            this.queue.push(notification);
        }
    }

    dismiss(id: number) {
        this.activeNotifications.update((n: INotification[]) => n.filter((notif: INotification) => notif.id !== id));
        this.checkQueue();
    }

    private checkQueue() {
        if (this.queue.length > 0 && this.activeNotifications().length < 3) {
            const next = this.queue.shift();
            if (next) {
                this.activeNotifications.update((n: INotification[]) => [...n, next]);
            }
        }
    }

}
