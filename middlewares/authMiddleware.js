// middlewares/authMiddleware.js

/**
 * Responsable:
 * validar seguridad mínima
 * mediante token simple
 */

const verificarAuth =
    (
        req,
        res,
        next
    ) => {


        // Obtener header
        const authHeader =

            req.headers[
            'authorization'
            ];


        // 401
        if (
            !authHeader
            ||
            authHeader
            !==
            'TOKEN123'
        ) {

            return res
                .status(401)
                .json({
                    mensaje:
                        'Acceso no autorizado: Token inválido o inexistente.'
                });
        }


        // Continuar
        next();

    };


// Exportar
module.exports = {

    verificarAuth

};