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