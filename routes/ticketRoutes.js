// routes/ticketRoutes.js

// Framework
const express =require('express');

// Crear router
const router = express.Router();


// Controlador
const ticketController =require('../controllers/ticketController');


// Middleware validación
const {validarTicket} = require('../middlewares/ticketValidator');


// Middleware seguridad
const {verificarAuth} = require('../middlewares/authMiddleware');


// ======================
// GET /tickets
// Listar
// ======================

router.get('/',ticketController.listar);


// ======================
// GET /tickets/:id
// Buscar ticket
// ======================

router.get('/:id',ticketController.obtenerPorId);


// ======================
// POST /tickets
// Crear (protegido)
// ======================

router.post(

    '/',
    // seguridad
    verificarAuth,
    // validar body
    validarTicket,
    ticketController.crear

);


// ======================
// PUT /tickets/:id
// Actualizar
// ======================

router.put('/:id',verificarAuth,ticketController.actualizar);


// ======================
// DELETE /tickets/:id
// Eliminar
// ======================

router.delete('/:id',verificarAuth,ticketController.eliminar);


// Exportar
module.exports = router;