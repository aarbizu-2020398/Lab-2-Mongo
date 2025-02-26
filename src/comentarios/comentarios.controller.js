import Comentario from '../comentarios/comentarios.model.js';
import Publicacion from '../publicaciones/publicaciones.model.js';

export const crearComentario = async (req, res) => {
    try {
        console.log("Datos recibidos en la solicitud:", req.body); 
        console.log("Usuario autenticado:", req.user); 

        const { publicacionId, contenido } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado, token inválido o expirado',
            });
        }

        const usuarioId = req.user.id;

        const publicacion = await Publicacion.findById(publicacionId);
        if (!publicacion) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada',
            });
        }

        const nuevoComentario = new Comentario({
            contenido,
            autor: usuarioId,
            publicacion: publicacionId,
        });

        await nuevoComentario.save();

        res.status(201).json({
            success: true,
            message: 'Comentario creado exitosamente',
            nuevoComentario,
        });
    } catch (error) {
        console.error("Error en crearComentario:", error); 
        res.status(500).json({
            success: false,
            message: 'Error al crear comentario',
            error: error.message,
        });
    }
}

export const obtenerComentarios = async (req, res) => {
    try {
        const { publicacionId } = req.params;

        console.log("Obteniendo comentarios para la publicación:", publicacionId); // Para depuración

        // Validar si la publicación existe
        const publicacion = await Publicacion.findById(publicacionId);
        if (!publicacion) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada',
            });
        }

        // Buscar los comentarios de la publicación
        const comentarios = await Comentario.find({ publicacion: publicacionId })
            .populate('autor', 'nombre');

        res.status(200).json({
            success: true,
            comentarios,
        });
    } catch (error) {
        console.error("Error en obtenerComentarios:", error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener comentarios',
            error: error.message,
        });
    }
}


export const editarComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido } = req.body;

        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado',
            });
        }

        if (comentario.autor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para editar este comentario',
            });
        }

        comentario.contenido = contenido;
        await comentario.save();

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado',
            comentario,
        });
    } catch (error) {
        console.error("Error en editarComentario:", error);
        res.status(500).json({
            success: false,
            message: 'Error al editar comentario',
            error: error.message,
        });
    }
};


export const eliminarComentario = async (req, res) => {
    try {
        const { id } = req.params;

        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado',
            });
        }

        if (comentario.autor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este comentario',
            });
        }

        await comentario.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente',
        });
    } catch (error) {
        console.error("Error en eliminarComentario:", error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar comentario',
            error: error.message,
        });
    }
};
