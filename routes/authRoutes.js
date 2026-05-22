

const express =
    require(
        'express'
    );

// Crear enrutador
const router =
    express.Router();


// Importar controlador
const authController =
    require(
        '../controllers/authController'
    );


// POST /auth/login
router.post(

    '/login',

    authController.login

);


// Exportar
module.exports = router;