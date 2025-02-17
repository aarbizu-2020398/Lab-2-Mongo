import { Router } from "express";
import { check } from "express-validator";
import { SaveAppointment, getAppointments, searchAppointment, deleteAppointment } from "./appointment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeCitaById } from "../helpers/db-validator.js"; 
import { uploadProfileCites } from "../middlewares/multer-upload.js"; 

const router = Router();


router.post(
  "/",
  [
    validarJWT, 
    check("email", "Este correo no es válido").isEmail(),
    check("phone", "El número de teléfono debe ser válido").isLength({ min: 8, max: 8 }), 
    check("address", "La dirección es obligatoria").not().isEmpty(),
    check("petName", "El nombre de la mascota es obligatorio").not().isEmpty(),
    check("appointmentDate", "La fecha de la cita es obligatoria").isDate(),
    validarCampos, 
  ],
  SaveAppointment 
);

// Ruta para obtener todas las citas de adopción
router.get(
  "/",
  [
    validarJWT, 
    validarCampos,
  ],
  getAppointments 
);

// Ruta para obtener una cita por ID
router.get(
  "/:id",
  [
    validarJWT, 
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCitaById), 
    validarCampos, 
  ],
  searchAppointment 
);

// Ruta para eliminar una cita por ID
router.delete(
  "/:id",
  [
    validarJWT, 
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCitaById), 
    validarCampos, 
  ],
  deleteAppointment 
);

export default router;
