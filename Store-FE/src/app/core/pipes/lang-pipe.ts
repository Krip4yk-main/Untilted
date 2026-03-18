import { Pipe, PipeTransform } from '@angular/core';
import { lang } from '../../../assets/languages/languages.service';
import { ILanguage } from '../../../assets/languages/language.model';

@Pipe({
    name: 'lang',
    standalone: true,
})
export class LangPipe implements PipeTransform {

    transform(value: string, group: keyof ILanguage): string {
        const lan: ILanguage = lang();
        if (!lan[group]?.[value as keyof ILanguage[keyof ILanguage]]) {
            console.error(`[LangPipe] ${value} not found in ${group}`);
            return '[ERROR]';
        }

        return lan[group][value as keyof ILanguage[keyof ILanguage]];
    }

}
