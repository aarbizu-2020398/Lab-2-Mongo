import { Router } from 'express';
import { crearCategoria, obtenerCategorias, editarCategoria, eliminarCategoria } from '../categories/categorias.controller.js';

import { authMiddleware, isAdmin } from '../middlewares/auth.middlewares.js';  
import { validarCampos } from '../middlewares/validar-campos.js';  
import { check } from 'express-validator';  
import { existeCategoriaById } from '../helpers/db-validator.js';  

const router = Router();

router.get('/', authMiddleware, obtenerCategorias);

router.post(
    '/',
    authMiddleware, isAdmin,  
    [
        check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),  
        validarCampos  
    ],
    crearCategoria  
);

router.put('/:id', authMiddleware, isAdmin, editarCategoria);

router.delete('/:id', authMiddleware, isAdmin, eliminarCategoria);

export default router;
