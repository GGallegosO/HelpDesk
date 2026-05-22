

// Módulo para trabajar con archivos usando promesas
const fs = require('fs').promises;

// Módulo para construir rutas seguras
const path = require('path');


// Construye la ruta absoluta:
// data/users.json
const dataPath =
    path.join(
        __dirname,
        'users.json'
    );


// Busca un usuario por nombre
async function findByUser(usuario) {

    // Leer archivo JSON
    const raw =
        await fs.readFile(
            dataPath,
            'utf8'
        );

    // Convertir texto JSON → objeto JS
    const users =
        JSON.parse(raw);

    // Buscar coincidencia
    return users.find(
        user =>
            user.usuario === usuario
    );

}


// Exportar función
module.exports = {
    findByUser
};