import { body } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existePublicacionById, existeCategoriaById } from "../helpers/db-validator.js";


export const loginValidator = [
    body("email", "El correo es obligatorio").isEmail(),  
    body("password", "La contraseña es obligatoria").not().isEmpty(),  
    validarCampos  
];

export const registerValidator = [
    body("nombre", "El nombre es obligatorio").not().isEmpty(),  
    body("email", "El correo debe ser válido").isEmail(),  
    body("password", "La contraseña debe tener mínimo 6 caracteres").isLength({ min: 6 }),  
    validarCampos  
];


export const crearPublicacionValidator = [
    body("titulo", "El título es obligatorio").not().isEmpty(),  
    body("contenido", "El contenido es obligatorio").not().isEmpty(),  
    body("categoria", "Debe ingresar una categoría válida").isMongoId().custom(existeCategoriaById),  
    validarCampos  
];


export const crearComentarioValidator = [
    body("contenido", "El contenido del comentario es obligatorio").not().isEmpty(),  
    body("publicacion", "El ID de la publicación no es válido").isMongoId().custom(existePublicacionById),  
    validarCampos 
];


export const crearCategoriaValidator = [
    body("nombre", "El nombre de la categoría es obligatorio").not().isEmpty(),  
    body("descripcion", "La descripción es obligatoria").not().isEmpty(),  
    validarCampos 
];
