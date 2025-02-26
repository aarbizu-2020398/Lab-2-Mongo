import Comentario from '../comentarios/comentarios.model.js';
import Publicacion from '../publicaciones/publicaciones.model.js';
import Categoria from '../categories/categorias.model.js';



export const existeComentarioById = async (id = '') => {
    const comentario = await Comentario.findById(id);
    if (!comentario) {
        throw new Error(`El comentario con el ID ${id} no existe`);
    }
};

export const existePublicacionById = async (id = '') => {
    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
        throw new Error(`La publicación con el ID ${id} no existe`);
    }
};

export const existeCategoriaById = async (id = '') => {
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        throw new Error(`La categoría con el ID ${id} no existe`);
    }
};
