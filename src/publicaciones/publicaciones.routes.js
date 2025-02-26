import { Router } from 'express';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { crearPublicacion, obtenerPublicaciones, obtenerPublicacionPorId, editarPublicacion, eliminarPublicacion } from '../publicaciones/publicaciones.controller.js';

const router = Router();


router.get('/', validarJWT, obtenerPublicaciones);


router.get('/findPublicacion', validarJWT, obtenerPublicacionPorId);


router.post(
    '/register',
    [
        validarJWT,
        check('titulo', 'El título es obligatorio').not().isEmpty(),
        check('contenido', 'El contenido es obligatorio').not().isEmpty(),
        check('categoria', 'Debe ser un ID de Mongo válido').isMongoId(),
        validarCampos
    ],
    crearPublicacion
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        validarCampos
    ],
    editarPublicacion
);


router.delete('/:id', validarJWT, eliminarPublicacion);

export default router;

