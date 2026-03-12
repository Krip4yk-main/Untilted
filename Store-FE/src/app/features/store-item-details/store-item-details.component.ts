import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Good } from '../../core/models/good.model';
import { StorageService } from '../../core/services/storage.service';
import { CoreAuthService } from '../../core/services/core-auth.service';

@Component({
  selector: 'app-store-item-details',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './store-item-details.component.html',
  styleUrl: './store-item-details.component.less',
})
export class StoreItemDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly storageService = inject(StorageService);
  protected readonly authService = inject(CoreAuthService);
  protected readonly good = signal<Good | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const item = this.storageService.getGoodById(id);
    if (item) {
      this.good.set(item);
    } else {
      // Fallback for demo if not in storage
      this.good.set({
        id,
        name: `Product ${id}`,
        description: `Detailed description for Product ${id}.`,
        fullDescription: `Full detailed description for Product ${id}. This product is high quality and very useful for daily tasks.`,
        price: id * 50 + 49.99,
        imageUrl: `https://via.placeholder.com/400x300?text=Product+${id}`,
        count: 10,
        priceHistory: [{ price: id * 50 + 49.99, date: new Date().toISOString() }],
      });
    }
  }

  addToBucket() {
    const item = this.good();
    if (item) {
      this.storageService.addToBucket(item);
    }
  }
}
