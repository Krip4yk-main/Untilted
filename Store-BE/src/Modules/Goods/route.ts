import { Router } from 'express';
import { goodsController } from './controller.js';
import { authGuard } from '../../Core/auth.guard.js';

const router = Router();

router.get('/', goodsController.getGoods);
router.get('/:id', goodsController.getGoodById);
router.post('/id', goodsController.getGoodByUniqueId);
router.post('/code', goodsController.getGoodByUniqueCode);
router.post('/bundle', authGuard, goodsController.createGoodBundle);
router.post('/', authGuard, goodsController.createGood);
router.put('/bundle', authGuard, goodsController.updateGoodBundle);
router.put('/:id', authGuard, goodsController.updateGood);
router.delete('/:id', authGuard, goodsController.deleteGood);

export default router;

