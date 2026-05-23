// routes/ticketRoutes.js
// RESPONSABILIDAD: Definición de Endpoints y orquestación de middlewares.

const express = require('express');
const router = express.Router();

// Importamos el controlador que contiene la lógica de cada operación
const ticketController = require('../controllers/ticketController');

// Importamos los middlewares de seguridad y validación
const { validarTicket } = require('../middlewares/ticketValidator');
const { verificarAuth } = require('../middlewares/authMiddleware');

/**
 * RUTAS PÚBLICAS (No requieren autenticación)
 */

// GET '/': Lista todos los tickets que están actualmente abiertos
router.get('/', ticketController.listar);

// GET '/historial': Lista todos los tickets, incluidos los cerrados
router.get('/historial', ticketController.historial);

// GET '/:id': Obtiene el detalle de un ticket específico mediante su ID
router.get('/:id', ticketController.obtenerPorId);

/**
 * RUTAS PROTEGIDAS (Requieren autenticación)
 * Se ejecutan en orden:
 * 1. verificarAuth: Valida que el usuario tenga permiso.
 * 2. validarTicket: (Solo en POST) Valida que los datos enviados sean correctos.
 * 3. controller: Ejecuta la acción final.
 */

// POST '/': Crea un nuevo ticket. Primero valida seguridad, luego formato de datos.
router.post('/', verificarAuth, validarTicket, ticketController.crear);

// PATCH '/:id/resolver': Marca un ticket como resuelto. Requiere autenticación.
router.patch('/:id/resolver', verificarAuth, ticketController.resolver);

// Exportamos el router para usarlo en app.js
module.exports = router;