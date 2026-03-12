import { Component, inject } from '@angular/core';
import { StoreItemComponent } from './components/store-item/store-item.component';
import { FiltersComponent } from './components/filters/filters.component';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-main',
  imports: [StoreItemComponent, FiltersComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.less',
})
export class MainComponent {
  protected readonly storageService = inject(StorageService);
  protected readonly goods = this.storageService.goods;
}
