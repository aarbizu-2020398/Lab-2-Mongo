import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

export const validarJWT = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "No hay token en la petición"
        });
    }

    try {
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

        next();
    } catch (error) {
        console.log("Error en validarJWT:", error);
        res.status(401).json({
            success: false,
            msg: "Token no válido"
        });
    }
};
