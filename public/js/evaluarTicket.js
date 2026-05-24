// =========================================
// Responsable: Cargar ticket original y enviar evaluación
// =========================================

// SEGURIDAD FRONTEND
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');

if (!token || rol !== 'admin') {
    alert('Acceso denegado. Se requieren privilegios de administrador.');
    window.location.href = 'index.html';
}

// CAPTURAR EL ID DE LA URL (ej: evaluarTicket.html?id=5)
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
    alert('ID de ticket no válido.');
    window.location.href = 'dashboard.html';
}

// CARGAR LOS DATOS DEL TICKET ORIGINAL
async function cargarTicketOriginal() {
    const contenedorDetalle = document.getElementById('detalleTicketOriginal');

    try {
        // Hacemos la consulta a tu endpoint GET /tickets/:id
        const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Extraemos los datos que ingresó el usuario
            const ticket = await response.json();

            // Reemplazamos el texto de "Cargando..." por la información real
            contenedorDetalle.innerHTML = `
                <p style="margin-bottom: 8px;"><strong>Ticket:</strong> #${ticket.id}</p>
                <p style="margin-bottom: 8px;"><strong>Solicitante:</strong> ${ticket.nombreSolicitante} (${ticket.correo})</p>
                <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.1); margin: 12px 0;">
                <p style="margin-bottom: 5px;"><strong>Descripción del problema:</strong></p>
                <p style="white-space: pre-wrap; font-style: italic; color: var(--text-main);">${ticket.descripcion}</p>
            `;
        } else {
            contenedorDetalle.innerHTML = '<p style="color: red;">Error: No se encontró el ticket.</p>';
        }
    } catch (error) {
        console.error('Error al cargar:', error);
        contenedorDetalle.innerHTML = '<p style="color: red;">Error al conectar con el servidor.</p>';
    }
}

// Ejecutamos la carga apenas se abre la pantalla
cargarTicketOriginal();

// =========================================
//  CÁLCULO DE PRIORIDAD EN TIEMPO REAL
// =========================================
const selectImpacto   = document.getElementById('impacto');
const selectUrgencia  = document.getElementById('urgencia');
const selectCategoria = document.getElementById('categoria');
const inputTiempo     = document.getElementById('tiempo');
const inputPrioridad  = document.getElementById('prioridadCalculada');

function calcularPrioridad() {
    const impacto   = selectImpacto.value;
    const urgencia  = selectUrgencia.value;
    const categoria = selectCategoria.value;
    const tiempo    = Number(inputTiempo.value);

    if (!impacto || !urgencia) { inputPrioridad.value = ''; return; }

    const puntos = { bajo:1, medio:2, alto:3, baja:1, media:2, alta:3 };
    let total = puntos[impacto] + puntos[urgencia];
    if (categoria === 'red' || categoria === 'cuenta') total++;
    if (tiempo > 4) total++;

    if (total >= 7)       inputPrioridad.value = 'Crítica';
    else if (total === 6) inputPrioridad.value = 'Alta';
    else if (total >= 4)  inputPrioridad.value = 'Media';
    else                  inputPrioridad.value = 'Baja';
}

selectImpacto?.addEventListener('change', calcularPrioridad);
selectUrgencia?.addEventListener('change', calcularPrioridad);
selectCategoria?.addEventListener('change', calcularPrioridad);
inputTiempo?.addEventListener('input', calcularPrioridad);

// =========================================
//  MODO OSCURO
// =========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

// ENVIAR LA EVALUACIÓN (PUT)
const formEvaluacion = document.getElementById('formEvaluacion');

formEvaluacion.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Capturamos lo que elegiste en los selectores
    const datosEvaluacion = {
        categoria: document.getElementById('categoria').value,
        impacto: document.getElementById('impacto').value,
        urgencia: document.getElementById('urgencia').value,
        tiempoEstimado: Number(document.getElementById('tiempo').value)
    };

    try {
        // Enviamos al endpoint que calcula la prioridad
        const response = await fetch(`http://localhost:3000/tickets/${id}/evaluar`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEvaluacion)
        });

        if (response.ok) {
            alert('Evaluación guardada. El ticket ahora está "en proceso".');
            window.location.href = 'dashboard.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.mensaje}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar la evaluación.');
    }
});