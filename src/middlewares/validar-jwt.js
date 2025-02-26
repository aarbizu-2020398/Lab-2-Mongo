<<<<<<< HEAD
import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
=======
import jwt from 'jsonwebtoken';
 
import Usuario from '../users/user.model.js';
 
export const validarJWT = async (req, res, next) => {
 
    const token = req.header("x-token");
 
    if(!token){
>>>>>>> 8cd83b1979552dd5fe30de6ed427bfbc6671f306
        return res.status(401).json({
            success: false,
            msg: "No hay token en la petición"
        });
    }
    try {
<<<<<<< HEAD
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        let usuario = await User.findById(id);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                msg: 'Usuario no existe en la base de datos'
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                success: false,
                msg: 'Token no válido - Usuario con estado inactivo'
            });
        }

        req.user = {
            id: usuario._id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            role: usuario.role
        };

        console.log("Usuario autenticado desde validarJWT:", req.user); 

=======
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
 
        const usuario = await Usuario.findById(uid);
 
        if(!usuario){
            return res.status(401).json({
                msg: "Usuario no existe en la base de datos"
            })
        }
 
        if(!usuario.estado){
            return res.status(401).json({
                msg: "Token no valido - Usuario con estado: false"
            })
        }
 
        req.usuario = usuario;
 
>>>>>>> 8cd83b1979552dd5fe30de6ed427bfbc6671f306
        next();
    } catch (error) {
        console.log("Error en validarJWT:", error);
        res.status(401).json({
            success: false,
            msg: "Token no válido"
        });
    }
};
