import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../auth/auth.model.js';  


export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

       
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
        }

       
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

       
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordHash,
            rol: rol || 'USER_ROLE',  
        });

        await nuevoUsuario.save();

        res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};


export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }


        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }


        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '15d' }  
        );
        

        res.json({ success: true, token, message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Editar perfil
export const editarPerfil = async (req, res) => {
    try {
        const { nombre, password, nuevaPassword } = req.body;
        const usuarioId = req.usuario.id;  

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (nuevaPassword) {
            const passwordValido = await bcrypt.compare(password, usuario.password);
            if (!passwordValido) {
                return res.status(400).json({ success: false, message: 'La contraseña actual es incorrecta' });
            }

            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(nuevaPassword, salt);
        }

        if (nombre) {
            usuario.nombre = nombre;
        }

        await usuario.save();

        res.json({ success: true, message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};


export const eliminarPerfil = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;  
        const usuarioEliminado = await Usuario.findByIdAndDelete(usuarioId);

        if (!usuarioEliminado) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, message: 'Perfil eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el perfil:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};


export const getUsers = async (req, res) => {
    try {
    
        const usuarios = await Usuario.find({}, { password: 0 }); 
        res.status(200).json({ success: true, message: 'Lista de usuarios', usuarios });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};