export type DayStartOrEnd = "day-end" | "day-start";

function daysBeforeToday(days: number, type: DayStartOrEnd): Date {
    if (days < 0) throw new Error("[util] DateUtil.daysBeforeToday: days must be >=0");
    return dateRelativeTo(new Date(), -days, type);
}

function daysBeforeTodayAsString(days: number, type: DayStartOrEnd): string {
    if (days < 0) throw new Error("[util] DateUtil.daysBeforeTodayAsString: days must be >=0");
    return format(daysBeforeToday(days, type));
}

function daysAfterToday(days: number, type: DayStartOrEnd): Date {
    if (days < 0) throw new Error("[util] DateUtil.daysAfterToday: days must be >=0");
    return dateRelativeTo(new Date(), days, type);
}

function daysAfterTodayAsString(days: number, type: DayStartOrEnd): string {
    if (days < 0) throw new Error("[util] DateUtil.daysAfterTodayAsString: days must be >=0");
    return format(daysAfterToday(days, type));
}

function today(type: DayStartOrEnd): Date {
    return dateRelativeTo(new Date(), 0, type);
}

function todayAsString(type: DayStartOrEnd): string {
    return format(today(type));
}

function daysBefore(date: Date, days: number, type: DayStartOrEnd): Date {
    if (days < 0) throw new Error("[util] DateUtil.daysBefore: days must be >=0");
    return dateRelativeTo(date, -days, type);
}

function daysAfter(date: Date, days: number, type: DayStartOrEnd): Date {
    if (days < 0) throw new Error("[util] DateUtil.daysAfter: days must be >=0");
    return dateRelativeTo(date, days, type);
}

function someday(date: Date, type: DayStartOrEnd): Date {
    return dateRelativeTo(date, 0, type);
}

/**
 * @param text should match ISO date format
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#Date_Time_String_Format
 * Otherwise, it returns NULL
 */
function parse(text: string): Date | null {
    const date = new Date(text);
    return isNaN(date.getTime()) ? null : date;
}

function format(date: Date | null, type: "default" | "with-time" | "no-year" | "no-year-with-time" | "no-day" | "chinese" | "chinese-with-time" | "time" = "default"): string {
    if (date !== null) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const timePart = date.toTimeString().split(" ")[0];
        switch (type) {
            case "default":
                return year + "-" + month + "-" + day;
            case "with-time":
                return year + "-" + month + "-" + day + " " + timePart;
            case "no-year":
                return month + "/" + day;
            case "no-year-with-time":
                return month + "/" + day + " " + timePart;
            case "no-day":
                return year + "-" + month;
            case "chinese":
                return year + "年" + month + "月" + day + "日";
            case "chinese-with-time":
                return year + "年" + month + "月" + day + "日 " + timePart;
            case "time":
                return timePart;
        }
    }
    return "-";
}

function isSameMinute(time1: Date, time2: Date): boolean {
    return Math.floor(time1.getTime() / 60000) === Math.floor(time2.getTime() / 60000);
}

function dateRelativeTo(date: Date, diffDays: number, type: DayStartOrEnd): Date {
    return type === "day-end"
        ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffDays, 23, 59, 59, 999)
        : new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffDays, 0, 0, 0, 0);
}

/**
 * Only date-part (no time-part) will be handled.
 *
 * Return the differential days of date1 minus date2, can be any integer (including minus).
 * Throws error if date1 or date2 not in valid string.
 */
function dayDiff(date1: Date | string, date2: Date | string): number {
    const date1OfDate = typeof date1 === "string" ? parse(date1) : date1;
    if (!date1OfDate) throw new Error(`[util] DateUtil.dayDiff: invalid date1: ${date1}`);

    const date2OfDate = typeof date2 === "string" ? parse(date2) : date2;
    if (!date2OfDate) throw new Error(`[util] DateUtil.dayDiff: invalid date2: ${date2}`);

    // Ignore time part
    const date1UTC = Date.UTC(date1OfDate.getFullYear(), date1OfDate.getMonth(), date1OfDate.getDate());
    const date2UTC = Date.UTC(date2OfDate.getFullYear(), date2OfDate.getMonth(), date2OfDate.getDate());
    const result = (date1UTC - date2UTC) / 1000 / 3600 / 24;

    return Math.floor(result);
}

export const DateUtil = Object.freeze({
    someday,
    daysAfter,
    daysBeforeToday,
    today,
    daysAfterToday,
    todayAsString,
    daysBeforeTodayAsString,
    daysAfterTodayAsString,
    daysBefore,
    format,
    isSameMinute,
    parse,
    dayDiff,
});
