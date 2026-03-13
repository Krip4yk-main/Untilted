export type TUserRole = 'Admin' | 'Dm' | 'User';

export interface IUser {
    id: number;
    telegramId: `${number}`;
    username: string;
    displayName: string;
    role: TUserRole;
    registrationDate: Date;
    avatar: string;
    deleted: boolean;
}

export interface IUserExt extends IUser {
    email: string;
    adminNotes: string[];
}

export interface TelegramUserNested {
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

export interface TelegramUser {
    id_token: number;
    user: TelegramUserNested;
}
