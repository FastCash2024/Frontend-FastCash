export const getDescripcionDeExcepcion = (cc) => {
    switch (cc) {
        case 'Casos de Cobranza':
            return 'CC01';
        case 'Incurrir en una estación de trabajo':
            return 'CC02';
        case 'Cobro y balance':
            return 'CC08';
        case 'Recolección y Validación de Datos':
            return 'VC01';
        default:
            return 'DSC00';
    }
};