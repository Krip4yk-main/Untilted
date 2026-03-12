import { type Request, type Response } from 'express';
import { goodsService } from './service.js';

export class GoodsController {
  private static instance: GoodsController;

  private constructor() {}

  public static getInstance(): GoodsController {
    if (!GoodsController.instance) {
      GoodsController.instance = new GoodsController();
    }
    return GoodsController.instance;
  }

  public getGoods(req: Request, res: Response): void {
    goodsService.getGoods().subscribe({
      next: (goods) => res.json(goods),
      error: (err) => res.status(500).json({ error: err.message })
    });
  }
}

export const goodsController = GoodsController.getInstance();
