import { Pipe, PipeTransform } from '@angular/core';
import { ILanguage } from '../../../assets/languages/language.model';
import { sLang } from '../../../assets/languages/languages.service';

@Pipe({
    name: 'lang',
    standalone: true,
})
export class LangPipe implements PipeTransform {

    transform<K1 extends keyof ILanguage, K2 extends keyof ILanguage[K1]>(
        value: K2 | string,
        group: K1,
    ): string {
        const lan: ILanguage = sLang();
        if (!lan[group]?.[value as keyof ILanguage[keyof ILanguage]]) {
            console.error(`[LangPipe] ${String(value)} not found in ${group}`);
            return '[ERROR]';
        }

        return lan[group][value as keyof ILanguage[keyof ILanguage]];
    }

}
