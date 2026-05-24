// Responsable:
// acceso a datos de usuarios.
// Solo consulta MySQL.

// data/userRepository.js

const db = require('../config/db');

// Obtener todos
const findAll = async () => {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
};

// Buscar por username
const findByUsername = async (username) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE username = ?', 
        [username]
    );
    return rows[0]; // Retorna el usuario con su id, username, password y rol
};

module.exports = {
    findAll,
    findByUsername
};