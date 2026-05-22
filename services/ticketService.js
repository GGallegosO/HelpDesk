// Responsable único:
// aplicar reglas de negocio y coordinar operaciones.
// No conoce cómo ni dónde se guardan los datos.

// services/ticketService.js

// Responsable:
// aplicar reglas de negocio
// coordinar operaciones
// no acceder directamente al JSON

const ticketRepository =
    require(
        '../data/ticketRepository'
    );


// ======================
// CALCULAR PRIORIDAD
// ======================

const calcularPrioridad =
    (
        impacto,
        urgencia,
        categoria,
        tiempo
    ) => {

        const puntos = {

            bajo: 1,
            medio: 2,
            alto: 3,

            baja: 1,
            media: 2,
            alta: 3

        };


        // Normalizar texto
        impacto =
            impacto.toLowerCase();

        urgencia =
            urgencia.toLowerCase();

        categoria =
            categoria.toLowerCase();


        let total = puntos[impacto] + puntos[urgencia];


        // Categoría
        if (
            categoria === 'red'
            ||
            categoria === 'cuenta'
        ) {
            total++;
        }

        // Bonus tiempo
        if (
            tiempo > 4
        ) {
            total++;
        }

        // Resultado
        if (total >= 7)
            return 'Crítica';

        if (total === 6)
            return 'Alta';

        if (total >= 4)
            return 'Media';

        return 'Baja';

    };


// ======================
// CREAR TICKET
// ======================

const registrarTicket =
    async (
        ticketData
    ) => {

        const tickets =

            await ticketRepository
                .findAll();


        // Crear ID
        ticketData.id = tickets.length + 1;

        // Fecha automática
        ticketData.fechaCreacion =

            new Date()
                .toISOString();


        // Estado inicial
        ticketData.estado = 'pendiente';


        // Prioridad
        ticketData.prioridad =

            calcularPrioridad(

                ticketData.impacto,

                ticketData.urgencia,

                ticketData.categoria,

                ticketData.tiempoEstimado

            );


        // Guardar
        tickets.push(
            ticketData
        );

        await ticketRepository
            .saveAll(
                tickets
            );

        return ticketData;

    };


// ======================
// LISTAR
// ======================

const obtenerTodos =
    async () => {

        return await
            ticketRepository
                .findAll();

    };


// ======================
// BUSCAR ID
// ======================

const obtenerPorId =
    async (
        id
    ) => {

        const tickets =

            await ticketRepository
                .findAll();

        return tickets.find(

            t =>

                t.id == id

        );

    };


// ======================
// ACTUALIZAR
// ======================

const actualizar =
    async (
        id,
        datos
    ) => {

        const tickets =

            await ticketRepository
                .findAll();

        const index =

            tickets.findIndex(

                t =>

                    t.id == id

            );


        // No existe
        if (
            index === -1
        ) {

            return null;

        }


        // Mantener ID
        tickets[index] = {
            ...tickets[index],
            ...datos
        };


        // Recalcular prioridad
        tickets[index]
            .prioridad =

            calcularPrioridad(

                tickets[index]
                    .impacto,

                tickets[index]
                    .urgencia,

                tickets[index]
                    .categoria,

                tickets[index]
                    .tiempoEstimado

            );


        await ticketRepository
            .saveAll(
                tickets
            );

        return tickets[index];

    };


// ======================
// ELIMINAR
// ======================

const eliminar =
    async (
        id
    ) => {

        const tickets =

            await ticketRepository
                .findAll();

        const filtrados =

            tickets.filter(

                t =>

                    t.id != id

            );


        // No existe
        if (
            tickets.length
            ===
            filtrados.length
        ) {
            return false;
        }


        await ticketRepository
            .saveAll(
                filtrados
            );

        return true;

    };


// Exportar
module.exports = {

    registrarTicket,

    obtenerTodos,

    obtenerPorId,

    actualizar,

    eliminar

};