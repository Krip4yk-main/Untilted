import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Pipe({
    name: 'hasRequiredValidator',
})
export class HasRequiredValidatorPipe implements PipeTransform {

    transform(value: FormControl): boolean {
        return value.hasValidator(Validators.required);
    }

}
