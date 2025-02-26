import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ success: false, msg: 'No hay token en la petición' });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);

        if (!user || !user.estado) {
            return res.status(401).json({ success: false, msg: 'Token no válido - Usuario no encontrado' });
        }

        req.user = {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: 'Token no válido' });
    }
};

export const isAdmin = (req, res, next) => {
    console.log("Usuario autenticado en isAdmin:", req.user);

    if (!req.user) {
        return res.status(401).json({ success: false, msg: 'No autenticado' });
    }

    if (!req.user.role || req.user.role !== "ADMIN_ROLE") {  
        return res.status(403).json({ success: false, msg: 'Acceso denegado - Se requiere rol de ADMIN' });
    }

    next();
};
