import { Component, inject, Signal } from '@angular/core';
import { StoreItemComponent } from './components/store-item/store-item.component';
import { FiltersComponent } from './components/filters/filters.component';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';
import { Good } from '../../core/models/good.model';

@Component({
    selector: 'app-main',
    imports: [StoreItemComponent, FiltersComponent],
    templateUrl: './main.component.html',
    styleUrl: './main.component.less',
})
export class MainComponent {

    protected readonly storageService: StorageService = inject(StorageService);
    protected readonly router: Router = inject(Router);

    protected readonly goods: Signal<Good[]> = this.storageService.goods;

}
