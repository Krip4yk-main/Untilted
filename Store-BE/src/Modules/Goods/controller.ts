import { type Request, type Response } from 'express';
import { goodsService } from './service.js';
import type { IGood } from '../../Models/good.model.js';
import type { TNumString } from '../../Core/utils.types.js';
import { historyService } from './historyService.js';
import moment from 'moment';
import { authService } from '../../Core/auth.service.js';

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
            const result = await goodsService.getGoods();
            if (!result) {
                throw new Error('Failed to get goods');
            }
            res.status(200)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
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
            const result = await goodsService.getGoodById(id);
            if (!result) {
                res.status(404)
                    .json({ error: 'User not found' });
                return;
            }
            res.status(200)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
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
            const result: IGood | null = await goodsService.getGoodByUniqueId(uniqueId);

            res.status(200)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            const result: IGood | null = await goodsService.getGoodByUniqueCode(uniqueCode);

            res.status(200)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async createGood(req: Request, res: Response): Promise<void> {
        try {
            const data: Partial<IGood> = req.body;
            if (!data?.id) {
                throw new Error('User is required');
            }

            const result = await goodsService.createGood(data);
            if (!result) {
                throw new Error('Failed to create good');
            }
            const history = await historyService.createHistory({
                goodId: result.id,
                price: result.sellPrice,
                createdAt: moment().toISOString(),
                createdBy: authService.loggedUserData!.preferred_username,
                deleted: false,
            });

            if (!history) {
                await goodsService.deleteGood(result.id);
                throw new Error('Failed to create history. Good deleted');
            } else {
                result.priceHistory = [history];
            }

            res.status(201)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async createGoodBundle(req: Request, res: Response): Promise<void> {
        try {
            const data: Partial<IGood>[] = req.body;
            if (!data?.length) {
                throw new Error('User array is required');
            }
            const result: IGood[] = [];

            const createGood = async(item: Partial<IGood>) => {
                const newGood: IGood | null = await goodsService.createGood(item);
                if (!newGood) {
                    console.error('Failed to create good');
                    return;
                }
                const history = await historyService.createHistory({
                    goodId: newGood.id,
                    price: newGood.sellPrice,
                    createdAt: moment().toISOString(),
                    createdBy: authService.loggedUserData!.preferred_username,
                    deleted: false,
                });

                if (!history) {
                    await goodsService.deleteGood(newGood.id);
                    throw new Error('Failed to create history. Good deleted');
                }
                newGood.priceHistory = [history];

                result.push(newGood);
            };

            const promises = data.map(createGood);
            await Promise.all(promises)
                .catch(console.error);

            if (!result.length) {
                throw new Error('Failed to create good');
            }

            res.status(201)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async updateGood(req: Request, res: Response): Promise<void> {
        try {
            const data: Partial<IGood> = req.body;
            if (!data) {
                throw new Error('User is required');
            }
            if (!data.id) {
                throw new Error('User ID is required');
            }

            const result = await goodsService.updateGood(data.id, data);
            if (!result) {
                res.status(404)
                    .json({ error: 'User not found' });
                return;
            }

            res.status(200)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

    public async updateGoodBundle(req: Request, res: Response): Promise<void> {
        try {
            const data: Partial<IGood>[] = req.body;
            if (!data?.length || !data.every((item: Partial<IGood>) => !!item.id)) {
                throw new Error('User is required');
            }

            const result: [][] = [];

            const updateGood = async(item: Partial<IGood>) => {
                const updated: [] | null = await goodsService.updateGood(item.id!, item);
                if (!updated) {
                    console.error('Failed to update good');
                    return;
                }
                result.push(updated);
            };

            const promises = data.map(updateGood);
            await Promise.all(promises)
                .catch(console.error);

            if (!result.length) {
                throw new Error('Failed to create goods');
            }

            res.status(201)
                .json(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.trace(err);
            res.status(500)
                .json({ error: err.message });
        }
    }

}

export const goodsController = GoodsController.getInstance();
