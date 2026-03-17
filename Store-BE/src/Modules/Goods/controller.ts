import { type Request, type Response } from 'express';
import { goodsService } from './service.js';
import type { IGood } from '../../Models/good.model.js';
import type { TNumString } from '../../Core/utils.types.js';

export class GoodsController {

    private static instance: GoodsController;

    private constructor() {
        // intentionally empty
    }

    public static getInstance(): GoodsController {
        if (!GoodsController.instance) {
            GoodsController.instance = new GoodsController();
        }
        return GoodsController.instance;
    }

    public async getGoods(req: Request, res: Response): Promise<void> {
        try {
            const users = await goodsService.getGoods();
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

    public async getGoodById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!id) {
                throw new Error('Invalid ID');
            }
            const user = await goodsService.getGoodById(id);
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

    public async getGoodByUniqueId(req: Request, res: Response): Promise<void> {
        try {
            const uniqueId = req.body.uniqueId;
            if (!uniqueId) {
                throw new Error('Invalid Unique ID');
            }
            const user: IGood | null = await goodsService.getGoodByUniqueId(uniqueId);

            res.status(200)
                .json(user);
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async getGoodByUniqueCode(req: Request, res: Response): Promise<void> {
        try {
            const uniqueCode: TNumString = req.body.uniqueCode;
            if (!uniqueCode) {
                throw new Error('Invalid Unique Code');
            }
            const user: IGood | null = await goodsService.getGoodByUniqueCode(uniqueCode);

            res.status(200)
                .json(user);
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async createGood(req: Request, res: Response): Promise<void> {
        try {
            const user: IGood = req.body;
            if (!user?.id) {
                throw new Error('User is required');
            }

            const result = await goodsService.createGood(user);
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

    public async updateGood(req: Request, res: Response): Promise<void> {
        try {
            const user: IGood = req.body;
            if (!user?.id) {
                throw new Error('User is required');
            }

            const result = await goodsService.updateGood(user.id, user);
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

    public async deleteGood(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!id) {
                throw new Error('Invalid ID');
            }
            const deleted = await goodsService.deleteGood(id);
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

export const goodsController = GoodsController.getInstance();
