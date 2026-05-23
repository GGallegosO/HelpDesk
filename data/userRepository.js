// Responsable:
// acceso a datos de usuarios.
// Solo consulta MySQL.

const db = require('../config/db');

// Obtener todos
const findAll =
    async () => {

        const[rows] = await db.execute
        (`SELECT * FROM users`);
        return rows;
    };


// Buscar por username
const findByUsername = async (username) => {
        const[rows]= await db.execute(`
            SELECT * FROM users WHERE username = ?`, 
            [username]
        );
        return rows[0];
    };


// Exportar
module.exports = {
    findAll,
    findByUsername
};