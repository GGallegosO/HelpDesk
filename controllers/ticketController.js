
// Responsable:
// recibir request HTTP,
// validar entrada,
// devolver respuesta HTTP.

// controllers/ticketController.js

// Importar servicio
const ticketService = require('../services/ticketService');


// =====================
// POST /tickets
// Crear ticket
// =====================

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


            // 201
            return res
                .status(201)
                .json(
                    nuevoTicket
                );

        }
        catch (error) {

            console.error(error);


            // 500
            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno del servidor'

                });

        }

    };


// =====================
// GET /tickets
// Listar tickets
// =====================

const listar =
    async (
        req,
        res
    ) => {

        try {

            const tickets =

                await ticketService
                    .obtenerTodos();


            // 200
            return res
                .status(200)
                .json(
                    tickets
                );

        }
        catch {

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error al listar tickets'

                });

        }

    };


// =====================
// GET /tickets/:id
// Obtener ticket
// =====================

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


            // 404
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


            // 200
            return res
                .status(200)
                .json(
                    ticket
                );

        }
        catch {

            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno'

                });

        }

    };

// =====================
// PUT /tickets/:id
// Actualizar ticket
// =====================

const actualizar =
    async (
        req,
        res
    ) => {

        try {

            const ticket =

                await ticketService
                    .actualizar(

                        req.params.id,

                        req.body

                    );


            // 404
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


            // 200
            return res
                .status(200)
                .json(
                    ticket
                );

        }
        catch (error) {

            console.error(error);


            // 500
            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno'

                });

        }

    };


// =====================
// DELETE /tickets/:id
// Eliminar ticket
// =====================

const eliminar =
    async (
        req,
        res
    ) => {

        try {

            const eliminado =

                await ticketService
                    .eliminar(
                        req.params.id
                    );


            // 404
            if (
                !eliminado
            ) {

                return res
                    .status(404)
                    .json({

                        mensaje:
                            'Ticket no encontrado'

                    });

            }


            // 200
            return res
                .status(200)
                .json({

                    mensaje:
                        'Ticket eliminado correctamente'

                });

        }
        catch (error) {

            console.error(error);


            // 500
            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno'

                });

        }

    };

// Exportar
module.exports = {

    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar

};