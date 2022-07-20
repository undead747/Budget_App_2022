export function getDateByMonth(month = new Date().getMonth(), year = new Date().getFullYear()){
    const firstDay = new Date(year, month, 1).getDay();
    let dayCnt = 0 - firstDay;

    return new Array(5).fill([]).map(row => {
        return row[7].fill(null).map(element => {
            dayCnt += 1;
            return new Date(year, month, dayCnt);
        })
    })
}

export function getPreDate(date = new Date()){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
}

export function getNextDate(date = new Date()){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

export function getDayInEnglish(day = new Date().getDate()){
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    return weekday[day];
}

export function getFormatDateForDatePicker(date = new Date()){
    let currMonth = date.getMonth() + 1;
    let currDate = date.getDate();
    if(currMonth < 10) currMonth = `0${currMonth}`;
    if(currDate < 10) currDate = `0${currDate}`;


    return `${date.getFullYear()}-${currMonth}-${currDate}`
}
