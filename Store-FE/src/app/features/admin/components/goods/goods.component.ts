import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';
import { CoreAuthService } from '../../../../core/services/core-auth.service';
import { emptyGood, IGood } from '../../../../core/models/good.model';
import { EditorMode, GoodEditorComponent } from '../good-editor/good-editor.component';
import { PriceModifierComponent } from './price-modifier.component';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { LangPipe } from '../../../../core/pipes/lang-pipe';

type TTableskeys = 'goodsTable' | 'actionsTable'

@Component({
    selector: 'app-goods-tab',
    standalone: true,
    imports: [CommonModule, GoodEditorComponent, PriceModifierComponent, Button, TableModule, LangPipe],
    templateUrl: './goods.component.html',
    styleUrl: './goods.component.less',
})
export class GoodsTabComponent {

    protected readonly storageService: StorageService = inject(StorageService);
    protected readonly authService: CoreAuthService = inject(CoreAuthService);

    protected isEditorOpen: WritableSignal<boolean> = signal(false);
    protected editorMode: WritableSignal<EditorMode> = signal('view');
    protected selectedItem: WritableSignal<IGood | null> = signal(null);

    protected isPriceModifierOpen: WritableSignal<boolean> = signal(false);

    protected readonly goodKeys: (keyof IGood)[] = this.getAndSortGoodKeys();

    openAdd() {
        this.selectedItem.set(null);
        this.editorMode.set('add');
        this.isEditorOpen.set(true);
    }

    openView(item: IGood) {
        this.selectedItem.set(item);
        this.editorMode.set('view');
        this.isEditorOpen.set(true);
    }

    openEdit(item: IGood) {
        this.selectedItem.set(item);
        this.editorMode.set('edit');
        this.isEditorOpen.set(true);
    }

    deleteItem(id: number) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.storageService.deleteGood(id);
        }
    }

    applyModifier(multiplier: number) {
        this.storageService.applyPriceModifier(multiplier);
    }

    getAndSortGoodKeys() {
        const keys: (keyof IGood)[] = [
            'id',
            'imageUrl',
            'name',
            'type',
            'description',
            'shortDescription',
            'notes',
            'storage',
            'storageType',
            'nullPrice',
            'sellPrice',
            'deleted',
            'wholePrice',
            'wholeCount',
            'createdAt',
            'createdBy',
            'updatedAt',
            'updatedBy',
            'uniqueId',
            'uniqueCode',
            'priceHistory',
        ];
        if (keys.length !== Object.keys(emptyGood).length) {
            console.error('Keys do not match');
            return [];
        }
        return keys;
    }

}
