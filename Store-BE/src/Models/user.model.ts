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
