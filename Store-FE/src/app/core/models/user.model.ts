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

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface UserTg {
  code: string;
  state: string;
}
