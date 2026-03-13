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
            if (user) {
                res.status(200)
                    .json(user);
            } else {
                res.status(404)
                    .json({ error: 'User not found' });
            }
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
            const user = await usersService.getUserByTgId(tgUser.user.id);
            if (user) {
                res.status(200)
                    .json(user);
            } else {
                res.status(404)
                    .json({ error: 'User not found' });
            }
        } catch (err: any) {
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
            if (result) {
                res.status(200)
                    .json(result);
            } else {
                res.status(404)
                    .json({ error: 'User not found' });
            }
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
            if (deleted) {
                res.status(204)
                    .json();
            } else {
                res.status(404)
                    .json({ error: 'User not found' });
            }
        } catch (err: any) {
            res.status(500)
                .json({ error: err.message });
        }
    }

}

export const usersController = UsersController.getInstance();
