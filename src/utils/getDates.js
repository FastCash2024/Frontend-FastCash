export function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export function getDay(dias) {
    var dt = new Date();

    const diasSemana = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    // // console.log('Fecha Actual: ' + dt);
    //restando los dias deseados
    const dat = dt.setDate(dt.getDate() + dias);
    const index = new Date(dat).getDay();
    //mostrando el resultado
    return { val: formatDate(dt), day: diasSemana[index] };
}

export function getTodayDate() {
    const today = new Date();

    // Convertir la fecha a la zona horaria de México
    return today.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'America/Mexico_City' // Asegura la zona horaria
    }).split('/').reverse().join('-'); // Formato YYYY-MM-DD
}


export const getDays = (days) => {
    const dates = [];
    const today = new Date();
    days.forEach(dayOffset => {
        const date = new Date(today);
        date.setDate(today.getDate() + dayOffset);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
    });
    return dates;
};

export function getDayWeek(baseDate, offset) {
    console.log('baseDate: ', baseDate);
    console.log('offset: ', offset);

    const targetDate = new Date(baseDate);
    console.log('targetDate: ', targetDate.toISOString().split('T')[0]);
    if (isNaN(targetDate.getTime())) {
        throw new Error("Invalid baseDate");
    }
    targetDate.setDate(targetDate.getDate() + offset);
    if (isNaN(targetDate.getTime())) {
        throw new Error("Invalid targetDate");
    }

    return { val: targetDate.toISOString().split('T')[0] };
}

export function getDayWeekCustom(dateString) {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Fecha inválida");
    }

    let diaReal = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    // Ajuste para que Lunes sea el primer día y Domingo el último
    let diaIndex = diaReal === 0 ? 6 : diaReal - 1;
    console.log('diaIndex: ', diaIndex);
    console.log('diasSemana[diaIndex]: ', diasSemana[diaIndex]);    

    return diasSemana[diaIndex];
}

export function getMondayOfCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajuste cuando el día es domingo
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

export function obtenerFechaMexicoISO() {
    // Obtener la fecha actual en UTC
    const fechaUTC = new Date();

    // Obtener la fecha en la zona horaria de México
    const opciones = {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    };

    // Convertir la fecha UTC a la hora de México (como string)
    const fechaMexicoString = new Intl.DateTimeFormat("en-US", opciones).format(fechaUTC);

    // Extraer valores (mes/día/año hora:minuto:segundo)
    const [month, day, year, hour, minute, second] = fechaMexicoString.match(/\d+/g);

    // Crear una fecha correcta en México sin errores de zona horaria
    const fechaMexico = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    // Obtener el offset real de México (en minutos)
    const offsetMinutos = new Date().getTimezoneOffset(); // JavaScript ya lo da correcto
    const offsetHoras = -(offsetMinutos / 60);
    const signo = offsetHoras >= 0 ? "+" : "-";
    const offsetStr = `${signo}${String(Math.abs(offsetHoras)).padStart(2, "0")}:00`;

    // Convertir a formato ISO con el offset correcto
    return fechaMexico.toISOString().replace("Z", offsetStr);
}

export function diferenciaEnDias(fecha1, fecha2) {
    // Crear objetos Date para las fechas de inicio y fin
    const inicio = new Date(fecha1);
    const fin = new Date(fecha2);

    // Ajustar la fecha de inicio a las 00:01 del primer día
    inicio.setHours(0, 1, 0, 0);

    // Ajustar la fecha de fin a las 23:59 del último día
    fin.setHours(23, 59, 59, 999);

    // Calcular la diferencia en milisegundos
    const diferenciaMs = fin - inicio;

    // Convertir a días y redondear
    return Math.round(diferenciaMs / (1000 * 60 * 60 * 24));
}

export function getStartAndEndOfWeek() {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Lunes
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Domingo

    const startDate = firstDayOfWeek.toISOString().split('T')[0];
    const endDate = lastDayOfWeek.toISOString().split('T')[0];

    return { startDate, endDate };
}

export const today = obtenerFechaMexicoISO().split('T')[0];

export const getLocalISOString = () => {
    const fechaMexico = new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" });
    return new Date(fechaMexico).toISOString();
};
