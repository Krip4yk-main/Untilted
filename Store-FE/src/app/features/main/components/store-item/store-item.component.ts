import { Component, inject, input, InputSignal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IGood } from '../../../../core/models/good.model';
import { StorageService } from '../../../../core/services/storage.service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-store-item',
    imports: [CurrencyPipe, RouterLink, Button, Card],
    templateUrl: './store-item.component.html',
    styleUrl: './store-item.component.less',
})
export class StoreItemComponent {

    protected readonly storageService: StorageService = inject(StorageService);

    good: InputSignal<IGood> = input.required();

    addToBucket(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.storageService.addToBucket(this.good());
    }

}
