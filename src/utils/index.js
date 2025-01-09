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