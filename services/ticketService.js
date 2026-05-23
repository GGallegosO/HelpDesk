// Responsable:
// aplicar reglas de negocio.
// No conoce SQL ni Express.

const ticketRepository = require('../data/ticketRepository');

// Calcular prioridad
const calcularPrioridad = (
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

    let total = puntos[impacto] + puntos[urgencia];
    // Reglas adicionales
    if (
        categoria === 'red'
        ||
        categoria === 'cuenta'
    ) {
        total++;
    }


    if (tiempo > 4) {
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


// Crear ticket
const registrarTicket =
    async (
        ticket
    ) => {


        ticket.prioridad =

            calcularPrioridad(

                ticket.impacto,

                ticket.urgencia,

                ticket.categoria,

                ticket.tiempoEstimado

            );


        // Guardar
        await ticketRepository
            .save(
                ticket
            );
        return ticket;
    };


// Obtener activos
const obtenerTodos =
    async () => {
        return await
            ticketRepository
                .findAll();
    };


// Obtener historial
const obtenerHistorial =
    async () => {

        return await
            ticketRepository
                .findHistorial();

    };


// Obtener uno
const obtenerPorId =
    async (
        id
    ) => {

        return await
            ticketRepository
                .findById(
                    id
                );

    };


// Resolver ticket
const resolver =
    async (
        id
    ) => {

        return await
            ticketRepository
                .cerrar(
                    id
                );

    };


module.exports = {

    registrarTicket,

    obtenerTodos,

    obtenerHistorial,

    obtenerPorId,

    resolver

};