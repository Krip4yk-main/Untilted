import { type Request, type Response, Router } from 'express';
import { usersController } from './controller.js';

const router = Router();

router.get('/', (req: Request, res: Response) => usersController.getUsers(req, res));

export default router;
