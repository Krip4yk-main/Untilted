export type UserRole = 'client' | 'manager' | 'admin';

export interface User {
    id: string;
    name: string;
    isBlocked: boolean;
    role: UserRole;
    adminNotes?: string;
    email: string;
    phone?: string;
    token?: string;
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
}

export interface TelegramUser {
    id_token: number;
    user: TelegramUserNested;
}

export interface UserTg {
    code: string;
    state: string;
}
