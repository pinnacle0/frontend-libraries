export type DayStartOrEnd = "day-end" | "day-start";

export class ChinaDateUtil {
    static format(date: Date | null, type: "default" | "with-time" | "no-year" | "no-year-with-time" | "no-day" | "chinese" | "chinese-with-time" | "time" = "default"): string {
        if (date === null) return "-";
        const p = ChinaDateUtil.getParts(date);
        switch (type) {
            case "default":
                return `${p.year}-${p.month}-${p.day}`;
            case "with-time":
                return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
            case "no-year":
                return `${p.month}/${p.day}`;
            case "no-year-with-time":
                return `${p.month}/${p.day} ${p.hour}:${p.minute}:${p.second}`;
            case "no-day":
                return `${p.year}-${p.month}`;
            case "chinese":
                return `${p.year}年${p.month}月${p.day}日`;
            case "chinese-with-time":
                return `${p.year}年${p.month}月${p.day}日 ${p.hour}:${p.minute}:${p.second}`;
            case "time":
                return `${p.hour}:${p.minute}:${p.second}`;
        }
    }

    static todayAsString(): string {
        const p = ChinaDateUtil.getParts(new Date());
        return `${p.year}-${p.month}-${p.day}`;
    }

    static today(type: DayStartOrEnd): Date {
        const p = ChinaDateUtil.getParts(new Date());
        const year = Number(p.year);
        const month = Number(p.month);
        const day = Number(p.day);

        if (type === "day-start") {
            return new Date(Date.UTC(year, month - 1, day, -8, 0, 0, 0));
        } else {
            return new Date(Date.UTC(year, month - 1, day, -8, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1);
        }
    }

    static daysBeforeToday(days: number, type: DayStartOrEnd): Date {
        if (days < 0) throw new Error("[util] ChinaDateUtil.daysBeforeToday: days must be >=0");
        return ChinaDateUtil.dateRelativeTo(ChinaDateUtil.today(type), -days, type);
    }

    static daysBeforeTodayAsString(days: number): string {
        if (days < 0) throw new Error("[util] ChinaDateUtil.daysBeforeTodayAsString: days must be >=0");
        // string date don't care the time so no matter "day-start" or "day-end" works
        return ChinaDateUtil.format(ChinaDateUtil.daysBeforeToday(days, "day-start"));
    }

    static daysAfterToday(days: number, type: DayStartOrEnd): Date {
        if (days < 0) throw new Error("[util] ChinaDateUtil.daysAfterToday: days must be >=0");
        return ChinaDateUtil.dateRelativeTo(ChinaDateUtil.today(type), days, type);
    }

    static daysAfterTodayAsString(days: number): string {
        if (days < 0) throw new Error("[util] ChinaDateUtil.daysAfterTodayAsString: days must be >=0");
        // string date don't care the time so no matter "day-start" or "day-end" works
        return ChinaDateUtil.format(ChinaDateUtil.daysAfterToday(days, "day-start"));
    }

    static daysBefore(date: Date, days: number, type: DayStartOrEnd): Date {
        if (days < 0) throw new Error("[util] DateUtil.daysBefore: days must be >=0");
        return ChinaDateUtil.dateRelativeTo(date, -days, type);
    }
    
    static daysAfter(date: Date, days: number, type: DayStartOrEnd): Date {
        if (days < 0) throw new Error("[util] DateUtil.daysAfter: days must be >=0");
        return ChinaDateUtil.dateRelativeTo(date, days, type);
    }
    
    static someday(date: Date, type: DayStartOrEnd): Date {
        return ChinaDateUtil.dateRelativeTo(date, 0, type);
    }

    private static getParts(date: Date) {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Shanghai", // UTC+8
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // may return "24" for midnight in some environments
        }).formatToParts(date);

        const get = (type: string) => parts.find(p => p.type === type)?.value ?? "";
        return {
            year: get("year"),
            month: get("month"),
            day: get("day"),
            hour: get("hour") === "24" ? "00" : get("hour"),
            minute: get("minute"),
            second: get("second"),
        };
    }

    private static dateRelativeTo(date: Date, diffDays: number, type: DayStartOrEnd): Date {
        const p = ChinaDateUtil.getParts(date);
        // Beijing 00:00 of Y-M-D is Date.UTC(Y, M-1, D, -8) — i.e. 16:00 UTC on the previous day.
        // Date.UTC normalizes overflow, so `day + diffDays` handles month/year boundaries.
        const dayStart = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day) + diffDays, -8, 0, 0, 0);
        return type === "day-end" ? new Date(dayStart + 24 * 60 * 60 * 1000 - 1) : new Date(dayStart);
    }
}
