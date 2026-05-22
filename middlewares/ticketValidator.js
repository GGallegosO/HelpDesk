
/**
 * Middleware:
 * valida los datos del ticket
 * antes de llegar al controlador.
 *
 * Si hay error → corta flujo.
 * Si todo está correcto → next()
 */

const validarTicket = (req,res,next) => {

// Extraer campos enviados
const {
nombreSolicitante,
correo,
categoria,
impacto,
urgencia,
tiempoEstimado

} =
req.body;


// =====================
// Validar obligatorios
// =====================

if( !nombreSolicitante ||
!correo ||
!categoria ||
!impacto ||
!urgencia ||
!tiempoEstimado

){

return res.status(400).json({
mensaje:'Error: Todos los campos son obligatorios.'});
}


// =====================
// Validar correo
// =====================

// Expresión regular básica
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Si correo inválido
if(!emailRegex.test(correo)){
    return res.status(400).json({mensaje:'Error: formato correo inválido'});
}


// =====================
// Validar listas
// =====================

const valoresPermitidos = [

'bajo',
'medio',
'alto',
'baja',
'media',
'alta'

];


// Convertir a minúscula
const impactoNormalizado = impacto.toLowerCase();

const urgenciaNormalizada = urgencia.toLowerCase();


// Validar valores
if(
!valoresPermitidos.includes(impactoNormalizado)

||

!valoresPermitidos.includes(urgenciaNormalizada)

){

return res.status(400).json({mensaje:'Impacto o urgencia inválidos'});
}


// =====================
// Continuar flujo
// =====================

next();

};


// Exportar
module.exports = {

validarTicket

};