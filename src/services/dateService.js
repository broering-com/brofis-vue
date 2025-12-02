// Hilfsfunktion: führende Null
function pad(n) {
    return String(n).padStart(2, "0");
}

// YYYY-MM-DD formatter
function format(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
}

// aktuelles Datum
function today() {
    return format(new Date());
}

// String -> Date
function toDate(str) {
    return new Date(str + "T00:00:00");
}

// generische Add/Sub-Funktion
function addDays(date, amount) {
    const d = date instanceof Date ? new Date(date) : toDate(date);
    d.setDate(d.getDate() + amount);
    return format(d);
}

function subtractDays(date, amount) {
    return addDays(date, -amount);
}

export function useDateService() {
    return {
        format,
        today,
        toDate,
        addDays,
        subtractDays,
    };
}
