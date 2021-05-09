
const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
];


export const formatDate = ( dateTime, showDayName = false ) => {
    const year = dateTime.getFullYear();
    const date = dateTime.getDate();
    const monthName = months[dateTime.getMonth()];
    const dayName = days[dateTime.getDay()];
    if (showDayName) return `${dayName}, ${date} de ${monthName} de ${year}`;
    return `${date} de ${monthName} de ${year}`;
};

export const formatTime = ( dateTime, showSeconds = false ) => {
    const options = { hour: 'numeric', minute: 'numeric'};
    if (showSeconds) options.second = 'numeric';
    return dateTime.toLocaleTimeString('es-ES', options);
};