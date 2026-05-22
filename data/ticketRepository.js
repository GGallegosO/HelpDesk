// data/ticketRepository.js

// Responsable:
// leer y guardar tickets
// NO contiene reglas de negocio

const fs = require('fs').promises;

const path = require('path');


// Ruta JSON
const dataPath =

    path.join(

        __dirname,

        'tickets.json'

    );


// ======================
// LEER TODO
// ======================

const findAll =
    async () => {

        try {
            const raw =
                await fs.readFile(dataPath,'utf8');

            // Convertir
            return JSON.parse(raw);

        }
        catch (error) {

            // Si archivo vacío
            return [];
        }
    };


// ======================
// GUARDAR TODO
// ======================

const saveAll =
    async (
        tickets
    ) => {

        await fs
            .writeFile(

                dataPath,

                JSON.stringify(
                    tickets,
                    null,
                    2
                )

            );

    };


// ======================
// BUSCAR ID
// ======================

const findById =
    async (
        id
    ) => {

        const tickets =

            await findAll();

        return tickets.find(

            t =>

                t.id == id

        );

    };


// ======================
// EXPORTAR
// ======================

module.exports = {

    findAll,

    saveAll,

    findById

};