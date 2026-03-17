import {
    Component,
    inject,
    input,
    InputSignal,
    OnInit,
    output,
    OutputEmitterRef,
    signal,
    WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IGood } from '../../../../core/models/good.model';
import { LocalStorageBuckets, LocalStorageService } from '../../../../core/services/local-storage.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';

export type EditorMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-good-editor',
    standalone: true,
    imports: [CommonModule, FormsModule, Button, InputText, Textarea, InputNumber, TableModule],
    templateUrl: './good-editor.component.html',
    styleUrl: './good-editor.component.less',
})
export class GoodEditorComponent implements OnInit {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly STORAGE_KEY: LocalStorageBuckets = LocalStorageBuckets.GOOD_EDITOR;

    mode: InputSignal<EditorMode> = input.required();
    item: InputSignal<IGood | null> = input<IGood | null>(null);
    itemSave: OutputEmitterRef<IGood> = output();
    modalClose: OutputEmitterRef<void> = output();

    protected currentMode: WritableSignal<EditorMode> = signal('view');
    protected formData: WritableSignal<Partial<IGood>> = signal({});

    ngOnInit() {
        this.currentMode.set(this.mode());

        const savedData = this.localStorageService.getItem<Partial<IGood>>(this.STORAGE_KEY);

        if (this.item()) {
            const baseData = { ...this.item()! };
            if (savedData && savedData.id === baseData.id && this.currentMode() === 'edit') {
                this.formData.set({ ...baseData, ...savedData });
            } else {
                this.formData.set(baseData);
            }
        } else if (savedData && !savedData.id && this.currentMode() === 'add') {
            this.formData.set(savedData);
        } else {
            this.formData.set({
                name: '',
                description: '',
                shortDescription: '',
                sellPrice: 0,
                imageUrl: '',
                storage: 0,
                priceHistory: [],
            });
        }
    }

    onDataChange() {
        if (this.currentMode() === 'edit' || this.currentMode() === 'add') {
            this.localStorageService.setItem(this.STORAGE_KEY, this.formData());
        }
    }

    enableEdit() {
        this.currentMode.set('edit');
    }

    onSave() {
        this.itemSave.emit(this.formData() as IGood);
        this.localStorageService.removeItem(this.STORAGE_KEY);
    }

    onClose() {
        this.modalClose.emit();
        this.localStorageService.removeItem(this.STORAGE_KEY);
    }

}
