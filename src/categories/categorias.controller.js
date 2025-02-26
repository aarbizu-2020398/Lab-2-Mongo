

import Categoria from '../categories/categorias.model.js';

export const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const categoriaExistente = await Categoria.findOne({ nombre });
        if (categoriaExistente) {
            return res.status(400).json({ message: 'La categoría ya existe' });
        }

        const nuevaCategoria = new Categoria({ nombre, descripcion });
        await nuevaCategoria.save();

        res.status(201).json({ message: 'Categoría creada exitosamente', categoria: nuevaCategoria });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear categoría', error });
    }
};


export const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.status(200).json({ categorias });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error });
    }
};

export const editarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const categoria = await Categoria.findByIdAndUpdate(id, { nombre, descripcion }, { new: true });

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría actualizada', categoria });
    } catch (error) {
        res.status(500).json({ message: 'Error al editar categoría', error });
    }
};

export const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findByIdAndDelete(id);

        if (!categoria) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar categoría', error });
    }
};
