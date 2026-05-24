// public/js/index.js

// =========================================
//  MANEJO DEL MODO OSCURO (UI/UX)
// =========================================
// Capturamos el botón y el cuerpo entero del documento (HTML)
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Al cargar la página, le preguntamos a la memoria del navegador (localStorage)
// si el usuario ya había elegido el modo oscuro en una visita anterior.
// El localStorage no se borra aunque el usuario cierre la pestaña.
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode'); // Le aplicamos la clase CSS
    themeToggle.textContent = '☀️';   // Cambiamos el icono
} else {
    themeToggle.textContent = '🌙';   // Por defecto se queda claro
}

// "Escuchamos" cada vez que el usuario hace clic en el botón de la luna/sol
themeToggle.addEventListener('click', () => {
    // toggle() es un interruptor: si la clase 'dark-mode' está, la quita. Si no está, la pone.
    body.classList.toggle('dark-mode');

    // Verificamos cómo quedó el body después del clic
    const isDark = body.classList.contains('dark-mode');

    // Guardamos la nueva preferencia en el navegador para su próxima visita
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Actualizamos el icono visualmente (Operador ternario: Si es dark ? pon sol : si no pon luna)
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});


// =========================================
//  LÓGICA DE INICIO DE SESIÓN Y ENRUTAMIENTO
// =========================================
// Capturamos el formulario completo y escuchamos el evento 'submit' (cuando se presiona "Entrar")
document.getElementById('loginForm').addEventListener('submit', async (evento) => {

    // EXTREMADAMENTE IMPORTANTE: preventDefault() evita que el navegador 
    // recargue la página o intente enviar los datos por la URL por defecto.
    evento.preventDefault();

    // Capturamos los valores que el usuario escribió en las cajas de texto
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const mensajeError = document.getElementById('mensajeError');

    // Ocultamos cualquier mensaje de error de un intento fallido anterior
    mensajeError.style.display = 'none';

    try {
        // Hacemos la petición HTTP POST a nuestro backend usando Fetch API
        // Usamos 'await' porque el servidor tarda unos milisegundos en responder
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST', // Método para enviar datos sensibles
            headers: {
                'Content-Type': 'application/json' // Le decimos al backend "Te mando un JSON"
            },
            // Convertimos las variables de JS a texto JSON para que viajen por la red
            body: JSON.stringify({ username: user, password: pass })
        });

        // Convertimos la respuesta de texto que nos devolvió el servidor a un objeto de JS
        const data = await response.json();

        // response.ok es true si el backend respondió con códigos 200 a 299 (Ej: 200 OK)
        // Será false si el backend respondió 401 (No Autorizado) o 500 (Error de servidor)
        if (response.ok) {

            // EL NAVEGADOR GUARDA LOS SECRETOS
            // Guardamos la llave maestra  y el rol (admin/usuario) en el localStorage.
            // Esto servirá para que las otras páginas (dashboard.html) sepan quién es.
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);

            //EL DIRECTOR DE TRÁFICO (Control de Acceso Básico)
            // Leemos el rol que nos dio el backend y redirigimos la página (cambiamos la URL)
            if (data.rol === 'admin') {
                window.location.href = 'dashboard.html'; // El admin va al panel de control
            } else {
                window.location.href = 'nuevoTicket.html'; // El usuario va directo a crear ticket
            }

        } else {
            // Si entra aquí, significa que la contraseña estaba mal o el usuario no existe.
            // Mostramos el mensaje que nos mandó el backend en el authController.
            mensajeError.textContent = data.mensaje || 'Credenciales incorrectas';
            mensajeError.style.display = 'block'; // Hacemos visible la caja roja de error
        }

    } catch (error) {
        // Si entra al catch, significa que tu servidor de Node.js está apagado
        // o que hay un problema con tu conexión a internet (el fetch falló a nivel de red).
        console.error('Error de conexión:', error);
        mensajeError.textContent = 'Error al conectar con el servidor.';
        mensajeError.style.display = 'block';
    }
});