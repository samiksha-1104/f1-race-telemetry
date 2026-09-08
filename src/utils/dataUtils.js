function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function sortSessions(sessions) {
    return [...sessions].sort((first, second) => {
        const firstDate = Date.parse(first.date_start || '') || 0;
        const secondDate = Date.parse(second.date_start || '') || 0;
        return firstDate - secondDate;
    });
}

function normalizeSessions(sessions) {
    return sortSessions(Array.isArray(sessions) ? sessions : []).filter(session => {
        return session && session.session_key && !session.is_cancelled;
    });
}

function normalizeDrivers(drivers) {
    const uniqueDrivers = new Map();
    (Array.isArray(drivers) ? drivers : []).forEach(driver => {
        if (driver && driver.driver_number !== undefined) {
            uniqueDrivers.set(String(driver.driver_number), driver);
        }
    });
    return [...uniqueDrivers.values()].sort((first, second) => {
        return toNumber(first.driver_number) - toNumber(second.driver_number);
    });
}

module.exports = { normalizeSessions, normalizeDrivers, toNumber };
