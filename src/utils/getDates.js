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


export function getMondayOfCurrentWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajuste cuando el día es domingo
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

export function getStartAndEndOfWeek() {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Lunes
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Domingo

    const startDate = firstDayOfWeek.toISOString().split('T')[0];
    const endDate = lastDayOfWeek.toISOString().split('T')[0];

    return { startDate, endDate };
}