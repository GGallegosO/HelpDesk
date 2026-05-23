
/**
 * Middleware para validar la estructura del ticket.
 * Actúa como filtro antes de que la petición llegue al controlador.
 */

const validarTicket = (req, res, next) => {
    const { nombreSolicitante, correo, categoria, impacto, urgencia, tiempoEstimado } = req.body;

    // Validar campos obligatorios
    if (
        !nombreSolicitante || 
        !correo ||
        !categoria || 
        !impacto || 
        !urgencia || 
        !tiempoEstimado) 
        {
        return res.status(400).json({
            mensaje: 'Error: Todos los campos son obligatorios.' 
        });
    }

    // Validar formato de correo (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ mensaje: 'Error: formato correo inválido' });
    }

    // Validar listas permitidas para impacto y urgencia
    const valoresPermitidos = ['bajo', 'medio', 'alto', 'baja', 'media', 'alta'];
    const impactoNormalizado = impacto.toLowerCase();
    const urgenciaNormalizada = urgencia.toLowerCase();

    if (
        !valoresPermitidos.includes(impactoNormalizado) 
        ||
        !valoresPermitidos.includes(urgenciaNormalizada)) {
        return res.status(400).json({ mensaje: 'Impacto o urgencia inválidos' });
    }

    // Categorías permitidas
    // Definimos el catálogo de categorías que nuestro sistema soporta
    const categorias = ['hardware', 'software', 'red', 'cuenta', 'otro'];

    // Verificamos que la categoría recibida esté dentro de nuestra lista permitida
    if (!categorias.includes(categoria.toLowerCase())) {
        return res.status(400).json({
            mensaje: 'Categoría inválida. Debe ser: hardware, software, red, cuenta u otro.'
        });
    }

    // Si todas las validaciones pasan, next() permite avanzar al controlador
    next();
};

module.exports = { validarTicket };