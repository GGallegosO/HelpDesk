const formProducto = document.getElementById('formProducto');
const mensaje = document.getElementById('mensaje');
const btnVolver = document.getElementById('btnVolver');
const tituloFormulario = document.getElementById('tituloFormulario');
const btnGuardar = document.getElementById('btnGuardar');

const parametros = new URLSearchParams(window.location.search);
const productoId = parametros.get('id');
const modoEdicion = productoId !== null;

btnVolver.addEventListener('click', () => {
  window.location.href = '/';
});

document.addEventListener('DOMContentLoaded', async () => {
  if (modoEdicion) {
    tituloFormulario.textContent = 'Actualizar Producto';
    btnGuardar.textContent = 'Actualizar';
    await cargarProductoParaEditar(productoId);
  }
});

formProducto.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const categoria = document.getElementById('categoria').value.trim();
  const precio = document.getElementById('precio').value.trim();
  const stock = document.getElementById('stock').value.trim();

  if (!nombre || !categoria || !precio || !stock) {
    mensaje.innerHTML = `<p class="error">Todos los campos son obligatorios.</p>`;
    return;
  }

  const url = modoEdicion ? `/api/productos/${productoId}` : '/api/productos';
  const metodo = modoEdicion ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, categoria, precio, stock })
    });

    const data = await response.json();

    if (data.ok) {
      mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;

      if (!modoEdicion) {
        formProducto.reset();
      }

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;
    }
  } catch (error) {
    mensaje.innerHTML = `<p class="error">Error de conexión con el servidor.</p>`;
  }
});

async function cargarProductoParaEditar(id) {
  try {
    const response = await fetch(`/api/productos/${id}`);
    const data = await response.json();

    if (!data.ok) {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;
      formProducto.style.display = 'none';
      return;
    }

    document.getElementById('nombre').value = data.data.nombre;
    document.getElementById('categoria').value = data.data.categoria;
    document.getElementById('precio').value = data.data.precio;
    document.getElementById('stock').value = data.data.stock;
  } catch (error) {
    mensaje.innerHTML = `<p class="error">Error al cargar el producto.</p>`;
    formProducto.style.display = 'none';
  }
}
