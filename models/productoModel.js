const pool = require('../config/db');

async function insertarProducto(producto) {
  const sql = `
    INSERT INTO productos (nombre, categoria, precio, stock)
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    producto.nombre,
    producto.categoria,
    producto.precio,
    producto.stock
  ];

  const [result] = await pool.execute(sql, values);
  return result;
}

async function obtenerTodosLosProductos() {
  const sql = `
    SELECT id, nombre, categoria, precio, stock
    FROM productos
    ORDER BY id DESC
  `;

  const [rows] = await pool.execute(sql);
  return rows;
}

async function buscarPorId(id) {
  const sql = `
    SELECT id, nombre, categoria, precio, stock
    FROM productos
    WHERE id = ?
  `;

  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
}

async function actualizarProducto(id, producto) {
  const sql = `
    UPDATE productos
    SET nombre = ?, categoria = ?, precio = ?, stock = ?
    WHERE id = ?
  `;

  const values = [
    producto.nombre,
    producto.categoria,
    producto.precio,
    producto.stock,
    id
  ];

  const [result] = await pool.execute(sql, values);
  return result;
}

async function eliminarProducto(id) {
  const sql = 'DELETE FROM productos WHERE id = ?';
  const [result] = await pool.execute(sql, [id]);
  return result;
}

module.exports = {
  insertarProducto,
  obtenerTodosLosProductos,
  buscarPorId,
  actualizarProducto,
  eliminarProducto
};
