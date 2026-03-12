import { of, Observable } from 'rxjs';
import type { User } from '../../Models/user.model.js';

export class UsersService {
  public getUsers(): Observable<User[]> {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Admin User',
        isBlocked: false,
        role: 'admin',
        email: 'admin@example.com'
      },
      {
        id: '2',
        name: 'Regular Client',
        isBlocked: false,
        role: 'client',
        email: 'client@example.com'
      }
    ];
    return of(mockUsers);
  }
}

export const usersService = new UsersService();
