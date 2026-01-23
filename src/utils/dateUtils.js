/**
 * Safely parses a datetime-local input string (YYYY-MM-DDTHH:mm) as a LOCAL date.
 * This prevents mobile browsers from incorrectly parsing it as UTC.
 * @param {string} dtStr - The string from <input type="datetime-local">
 * @returns {Date|null}
 */
export const parseDateTimeLocal = (dtStr) => {
    if (!dtStr) return null;
    try {
        // Expected format: "YYYY-MM-DDTHH:mm"
        const [datePart, timePart] = dtStr.split('T');
        if (!datePart || !timePart) return new Date(dtStr); // Fallback

        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        // Month is 0-indexed in JS Date: Jan is 0, Dec is 11
        const date = new Date(year, month - 1, day, hours, minutes);

        // Final sanity check
        if (isNaN(date.getTime())) return null;

        return date;
    } catch (e) {
        console.error("Error parsing local datetime:", e);
        return null;
    }
};

/**
 * Converts a datetime-local string to a UTC ISO string safely.
 * @param {string} dtStr 
 * @returns {string|null}
 */
export const datetimeLocalToUTC = (dtStr) => {
    const date = parseDateTimeLocal(dtStr);
    return date ? date.toISOString() : null;
};

/**
 * Formats a Date object or ISO string back into the "YYYY-MM-DDTHH:mm" format 
 * expected by <input type="datetime-local">, localized to the user's timezone.
 * @param {Date|string} date 
 * @returns {string}
 */
export const toDateTimeLocalString = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!d || isNaN(d.getTime())) return "";

    const pad = (num) => String(num).padStart(2, '0');

    const Y = d.getFullYear();
    const M = pad(d.getMonth() + 1);
    const D = pad(d.getDate());
    const h = pad(d.getHours());
    const m = pad(d.getMinutes());

    return `${Y}-${M}-${D}T${h}:${m}`;
};
