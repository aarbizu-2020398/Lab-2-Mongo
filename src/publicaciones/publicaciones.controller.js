import { response, request } from "express";
import Publicacion from "../publicaciones/publicaciones.model.js";
import Comentario from "../comentarios/comentarios.model.js";


export const obtenerPublicaciones = async (req = request, res = response) => {
    try {
        const publicaciones = await Publicacion.find()
            .populate("categoria", "nombre descripcion")
            .populate("comentarios", "contenido autor fecha");

        res.status(200).json({ success: true, publicaciones });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al obtener publicaciones", error });
    }
};


export const obtenerPublicacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const publicacion = await Publicacion.findById(id)
            .populate("categoria", "nombre descripcion")
            .populate("comentarios", "contenido autor fecha");

        if (!publicacion) {
            return res.status(404).json({ success: false, msg: "Publicación no encontrada" });
        }

        res.status(200).json({ success: true, publicacion });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al obtener la publicación", error });
    }
};


export const crearPublicacion = async (req, res) => {
    try {
        const { titulo, contenido, categoria } = req.body;

        const publicacion = new Publicacion({ titulo, contenido, categoria });

        await publicacion.save();

        res.status(201).json({ success: true, msg: "Publicación creada exitosamente", publicacion });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al crear la publicación", error });
    }
};


import mongoose from "mongoose";

export const editarPublicacion = async (req, res) => {
    try {
        let { id } = req.params;
        const { titulo, contenido, categoria } = req.body;

        id = id.trim();

        console.log("ID de publicación recibido:", `"${id}"`); 

        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: "ID de publicación no válido" });
        }

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({ success: false, msg: "Publicación no encontrada" });
        }

        // ✅ Validar y actualizar los campos
        if (titulo) publicacion.titulo = titulo;
        if (contenido) publicacion.contenido = contenido;
        if (categoria && mongoose.Types.ObjectId.isValid(categoria)) {
            publicacion.categoria = categoria;
        } else {
            return res.status(400).json({ success: false, msg: "ID de categoría no válido" });
        }

        await publicacion.save();

        res.status(200).json({ success: true, msg: "Publicación actualizada", publicacion });
    } catch (error) {
        console.error("Error en editarPublicacion:", error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la publicación",
            error: error.message
        });
    }
};



export const eliminarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const publicacion = await Publicacion.findByIdAndDelete(id);

        if (!publicacion) {
            return res.status(404).json({ success: false, msg: "Publicación no encontrada" });
        }

        await Comentario.deleteMany({ publicacion: id });

        res.status(200).json({ success: true, msg: "Publicación eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Error al eliminar la publicación", error });
    }
};
