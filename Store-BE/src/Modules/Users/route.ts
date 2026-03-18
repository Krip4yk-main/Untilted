import { Router } from 'express';
import { usersController } from './controller.js';

const router = Router();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.post('/tg', usersController.getUserByTgId);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

export default router;
