import { Router } from "express";
import { check } from "express-validator";
import { SavePet, getPets, searchPets, deletePet } from "./pet.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT, 
        check("email", "Este no es un correo válido").isEmail(), 
        check("email", "El correo electrónico es obligatorio").not().isEmpty(), 
        validarCampos 
    ],
    SavePet
);


router.get(
    "/",
    getPets
);

router.get(
    "/:id",
    [
        validarJWT, 
        check("id", "No es un ID válido").isMongoId(),
        validarCampos 
    ],
    searchPets
);


router.delete(
    "/:id",
    [
        validarJWT, 
        check("id", "No es un ID válido").isMongoId(), 
        validarCampos 
    ],
    deletePet
);

export default router;
