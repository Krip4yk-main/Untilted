import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safeResourseUrl',
})
export class SafeResourseUrlPipe implements PipeTransform {

    private readonly sanitizer: DomSanitizer = inject(DomSanitizer);

    transform(value: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }

}
