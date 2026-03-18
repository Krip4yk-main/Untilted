import { computed, Signal, signal, WritableSignal } from '@angular/core';
import { EAvailableLanguage, ILanguage, LanguagesList } from './language.model';

class LanguagesService {

    private static instance: LanguagesService;

    private readonly _selectedLang: WritableSignal<EAvailableLanguage> = signal('uaLanguage');
    readonly selectedLang: Signal<EAvailableLanguage> = this._selectedLang.asReadonly();
    readonly lang: Signal<ILanguage> = computed(() => LanguagesList[this.selectedLang()]);

    public static getInstance(): LanguagesService {
        if (!LanguagesService.instance) {
            LanguagesService.instance = new LanguagesService();
        }
        return LanguagesService.instance;
    }

    public changeLang(lang: EAvailableLanguage): void {
        this._selectedLang.set(lang);
    }

}

export const langServiceInstance = LanguagesService.getInstance();
export const lang = langServiceInstance.lang;
