import type { TNumString } from '../Core/utils.types.js';

export type TUserRole = 'Admin' | 'Dm' | 'User';

export interface IUser {
    id: number;
    telegramId: TNumString;
    username: string;
    displayName: string;
    role: TUserRole;
    registrationDate: string;
    avatar: string;
    deleted: boolean;
}

export interface IUserRaw {
    Id: number;
    TelegramId: TNumString;
    Username: string;
    DisplayName: string;
    Role: TUserRole;
    RegistrationDate: string;
    Avatar: string;
    deleted: boolean;
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
}

export interface ITelegramUser {
    id_token: string;
    user: ITelegramUserNested;
}
