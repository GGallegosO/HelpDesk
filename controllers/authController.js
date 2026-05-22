// controllers/authController.js

// Importar servicio login
const authService =
    require(
        '../services/authService'
    );


// POST /auth/login
const login =
    async (
        req,
        res
    ) => {

        try {

            // Extraer datos enviados
            const {
                username,
                password

            } =
                req.body;


            // =====================
            // Validar entrada
            // =====================

            // 400 → faltan datos
            if (

                !username ||
                !password

            ) {

                return res
                    .status(400)
                    .json({

                        mensaje:
                            'Debe ingresar usuario y contraseña'

                    });

            }


            // =====================
            // Validar login
            // =====================

            const usuario =

                await authService
                    .validarUsuario(
                        username,
                        password
                    );


            // 401 → credenciales malas
            if (

                !usuario

            ) {

                return res
                    .status(401)
                    .json({

                        mensaje:
                            'Usuario o contraseña incorrectos'

                    });

            }


            // 200 → login correcto
            return res
                .status(200)
                .json({

                    mensaje:
                        'Inicio de sesión exitoso'

                });

        }
        catch (error) {

            console.error(error);


            // 500
            return res
                .status(500)
                .json({

                    mensaje:
                        'Error interno'

                });

        }

    };


// Exportar
module.exports = {

    login

};