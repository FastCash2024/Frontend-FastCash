export function reestructurarArray(arr) {
    return arr().map(item => {
        // Eliminar el contenido dentro de los corchetes y los propios corchetes
        return item.replace(/\s*\[.*?\]\s*/g, '').trim();
    });
}


export function reestructurarArrayForBody(arr) {
    return arr().map(item => {
        const match = item.match(/\[(.*?)\]/); // Buscar contenido dentro de los corchetes []

        if (match) {
            return match[1]; // Si hay corchetes, devolver solo el contenido dentro
        } else {
            return item.replace(/\s*\(.*?\)\s*/g, ''); // Si no hay corchetes, eliminar paréntesis y su contenido
        }
    });
}

export const extraerCodigo = (cadena) => {
    return cadena.split(" = ")[0];
};
