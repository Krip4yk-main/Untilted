import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';
import { CoreAuthService } from '../../../../core/services/core-auth.service';
import { Good } from '../../../../core/models/good.model';
import { GoodEditorComponent, EditorMode } from '../good-editor/good-editor.component';
import { PriceModifierComponent } from './price-modifier.component';

@Component({
  selector: 'app-goods-tab',
  standalone: true,
  imports: [CommonModule, GoodEditorComponent, PriceModifierComponent],
  templateUrl: './goods.component.html',
  styleUrl: './goods.component.less',
})
export class GoodsTabComponent {
  protected readonly storageService = inject(StorageService);
  protected readonly authService = inject(CoreAuthService);

  protected isEditorOpen = signal(false);
  protected editorMode = signal<EditorMode>('view');
  protected selectedItem = signal<Good | null>(null);

  protected isPriceModifierOpen = signal(false);

  openAdd() {
    this.selectedItem.set(null);
    this.editorMode.set('add');
    this.isEditorOpen.set(true);
  }

  openView(item: Good) {
    this.selectedItem.set(item);
    this.editorMode.set('view');
    this.isEditorOpen.set(true);
  }

  openEdit(item: Good) {
    this.selectedItem.set(item);
    this.editorMode.set('edit');
    this.isEditorOpen.set(true);
  }

  onSave(item: Good) {
    if (this.editorMode() === 'add') {
      this.storageService.addGood(item);
    } else {
      this.storageService.updateGood(item);
    }
    this.isEditorOpen.set(false);
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.storageService.deleteGood(id);
    }
  }

  applyModifier(multiplier: number) {
    this.storageService.applyPriceModifier(multiplier);
  }
}
