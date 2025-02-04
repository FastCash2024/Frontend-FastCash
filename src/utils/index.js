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
    if (!fechaISO) return "Fecha no disponible"; // Evita errores con valores nulos o vacíos

    const fecha = new Date(fechaISO);
    
    if (isNaN(fecha.getTime())) return "Fecha inválida"; // Verifica si la fecha es válida

    return new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone
    }).format(fecha);
};


export const obtenerSegmento = (valor) => {
    const partes = valor.split('-');
    return partes.length >= 3 ? partes[2] : null;
};