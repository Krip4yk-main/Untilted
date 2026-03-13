export type TUserRole = 'Admin' | 'Dm' | 'User';

export interface IUser {
    id: number;
    telegramId: `${number}`;
    username: string;
    displayName: string;
    role: TUserRole;
    registrationDate: string;
    avatar: string;
    deleted: boolean;
}

export interface IUserRaw {
    Id: number;
    TelegramId: `${number}`;
    Username: string;
    DisplayName: string;
    Role: TUserRole;
    RegistrationDate: string;
    Avatar: string;
    deleted: boolean;
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
}

export interface ITelegramUser {
    id_token: string;
    user: ITelegramUserNested;
}
