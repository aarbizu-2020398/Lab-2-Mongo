import { Router } from "express";
import { check } from "express-validator";
import { SaveAppointment, getAppointments, searchAppointment, deleteAppointment } from "./appointment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeCitaById } from "../helpers/db-validator.js"; // Asumiendo que existe una validación para cita
import { uploadProfileCites } from "../middlewares/multer-upload.js"; // Si hay subida de archivo de cita (como fotos, etc.)

const router = Router();

// Ruta para crear una nueva cita de adopción
router.post(
  "/",
  [
    validarJWT, // Verifica que el usuario esté autenticado
    check("email", "Este correo no es válido").isEmail(),
    check("phone", "El número de teléfono debe ser válido").isLength({ min: 8, max: 8 }), // Teléfono de 8 dígitos
    check("address", "La dirección es obligatoria").not().isEmpty(),
    check("petName", "El nombre de la mascota es obligatorio").not().isEmpty(),
    check("appointmentDate", "La fecha de la cita es obligatoria").isDate(),
    validarCampos, // Valida que los campos sean correctos
  ],
  SaveAppointment // Controlador para crear una cita de adopción
);

// Ruta para obtener todas las citas de adopción
router.get(
  "/",
  [
    validarJWT, // Verifica que el usuario esté autenticado
    validarCampos,
  ],
  getAppointments // Controlador para obtener las citas
);

// Ruta para obtener una cita por ID
router.get(
  "/:id",
  [
    validarJWT, // Verifica que el usuario esté autenticado
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCitaById), // Valida si la cita existe
    validarCampos, // Valida los campos
  ],
  searchAppointment // Controlador para buscar una cita específica
);

// Ruta para eliminar una cita por ID
router.delete(
  "/:id",
  [
    validarJWT, // Verifica que el usuario esté autenticado
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeCitaById), // Valida si la cita existe
    validarCampos, // Valida los campos
  ],
  deleteAppointment // Controlador para eliminar una cita
);

export default router;
