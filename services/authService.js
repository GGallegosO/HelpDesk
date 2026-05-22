// Responsabilidad: lógica del login.
// Decide si el usuario entra o no.

// Importar acceso a datos
const userRepository = require('../data/userRepository');

/**
 * Valida usuario y contraseña
 *
 * Retorna:
 * - usuario encontrado
 * - undefined si no existe
 */
const validarUsuario = async (
        username,
        password
    ) => {
        // Obtener usuarios almacenados
        const usuarios = await userRepository.findAll();
        // Buscar coincidencia
        const usuarioEncontrado = usuarios.find( u =>
            u.username === username
            &&
            u.password === password
        );
        // Retornar usuario
        return usuarioEncontrado;
    };


// Exportar servicio
module.exports = {

    validarUsuario

};

