// =========================================
// SEGURIDAD FRONTEND
// =========================================
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');

if (!token || rol !== 'admin') {
    alert('Acceso denegado.');
    window.location.href = 'index.html';
}

// =========================================
// MODO OSCURO
// =========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// =========================================
// CAPTURAR ID DE LA URL
// =========================================
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const origen = params.get('origen') || 'activos';

if (!id) {
    alert('ID de ticket no válido.');
    window.location.href = 'dashboard.html';
}

// =========================================
// CARGAR Y MOSTRAR EL TICKET (SOLO LECTURA)
// =========================================
async function cargarDetalle() {
    const contenedorInfo = document.getElementById('detalleTicketOriginal');
    const contenedorEval = document.getElementById('detalleEvaluacion');

    try {
        const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            contenedorInfo.innerHTML = '<p style="color:red;">No se encontró el ticket.</p>';
            return;
        }

        const ticket = await response.json();

        // Datos del solicitante (igual que evaluarTicket)
        contenedorInfo.innerHTML = `
            <p style="margin-bottom: 8px;"><strong>Ticket:</strong> #${ticket.id}</p>
            <p style="margin-bottom: 8px;"><strong>Solicitante:</strong> ${ticket.nombreSolicitante} (${ticket.correo})</p>
            <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 12px 0;">
            <p style="margin-bottom: 5px;"><strong>Descripción del problema:</strong></p>
            <p style="white-space: pre-wrap; font-style: italic; color: var(--text-main);">${ticket.descripcion}</p>
        `;

        // Datos de la evaluación ya guardada (solo lectura)
        contenedorEval.innerHTML = `
            <div class="form-group">
                <label>Categoría</label>
                <input type="text" value="${ticket.categoria || 'Sin categoría'}" disabled>
            </div>
            <div class="form-group">
                <label>Impacto</label>
                <input type="text" value="${ticket.impacto || 'No registrado'}" disabled>
            </div>
            <div class="form-group">
                <label>Urgencia</label>
                <input type="text" value="${ticket.urgencia || 'No registrado'}" disabled>
            </div>
            <div class="form-group">
                <label>Prioridad calculada</label>
                <input type="text" value="${ticket.prioridad || 'Sin prioridad'}" disabled>
            </div>
            <div class="form-group">
                <label>Estado</label>
                <input type="text" value="${ticket.estado || '-'}" disabled>
            </div>
            <div class="form-group">
                <label>Tiempo estimado (Horas)</label>
                <input type="text" value="${ticket.tiempoEstimado ? ticket.tiempoEstimado + 'h' : 'No registrado'}" disabled>
            </div>
            <div class="form-group">
                <label>Fecha de creación</label>
                <input type="text" value="${ticket.fechaCreacion ? new Date(ticket.fechaCreacion).toLocaleDateString('es-CL') : '-'}" disabled>
            </div>
        `;

        // Solo el admin ve el botón Resolver, y solo si el ticket está en proceso
        const btnResolver = document.getElementById('btnResolver');
        if (rol === 'admin' && ticket.estado === 'en proceso') {
            btnResolver.style.display = 'block';

            btnResolver.addEventListener('click', async () => {
                if (!confirm('¿Confirmas que este ticket ha sido resuelto?')) return;

                try {
                    const res = await fetch(`http://localhost:3000/tickets/${id}/resolver`, {
                        method: 'PATCH',
                        headers: { 'Authorization': token }
                    });

                    if (res.ok) {
                        alert('Ticket resuelto con éxito.');
                        window.location.href = 'dashboard.html';
                    } else {
                        alert('No se pudo resolver el ticket.');
                    }
                } catch (err) {
                    console.error(err);
                    alert('Error al conectar con el servidor.');
                }
            });
        }

    } catch (error) {
        console.error('Error al cargar detalle:', error);
        contenedorInfo.innerHTML = '<p style="color:red;">Error al conectar con el servidor.</p>';
    }
}

document.getElementById('btnVolver').addEventListener('click', () => {
    window.location.href = `dashboard.html?vista=${origen}`;
});

cargarDetalle();

