import { Router } from 'express';
import { check } from 'express-validator';
import { crearComentario, obtenerComentarios, editarComentario, eliminarComentario} from '../comentarios/comentarios.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { existePublicacionById, existeComentarioById } from '../helpers/db-validator.js';

const router = Router();

router.get(
    '/publicacion/:publicacionId',  
    [
        validarJWT,
        check('publicacionId', 'No es un ID válido').isMongoId(),
        check('publicacionId').custom(existePublicacionById),
        validarCampos
    ],
    obtenerComentarios
);

router.post(
    '/',
    [
        validarJWT,
        check('publicacionId', 'No es un ID válido').isMongoId(),
        check('contenido', 'El contenido del comentario es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearComentario
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeComentarioById),
        check('contenido', 'El contenido del comentario es obligatorio').not().isEmpty(),
        validarCampos
    ],
    editarComentario
);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeComentarioById),
        validarCampos
    ],
    eliminarComentario
);

export default router;
