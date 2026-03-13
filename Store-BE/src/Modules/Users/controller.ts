import { type Request, type Response } from 'express';
import { usersService } from './service.js';
import type { ITelegramUser, IUser } from '../../Models/user.model.js';

export class UsersController {

    private static instance: UsersController;

    public static getInstance(): UsersController {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await usersService.getUsers();
            if (!users) {
                throw new Error('Failed to get users');
            }
            res.status(200)
                .json(users);
        } catch (err: any) {
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!id) {
                throw new Error('Invalid ID');
            }
            const user = await usersService.getUserById(id);
            if (!user) {
                res.status(404)
                    .json({ error: 'User not found' });
                return;
            }
            res.status(200)
                .json(user);
        } catch (err: any) {
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async getUserByTgId(req: Request, res: Response): Promise<void> {
        try {
            const tgUser: ITelegramUser = req.body;
            if (!tgUser?.id_token || !tgUser?.user?.id) {
                throw new Error('Invalid User Data');
            }
            let user: IUser | null = await usersService.getUserByTgId(tgUser.user.id);
            if (!user) {
                user = await usersService.createUser({
                    username: tgUser.user.preferred_username,
                    displayName: tgUser.user.name,
                    avatar: tgUser.user.picture,
                    telegramId: tgUser.user.id,
                    role: 'User',
                    registrationDate: new Date().toISOString(),
                });
                if (!user) {
                    throw new Error('Failed to create user');
                }
            } else {
                const a: Partial<IUser> = {
                    username: tgUser.user.preferred_username,
                    displayName: tgUser.user.name,
                    avatar: tgUser.user.picture,
                    telegramId: tgUser.user.id,
                };
                const b: Partial<IUser> = {
                    username: user.username,
                    displayName: user.displayName,
                    avatar: user.avatar,
                    telegramId: user.telegramId,
                };
                if (JSON.stringify(a) !== JSON.stringify(b)) {
                    const newUser = await usersService.updateUser(user.id, a);
                    if (!newUser) {
                        console.error('Failed to update user');
                    } else {
                        user = {
                            ...user,
                            ...a,
                        };
                    }
                }
            }

            res.status(200)
                .json(user);
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user: IUser = req.body;
            if (!user?.id) {
                throw new Error('User is required');
            }

            const result = await usersService.createUser(user);
            if (!result) {
                throw new Error('Failed to create user');
            }
            res.status(201)
                .json(result);
        } catch (err: any) {
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user: IUser = req.body;
            if (!user?.id) {
                throw new Error('User is required');
            }

            const result = await usersService.updateUser(user.id, user);
            if (!result) {
                res.status(404)
                    .json({ error: 'User not found' });
                return;
            }

            res.status(200)
                .json(result);
        } catch (err: any) {
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!id) {
                throw new Error('Invalid ID');
            }
            const deleted = await usersService.deleteUser(id);
            if (!deleted) {
                res.status(404)
                    .json({ error: 'User not found' });
                return;
            }

            res.status(204)
                .json(deleted);
        } catch (err: any) {
            res.status(500)
                .json({ error: err.message });
        }
    }

}

export const usersController = UsersController.getInstance();
