

// Responsable:
// aplicar reglas de negocio.
// No conoce SQL ni Express.

const ticketRepository =
    require(
        '../data/ticketRepository'
    );


// ======================================
// Calcular prioridad
// ======================================

const calcularPrioridad = (impacto, urgencia, categoria, tiempo) => {

    const puntos = {
        bajo: 1, medio: 2, alto: 3,
        baja: 1, media: 2, alta: 3
    };

    let total = puntos[impacto] + puntos[urgencia];

    // Bonus categoría
    if (categoria === 'red' || categoria === 'cuenta') {
        total++;
    }

    // Bonus tiempo
    if (tiempo > 4) {
        total++;
    }

    // Resultado según pauta
    if (total >= 7) return 'Crítica';
    if (total === 6) return 'Alta';
    if (total >= 4) return 'Media';
    return 'Baja'; // 1 a 3
};


// ======================================
// Crear ticket
// ======================================

const registrarTicket = async (ticket) => {

    ticket.categoria = ticket.categoria || null;
    ticket.impacto = ticket.impacto || null;
    ticket.urgencia = ticket.urgencia || null;
    ticket.tiempoEstimado = ticket.tiempoEstimado || null;

    if (ticket.impacto && ticket.urgencia) {
        ticket.prioridad = calcularPrioridad(
            ticket.impacto,
            ticket.urgencia,
            ticket.categoria,
            ticket.tiempoEstimado
        );
        ticket.estado = 'en proceso';
    } else {
        ticket.prioridad = null;
        ticket.estado = 'pendiente';
    }

    await ticketRepository.save(ticket);
    return ticket;
};


// ======================================
// Evaluar ticket
// ======================================

const evaluar =
    async (

        id,

        datos

    ) => {


        const ticket =

            await ticketRepository
                .findById(
                    id
                );


        if (
            !ticket
        ) {

            return null;

        }


        // Aplicar evaluación

        ticket.categoria =
            datos.categoria;

        ticket.impacto =
            datos.impacto;

        ticket.urgencia =
            datos.urgencia;

        ticket.tiempoEstimado =
            datos.tiempoEstimado;


        // Calcular prioridad

        ticket.prioridad =

            calcularPrioridad(

                ticket.impacto,

                ticket.urgencia,

                ticket.categoria,

                ticket.tiempoEstimado

            );


        // Cambiar estado

        ticket.estado =
            'en proceso';


        // Guardar

        await ticketRepository
            .actualizar(
                ticket
            );


        return ticket;

    };


// ======================================
// Obtener activos
// ======================================

const obtenerTodos =
    async () => {

        return await
            ticketRepository
                .findAll();

    };


// ======================================
// Obtener historial
// ======================================

const obtenerHistorial =
    async () => {

        return await
            ticketRepository
                .findHistorial();

    };


// ======================================
// Obtener uno
// ======================================

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


// ======================================
// Resolver ticket
// ======================================

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

// ======================================
// Editar ticket
// ======================================

const editarTicket = async (id, datos) => {

    const ticket = await ticketRepository.findById(id);

    if (!ticket) return null;

    // Recalcula la prioridad con los nuevos datos
    datos.prioridad = calcularPrioridad(
        datos.impacto,
        datos.urgencia,
        datos.categoria,
        datos.tiempoEstimado
    );

    await ticketRepository.editar(id, datos);

    return await ticketRepository.findById(id);
};


// ======================================
// Exportar
// ======================================

module.exports = {

    registrarTicket,

    evaluar,

    editarTicket,

    obtenerTodos,

    obtenerHistorial,

    obtenerPorId,

    resolver

};