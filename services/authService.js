// Responsable:
// lógica de login

const userRepository = require('../data/userRepository');

const validarUsuario = async (
        username,
        password
    ) => {
        const usuario = await userRepository.findByUsername
        (
            username
        );

        // Usuario no existe
        if (!usuario) {
            return null;
        }


        // Validar password
        if (usuario.password!==password) {
            return null;
        }
        return usuario;
    };


module.exports = {
    validarUsuario
};