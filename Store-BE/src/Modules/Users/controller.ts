import { type Request, type Response } from 'express';
import { usersService } from './service.js';

export class UsersController {
  private static instance: UsersController;

  private constructor() {}

  public static getInstance(): UsersController {
    if (!UsersController.instance) {
      UsersController.instance = new UsersController();
    }
    return UsersController.instance;
  }

  public getUsers(req: Request, res: Response): void {
    usersService.getUsers().subscribe({
      next: (users) => res.json(users),
      error: (err) => res.status(500).json({ error: err.message })
    });
  }
}

export const usersController = UsersController.getInstance();
