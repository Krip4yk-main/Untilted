import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';
import { User } from '../../../../core/models/user.model';
import { UserEditorComponent } from '../user-editor/user-editor.component';

@Component({
  selector: 'app-history-tab',
  standalone: true,
  imports: [CommonModule, UserEditorComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.less',
})
export class HistoryTabComponent {
  protected readonly storageService = inject(StorageService);

  protected isUserEditorOpen = signal(false);
  protected selectedUser = signal<User | null>(null);

  openUserModal(userId: string | 'unknown') {
    if (userId === 'unknown') return;
    const user = this.storageService.getUserById(userId);
    if (user) {
      this.selectedUser.set(user);
      this.isUserEditorOpen.set(true);
    }
  }

  onSaveUser(user: User) {
    this.storageService.updateUser(user);
    this.isUserEditorOpen.set(false);
  }
}
