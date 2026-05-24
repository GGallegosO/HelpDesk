// =========================================
//  SEGURIDAD
// =========================================
const token = localStorage.getItem('token');
const rol = localStorage.getItem('rol');

if (!token || rol !== 'admin') {
    alert('Acceso denegado.');
    window.location.href = 'index.html';
}

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

// =========================================
//  CAPTURAR ID DE LA URL
// =========================================
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
    alert('ID de ticket no válido.');
    window.location.href = 'dashboard.html';
}

// =========================================
//  REFERENCIAS A CAMPOS
// =========================================
const inputNombre = document.getElementById('nombreSolicitante');
const inputCorreo = document.getElementById('correo');
const inputDesc = document.getElementById('descripcion');
const selectCat = document.getElementById('categoria');
const selectImpacto = document.getElementById('impacto');
const selectUrgencia = document.getElementById('urgencia');
const inputTiempo = document.getElementById('tiempoEstimado');
const inputPrioridad = document.getElementById('prioridadCalculada');

// =========================================
//  CÁLCULO DE PRIORIDAD EN TIEMPO REAL
// =========================================
function calcularPrioridad() {
    const impacto = selectImpacto.value;
    const urgencia = selectUrgencia.value;
    const categoria = selectCat.value;
    const tiempo = Number(inputTiempo.value);

    if (!impacto || !urgencia) { inputPrioridad.value = ''; return; }

    const puntos = { bajo: 1, medio: 2, alto: 3, baja: 1, media: 2, alta: 3 };
    let total = puntos[impacto] + puntos[urgencia];

    if (categoria === 'red' || categoria === 'cuenta') total++;
    if (tiempo > 4) total++;

    if (total >= 7) inputPrioridad.value = 'Crítica';
    else if (total === 6) inputPrioridad.value = 'Alta';
    else if (total >= 4) inputPrioridad.value = 'Media';
    else inputPrioridad.value = 'Baja';
}

selectImpacto?.addEventListener('change', calcularPrioridad);
selectUrgencia?.addEventListener('change', calcularPrioridad);
selectCat?.addEventListener('change', calcularPrioridad);
inputTiempo?.addEventListener('input', calcularPrioridad);

// =========================================
//  CARGAR DATOS ACTUALES DEL TICKET
// =========================================
async function cargarTicket() {
    try {
        const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            alert('No se encontró el ticket.');
            window.location.href = 'dashboard.html';
            return;
        }

        const ticket = await response.json();

        // Rellenamos los campos con los valores actuales
        inputNombre.value = ticket.nombreSolicitante || '';
        inputCorreo.value = ticket.correo || '';
        inputDesc.value = ticket.descripcion || '';
        inputTiempo.value = ticket.tiempoEstimado || '';

        // Para los selects usamos value directamente
        selectCat.value = ticket.categoria || '';
        selectImpacto.value = ticket.impacto || '';
        selectUrgencia.value = ticket.urgencia || '';

        // Calculamos la prioridad con los datos cargados
        calcularPrioridad();

    } catch (error) {
        console.error('Error al cargar ticket:', error);
        alert('Error al conectar con el servidor.');
    }
}

cargarTicket();

// =========================================
//  ENVIAR CAMBIOS
// =========================================
const formEditar = document.getElementById('formEditar');

formEditar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datosActualizados = {
        nombreSolicitante: inputNombre.value,
        correo: inputCorreo.value,
        descripcion: inputDesc.value,
        categoria: selectCat.value,
        impacto: selectImpacto.value,
        urgencia: selectUrgencia.value,
        tiempoEstimado: Number(inputTiempo.value)
    };

    try {
        const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (response.ok) {
            alert('Ticket actualizado correctamente.');
            window.location.href = 'dashboard.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.mensaje || 'No se pudo actualizar.'}`);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor.');
    }
});

// =========================================
//  BOTÓN VOLVER
// =========================================
document.getElementById('btnVolver').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});