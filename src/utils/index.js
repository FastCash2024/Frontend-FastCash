export const generarContrasena = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let contrasenaGenerada = '';
    const longitud = 16; // Longitud de la contraseña

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        contrasenaGenerada += caracteres[indice];
    }
    return contrasenaGenerada

};

export const formatearFecha = (fechaISO, timeZone = "America/Mexico_City") => {
    if (!fechaISO) return "Fecha no disponible"; 

    const fecha = new Date(fechaISO);
    
    if (isNaN(fecha.getTime())) return "Fecha inválida"; 

    return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone
    }).format(fecha);
};

// funcion para obtener la fecha actual y devolver en el formato yyyy-mm-dd
export function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const obtenerSegmento = (valor) => {
    const partes = valor?.split('-');
    return partes?.length >= 3 ? partes[2] : null;
};


export function ajustarFechaInicio(fecha) {
    // Crear un objeto Date con la fecha original
    const originalDate = new Date(fecha);

    // Establecer la hora a las 00:01 manteniendo la zona horaria
    originalDate.setHours(0, 1, 0, 0);

    // Devolver la fecha ajustada en formato string con la zona horaria original
    const offset = originalDate.getTimezoneOffset() * 60000;  // Obtener el desfase horario en milisegundos
    const fechaAjustada = new Date(originalDate - offset);  // Ajustar la fecha al desfase original

    // Crear el string con la fecha ajustada, respetando el formato local
    const fechaLocal = fechaAjustada.toISOString().slice(0, 19); // Quitar la 'Z' para mantener la zona horaria original
    const zonaHoraria = fecha.slice(-6);  // Tomar la zona horaria original

    return `${fechaLocal}${zonaHoraria}`;
}
export function ajustarFechaFinal(fecha) {
    // Crear un objeto Date con la fecha original
    const originalDate = new Date(fecha);

    // Establecer la hora a las 00:01 manteniendo la zona horaria
    originalDate.setHours(0, 1, 0, 0);

    // Sumar 7 días
    originalDate.setDate(originalDate.getDate() + 6);

    // Devolver la fecha ajustada en formato string con la zona horaria original
    const offset = originalDate.getTimezoneOffset() * 60000;  // Obtener el desfase horario en milisegundos
    const fechaAjustada = new Date(originalDate - offset);  // Ajustar la fecha al desfase original

    // Crear el string con la fecha ajustada, respetando el formato local
    const fechaLocal = fechaAjustada.toISOString().slice(0, 19); // Quitar la 'Z' para mantener la zona horaria original
    const zonaHoraria = fecha.slice(-6);  // Tomar la zona horaria original

    return `${fechaLocal}${zonaHoraria}`;
}


