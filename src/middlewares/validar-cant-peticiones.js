import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        msg: "Demasiadas peticiones desde esta IP, por favor intente de nuevo después de 15 minutos"
    }
});
