export function calcularFecha(dias) {
    if (typeof dias !== 'number' || isNaN(dias)) {
        throw new Error('El parámetro debe ser un número válido.');
    }

    let fecha = new Date();
    fecha.setDate(fecha.getDate() + dias); 

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${año}-${mes}-${dia}`; 
}