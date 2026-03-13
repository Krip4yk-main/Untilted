import { type Request, type Response, Router } from 'express';
import goodsRouter from './Modules/Goods/route.js';
import usersRouter from './Modules/Users/route.js';
import { authGuard } from './Core/auth.guard.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Store-BE is running with modular architecture');
});

// Register module routes
router.use('/goods', goodsRouter);
router.use('/users', authGuard, usersRouter);

export default router;
