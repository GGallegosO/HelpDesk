
// RESPONSABILIDAD:
// Acceso a datos.
// Esta capa es la única que interactúa con MySQL.

const db =
    require(
        '../config/db'
    );


// ======================================
// Obtener activos
// ======================================

const findAll =
    async () => {

        const [rows] =
            await db.execute(

                `
SELECT *
FROM tickets
WHERE estado != 'resuelto'
ORDER BY fechaCreacion DESC
`

            );

        return rows;

    };


// ======================================
// Obtener historial
// ======================================

const findHistorial =
    async () => {

        const [rows] =
            await db.execute(

                `
SELECT *
FROM tickets
ORDER BY fechaCreacion DESC
`

            );

        return rows;

    };


// ======================================
// Buscar por ID
// ======================================

const findById =
    async (
        id
    ) => {

        const [rows] =
            await db.execute(

                `
SELECT *
FROM tickets
WHERE id = ?
`,

                [
                    id
                ]

            );

        return rows[0];

    };


// ======================================
// Crear ticket
// ======================================

const save =
    async (
        ticket
    ) => {

        const [result] =
            await db.execute(

                `

INSERT INTO tickets (

nombreSolicitante,
correo,
categoria,
descripcion,
impacto,
urgencia,
tiempoEstimado,
prioridad,
estado

)

VALUES (

?,
?,
?,
?,
?,
?,
?,
?,
?

)

`,

                [

                    ticket.nombreSolicitante,

                    ticket.correo,

                    ticket.categoria,

                    ticket.descripcion,

                    ticket.impacto,

                    ticket.urgencia,

                    ticket.tiempoEstimado,

                    ticket.prioridad,

                    ticket.estado

                ]

            );

        return result;

    };


// ======================================
// Evaluar ticket
// ======================================

const actualizar =
    async (
        ticket
    ) => {

        const [result] =
            await db.execute(

                `

UPDATE tickets
SET

categoria = ?,

impacto = ?,

urgencia = ?,

tiempoEstimado = ?,

prioridad = ?,

estado = ?

WHERE id = ?

`,

                [

                    ticket.categoria,

                    ticket.impacto,

                    ticket.urgencia,

                    ticket.tiempoEstimado,

                    ticket.prioridad,

                    ticket.estado,

                    ticket.id

                ]

            );

        return result;

    };


// ======================================
// Resolver ticket
// ======================================

const cerrar =
    async (
        id
    ) => {

        const [result] =
            await db.execute(

                `

UPDATE tickets
SET estado='resuelto'

WHERE id=?

`,

                [
                    id
                ]

            );

        return result;

    };

// ======================================
// Editar ticket (todos los campos)
// ======================================

const editar = async (id, datos) => {

    const [result] = await db.execute(
        `UPDATE tickets
        SET nombreSolicitante = ?,
            correo = ?,
            descripcion = ?,
            categoria = ?,
            impacto = ?,
            urgencia = ?,
            tiempoEstimado = ?,
            prioridad = ?
        WHERE id = ?`,
        [
            datos.nombreSolicitante,
            datos.correo,
            datos.descripcion,
            datos.categoria,
            datos.impacto,
            datos.urgencia,
            datos.tiempoEstimado,
            datos.prioridad,
            id
        ]
    );

    return result;
};


// ======================================
// Exportar
// ======================================

module.exports = {

    findAll,

    findHistorial,

    findById,

    save,

    actualizar,

    editar,

    cerrar

};