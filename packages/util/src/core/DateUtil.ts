export type DayStartOrEnd = "day-end" | "day-start";

function daysBeforeToday(days: number, type: DayStartOrEnd): Date {
    if (days < 0) {
        throw new Error("[util] Days must be >=0, or use DateUtil.daysAfterToday");
    }
    return dateRelativeTo(new Date(), -days, type);
}

function daysAfterToday(days: number, type: DayStartOrEnd): Date {
    if (days < 0) {
        throw new Error("[util] Days must be >=0, or use DateUtil.daysBeforeToday");
    }
    return dateRelativeTo(new Date(), days, type);
}

function today(type: DayStartOrEnd): Date {
    return dateRelativeTo(new Date(), 0, type);
}

function daysBefore(date: Date, days: number, type: DayStartOrEnd): Date {
    if (days < 0) {
        throw new Error("[util] Days must be >=0, or use DateUtil.daysAfter");
    }
    return dateRelativeTo(date, -days, type);
}

function daysAfter(date: Date, days: number, type: DayStartOrEnd): Date {
    if (days < 0) {
        throw new Error("[util] Days must be >=0, or use DateUtil.daysBefore");
    }
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

function format(date: Date | null, type: "default" | "with-time" | "no-year" | "no-year-with-time" | "chinese" | "chinese-with-time" | "time" = "default"): string {
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
                return month + "-" + day;
            case "no-year-with-time":
                return month + "-" + day + " " + timePart;
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
        ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffDays, 23, 59, 59)
        : new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffDays, 0, 0, 0);
}

export const DateUtil = Object.freeze({
    someday,
    daysAfter,
    daysBeforeToday,
    today,
    daysAfterToday,
    daysBefore,
    format,
    isSameMinute,
    parse,
});
