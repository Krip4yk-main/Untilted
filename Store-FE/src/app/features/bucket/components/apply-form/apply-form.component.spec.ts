import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyFormComponent } from './apply-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

describe('ApplyFormComponent', () => {
  let component: ApplyFormComponent;
  let fixture: ComponentFixture<ApplyFormComponent>;
  let localStorageMock: jest.Mocked<LocalStorageService>;

  beforeEach(async () => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ApplyFormComponent, ReactiveFormsModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should require at least street or novaPostDepartment', () => {
    component.form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      country: 'USA',
      city: 'NY',
      phoneNumber: '123',
      email: 'john@doe.com',
    });
    expect(component.form.valid).toBe(false);
    expect(component.form.errors?.['atLeastOneRequired']).toBe(true);

    component.form.patchValue({ street: 'Wall St' });
    expect(component.form.valid).toBe(true);
  });

  it('should emit submitOrder when valid form is submitted', () => {
    jest.spyOn(component.submitOrder, 'emit');
    component.form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      country: 'USA',
      city: 'NY',
      phoneNumber: '123',
      email: 'john@doe.com',
      street: 'Wall St',
    });
    component.onSubmit();
    expect(component.submitOrder.emit).toHaveBeenCalled();
  });

  it('should load saved data from localStorage on init', () => {
    const savedData = { firstName: 'Jane', lastName: 'Smith' };
    localStorageMock.getItem.mockReturnValue(savedData);

    // We need to re-initialize or trigger ngOnInit
    component.ngOnInit();

    expect(component.form.value.firstName).toBe('Jane');
    expect(component.form.value.lastName).toBe('Smith');
  });

  it('should save data to localStorage on form changes', () => {
    component.form.patchValue({ firstName: 'Bob' });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('apply-form-data', expect.objectContaining({ firstName: 'Bob' }));
  });

  it('should remove data from localStorage on submit', () => {
    component.form.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      country: 'USA',
      city: 'NY',
      phoneNumber: '123',
      email: 'john@doe.com',
      street: 'Wall St',
    });
    component.onSubmit();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('apply-form-data');
  });

  it('should remove data from localStorage on cancel', () => {
    component.onCancel();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('apply-form-data');
  });

  it('should mark all as touched on invalid submit', () => {
    jest.spyOn(component.form, 'markAllAsTouched');
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });
});
