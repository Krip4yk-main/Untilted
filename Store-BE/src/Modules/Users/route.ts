import { type Request, type Response, Router } from 'express';
import { usersController } from './controller.js';

const router = Router();

router.get('/', (req: Request, res: Response) => usersController.getUsers(req, res));
router.get('/:id', (req: Request, res: Response) => usersController.getUserById(req, res));
router.post('/tg', (req: Request, res: Response) => usersController.getUserByTgId(req, res));
router.post('/', (req: Request, res: Response) => usersController.createUser(req, res));
router.put('/:id', (req: Request, res: Response) => usersController.updateUser(req, res));
router.delete('/:id', (req: Request, res: Response) => usersController.deleteUser(req, res));

export default router;
