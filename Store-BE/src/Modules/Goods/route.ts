import { type Request, type Response, Router } from 'express';
import { goodsController } from './controller.js';

const router = Router();

router.get('/', (req: Request, res: Response) => goodsController.getGoods(req, res));

router.get('/', (req: Request, res: Response) => goodsController.getGoods(req, res));
router.get('/:id', (req: Request, res: Response) => goodsController.getGoodById(req, res));
router.post('/id', (req: Request, res: Response) => goodsController.getGoodByUniqueId(req, res));
router.post('/code', (req: Request, res: Response) => goodsController.getGoodByUniqueCode(req, res));
router.post('/', (req: Request, res: Response) => goodsController.createGood(req, res));
router.put('/:id', (req: Request, res: Response) => goodsController.updateGood(req, res));
router.delete('/:id', (req: Request, res: Response) => goodsController.deleteGood(req, res));

export default router;

