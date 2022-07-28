/**
 * Get all dates in input month, year.
 * Returns 2 dimension array represent of dates in input month, otherwise it will select current month.
 * @param {string} month - input month.
 * @param {string} year - input year.
 */
export function getDateByMonth({ month = new Date().getMonth(), year = new Date().getFullYear() } = {}) {
    const firstDay = new Date(year, month, 1).getDay();
    let dayCnt = 0 - firstDay;

    return new Array(5).fill([]).map(row => {
        return row[7].fill(null).map(element => {
            dayCnt += 1;
            return new Date(year, month, dayCnt);
        })
    })
}

/**
 * Get previous date base on input date
 * Returns previous date, otherwise return previous date of current date
 * @param {date} date - input date.
 */
export function getPreDate(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
}

/**
 * Get next date base on input date
 * Returns next date, otherwise return next date of current date
 * @param {date} date - input date.
 */
export function getNextDate(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

/**
 * Get current day name base on input index day
 * Returns name of day, otherwise return name of current day
 * @param {number} day - day index.
 */
export function getDayInEnglish(day = new Date().getDate()) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return weekday[day];
}

/**
 * Get formated date for date picker input
 * Returns string represent of input date, otherwite return string of current date  
 * @param {date} date - input date.
 */
export function getFormatDateForDatePicker(date = new Date()) {
    let currMonth = date.getMonth() + 1;
    let currDate = date.getDate();
    if (currMonth < 10) currMonth = `0${currMonth}`;
    if (currDate < 10) currDate = `0${currDate}`;


    return `${date.getFullYear()}-${currMonth}-${currDate}`
}
