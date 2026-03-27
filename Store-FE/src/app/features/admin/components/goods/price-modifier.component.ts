import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    output,
    OutputEmitterRef,
    signal,
    WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalStorageBuckets, LocalStorageService } from '../../../../core/services/local-storage.service';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';
import { LangPipe } from '../../../../core/pipes/lang-pipe';
import { IGood } from '../../../../core/models/good.model';

@Component({
    selector: 'app-price-modifier',
    imports: [CommonModule, ReactiveFormsModule, Button, InputNumber, LangPipe],
    templateUrl: './price-modifier.component.html',
    styleUrl: './price-modifier.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceModifierComponent implements OnInit {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly STORAGE_KEY: LocalStorageBuckets = LocalStorageBuckets.PRICE_MODIFIER;
    private readonly fb: FormBuilder = inject(FormBuilder);

    applyModifier: OutputEmitterRef<number> = output();
    modalClose: OutputEmitterRef<void> = output();

    protected form!: FormGroup;
    protected showConfirmation: WritableSignal<boolean> = signal(false);

    ngOnInit() {
        const savedData = this.localStorageService.getItem<{ multiplier: number }>(this.STORAGE_KEY);
        const multiplier = savedData?.multiplier ?? 1.0;

        this.form = this.fb.group({
            multiplier: [multiplier, [Validators.required, Validators.min(0.01)]],
        });

        this.form.valueChanges.subscribe(() => {
            const value = this.form.getRawValue();
            this.localStorageService.setItem(this.STORAGE_KEY, value as unknown as IGood);
        });
    }

    confirm() {
        this.showConfirmation.set(true);
    }

    apply() {
        const multiplier = this.form.get('multiplier')?.value;
        this.applyModifier.emit(multiplier);
        this.localStorageService.removeItem(this.STORAGE_KEY);
        this.modalClose.emit();
    }

    cancel() {
        this.localStorageService.removeItem(this.STORAGE_KEY);
        this.modalClose.emit();
    }

}
