import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'camelToTitle',
})
export class CamelToTitlePipe implements PipeTransform {

    transform(value: string): string {
        let result = value.replaceAll(/([A-Z])/g, ' $1');
        result = result.charAt(0).toUpperCase() + result.slice(1);
        return result;
    }

}
