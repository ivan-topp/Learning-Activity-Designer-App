
export default class TimeFormatter {
    static toHoursAndMinutes = (timeInMinutes = 0) => {
        let hours = Math.floor(timeInMinutes / 60);
        let minutes = Math.round((timeInMinutes / 60 - hours) * 60);
        return [hours, minutes];
    }

    static toMinutes = (hours = 0, minutes = 0) => {
        return (parseInt(hours) * 60) + parseInt(minutes);
    };
}