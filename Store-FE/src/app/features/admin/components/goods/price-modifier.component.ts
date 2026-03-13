import { Component, inject, OnInit, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageBuckets, LocalStorageService } from '../../../../core/services/local-storage.service';
import { Button } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-price-modifier',
    standalone: true,
    imports: [CommonModule, FormsModule, Button, InputNumber],
    templateUrl: './price-modifier.component.html',
    styleUrl: './price-modifier.component.less',
})
export class PriceModifierComponent implements OnInit {

    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly STORAGE_KEY: LocalStorageBuckets = LocalStorageBuckets.PRICE_MODIFIER;

    applyModifier: OutputEmitterRef<number> = output();
    modalClose: OutputEmitterRef<void> = output();

    protected multiplier: number = 1.0;
    protected showConfirmation: WritableSignal<boolean> = signal(false);

    ngOnInit() {
        const savedData = this.localStorageService.getItem<{ multiplier: number }>(this.STORAGE_KEY);
        if (savedData) {
            this.multiplier = savedData.multiplier;
        }
    }

    onMultiplierChange() {
        this.localStorageService.setItem(this.STORAGE_KEY, { multiplier: this.multiplier });
    }

    confirm() {
        this.showConfirmation.set(true);
    }

    apply() {
        this.applyModifier.emit(this.multiplier);
        this.localStorageService.removeItem(this.STORAGE_KEY);
        this.modalClose.emit();
    }

    cancel() {
        this.localStorageService.removeItem(this.STORAGE_KEY);
        this.modalClose.emit();
    }

}
