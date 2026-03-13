import {
    Component,
    computed,
    inject,
    input,
    InputSignal,
    OnInit,
    output,
    OutputEmitterRef,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { StorageService } from '../../../../core/services/storage.service';
import { LocalStorageBuckets, LocalStorageService } from '../../../../core/services/local-storage.service';
import { Sale } from '../../../../core/models/sale.model';

export type UserEditorMode = 'view' | 'modify';

@Component({
    selector: 'app-user-editor',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './user-editor.component.html',
    styleUrl: './user-editor.component.less',
})
export class UserEditorComponent implements OnInit {

    private readonly storageService: StorageService = inject(StorageService);
    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly STORAGE_KEY: LocalStorageBuckets = LocalStorageBuckets.USER_EDITOR;

    mode: InputSignal<UserEditorMode> = input.required();
    user: InputSignal<User> = input.required();
    userSave: OutputEmitterRef<User> = output();
    modalClose: OutputEmitterRef<void> = output();

    protected currentMode: WritableSignal<UserEditorMode> = signal('view');
    protected formData: WritableSignal<Partial<User>> = signal({});

    protected userSales: Signal<Sale[]> = computed(() => this.storageService.sales().filter((s: Sale) => s.userId === this.user().id));

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
