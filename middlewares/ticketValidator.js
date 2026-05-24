/**
 * Middleware para validar creación de ticket.
 * Solo valida información que entrega el usuario.
 */

const validarTicket = (
    req,
    res,
    next
) => {

    const {
        nombreSolicitante,
        correo,
        descripcion
    } = req.body;


    // ======================
    // Campos obligatorios
    // ======================

    if (
        !nombreSolicitante
        ||
        !correo
        ||
        !descripcion
    ) {

        return res
            .status(400)
            .json({

                mensaje:
                    'Nombre, correo y descripción son obligatorios'

            });

    }


    // ======================
    // Validar correo
    // ======================

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailRegex.test(
            correo
        )
    ) {

        return res
            .status(400)
            .json({

                mensaje:
                    'Formato de correo inválido'

            });

    }


    // ======================
    // Continuar
    // ======================

    next();

};


// Exportar
module.exports = {

    validarTicket

};