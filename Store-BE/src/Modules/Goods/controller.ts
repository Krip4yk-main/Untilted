import { type Request, type Response } from 'express';
import { goodsService } from './service.js';
import type { Good } from '../../Models/good.model.js';

export class GoodsController {

    private static instance: GoodsController;

    public static getInstance(): GoodsController {
        if (!GoodsController.instance) {
            GoodsController.instance = new GoodsController();
        }
        return GoodsController.instance;
    }

    public getGoods(req: Request, res: Response): void {
        goodsService.getGoods()
            .then((goods: Good[]) => {
                res.status(200)
                    .json(goods);
            })
            .catch((err: Error) => {
                res.status(500)
                    .json({ error: err.message });
            });
    }

}

export const goodsController = GoodsController.getInstance();
