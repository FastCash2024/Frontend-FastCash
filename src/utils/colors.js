export function getBackgroundClass(estado) {
    switch (estado) {
        case 'Operando':
            return 'text-green-400';
        case 'Atraso-1':
            return 'text-yellow-400';
        case 'Atraso-2':
            return 'text-orange-400';
        case 'Falta':
            return 'text-red-500';
        default:
            return '';
    }
}