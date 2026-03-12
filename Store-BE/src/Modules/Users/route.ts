import { Router } from 'express';
import { usersController } from './controller.js';

const router = Router();

router.get('/', (req, res) => usersController.getUsers(req, res));

export default router;
