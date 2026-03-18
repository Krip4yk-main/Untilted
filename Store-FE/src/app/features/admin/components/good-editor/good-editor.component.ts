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
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emptyGoodTemplate, IGood, IGoodTemplate, IPriceHistoryRecord } from '../../../../core/models/good.model';
import { LocalStorageBuckets, LocalStorageService } from '../../../../core/services/local-storage.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { COPY } from '../../../../core/services/utils.service';
import { LangPipe } from '../../../../core/pipes/lang-pipe';
import moment from 'moment';
import { CoreAuthService } from '../../../../core/services/core-auth.service';

export type EditorMode = 'view' | 'edit' | 'add';
type TPartialGood = IGoodTemplate & { priceHistory: IPriceHistoryRecord[] };

@Component({
    selector: 'app-good-editor',
    standalone: true,
    imports: [CommonModule, Button, InputText, Textarea, InputNumber, TableModule, ReactiveFormsModule, LangPipe],
    templateUrl: './good-editor.component.html',
    styleUrl: './good-editor.component.less',
})
export class GoodEditorComponent implements OnInit {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly coreAuthService: CoreAuthService = inject(CoreAuthService);
    private readonly STORAGE_KEY: LocalStorageBuckets = LocalStorageBuckets.GOOD_EDITOR;
    private readonly fb: FormBuilder = inject(FormBuilder);

    mode: InputSignal<EditorMode> = input.required();
    item: InputSignal<IGood | null> = input<IGood | null>(null);
    itemSave: OutputEmitterRef<IGood> = output();
    modalClose: OutputEmitterRef<void> = output();

    protected readonly goodTypes: { label: string, value: IGoodTemplate['type'] }[] = [
        { label: 'poly', value: 'poly' },
        { label: 'poly_lam', value: 'poly_lam' },
        { label: 'SLA', value: 'SLA' },
        { label: 'FDM', value: 'FDM' },
        { label: 'wood', value: 'wood' },
        { label: 'clothes', value: 'clothes' },
    ];

    protected readonly storageTypes: { label: string, value: IGoodTemplate['storageType'] }[] = [
        { label: 'items', value: 'items' },
        { label: 'meters', value: 'meters' },
    ];

    protected currentMode: WritableSignal<EditorMode> = signal('view');
    protected form!: FormGroup<{
        uniqueId: FormControl<string | null>;
        uniqueCode: FormControl<string | null>;
        name: FormControl<string>;
        type: FormControl<IGoodTemplate['type']>;
        imageUrl: FormControl<string>;
        description: FormControl<string>;
        shortDescription: FormControl<string>;
        notes: FormControl<string>;
        storage: FormControl<number>;
        storageType: FormControl<IGoodTemplate['storageType']>;
        nullPrice: FormControl<number>;
        sellPrice: FormControl<number>;
        wholePrice: FormControl<number>;
        wholeCount: FormControl<number>;
        createdAt: FormControl<`${number}`>;
        updatedAt: FormControl<`${number}`>;
        createdBy: FormControl<string>;
        updatedBy: FormControl<string>;
        deleted: FormControl<boolean>;
        priceHistory: FormControl<IPriceHistoryRecord[]>;
    }>;

    ngOnInit() {
        this.currentMode.set(this.mode());

        const savedData = this.localStorageService.getItem<Partial<IGood>>(this.STORAGE_KEY);

        const base: TPartialGood = this.item() ?
            { ...(this.item() as IGood) } :
            { ...COPY(emptyGoodTemplate), priceHistory: [] };

        const initial: Partial<TPartialGood> = (this.currentMode() === 'edit' && savedData && savedData.id === (base as IGood).id) ?
            { ...base, ...savedData } :
            (this.currentMode() === 'add' && savedData && !savedData.id) ? { ...base, ...savedData } : base;

        this.form = this.fb.nonNullable.group({
            uniqueId: new FormControl(initial.uniqueId ?? null, {
                validators: [
                    Validators.maxLength(1023),
                ],
            }),
            uniqueCode: new FormControl(initial.uniqueCode ?? null, {
                validators: [
                    Validators.maxLength(511),
                ],
            }),
            name: new FormControl(initial.name ?? '', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.maxLength(511),
                    Validators.minLength(2),
                ],
            }),
            type: new FormControl(initial.type ?? 'FDM', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            imageUrl: new FormControl(initial.imageUrl ?? '', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.pattern(/^(https?:\/\/).+/),
                    Validators.maxLength(2047),
                ],
            }),
            description: new FormControl(initial.description ?? '', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.maxLength(3999),
                ],
            }),
            shortDescription: new FormControl(initial.shortDescription ?? '', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.maxLength(1023),
                ],
            }),
            notes: new FormControl(initial.notes ?? '', {
                nonNullable: true,
                validators: [
                    Validators.maxLength(3999),
                ],
            }),
            storage: new FormControl(initial.storage ?? 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                ],
            }),
            storageType: new FormControl(initial.storageType ?? 'items', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            nullPrice: new FormControl(initial.nullPrice ?? 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                ],
            }),
            sellPrice: new FormControl(initial.sellPrice ?? 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                ],
            }),
            wholePrice: new FormControl(initial.wholePrice ?? 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                ],
            }),
            wholeCount: new FormControl(initial.wholeCount ?? 0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                ],
            }),
            createdAt: new FormControl(String(moment().unix() * 1000) as `${number}`, {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            updatedAt: new FormControl(String(moment().unix() * 1000) as `${number}`, {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            createdBy: new FormControl(this.coreAuthService.user()?.username || '', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            updatedBy: new FormControl(this.coreAuthService.user()?.username || '', {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
            }),
            deleted: new FormControl(initial.deleted ?? false, {
                nonNullable: true,
            }),
            priceHistory: new FormControl(initial.priceHistory ?? [], {
                nonNullable: true,
            }),
        });

        this.currentMode.set(this.mode());

        // Disable form in view mode
        if (this.currentMode() === 'view') {
            this.form.disable({ emitEvent: false });
        }

        this.form.valueChanges.subscribe(() => {
            if (this.currentMode() === 'edit' || this.currentMode() === 'add') {
                const value = this.form.getRawValue();
                this.localStorageService.setItem(this.STORAGE_KEY, value as unknown as IGood);
            }
        });
    }

    enableEdit() {
        this.currentMode.set('edit');
    }

    onSave() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const raw = this.form.getRawValue();
        const baseId = this.item()?.id ?? -1;
        const result: IGood = {
            ...(COPY(emptyGoodTemplate)),
            ...(raw as IGoodTemplate),
            id: baseId,
            priceHistory: raw.priceHistory ?? [],
        };
        this.itemSave.emit(result);
        this.localStorageService.removeItem(this.STORAGE_KEY);
    }

    onClose() {
        this.modalClose.emit();
        this.localStorageService.removeItem(this.STORAGE_KEY);
    }

    protected readonly Validators = Validators;

}
