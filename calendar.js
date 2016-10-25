var document,
    window,
    funcArray;

function pickUpNewDate(lang, area) {
    "use strict";
    var d = new Date(),
        day = d.getDate(),
        month = d.getMonth() + 1,
        year = d.getFullYear(),
        dayOfWeek = d.getDay(),
        dayOfMonth,
        endOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        dayOfWeekName = [
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"],
            ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
        ],
        monthName = [
            ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
            ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
        ],
        tableHeader = [
            ["previous month", "next month"],
            ["poprzedni miesiąc", "następny miesiąc"],
            ["Vormonat", "nächsten Monat"]
        ],
        table,
        numberOfWeeks;
    switch (lang) {
    case undefined:
    case "":
    case "eng":
        lang = 0;
        break;
    case "pl":
        lang = 1;
        break;
    case "de":
        lang = 2;
        break;
    default:
        lang = 0;
    }
    if (dayOfWeek === 0) {
        dayOfWeek = 7;
    }
    if (year % 4 === 0) {
        endOfMonth[1] = 29;
    }
    endOfMonth.unshift("");
    dayOfWeekName[lang].unshift("");
    monthName[lang].unshift("");

    /* table with all day of current month */
    function tableOfDays(a, b, c) { // a - day, b - No. day in the week, c - month
        var x, // day in the month
            y; // day of the week
        dayOfMonth = [];
        dayOfMonth[0] = "";
        for (x = a, y = b; x > 0; x -= 1, y -= 1) {
            if (y === 0) {
                y = 7;
            }
            dayOfMonth[x] = {
                dayInMonth: x,
                dayInWeek: y
            };
        }
        for (x = a, y = b; x < endOfMonth[c] + 1; x += 1, y += 1) {
            if (y === 8) {
                y = 1;
            }
            dayOfMonth[x] = {
                dayInMonth: x,
                dayInWeek: y
            };
        }
        return dayOfMonth;
    }

    function nOw() {
        var i = 1;
        if (dayOfMonth[1].dayInWeek !== 1) {
            numberOfWeeks = 1;
        } else {
            numberOfWeeks = 0;
        }
        while (dayOfMonth[i]) {
            if (dayOfMonth[i].dayInWeek === 1) {
                numberOfWeeks += 1;
            }
            i += 1;
        }
        return numberOfWeeks;
    }

    function createCalendar(c) {
        var trOn = "<tr>",
            trOff = "</tr>",
            monthHeader,
            weekHeader = "",
            content = "",
            i = 1,
            j = 1;
        monthHeader = trOn + '<td class="monthHeader"  onclick="funcArray.prevMonth()" title="' + tableHeader[lang][0] + '"><i class="material-icons">navigate_before</i></td><td colspan="5" class="monthHeader" title="' + monthName[lang][c] + ', ' + year + '">' + monthName[lang][c] + ', ' + year + '</td><td class="monthHeader" onclick="funcArray.nextMonth()" title="' + tableHeader[lang][1] + '"><i class="material-icons">navigate_next</i></td>' + trOff;
        while (dayOfWeekName[lang][i]) {
            weekHeader += '<td class="weekDayName">' + dayOfWeekName[lang][i] + '</td>';
            i += 1;
        }
        for (j; j < numberOfWeeks + 1; j += 1) {
            content += trOn + '<td id="' + j + '-1"></td><td id="' + j + '-2"></td><td id="' + j + '-3"></td><td id="' + j + '-4"></td><td id="' + j + '-5"></td><td id="' + j + '-6"></td><td id="' + j + '-7"></td>' + trOff;
        }
        table = '<table class="calendar">' + monthHeader + trOn + weekHeader + trOff + content + "</table>";
        return table;
    }

    function drawCalendar(c, ar) {
        var a = 0, // number of week
            b = 1; // number of day
        if (dayOfMonth[1].dayInWeek !== 1) {
            a = 1;
        }
        document.getElementById(ar).innerHTML = table;
        for (b; b < endOfMonth[c] + 1; b += 1) {
            if (dayOfMonth[b].dayInWeek === 1) {
                a += 1;
            }
            document.getElementById(a + "-" + dayOfMonth[b].dayInWeek).innerHTML = dayOfMonth[b].dayInMonth;
            document.getElementById(a + "-" + dayOfMonth[b].dayInWeek).className += "currentMonth";
        }
        if (month === d.getMonth() + 1 && year === d.getFullYear()) {
            document.getElementsByClassName("currentMonth")[d.getDate() - 1].className += " today";
        }
    }

    dayOfMonth = (tableOfDays(day, dayOfWeek, month));
    numberOfWeeks = (nOw());
    table = (createCalendar(month));
    (drawCalendar(month, area));

    function prevMonth() {
        month = month - 1;
        if (month === 0) {
            month = 12;
            year = year - 1;
            if (year % 4 === 0) {
                endOfMonth[2] = 29;
            } else {
                endOfMonth[2] = 28;
            }
        }
        dayOfWeek = dayOfMonth[1].dayInWeek - 1;
        if (dayOfWeek === 0) {
            dayOfWeek = 7;
        }
        dayOfMonth = (tableOfDays(endOfMonth[month], dayOfWeek, month));
        numberOfWeeks = (nOw());
        table = (createCalendar(month));
        (drawCalendar(month, area));
    }

    function nextMonth() {
        dayOfWeek = dayOfMonth[(endOfMonth[month])].dayInWeek + 1;
        if (dayOfWeek === 8) {
            dayOfWeek = 1;
        }
        month = month + 1;
        if (month === 13) {
            month = 1;
            year = year + 1;
            if (year % 4 === 0) {
                endOfMonth[2] = 29;
            } else {
                endOfMonth[2] = 28;
            }
        }
        dayOfMonth = (tableOfDays(1, dayOfWeek, month));
        numberOfWeeks = (nOw());
        table = (createCalendar(month));
        (drawCalendar(month, area));
    }

    /* window.onkeyup = function (e) {
        var key;
        if (e.keyCode) {
            key = e.keyCode;
        } else {
            key = e.which;
        }
        if (key === 37) {
            prevMonth();
        } else if (key === 39) {
            nextMonth();
        }
    }; */

    funcArray = {
        prevMonth: prevMonth,
        nextMonth: nextMonth
    };
}
