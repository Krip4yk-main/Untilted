import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { IGood } from '../../core/models/good.model';
import { StorageService } from '../../core/services/storage.service';
import { CoreAuthService } from '../../core/services/core-auth.service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-store-item-details',
    imports: [CurrencyPipe, RouterLink, Button, Card],
    templateUrl: './store-item-details.component.html',
    styleUrl: './store-item-details.component.less',
})
export class StoreItemDetailsComponent implements OnInit {

    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected readonly storageService: StorageService = inject(StorageService);
    protected readonly authService: CoreAuthService = inject(CoreAuthService);

    protected readonly good: WritableSignal<IGood | null> = signal(null);

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        const item = this.storageService.getGoodById(id);
        if (item) {
            this.good.set(item);
        }
    }

    addToBucket() {
        const item = this.good();
        if (item) {
            this.storageService.addToBucket(item);
        }
    }

}
