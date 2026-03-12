import { Component, input, output, signal, inject, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { StorageService } from '../../../../core/services/storage.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

export type UserEditorMode = 'view' | 'modify';

@Component({
  selector: 'app-user-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.less',
})
export class UserEditorComponent implements OnInit {
  private readonly storageService = inject(StorageService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly STORAGE_KEY = 'user-editor-data';

  mode = input.required<UserEditorMode>();
  user = input.required<User>();
  userSave = output<User>();
  modalClose = output<void>();

  protected currentMode = signal<UserEditorMode>('view');
  protected formData = signal<Partial<User>>({});

  constructor() {}

  protected userSales = computed(() => {
    return this.storageService.sales().filter((s) => s.userId === this.user().id);
  });

  ngOnInit() {
    this.currentMode.set(this.mode());
    const savedData = this.localStorageService.getItem<Partial<User>>(this.STORAGE_KEY);

    if (savedData && savedData.id === this.user().id && this.currentMode() === 'modify') {
      this.formData.set({ ...this.user(), ...savedData });
    } else {
      this.formData.set({ ...this.user() });
    }
  }

  onDataChange() {
    if (this.currentMode() === 'modify') {
      this.localStorageService.setItem(this.STORAGE_KEY, this.formData());
    }
  }

  enableModify() {
    this.currentMode.set('modify');
  }

  onSave() {
    this.userSave.emit({ ...this.user(), ...this.formData() } as User);
    this.localStorageService.removeItem(this.STORAGE_KEY);
  }

  onClose() {
    this.modalClose.emit();
    this.localStorageService.removeItem(this.STORAGE_KEY);
  }
}
