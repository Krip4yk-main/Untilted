import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';
import { User } from '../../../../core/models/user.model';
import { UserEditorComponent, UserEditorMode } from '../user-editor/user-editor.component';

@Component({
    selector: 'app-management-tab',
    standalone: true,
    imports: [CommonModule, UserEditorComponent],
    templateUrl: './management.component.html',
    styleUrl: './management.component.less',
})
export class ManagementTabComponent {

    protected readonly storageService: StorageService = inject(StorageService);

    protected isEditorOpen: WritableSignal<boolean> = signal(false);
    protected editorMode: WritableSignal<UserEditorMode> = signal('view');
    protected selectedUser: WritableSignal<User | null> = signal(null);

    openView(user: User) {
        this.selectedUser.set(user);
        this.editorMode.set('view');
        this.isEditorOpen.set(true);
    }

    openModify(user: User) {
        this.selectedUser.set(user);
        this.editorMode.set('modify');
        this.isEditorOpen.set(true);
    }

    onSave(user: User) {
        this.storageService.updateUser(user);
        this.isEditorOpen.set(false);
    }

}
