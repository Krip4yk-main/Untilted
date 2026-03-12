import { output, signal, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

@Component({
  selector: 'app-price-modifier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './price-modifier.component.html',
  styleUrl: './price-modifier.component.less',
})
export class PriceModifierComponent implements OnInit {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly STORAGE_KEY = 'price-modifier-data';

  applyModifier = output<number>();
  modalClose = output<void>();

  protected multiplier = 1.0;
  protected showConfirmation = signal(false);

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
