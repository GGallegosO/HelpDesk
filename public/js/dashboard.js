

// =========================================
//  VERIFICACIÓN DE SEGURIDAD FRONTEND
// =========================================
// Obtenemos los datos de sesión guardados en el navegador
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');

// Validamos que el usuario esté logueado y que, además, sea administrador.
// Si alguien intenta entrar por la URL sin ser admin, lo expulsamos.
if (!token || rol !== 'admin') {
    alert('Acceso denegado. Se requieren privilegios de administrador.');

    // Limpiamos cualquier rastro de sesión por seguridad
    localStorage.removeItem('token');
    localStorage.removeItem('rol');

    // Lo redirigimos a la pantalla de login
    window.location.href = 'index.html';
}

// =========================================
//  LÓGICA DE MODO OSCURO
// =========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Al cargar, verificamos la preferencia previa del usuario
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

// Evento para alternar entre claro y oscuro
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');

    // Guardamos la nueva elección en memoria
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// =========================================
//  CERRAR SESIÓN
// =========================================
const btnLogout = document.getElementById('btnLogout');
btnLogout.addEventListener('click', () => {
    // Para cerrar sesión, simplemente borramos la llave maestra y el rol
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    window.location.href = 'index.html';
});

// =========================================
//  CAPTURA DE ELEMENTOS DEL DOM (HTML)
// =========================================
const tbodyTickets = document.getElementById('tbodyTickets');
const btnActivos = document.getElementById('btnActivos');
const btnHistorial = document.getElementById('btnHistorial');
const btnNuevoTicket = document.getElementById('btnNuevoTicket');

// Variable global para tickets y orden
let ticketsCargados = [];
let ordenActual = { col: 'fecha', dir: 'desc' };

const pesoPrioridad = { 'Crítica': 4, 'Alta': 3, 'Media': 2, 'Baja': 1, 'Pendiente': 0 };


// =========================================
//  FILTRO Y ORDENAMIENTO
// =========================================
function aplicarFiltros(vista) {
    const vistaActual = vista || (btnHistorial.classList.contains('active') ? 'historial' : 'activos');

    let resultado = [...ticketsCargados];

    resultado.sort((a, b) => {
        const dir = ordenActual.dir === 'asc' ? 1 : -1;

        if (ordenActual.col === 'id')
            return (a.id - b.id) * dir;

        if (ordenActual.col === 'prioridad')
            return ((pesoPrioridad[a.prioridad] || 0) - (pesoPrioridad[b.prioridad] || 0)) * dir;

        if (ordenActual.col === 'fecha')
            return (new Date(a.fechaCreacion) - new Date(b.fechaCreacion)) * dir;

        if (ordenActual.col === 'nombre')
            return (a.nombreSolicitante || '').localeCompare(b.nombreSolicitante || '') * dir;

        if (ordenActual.col === 'categoria')
            return (a.categoria || '').localeCompare(b.categoria || '') * dir;

        if (ordenActual.col === 'estado')
            return (a.estado || '').localeCompare(b.estado || '') * dir;

        return 0;
    });

    dibujarTabla(resultado, vistaActual);
}

// Clic en encabezados de tabla
// Delegación de eventos en el thead (sobrevive a rerenders)
document.querySelector('thead').addEventListener('click', (e) => {
    const th = e.target.closest('th[data-col]');
    if (!th) return; // clic en th sin data-col, ignorar

    const col = th.dataset.col;

    if (ordenActual.col === col) {
        ordenActual.dir = ordenActual.dir === 'asc' ? 'desc' : 'asc';
    } else {
        ordenActual.col = col;
        ordenActual.dir = 'asc';
    }

    // Actualiza indicador visual
    document.querySelectorAll('thead th[data-col]').forEach(t => {
        t.classList.remove('orden-asc', 'orden-desc');
    });
    th.classList.add(`orden-${ordenActual.dir}`);

    aplicarFiltros();
});

// =========================================
//  CARGAR TICKETS DESDE LA API
// =========================================
// Función asíncrona porque debe esperar la respuesta del servidor
async function cargarTickets(vista = 'activos') {
    // Mostramos un mensaje de carga mientras el servidor responde
    tbodyTickets.innerHTML = `<tr><td colspan="7">Cargando...</td></tr>`;

    try {
        // Definimos a qué endpoint pegarle según la pestaña seleccionada
        const url = vista === 'activos'
            ? 'http://localhost:3000/tickets'
            : 'http://localhost:3000/tickets/historial';

        // Hacemos la petición GET enviando nuestro token en los Headers
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token, // Aquí mandamos la llave maestra
                'Content-Type': 'application/json'
            }
        });

        // Si el token expiró o es inválido (401), cerramos la sesión automáticamente
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            window.location.href = 'index.html';
            return;
        }

        // Convertimos la respuesta a un arreglo de objetos JS
        let tickets = await response.json();

        // Filtro de seguridad: en historial solo mostramos resueltos
        if (vista === 'historial') {
            tickets = tickets.filter(t => t.estado === 'resuelto');
        }

        ticketsCargados = tickets;
        aplicarFiltros(vista);

    } catch (error) {
        console.error(error);
        tbodyTickets.innerHTML = `<tr><td colspan="7">Error al conectar con el servidor</td></tr>`;
    }
}

// =========================================
//  DIBUJAR LA TABLA (RENDERIZADO DINÁMICO)
// =========================================
function dibujarTabla(tickets, vista = 'activos') {
    // Limpiamos la tabla antes de inyectar los nuevos datos
    tbodyTickets.innerHTML = '';

    // Si el arreglo viene vacío, mostramos un mensaje amigable
    if (!tickets.length) {
        tbodyTickets.innerHTML = `<tr><td colspan="7">No hay tickets en esta vista</td></tr>`;
        return;
    }


    // Recorremos cada ticket del arreglo
    tickets.forEach((ticket) => {
        // Asignamos valores por defecto en caso de que vengan en NULL
        const categoria = ticket.categoria || 'Sin evaluar';
        const prioridad = ticket.prioridad || 'Pendiente';
        const estado = ticket.estado || 'pendiente';

        // Formateamos la clase CSS quitando tildes y pasando a minúsculas (Ej: "Crítica" -> "critica")
        const prioridadClase = prioridad.toLowerCase()
            .replace('í', 'i')
            .replace('é', 'e')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        // Formateamos la fecha a formato local chileno
        const fecha = ticket.fechaCreacion
            ? new Date(ticket.fechaCreacion).toLocaleDateString('es-CL')
            : '-';

        // LÓGICA DE NEGOCIO: Mostrar botones según el estado
        let accion = '';
        if (vista === 'historial') {
            accion = `<button class="btn-primary" onclick="verDetalle(${ticket.id})">Ver Detalle</button>`;
        } else if (estado === 'pendiente') {
            accion = `
                <button class="btn-primary" onclick="evaluarTicket(${ticket.id})">Evaluar</button>
                <button class="btn-warning" onclick="editarTicket(${ticket.id})">Editar</button>            
            `;
        } else if (estado === 'en proceso') {
            accion = `
                <button class="btn-success" onclick="resolverTicket(${ticket.id})">Resolver</button>
                <button class="btn-warning" onclick="editarTicket(${ticket.id})">Editar</button>
            `;
        } else {
            accion = `<span>Finalizado</span>`;
        }

        // Creamos la fila (tr) e inyectamos las celdas (td)
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${ticket.id}</td>
            <td>${ticket.nombreSolicitante}</td>
            <td>${categoria}</td>
            <td><span class="badge ${prioridadClase}">${prioridad}</span></td>
            <td>${estado}</td>
            <td>${fecha}</td>
            <td>${accion}</td>
        `;

        // Agregamos la fila al cuerpo de la tabla
        tbodyTickets.appendChild(tr);
    });
}

// =========================================
//  ACCIONES DE LOS BOTONES DE LA TABLA
// =========================================

// Redirige a la pantalla de evaluación pasando el ID en la URL
function evaluarTicket(id) {
    window.location.href = `evaluarTicket.html?id=${id}`;
}

// Redirige a la vista de detalle de un ticket resuelto
function verDetalle(id) {
    window.location.href = `detalleTicket.html?id=${id}&origen=historial`;
}

// Ejecuta el endpoint PATCH para cambiar el estado a "resuelto"
function resolverTicket(id) {
    window.location.href = `detalleTicket.html?id=${id}&origen=activos`;
}

function editarTicket(id) {
    window.location.href = `editarTicket.html?id=${id}`;
}

// =========================================
//  NAVEGACIÓN Y FILTROS (TABS)
// =========================================
// Usamos el operador '?' (Optional Chaining) por si el botón no existe en el HTML no arroje error
btnActivos?.addEventListener('click', () => {
    btnActivos.classList.add('active');
    btnHistorial.classList.remove('active');
    const thEstado = document.querySelector('th[data-col="estado"]');
    thEstado.dataset.col = 'estado'; // restaura el data-col
    thEstado.textContent = 'Estado ↕';
    cargarTickets('activos');
});

btnHistorial?.addEventListener('click', () => {
    btnHistorial.classList.add('active');
    btnActivos.classList.remove('active');
    const thEstado = document.querySelector('th[data-col="estado"]');
    thEstado.removeAttribute('data-col'); // quita el data-col → no es clickeable
    thEstado.textContent = 'Estado';
    cargarTickets('historial');
});

btnNuevoTicket?.addEventListener('click', () => {
    window.location.href = 'nuevoTicket.html';
});

// =========================================
//  INICIALIZACIÓN
// =========================================
const params = new URLSearchParams(window.location.search);
const vistaInicial = params.get('vista') || 'activos';

// Activamos el tab correcto visualmente
if (vistaInicial === 'historial') {
    btnHistorial.classList.add('active');
    btnActivos.classList.remove('active');
    const thEstado = document.querySelector('th[data-col="estado"]');
    thEstado.removeAttribute('data-col');
    thEstado.textContent = 'Estado';
}

// Cargamos la vista que corresponde
cargarTickets(vistaInicial);