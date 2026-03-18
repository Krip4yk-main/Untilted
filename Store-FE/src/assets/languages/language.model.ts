import { uaLanguage } from './models/ua.language';
import { TUserRole } from '../../app/core/models/user.model';
import { IGood, IPriceHistoryRecord, TGoodType, TStorageType } from '../../app/core/models/good.model';
import { TAdminTab } from '../../app/features/admin/admin.component';
import { TTab } from '../../app/shared/components/header/header.component';

export type TAvailableLanguage = 'ua';
export type EAvailableLanguage = `${TAvailableLanguage}Language`;
export const LanguagesList: Record<EAvailableLanguage, ILanguage> = {
    uaLanguage,
};

export interface ILanguage {
    userRole: Record<TUserRole, string>;
    good: Record<keyof IGood, string>;
    goodType: Record<TGoodType, string>;
    storageType: Record<TStorageType, string>;
    priceHistory: Record<keyof IPriceHistoryRecord, string>;
    adminTab: Record<TAdminTab, string>;
    headerTab: Record<TTab, string>;
    misc: {
        logout: string;
        profit: string;
        actions: string;
        addGood: string;
        modifyPrices: string;
        addItem: string;
        editItem: string;
        viewItem: string;
        save: string;
        cancel: string;
    }
}
