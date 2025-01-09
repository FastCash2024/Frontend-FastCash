// ----------------------- SOLICITUD DE PRESTAMO
// POST http://localhost:3000/api/verification
const json1 = {
    "numeroDePrestamo": "12345",
    "idDeSubFactura": "SUB12345",
    "estadoDeCredito": "Pendiente",
    "nombreDelCliente": "Juan Pérez",
    "numeroDeTelefonoMovil": "5551234567",
    "clientesNuevos": "Si",
    "valorSolicitado": 1500,
    "valorEnviado": 1200,
    "registroDeNotas": "Cliente necesita seguimiento",
    "nombreDelProducto": "Préstamo Personal",
    "fechaDeReembolso": "2024-12-31",
    "fechaDeCreacionDeLaTarea": "2024-10-01",
    "fechaDeTramitacionDelCaso": "2024-10-10",
    "nombreDeLaEmpresa": "Finanzas SA",
}
// ----------------------- VERIFICACION DE PRESTAMO
// PUT http://localhost:3000/api/verification/:id
const json2 = {
    "estadoDeCredito": "Pendiente",
    "apodoDeUsuarioDeCobro": "CobroJuan"
}