
// RESPONSABILIDAD: Acceso a datos. 
// Esta capa es la única que interactúa con la base de datos.

// Importamos la conexión a la base de datos configurada previamente
const db = require('../config/db');


//findAll: Recupera todos los tickets de la base de datos.
const findAll = async () => {
    // db.execute devuelve un array donde el primer elemento son los resultados
    const [rows] = await db.execute(`
        SELECT * FROM tickets
        WHERE estado != 'resuelto'
        ORDER BY fechaCreacion DESC
    `);
    return rows;
};

/**
 * findById: Busca un ticket específico por su ID.
 * Usamos '?' como placeholder para prevenir ataques de Inyección SQL.
 */
const findById = async (id) => {
    const [rows] = await db.execute(`
        SELECT * FROM tickets WHERE id = ?
    `, [id]);

    // Retornamos solo el primer registro encontrado
    return rows[0];
};

/**
 * save: Inserta un nuevo ticket en la base de datos.
 * El '?' actúa como un parámetro seguro para evitar inyección de código.
 */
const save = async (ticket) => {
    const [result] = await db.execute(`
        INSERT INTO tickets (
            nombreSolicitante, correo, categoria, descripcion, 
            impacto, urgencia, tiempoEstimado, prioridad, estado
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        ticket.nombreSolicitante,
        ticket.correo,
        ticket.categoria,
        ticket.descripcion,
        ticket.impacto,
        ticket.urgencia,
        ticket.tiempoEstimado,
        ticket.prioridad,
        'pendiente' // Definimos el estado inicial por defecto aquí
    ]);

    return result;
};

/**
 * cerrar: Actualiza el estado de un ticket a 'resuelto'.
 * Es un ejemplo de una operación de escritura específica (UPDATE).
 */
const cerrar = async (id) => {
    const [result] = await db.execute(`
        UPDATE tickets SET estado = 'resuelto' WHERE id = ?`,
        [id]
    );

    return result;
};

// Obtener historial completo
const findHistorial = async () => {
    const [rows] = await db.execute(`
        SELECT * FROM tickets
        ORDER BY fechaCreacion DESC
        `);
        return rows;
    };

// Exportamos las funciones para que el Service pueda usarlas
module.exports={
    findAll,
    findHistorial,
    findById,
    save,
    cerrar
};