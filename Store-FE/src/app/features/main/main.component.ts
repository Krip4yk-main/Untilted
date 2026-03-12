import { Component, inject } from '@angular/core';
import { StoreItemComponent } from './components/store-item/store-item.component';
import { FiltersComponent } from './components/filters/filters.component';
import { StorageService } from '../../core/services/storage.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CoreAuthService } from '../../core/services/core-auth.service';

@Component({
  selector: 'app-main',
  imports: [StoreItemComponent, FiltersComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.less',
})
export class MainComponent {
  protected readonly storageService = inject(StorageService);
  protected readonly router = inject(Router);

  protected readonly goods = this.storageService.goods;
}
