// middlewares/authMiddleware.js

/**
 * Responsable:
 * validar seguridad mínima
 * mediante token simple
 */

const verificarAuth = 
(req, res, next) => {
    // Obtener header
    const authHeader = req.headers['authorization'];

    const tokenValido = process.env.SECRET_TOKEN;
    // 401
    if (
        !authHeader
        ||
        authHeader
        !==
        tokenValido
    ) {

        return res.status(401).json({
            mensaje: 'Acceso no autorizado: Token inválido o inexistente.'
        });
    }
    // Continuar
    next();
};


// Exportar
module.exports = {

    verificarAuth

};