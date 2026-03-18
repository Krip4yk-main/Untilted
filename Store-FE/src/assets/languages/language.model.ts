import { uaLanguage } from './models/ua.language';
import { TUserRole } from '../../app/core/models/user.model';
import { IGood, TStorageType } from '../../app/core/models/good.model';
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
    adminTab: Record<TAdminTab, string>;
    storageType: Record<TStorageType, string>;
    headerTab: Record<TTab, string>;
    misc: {
        logout: string;
        profit: string;
    }
}
