import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { ApplyFormComponent } from './components/apply-form/apply-form.component';
import { OrderDetails } from '../../core/models/order-details.model';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-bucket',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ApplyFormComponent, Button, Card],
  templateUrl: './bucket.component.html',
  styleUrl: './bucket.component.less',
})
export class BucketComponent {
  protected readonly storageService = inject(StorageService);
  protected readonly isApplying = signal(false);

  getTotal() {
    return this.storageService.bucket().reduce((sum, item) => sum + item.good.price * item.count, 0);
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
    console.log('Order submitted:', orderDetails, 'Items:', this.storageService.bucket());
    alert('Order successfully submitted!');
    this.storageService.clearBucket();
    this.isApplying.set(false);
  }
}
