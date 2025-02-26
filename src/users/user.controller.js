<<<<<<< HEAD
import User from '../users/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { nombre, email, password, role = 'USER_ROLE' } = req.body; 

        if (role === 'ADMIN_ROLE') {
            const existingAdmin = await User.findOne({ role: 'ADMIN_ROLE' });
            if (existingAdmin) {
                return res.status(400).json({ message: 'No se puede crear otro administrador.' });
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ nombre, email, password: hashedPassword, role });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};


export const getAll = async (req, res) => {
    try {
        
        const { limit = 20, skip = 0 } = req.query;
        const users = await User.find()
            .skip(Number(skip))
            .limit(Number(limit))
            .select('-password'); 

        if (users.length === 0) {
            return res.status(404).send({
                message: 'Users not found',
                success: false
            });
        }

        return res.send({
            success: true,
            message: 'Users found',
            users,
            total: users.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'General error',
            err
        });
    }
};

export const editarPerfil = async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const userId = req.user.id; 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { nombre, email },
            { new: true }
        ).select('-password'); 

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const eliminarPerfil = async (req, res) => {
    try {
        const userId = req.user.id; 

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const createDefaultUsers = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'ADMIN_ROLE' });
        if (existingAdmin) {
            console.log('Ya existe un administrador. No se puede crear otro.');
            return; 
        }

        const defaultAdmin = {
            nombre: 'Admin',
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 10), 
            role: 'ADMIN_ROLE' 
        };

        const admin = new User(defaultAdmin);
        await admin.save();
        console.log('Administrador por defecto creado:', admin);
    } catch (error) {
        console.error('Error al crear usuarios por defecto:', error.message);
    }
};
=======
import { response, request } from "express";
import { hash, verify } from "argon2";
import User from './user.model.js';

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuario',
            error
        });
    }
};

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, email, ...data } = req.body;

        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id !== id) {
                return res.status(400).json({
                    success: false,
                    msg: 'El correo electrónico ya está en uso por otro usuario.'
                });
            }
        }

        if (password) {
            data.password = await hash(password);
        }

       
        const user = await User.findByIdAndUpdate(id, data, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado exitosamente",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
        const authenticatedUser = req.user;

        res.status(200).json({
            success: true,
            msg: 'Usuario desactivado',
            user,
            authenticatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar usuario',
            error
        });
    }
};
>>>>>>> 8cd83b1979552dd5fe30de6ed427bfbc6671f306
