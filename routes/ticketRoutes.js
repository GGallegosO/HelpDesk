

// Responsable:
// Definir endpoints
// y conectar middlewares.

const express =
    require(
        'express'
    );

const router =
    express.Router();


// Importar controlador
const ticketController =
    require(
        '../controllers/ticketController'
    );


// Middleware validación
const {
    validarTicket
} =
    require(
        '../middlewares/ticketValidator'
    );


// Middleware seguridad
const {
    verificarAuth
} =
    require(
        '../middlewares/authMiddleware'
    );


// ======================================
// RUTAS PÚBLICAS
// ======================================


// POST /tickets
// Crear ticket
// Usuario NO requiere login

router.post(

    '/',

    validarTicket,

    ticketController.crear

);


// ======================================
// RUTAS ADMIN
// Requieren token
// ======================================


// GET /tickets
// Listar activos

router.get(

    '/',

    verificarAuth,

    ticketController.listar

);


// GET /tickets/historial
// Historial completo

router.get(

    '/historial',

    verificarAuth,

    ticketController.historial

);


// GET /tickets/:id
// Obtener ticket

router.get(

    '/:id',

    verificarAuth,

    ticketController.obtenerPorId

);


// PUT /tickets/:id/evaluar
// Clasificar ticket

router.put(

    '/:id/evaluar',

    verificarAuth,

    ticketController.evaluar

);


// PATCH /tickets/:id/resolver
// Resolver ticket

router.patch(

    '/:id/resolver',

    verificarAuth,

    ticketController.resolver

);

// PUT /tickets/:id
// Editar ticket completo

router.put(
    '/:id',
    verificarAuth,
    ticketController.editar
);

// ======================================
// EXPORTAR
// ======================================

module.exports =
    router;