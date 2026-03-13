import type { IUser, IUserRaw } from '../../Models/user.model.js';
import { AzureDB } from '../../Configurations/database.js';
import type { TDBTable } from '../../Configurations/database.types.js';

export class UsersService {

    TABLE_NAME: TDBTable = 'Users';

    public async getUsers(): Promise<IUser[]> {
        return this.convertRawUsers((await AzureDB.readAll(this.TABLE_NAME)) as IUserRaw[]);
    }

    public async getUserById(id: number): Promise<IUser> {
        return this.convertRawUser((await AzureDB.readByKey(this.TABLE_NAME, id, 'Id'))[0] as IUserRaw);
    }

    public async getUserByTgId(id: `${number}`): Promise<IUser> {
        return this.convertRawUser((await AzureDB.readByKey(this.TABLE_NAME, id, 'TelegramId'))[0] as IUserRaw);
    }

    public async createUser(user: IUser): Promise<IUser | null> {
        const res: unknown[] | null = await AzureDB.insert(this.TABLE_NAME, user);
        if (!res) {
            return res;
        }
        return this.convertRawUser(res[0] as IUserRaw);
    }

    public async updateUser(id: number, user: Partial<IUser>): Promise<IUser | null> {
        const existingUser = await this.getUserById(id);
        if (!existingUser) {
            return null;
        }
        const res: unknown[] | null = await AzureDB.updateByID(this.TABLE_NAME, id, user);
        if (!res) {
            return res;
        }
        return this.convertRawUser(res[0] as IUserRaw);
    }

    public async deleteUser(id: number): Promise<IUser | null> {
        const existingUser = await this.getUserById(id);
        if (!existingUser) {
            return null;
        }
        const res: unknown[] | null = await AzureDB.softDeleteByID(this.TABLE_NAME, id);
        if (!res) {
            return res;
        }
        return this.convertRawUser(res[0] as IUserRaw);
    }

    convertRawUser(data: IUserRaw): IUser {
        return {
            id: data.Id,
            telegramId: data.TelegramId,
            username: data.Username,
            displayName: data.DisplayName,
            role: data.Role,
            registrationDate: data.RegistrationDate,
            avatar: data.Avatar,
            deleted: data.deleted,
        };
    }

    convertRawUsers(data: IUserRaw[]): IUser[] {
        return data.map(this.convertRawUser);
    }

}

export const usersService = new UsersService();
