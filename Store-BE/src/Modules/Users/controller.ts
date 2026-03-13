import { type Request, type Response } from 'express';
import { usersService } from './service.js';
import type { User } from '../../Models/user.model.js';

export class UsersController {

    private static instance: UsersController;

    public static getInstance(): UsersController {
        if (!UsersController.instance) {
            UsersController.instance = new UsersController();
        }
        return UsersController.instance;
    }

    public getUsers(req: Request, res: Response): void {
        usersService.getUsers()
            .then((users: User[]) => {
                res.status(200)
                    .json(users);
            })
            .catch((err: Error) => {
                res.status(500)
                    .json({ error: err.message });
            });
    }

}

export const usersController = UsersController.getInstance();
