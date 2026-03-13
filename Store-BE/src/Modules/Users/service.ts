import type { User } from '../../Models/user.model.js';
import type { TPromisableLikeFunc } from '../../Core/utils.types.js';

export class UsersService {

    public getUsers(): Promise<User[]> {
        const mockUsers: User[] = [
            {
                id: '1',
                name: 'Admin User',
                isBlocked: false,
                role: 'admin',
                email: 'admin@example.com',
            },
            {
                id: '2',
                name: 'Regular Client',
                isBlocked: false,
                role: 'client',
                email: 'client@example.com',
            },
        ];
        return new Promise((resolve: TPromisableLikeFunc<User[]>) => {
            setTimeout(() => resolve(mockUsers), 1000);
        });
    }

}

export const usersService = new UsersService();
