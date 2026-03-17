import { SafeResourceUrl } from '@angular/platform-browser';

export type TUserRole = 'Admin' | 'Dm' | 'User';

export interface IUser {
    id: number;
    telegramId: `${number}`;
    username: string;
    displayName: string;
    role: TUserRole;
    registrationDate: Date;
    avatar: string | SafeResourceUrl;
    deleted: boolean;
}

export interface IUserExt extends IUser {
    email: string;
    adminNotes: string[];
}

export interface ITelegramUserNested {
    aud: `${number}`;
    exp: number;
    iat: number;
    id: `${number}`;
    iss: string;
    name: string;
    picture: string;
    preferred_username: string;
    sub: `${number}`;
    phone_number?: `${number}`;
}

export interface ITelegramUser {
    id_token: string;
    user: ITelegramUserNested;
}
