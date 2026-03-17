import { SafeResourceUrl } from '@angular/platform-browser';
import { TNumString } from '../services/utils.types';

export type TUserRole = 'Admin' | 'Manager' | 'Dm' | 'User';

export interface IUser {
    id: number;
    telegramId: TNumString;
    username: string;
    displayName: string;
    role: TUserRole;
    registrationDate: string;
    avatar: string | SafeResourceUrl;
    deleted: boolean;
}

export interface IUserExt extends IUser {
    email: string;
    adminNotes: string[];
}

export interface ITelegramUserNested {
    aud: TNumString;
    exp: number;
    iat: number;
    id: TNumString;
    iss: string;
    name: string;
    picture: string;
    preferred_username: string;
    sub: TNumString;
    phone_number?: TNumString;
}

export interface ITelegramUser {
    id_token: string;
    user: ITelegramUserNested;
}
