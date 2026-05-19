const btnAgregar = document.getElementById('btnAgregar');
const btnCargar = document.getElementById('btnCargar');
const tablaProductosBody = document.getElementById('tablaProductosBody');
const mensaje = document.getElementById('mensaje');

btnAgregar.addEventListener('click', () => {
  window.location.href = 'ingresar.html';
});

btnCargar.addEventListener('click', cargarProductos);

document.addEventListener('DOMContentLoaded', cargarProductos);

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-eliminar')) {
    const id = e.target.dataset.id;
    await eliminarProducto(id);
  }

  if (e.target.classList.contains('btn-actualizar')) {
    const id = e.target.dataset.id;
    window.location.href = `ingresar.html?id=${id}`;
  }
});

async function cargarProductos() {
  mensaje.innerHTML = '';

  try {
    const response = await fetch('/api/productos');
    const data = await response.json();

    if (!data.ok || data.data.length === 0) {
      tablaProductosBody.innerHTML = `
        <tr>
          <td colspan="6">No hay productos registrados.</td>
        </tr>
      `;
      return;
    }

    tablaProductosBody.innerHTML = data.data.map(producto => `
      <tr>
        <td>${producto.id}</td>
        <td>${producto.nombre}</td>
        <td>${producto.categoria}</td>
        <td>$${Number(producto.precio).toFixed(2)}</td>
        <td>${producto.stock}</td>
        <td>
          <button class="btn-accion btn-actualizar" data-id="${producto.id}">Actualizar</button>
          <button class="btn-accion btn-eliminar btn-peligro" data-id="${producto.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tablaProductosBody.innerHTML = `
      <tr>
        <td colspan="6">Error al cargar los productos.</td>
      </tr>
    `;
  }
}

async function eliminarProducto(id) {
  const confirmar = confirm('¿Desea eliminar este producto?');
  if (!confirmar) {
    return;
  }

  try {
    const response = await fetch(`/api/productos/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.ok) {
      mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;
      await cargarProductos();
    } else {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;
    }
  } catch (error) {
    mensaje.innerHTML = `<p class="error">Error al eliminar el producto.</p>`;
  }
}
