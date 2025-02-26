import { Schema, model } from "mongoose";

const ComentarioSchema = new Schema({
    contenido: {
        type: String,
        required: true,
    },

    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    publicacion: {
        type: Schema.Types.ObjectId,
        ref: 'Publicacion',
        required: true
    },

    estado: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    versionKey: false
});


export default model('Comentario', ComentarioSchema);
