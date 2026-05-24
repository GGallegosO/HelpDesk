// controllers/authController.js

const authService = require('../services/authService');

// POST /auth/login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // =====================
        // Validar entrada
        // =====================
        if (!username || !password) {
            return res.status(400).json({
                mensaje: 'Debe ingresar usuario y contraseña'
            });
        }

        // =====================
        // Validar login
        // =====================
        const usuario = await authService.validarUsuario(username, password);

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos'
            });
        }

        // =====================
        // Login correcto
        // =====================
        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token: process.env.SECRET_TOKEN,
            rol: usuario.rol 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Error interno'
        });
    }
};

module.exports = {
    login
};