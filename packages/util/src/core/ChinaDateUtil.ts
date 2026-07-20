export class ChinaDateUtil {
    static format(date: Date): string {
        const p = ChinaDateUtil.getParts(date);
        return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
    }

    static todayStr(): string {
        const p = ChinaDateUtil.getParts(new Date());
        return `${p.year}-${p.month}-${p.day}`;
    }

    static today(type: "start" | "end"): Date {
        const p = ChinaDateUtil.getParts(new Date());
        const year = Number(p.year);
        const month = Number(p.month);
        const day = Number(p.day);

        if (type === "start") {
            return new Date(Date.UTC(year, month - 1, day, -8, 0, 0, 0));
        } else {
            return new Date(Date.UTC(year, month - 1, day, -8, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1);
        }
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
}
