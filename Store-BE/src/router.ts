import { type Request, type Response, Router } from 'express';
import goodsRouter from './Modules/Goods/route.js';
import usersRouter from './Modules/Users/route.js';
import { authGuard } from './Core/auth.guard.js';
import { authService } from './Core/auth.service.js';
import type { ITelegramUser } from './Models/user.model.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Store-BE is running with modular architecture');
});

router.post('/token', async(req: Request, res: Response) => {
    const tgUser: ITelegramUser = req.body;
    if (!tgUser?.id_token || !tgUser?.user?.id) {
        throw new Error('Invalid User Data');
    }
    const newToken = await authService.verify(tgUser);

    if (!newToken) {
        res.status(401)
            .json({ error: 'Invalid token' });
    }

    res.status(200)
        .json(newToken);
});

// Register module routes
router.use('/goods', goodsRouter);
router.use('/users', authGuard, usersRouter);

export default router;
