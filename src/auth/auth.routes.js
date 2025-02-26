import { Router } from 'express';
import { getAll, editarPerfil, eliminarPerfil, login, register } from '../users/user.controller.js'; 
import { authMiddleware, isAdmin } from '../middlewares/auth.middlewares.js'; 
import { registerValidator, loginValidator } from '../middlewares/validator.js'; 

const router = Router();

router.get('/', authMiddleware, isAdmin, getAll);


router.post('/login', loginValidator, login);


router.post(
    '/register',
    registerValidator,
    register 
);


router.put(
    '/:id',
    authMiddleware, 
    editarPerfil 
);


router.delete('/:id', authMiddleware, eliminarPerfil);

export default router;