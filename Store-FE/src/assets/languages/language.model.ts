import { uaLanguage } from './models/ua.language';
import { TUserRole } from '../../app/core/models/user.model';
import { IGood, IPriceHistoryRecord, TGoodType, TStorageType } from '../../app/core/models/good.model';
import { TAdminTab } from '../../app/features/admin/admin.component';
import { TTab } from '../../app/shared/components/header/header.component';
import { NotificationSeverity } from '../../app/core/services/notification.service';

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
    notifSeverity: Record<NotificationSeverity, string>;
    misc: {
        logout: string;
        profit: string;
        actions: string;
        addGood: string;
        importGoods: string;
        modifyPrices: string;
        addItem: string;
        editItem: string;
        viewItem: string;
        save: string;
        cancel: string;
        close: string;
        apply: string;
        multiplier: string;
        priceModifier: string;
        priceModifierDesc: string;
        confirmPriceModifier: string;
    };
    success: Record<TSuccess, string>;
    errors: Record<TError, string>;
}

export type TSuccessError = 'good_1' |
    'good_2' |
    'good_3' |
    `good_6`;

export type TSuccess = TSuccessError |
    'good_4' |
    'good_5';

export type TError =
    'unauthorized' |
    TSuccessError |
    'good_file_1' |
    'good_file_2' |
    'good_file_3' |
    'good_file_4' |
    'good_file_5' |
    'good_file_6' |
    'good_file_7' |
    'good_file_8';
