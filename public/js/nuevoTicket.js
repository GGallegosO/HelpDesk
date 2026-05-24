// =========================================
//  VERIFICACIÓN DE SEGURIDAD
// =========================================
const token = localStorage.getItem('token');
const rol   = localStorage.getItem('rol');

if (!token) {
    alert('Acceso denegado. Por favor, inicie sesión.');
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
//  CERRAR SESIÓN
// =========================================
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        window.location.href = 'index.html';
    });
}

// =========================================
//  MOSTRAR CAMPOS ADMIN SI CORRESPONDE
// =========================================
const camposAdmin = document.getElementById('camposAdmin');

// Si el usuario es admin, mostramos los campos extra
if (rol === 'admin') {
    camposAdmin.style.display = 'block';
}

// =========================================
//  CÁLCULO AUTOMÁTICO DE PRIORIDAD
// =========================================
const selectImpacto   = document.getElementById('impacto');
const selectUrgencia  = document.getElementById('urgencia');
const selectCategoria = document.getElementById('categoria');
const inputTiempo     = document.getElementById('tiempoEstimado');
const inputPrioridad  = document.getElementById('prioridadCalculada');

function calcularPrioridad() {
    const impacto   = selectImpacto.value;
    const urgencia  = selectUrgencia.value;
    const categoria = selectCategoria.value;
    const tiempo    = Number(inputTiempo.value);

    // Si faltan los campos mínimos, no calculamos
    if (!impacto || !urgencia) {
        inputPrioridad.value = '';
        return;
    }

    const puntos = {
        bajo: 1, medio: 2, alto: 3,
        baja: 1, media: 2, alta: 3
    };

    let total = puntos[impacto] + puntos[urgencia];

    // Bonus categoría (igual que el backend)
    if (categoria === 'red' || categoria === 'cuenta') total++;

    // Bonus tiempo (igual que el backend)
    if (tiempo > 4) total++;

    // Resultado según pauta
    if (total >= 7)      inputPrioridad.value = 'Crítica';
    else if (total === 6) inputPrioridad.value = 'Alta';
    else if (total >= 4)  inputPrioridad.value = 'Media';
    else                  inputPrioridad.value = 'Baja';
}

// Recalcula al cambiar cualquier campo que afecte la prioridad
selectImpacto?.addEventListener('change', calcularPrioridad);
selectUrgencia?.addEventListener('change', calcularPrioridad);
selectCategoria?.addEventListener('change', calcularPrioridad);
inputTiempo?.addEventListener('input', calcularPrioridad);  // 'input' reacciona a cada tecla

// =========================================
//  ENVÍO DEL FORMULARIO
// =========================================
const formNuevoTicket = document.getElementById('formNuevoTicket');

formNuevoTicket.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Datos base que todos envían
    const nuevoTicket = {
        nombreSolicitante: document.getElementById('nombreSolicitante').value,
        correo:            document.getElementById('correo').value,
        descripcion:       document.getElementById('descripcion').value,
    };

    // Si es admin, agregamos los campos extra al objeto
    if (rol === 'admin') {
        nuevoTicket.categoria      = document.getElementById('categoria').value;
        nuevoTicket.impacto        = document.getElementById('impacto').value;
        nuevoTicket.urgencia       = document.getElementById('urgencia').value;
        nuevoTicket.tiempoEstimado = Number(document.getElementById('tiempoEstimado').value);
    }

    try {
        const response = await fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoTicket)
        });

        if (response.ok) {
            alert('¡Ticket enviado correctamente!');

            // Admin vuelve al dashboard, usuario limpia el formulario
            if (rol === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                formNuevoTicket.reset();
            }

        } else if (response.status === 401) {
            alert('Sesión inválida o expirada.');
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.mensaje || 'Intente nuevamente'}`);
        }

    } catch (error) {
        console.error('Error de red:', error);
        alert('Error al conectar con el servidor.');
    }
});

// =========================================
//  BOTÓN CANCELAR
// =========================================
const btnCancelar = document.getElementById('btnCancelar');

if (btnCancelar) {
    btnCancelar.addEventListener('click', () => {
        // Admin vuelve al dashboard, usuario limpia el formulario
        if (rol === 'admin') {
            window.location.href = 'dashboard.html';
        } else {
            formNuevoTicket.reset();
        }
    });
}