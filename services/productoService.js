const productoModel = require('../models/productoModel');

function normalizarTexto(texto) {
  return String(texto).trim().replace(/\s+/g, ' ');
}

function validarProducto({ nombre, categoria, precio, stock }) {
  if (!nombre || !categoria || precio === undefined || stock === undefined) {
    return 'Todos los campos son obligatorios.';
  }

  if (String(nombre).trim() === '' || String(categoria).trim() === '') {
    return 'Todos los campos son obligatorios.';
  }

  const precioNumero = Number(precio);
  const stockNumero = Number(stock);

  if (isNaN(precioNumero) || precioNumero < 0) {
    return 'El precio debe ser un número válido mayor o igual a 0.';
  }

  if (!Number.isInteger(stockNumero) || stockNumero < 0) {
    return 'El stock debe ser un número entero mayor o igual a 0.';
  }

  return null;
}

async function crearProducto(data) {
  const productoNormalizado = {
    nombre: normalizarTexto(data.nombre),
    categoria: normalizarTexto(data.categoria),
    precio: Number(data.precio),
    stock: Number(data.stock)
  };

  const errorValidacion = validarProducto(productoNormalizado);
  if (errorValidacion) {
    throw new Error(errorValidacion);
  }

  const resultado = await productoModel.insertarProducto(productoNormalizado);

  return {
    id: resultado.insertId,
    ...productoNormalizado
  };
}

async function listarProductos() {
  return await productoModel.obtenerTodosLosProductos();
}

async function obtenerProductoPorId(id) {
  const idNumero = Number(id);

  if (!Number.isInteger(idNumero) || idNumero <= 0) {
    throw new Error('El id del producto no es válido.');
  }

  const producto = await productoModel.buscarPorId(idNumero);
  if (!producto) {
    throw new Error('No se encontró el producto.');
  }

  return producto;
}

async function actualizarProducto(id, data) {
  const idNumero = Number(id);

  if (!Number.isInteger(idNumero) || idNumero <= 0) {
    throw new Error('El id del producto no es válido.');
  }

  const productoExistente = await productoModel.buscarPorId(idNumero);
  if (!productoExistente) {
    throw new Error('No se encontró el producto a actualizar.');
  }

  const productoNormalizado = {
    nombre: normalizarTexto(data.nombre),
    categoria: normalizarTexto(data.categoria),
    precio: Number(data.precio),
    stock: Number(data.stock)
  };

  const errorValidacion = validarProducto(productoNormalizado);
  if (errorValidacion) {
    throw new Error(errorValidacion);
  }

  await productoModel.actualizarProducto(idNumero, productoNormalizado);

  return {
    id: idNumero,
    ...productoNormalizado
  };
}

async function eliminarProducto(id) {
  const idNumero = Number(id);

  if (!Number.isInteger(idNumero) || idNumero <= 0) {
    throw new Error('El id del producto no es válido.');
  }

  const producto = await productoModel.buscarPorId(idNumero);
  if (!producto) {
    throw new Error('No se encontró el producto a eliminar.');
  }

  await productoModel.eliminarProducto(idNumero);
}

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
};
