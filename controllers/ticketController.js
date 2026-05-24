
// Responsable:
// - Recibir request HTTP
// - Validar flujo HTTP
// - Invocar Services
// - Retornar respuestas HTTP


// Importar servicio
const ticketService =
    require(
        '../services/ticketService'
    );


// ======================================
// POST /tickets
// Crear ticket
// ======================================

const crear =
    async (
        req,
        res
    ) => {

        try {

            const nuevoTicket =

                await ticketService
                    .registrarTicket(
                        req.body
                    );


            // 201 → creado
            return res
                .status(201)
                .json(
                    nuevoTicket
                );

        }
        catch (
        error
        ) {

            console.error(
                error
            );

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno del servidor'

                });

        }

    };


// ======================================
// GET /tickets
// Obtener tickets activos
// ======================================

const listar =
    async (
        req,
        res
    ) => {

        try {

            const tickets =

                await ticketService
                    .obtenerTodos();


            return res
                .status(200)
                .json(
                    tickets
                );

        }
        catch (
        error
        ) {

            console.error(
                error
            );

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error al listar tickets'

                });

        }

    };


// ======================================
// GET /tickets/:id
// Obtener ticket específico
// ======================================

const obtenerPorId =
    async (
        req,
        res
    ) => {

        try {

            const ticket =

                await ticketService
                    .obtenerPorId(
                        req.params.id
                    );


            if (
                !ticket
            ) {

                return res
                    .status(404)
                    .json({

                        mensaje:
                            'Ticket no encontrado'

                    });

            }


            return res
                .status(200)
                .json(
                    ticket
                );

        }
        catch (
        error
        ) {

            console.error(
                error
            );

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno'

                });

        }

    };


// ======================================
// PUT /tickets/:id/evaluar
// Evaluar ticket
// (Admin clasifica)
// ======================================

const evaluar =
    async (
        req,
        res
    ) => {

        try {

            const ticket =

                await ticketService
                    .evaluar(

                        req.params.id,

                        req.body

                    );


            if (
                !ticket
            ) {

                return res
                    .status(404)
                    .json({

                        mensaje:
                            'Ticket no encontrado'

                    });

            }


            return res
                .status(200)
                .json(
                    ticket
                );

        }
        catch (
        error
        ) {

            console.error(
                error
            );

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno'

                });

        }

    };


// ======================================
// PATCH /tickets/:id/resolver
// Resolver ticket
// (Soft delete)
// ======================================

const resolver =
    async (
        req,
        res
    ) => {

        try {

            const resultado =

                await ticketService
                    .resolver(
                        req.params.id
                    );


            if (
                resultado
                    .affectedRows
                ===
                0
            ) {

                return res
                    .status(404)
                    .json({

                        mensaje:
                            'Ticket no encontrado'

                    });

            }


            return res
                .status(200)
                .json({

                    mensaje:
                        'Ticket marcado como resuelto'

                });

        }
        catch (
        error
        ) {

            console.error(
                error
            );

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno'

                });

        }

    };


// ======================================
// GET /tickets/historial
// Tickets cerrados
// ======================================

const historial =
    async (
        req,
        res
    ) => {

        try {

            const tickets =

                await ticketService
                    .obtenerHistorial();


            return res
                .status(200)
                .json(
                    tickets
                );

        }
        catch (
        error
        ) {

            console.error(
                error
            );

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error al obtener historial'

                });

        }

    };

// ======================================
// PUT /tickets/:id
// Editar ticket
// ======================================

const editar = async (req, res) => {

    try {
        const ticket = await ticketService.editarTicket(
            req.params.id,
            req.body
        );

        if (!ticket) {
            return res.status(404).json({ mensaje: 'Ticket no encontrado' });
        }

        return res.status(200).json(ticket);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno' });
    }
};



// ======================================
// EXPORTAR
// ======================================

module.exports = {

    crear,

    listar,

    obtenerPorId,

    evaluar,

    editar,

    resolver,

    historial

};