// ============================
// IMPORTACIONES
// ============================

// Framework principal
const express = require('express');

// Middleware para permitir peticiones externas
const cors = require('cors');


// Rutas del proyecto
const ticketRoutes = require('./routes/ticketRoutes');

const authRoutes = require('./routes/authRoutes');

// ============================
// CREAR APP
// ============================

const app = express();


// ============================
// MIDDLEWARES GLOBALES
// ============================

// Permitir conexiones externas
app.use( cors() );

// Leer JSON recibido
app.use( express.json() );


// ============================
// REGISTRO DE RUTAS
// ============================

// Rutas de autenticación
app.use('/auth', authRoutes);


// Rutas de tickets
app.use('/tickets', ticketRoutes);


// ============================
// RUTA BASE
// ============================

app.get('/', (req, res) => {
    res.json({ mensaje:
        'Servidor funcionando'
        });
    }
);


// ============================
// INICIAR SERVIDOR
// ============================

const PORT = 3000;

app.listen( PORT, () => {
        console.log(
            `Servidor iniciado en puerto ${PORT}`
        );
    }
);