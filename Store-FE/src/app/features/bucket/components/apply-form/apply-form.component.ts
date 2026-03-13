import { Component, output, inject, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderDetails } from '../../../../core/models/order-details.model';
import { LocalStorageBuckets, LocalStorageService } from '../../../../core/services/local-storage.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-apply-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, InputText],
  templateUrl: './apply-form.component.html',
  styleUrl: './apply-form.component.less',
})
export class ApplyFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly STORAGE_KEY = LocalStorageBuckets.APPLY;

  cancelForm = output<void>();
  submitOrder = output<OrderDetails>();

  form: FormGroup = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      street: [''],
      novaPostDepartment: [''],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telegramNickname: [''],
    },
    { validators: this.atLeastOneMandatoryValidator },
  );

  ngOnInit() {
    const savedData = this.localStorageService.getItem<Partial<OrderDetails>>(this.STORAGE_KEY);
    if (savedData) {
      this.form.patchValue(savedData, { emitEvent: false });
    }

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.localStorageService.setItem(this.STORAGE_KEY, value);
    });
  }

  atLeastOneMandatoryValidator(group: FormGroup) {
    const street = group.get('street')?.value;
    const novaPostDepartment = group.get('novaPostDepartment')?.value;
    return street || novaPostDepartment ? null : { atLeastOneRequired: true };
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitOrder.emit(this.form.value);
      this.localStorageService.removeItem(this.STORAGE_KEY);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancelForm.emit();
    this.localStorageService.removeItem(this.STORAGE_KEY);
  }
}
