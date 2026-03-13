import { type Request, type Response, Router } from 'express';
import { goodsController } from './controller.js';

const router = Router();

router.get('/', (req: Request, res: Response) => goodsController.getGoods(req, res));

export default router;
