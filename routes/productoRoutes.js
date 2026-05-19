const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

router.get('/productos', productoController.listarProductos);
router.get('/productos/:id', productoController.obtenerProductoPorId);
router.post('/productos', productoController.agregarProducto);
router.put('/productos/:id', productoController.actualizarProducto);
router.delete('/productos/:id', productoController.eliminarProducto);

module.exports = router;
