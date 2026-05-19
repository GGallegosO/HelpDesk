const productoService = require('../services/productoService');

async function agregarProducto(req, res) {
  try {
    const nuevoProducto = await productoService.crearProducto(req.body);

    res.status(201).json({
      ok: true,
      mensaje: 'Producto registrado correctamente.',
      data: nuevoProducto
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: error.message
    });
  }
}

async function listarProductos(req, res) {
  try {
    const productos = await productoService.listarProductos();

    res.status(200).json({
      ok: true,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al listar productos.'
    });
  }
}

async function obtenerProductoPorId(req, res) {
  try {
    const { id } = req.params;
    const producto = await productoService.obtenerProductoPorId(id);

    res.status(200).json({
      ok: true,
      data: producto
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      mensaje: error.message
    });
  }
}

async function actualizarProducto(req, res) {
  try {
    const { id } = req.params;
    const productoActualizado = await productoService.actualizarProducto(id, req.body);

    res.status(200).json({
      ok: true,
      mensaje: 'Producto actualizado correctamente.',
      data: productoActualizado
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: error.message
    });
  }
}

async function eliminarProducto(req, res) {
  try {
    const { id } = req.params;
    await productoService.eliminarProducto(id);

    res.status(200).json({
      ok: true,
      mensaje: 'Producto eliminado correctamente.'
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: error.message
    });
  }
}

module.exports = {
  agregarProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
};
