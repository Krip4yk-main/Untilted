import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { ApplyFormComponent } from './components/apply-form/apply-form.component';
import { OrderDetails } from '../../core/models/order-details.model';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { BucketItem } from '../../core/models/bucket-item.model';

@Component({
    selector: 'app-bucket',
    standalone: true,
    imports: [CommonModule, CurrencyPipe, ApplyFormComponent, Button, Card],
    templateUrl: './bucket.component.html',
    styleUrl: './bucket.component.less',
})
export class BucketComponent {

    protected readonly storageService: StorageService = inject(StorageService);

    protected readonly isApplying: WritableSignal<boolean> = signal(false);

    getTotal() {
        return this.storageService.bucket().reduce((sum: number, item: BucketItem) => sum + (item.good.sellPrice * item.count), 0);
    }

    onRemove(id: number) {
        this.storageService.removeFromBucket(id);
    }

    onIncrement(id: number) {
        this.storageService.incrementFromBucket(id);
    }

    onDecrement(id: number) {
        this.storageService.decrementFromBucket(id);
    }

    onClear() {
        this.storageService.clearBucket();
    }

    onApply() {
        this.isApplying.set(true);
    }

    onCancelApply() {
        this.isApplying.set(false);
    }

    onSubmitOrder(orderDetails: OrderDetails) {
        console.info('Order submitted:', orderDetails, 'Items:', this.storageService.bucket());
        alert('Order successfully submitted!');
        this.storageService.clearBucket();
        this.isApplying.set(false);
    }

}
