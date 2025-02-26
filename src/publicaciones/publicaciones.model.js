import { Schema, model } from "mongoose";

const PostSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "El título de la publicación es obligatorio"],
        maxLength: [100, "El título no puede superar los 100 caracteres"]
    },
    contenido: {
        type: String,
        required: [true, "El contenido de la publicación es obligatorio"],
        maxLength: [1000, "El contenido no puede superar los 1000 caracteres"]
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: "Comentario"
    }],
    estado: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, versionKey: false });

export default model("Publicacion", PostSchema);
