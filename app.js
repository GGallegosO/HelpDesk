// ============================
// IMPORTACIONES
// ============================
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const express = require('express'); // Framework para crear el servidor HTTP
const cors = require('cors'); // Permite peticiones desde otros orígenes (ej: frontend en otro puerto)
const path = require('path'); // Utilidad de Node para construir rutas de archivos de forma segura

// Rutas del proyecto
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');

// ============================
// CREAR APP
// ============================
const app = express(); // Crea la instancia principal de la aplicación Express

// ============================
// MIDDLEWARES GLOBALES
// ============================
// Un middleware es una función que se ejecuta ANTES de que llegue la petición a la ruta final.
// Se aplican en orden, de arriba hacia abajo.

app.use(cors()); // Habilita CORS para todas las rutas (debe ir primero)

app.use(express.json()); // Permite leer el body de las peticiones en formato JSON

// Sirve todos los archivos de la carpeta 'public' de forma estática (HTML, CSS, JS, imágenes).
// Al visitar localhost:3000 se servirá automáticamente public/index.html.
// Ejemplo: /css/style.css → busca en public/css/style.css
app.use(express.static(path.join(__dirname, 'public')));

// ============================
// REGISTRO DE RUTAS
// ============================
// Todas las peticiones que empiecen con /auth serán manejadas por authRoutes
app.use('/auth', authRoutes);

// Todas las peticiones que empiecen con /tickets serán manejadas por ticketRoutes
app.use('/tickets', ticketRoutes);

// ============================
// INICIAR SERVIDOR
// ============================
const PORT = process.env.PORT || 3000; // Usa el puerto del .env o 3000 como respaldo

app.listen(PORT, () => {
    // Este callback se ejecuta una sola vez cuando el servidor está listo
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});