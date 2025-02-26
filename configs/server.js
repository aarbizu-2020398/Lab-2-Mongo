import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from '../configs/mongo.js';  
import { limiter } from '../src/middlewares/validar-cant-peticiones.js';

import dotenv from 'dotenv';
dotenv.config();

import authRoutes from '../src/auth/auth.routes.js';
import postRoutes from '../src/publicaciones/publicaciones.routes.js'; 
import commentRoutes from '../src/comentarios/comentarios.routes.js';
import categoriaRoutes from '../src/categories/categorias.routes.js';
import { createDefaultUsers } from '../src/users/user.controller.js'; 

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const routes = (app) => {
    app.use("/gestor-opiniones/v1/auth", authRoutes);
    app.use("/gestor-opiniones/v1/publicaciones", postRoutes); 
    app.use("/gestor-opiniones/v1/comment", commentRoutes);
    app.use("/gestor-opiniones/v1/categories", categoriaRoutes);
};


const conectarDB = async () => {
    try {
        await dbConnection();
        console.log(" Conexión a la base de datos exitosa");


        await createDefaultUsers();
    } catch (error) {
        console.error(" Error conectando a la base de datos:", error);
        process.exit(1); 
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3040;

    try {
        middlewares(app);
        await conectarDB(); 
        routes(app);

        app.listen(port, () => {
            console.log(` Server running on port: ${port}`);
        });
    } catch (err) {
        console.error(" Server init failed:", err);
    }
};