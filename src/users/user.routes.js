<<<<<<< HEAD
import express from 'express';
import {register,login,getProfile,updateProfile,changePassword} from '../users/user.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
=======
import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";
>>>>>>> 8cd83b1979552dd5fe30de6ed427bfbc6671f306

const router = express.Router();


<<<<<<< HEAD
router.post('/register', register);
router.post('/login', login);


router.get('/', authMiddleware, getProfile);
router.put('/:id', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);



export default router;
=======

router.get("/", getUsers);


router.get(
    "/findUser/:id",
    [
      
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);


router.put(
    "/:id",
    uploadProfilePicture.single("profilePicture"), 
    [
        
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);


router.delete(
    "/:id",
    [

        validarJWT,
        

        tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
        
        
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
);

export default router;
>>>>>>> 8cd83b1979552dd5fe30de6ed427bfbc6671f306
