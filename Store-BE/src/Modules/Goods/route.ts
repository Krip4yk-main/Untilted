import { Router } from 'express';
import { goodsController } from './controller.js';

const router = Router();

router.get('/', (req, res) => goodsController.getGoods(req, res));

export default router;
