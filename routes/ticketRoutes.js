// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();

const ticketController = require('../controllers/ticketController');
const { validarTicket } = require('../middlewares/ticketValidator');
const { verificarAuth } = require('../middlewares/authMiddleware');

/**
 * TODAS LAS RUTAS ESTÁN PROTEGIDAS
 * El usuario DEBE estar autenticado para listar, ver, crear o resolver tickets.
 */

// GET '/': Lista todos los tickets (Protegido)
router.get('/', verificarAuth, ticketController.listar);

// GET '/historial': Lista todos los tickets (Protegido)
router.get('/historial', verificarAuth, ticketController.historial);

// GET '/:id': Obtiene el detalle de un ticket específico (Protegido)
router.get('/:id', verificarAuth, ticketController.obtenerPorId);

// POST '/': Crea un nuevo ticket (Protegido)
router.post('/', verificarAuth, validarTicket, ticketController.crear);

// PATCH '/:id/resolver': Resuelve un ticket (Protegido)
router.patch('/:id/resolver', verificarAuth, ticketController.resolver);

module.exports = router;