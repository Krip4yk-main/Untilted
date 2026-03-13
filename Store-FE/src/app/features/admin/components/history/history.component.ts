import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';
import { IUser } from '../../../../core/models/user.model';
import { UserEditorComponent } from '../user-editor/user-editor.component';

@Component({
    selector: 'app-history-tab',
    standalone: true,
    imports: [CommonModule, UserEditorComponent],
    templateUrl: './history.component.html',
    styleUrl: './history.component.less',
})
export class HistoryTabComponent {

    protected readonly storageService: StorageService = inject(StorageService);

    protected isUserEditorOpen: WritableSignal<boolean> = signal(false);
    protected selectedUser: WritableSignal<IUser | null> = signal(null);

    openUserModal(userId: number | 'unknown') {
        if (userId === 'unknown') {
            return;
        }
        const user = this.storageService.getUserById(userId);
        if (user) {
            this.selectedUser.set(user);
            this.isUserEditorOpen.set(true);
        }
    }

    onSaveUser(user: IUser) {
        this.storageService.updateUser(user);
        this.isUserEditorOpen.set(false);
    }

}
