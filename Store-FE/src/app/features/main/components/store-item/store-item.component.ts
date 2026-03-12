import { Component, input, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Good } from '../../../../core/models/good.model';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-store-item',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './store-item.component.html',
  styleUrl: './store-item.component.less',
})
export class StoreItemComponent {
  good = input.required<Good>();
  protected readonly storageService = inject(StorageService);

  addToBucket(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.storageService.addToBucket(this.good());
  }
}
